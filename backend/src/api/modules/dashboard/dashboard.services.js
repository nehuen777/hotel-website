import { sql, poolPromise } from '../../config/db.js';

export class DashboardService {
  static async getMetricKpis(startDate, endDate) {
    try {
      const pool = await poolPromise;
      
      const end = endDate ? new Date(endDate) : new Date();
      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      
      const hoy = new Date().toISOString().split('T')[0];

      // 1. KPIs Financieros: Ahora calculamos tanto lo pagado como lo pendiente (solo reservas activas)
      const finanzasQuery = await pool.request()
        .input('start', sql.Date, start)
        .input('end', sql.Date, end)
        .query(`
          SELECT 
            ISNULL(SUM(CASE WHEN r.Pagada = 1 THEN DATEDIFF(day, r.FechaCheckIn, r.FechaCheckOut) * th.PrecioPorNoche ELSE 0 END), 0) AS IngresosTotales,
            ISNULL(SUM(CASE WHEN r.Pagada = 0 AND r.ID_EstadoReserva = 1 THEN DATEDIFF(day, r.FechaCheckIn, r.FechaCheckOut) * th.PrecioPorNoche ELSE 0 END), 0) AS MontoPendiente,
            ISNULL(SUM(CASE WHEN r.Pagada = 1 THEN 1 ELSE 0 END), 0) AS CantidadPagadas,
            ISNULL(SUM(CASE WHEN r.Pagada = 0 AND r.ID_EstadoReserva = 1 THEN 1 ELSE 0 END), 0) AS CantidadPendientes
          FROM Reservas r
          JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
          JOIN TiposHabitacion th ON h.ID_TipoHabitacion = th.ID_TipoHabitacion
          WHERE r.FechaCreacion >= @start AND r.FechaCreacion <= @end
        `);
      
      const ingresos = finanzasQuery.recordset[0].IngresosTotales;
      const montoPendiente = finanzasQuery.recordset[0].MontoPendiente;
      const pagadas = finanzasQuery.recordset[0].CantidadPagadas;
      const pendientes = finanzasQuery.recordset[0].CantidadPendientes;
      const ticketPromedio = pagadas > 0 ? (ingresos / pagadas) : 0;

      // 2. Gráfico de Anillo: Distribución de Estados
      const estadosQuery = await pool.request()
        .input('start', sql.Date, start)
        .input('end', sql.Date, end)
        .query(`
          SELECT e.NombreEstado, COUNT(r.ID_Reserva) AS Cantidad
          FROM Reservas r
          JOIN EstadosReserva e ON r.ID_EstadoReserva = e.ID_EstadoReserva
          WHERE r.FechaCreacion >= @start AND r.FechaCreacion <= @end
          GROUP BY e.NombreEstado
        `);

      // 3. Gráfico de Barras: Ocupación por Tipo
      const ocupacionTipoQuery = await pool.request()
        .input('start', sql.Date, start)
        .input('end', sql.Date, end)
        .query(`
          SELECT th.Nombre AS TipoHabitacion, COUNT(r.ID_Reserva) AS CantidadReservas
          FROM TiposHabitacion th
          LEFT JOIN Habitaciones h ON th.ID_TipoHabitacion = h.ID_TipoHabitacion
          LEFT JOIN Reservas r ON h.ID_Habitacion = r.ID_Habitacion AND r.FechaCreacion >= @start AND r.FechaCreacion <= @end
          GROUP BY th.Nombre
        `);

      // 4. Panel Operativo Front-Desk: AHORA TRAE EL ESTADO "PAGADA"
      const recepcionQuery = await pool.request()
        .input('hoy', sql.Date, hoy)
        .query(`
          SELECT 
            r.NombreCliente + ' ' + r.ApellidoCliente AS Huesped,
            h.NumeroHabitacion AS Habitacion,
            r.Pagada,
            CASE WHEN r.FechaCheckIn = @hoy THEN 'Check-in' ELSE 'Check-out' END AS Movimiento
          FROM Reservas r
          JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
          WHERE (r.FechaCheckIn = @hoy OR r.FechaCheckOut = @hoy) 
            AND r.ID_EstadoReserva = 1
        `);

      // 5. Consultas pendientes
      const consultasQuery = await pool.request().query(`
        SELECT COUNT(*) AS ConsultasPendientes FROM Consultas WHERE Respondida = 0
      `);

      return {
        kpis: {
            ingresosTotales: ingresos,
            montoPendiente: montoPendiente,
            reservasPendientes: pendientes,
            ticketPromedio: ticketPromedio,
            consultasPendientes: consultasQuery.recordset[0].ConsultasPendientes,
        },
        graficoEstados: estadosQuery.recordset,
        graficoTipos: ocupacionTipoQuery.recordset,
        movimientosHoy: recepcionQuery.recordset
      };
    } catch (err) {
      throw new Error('Error al calcular las métricas del sistema.');
    }
  }
}
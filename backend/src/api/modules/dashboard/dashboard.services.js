import { sql, poolPromise } from '../../config/db.js';

export class DashboardService {
  static async getMetricKpis(startDate, endDate) {
    try {
      const pool = await poolPromise;
      
      const end = endDate ? new Date(endDate) : new Date();
      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));

      // 1. KPIs Financieros y de Tasa de Cancelación
      const finanzasQuery = await pool.request()
        .input('start', sql.Date, start)
        .input('end', sql.Date, end)
        .query(`
          SELECT 
            ISNULL(SUM(CASE WHEN r.Pagada = 1 THEN DATEDIFF(day, r.FechaCheckIn, r.FechaCheckOut) * th.PrecioPorNoche ELSE 0 END), 0) AS IngresosTotales,
            ISNULL(SUM(CASE WHEN r.Pagada = 0 AND r.ID_EstadoReserva = 1 THEN DATEDIFF(day, r.FechaCheckIn, r.FechaCheckOut) * th.PrecioPorNoche ELSE 0 END), 0) AS MontoPendiente,
            ISNULL(SUM(CASE WHEN r.Pagada = 1 THEN 1 ELSE 0 END), 0) AS CantidadPagadas,
            ISNULL(SUM(CASE WHEN r.Pagada = 0 AND r.ID_EstadoReserva = 1 THEN 1 ELSE 0 END), 0) AS CantidadPendientes,
            COUNT(r.ID_Reserva) AS TotalReservasPeriodo,
            ISNULL(SUM(CASE WHEN r.ID_EstadoReserva = 2 THEN 1 ELSE 0 END), 0) AS CantidadCanceladas
          FROM Reservas r
          JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
          JOIN TiposHabitacion th ON h.ID_TipoHabitacion = th.ID_TipoHabitacion
          WHERE r.FechaCreacion >= @start AND r.FechaCreacion <= @end
        `);
      
      const record = finanzasQuery.recordset[0];
      const ingresos = record.IngresosTotales;
      const ticketPromedio = record.CantidadPagadas > 0 ? (ingresos / record.CantidadPagadas) : 0;
      const tasaCancelacion = record.TotalReservasPeriodo > 0 ? ((record.CantidadCanceladas / record.TotalReservasPeriodo) * 100) : 0;

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

      // 3. NUEVO: Curva temporal de Ingresos (Gráfico de Líneas)
      const curvaIngresosQuery = await pool.request()
        .input('start', sql.Date, start)
        .input('end', sql.Date, end)
        .query(`
          SELECT 
            CONVERT(varchar, r.FechaCreacion, 23) AS Fecha,
            ISNULL(SUM(DATEDIFF(day, r.FechaCheckIn, r.FechaCheckOut) * th.PrecioPorNoche), 0) AS IngresoDiario
          FROM Reservas r
          JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
          JOIN TiposHabitacion th ON h.ID_TipoHabitacion = th.ID_TipoHabitacion
          WHERE r.FechaCreacion >= @start AND r.FechaCreacion <= @end 
            AND r.ID_EstadoReserva != 2 -- Excluir canceladas
          GROUP BY CONVERT(varchar, r.FechaCreacion, 23)
          ORDER BY Fecha ASC
        `);

      // 4. NUEVO: Tabla de Rentabilidad Estructural por Categoría
      const rentabilidadQuery = await pool.request()
        .input('start', sql.Date, start)
        .input('end', sql.Date, end)
        .query(`
          SELECT 
            th.Nombre AS Categoria,
            ISNULL(SUM(DATEDIFF(day, r.FechaCheckIn, r.FechaCheckOut)), 0) AS NochesVendidas,
            ISNULL(SUM(DATEDIFF(day, r.FechaCheckIn, r.FechaCheckOut) * th.PrecioPorNoche), 0) AS IngresoGenerado
          FROM TiposHabitacion th
          LEFT JOIN Habitaciones h ON th.ID_TipoHabitacion = h.ID_TipoHabitacion
          LEFT JOIN Reservas r ON h.ID_Habitacion = r.ID_Habitacion 
            AND r.FechaCreacion >= @start AND r.FechaCreacion <= @end
            AND r.ID_EstadoReserva != 2
          GROUP BY th.Nombre
          ORDER BY IngresoGenerado DESC
        `);

      return {
        kpis: {
            ingresosTotales: ingresos,
            montoPendiente: record.MontoPendiente,
            reservasPendientes: record.CantidadPendientes,
            ticketPromedio: ticketPromedio,
            tasaCancelacion: tasaCancelacion.toFixed(1), // Se envía con 1 decimal
        },
        graficoEstados: estadosQuery.recordset,
        curvaIngresos: curvaIngresosQuery.recordset,
        tablaRentabilidad: rentabilidadQuery.recordset
      };
    } catch (err) {
      throw new Error('Error al calcular las métricas gerenciales del sistema.');
    }
  }
}
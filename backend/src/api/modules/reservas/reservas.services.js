import { sql, poolPromise } from '../../config/db.js';

export class ReservasService {
  static async createReserva(reservaData) {
    const { 
      idTipoHabitacion, 
      checkIn, 
      checkOut, 
      nombre, 
      apellido, 
      dni, 
      email 
    } = reservaData;

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const findRoomRequest = new sql.Request(transaction);
      const roomResult = await findRoomRequest
        .input('idTipoHabitacion', sql.Int, idTipoHabitacion)
        .input('checkIn', sql.Date, checkIn)
        .input('checkOut', sql.Date, checkOut)
        .query(`
            SELECT TOP 1 h.ID_Habitacion
            FROM Habitaciones h
            WHERE h.ID_TipoHabitacion = @idTipoHabitacion AND h.Abierta = 1
            AND NOT EXISTS (
                SELECT 1
                FROM Reservas r
                WHERE r.ID_Habitacion = h.ID_Habitacion AND r.ID_EstadoReserva = 1
                AND NOT (r.FechaCheckOut <= @checkIn OR r.FechaCheckIn >= @checkOut)
            )
        `);

      if (roomResult.recordset.length === 0) {
        throw new Error('No hay disponibilidad');
      }

      const idHabitacionDisponible = roomResult.recordset[0].ID_Habitacion;

      const insertRequest = new sql.Request(transaction);
      await insertRequest
        .input('idHabitacion', sql.Int, idHabitacionDisponible)
        .input('checkIn', sql.Date, checkIn)
        .input('checkOut', sql.Date, checkOut)
        .input('nombre', sql.VarChar, nombre)
        .input('apellido', sql.VarChar, apellido)
        .input('dni', sql.VarChar, dni)
        .input('email', sql.VarChar, email)
        .query(`
            INSERT INTO Reservas (ID_Habitacion, FechaCheckIn, FechaCheckOut, NombreCliente, ApellidoCliente, DNICliente, EmailCliente)
            VALUES (@idHabitacion, @checkIn, @checkOut, @nombre, @apellido, @dni, @email)
        `);
      
      await transaction.commit();
      
      return { message: '¡Reserva realizada con éxito!' };

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  static async getReservasOperador(filtros) {
    try {
      const pool = await poolPromise;
      let query = `
        SELECT 
          r.ID_Reserva, 
          r.NombreCliente, 
          r.ApellidoCliente, 
          r.DNICliente, 
          r.FechaCheckIn, 
          r.FechaCheckOut, 
          h.NumeroHabitacion, 
          h.Piso, 
          th.PrecioPorNoche, 
          r.Pagada, 
          er.NombreEstado
        FROM Reservas r
        JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
        JOIN TiposHabitacion th ON h.ID_TipoHabitacion = th.ID_TipoHabitacion
        JOIN EstadosReserva er ON r.ID_EstadoReserva = er.ID_EstadoReserva
      `;

      const request = pool.request();
      let whereClauses = [];

      if (filtros) {
        if (filtros.fechaInicio) {
          whereClauses.push(`r.FechaCheckIn >= @fechaInicio`);
          request.input('fechaInicio', sql.Date, filtros.fechaInicio);
        }
        if (filtros.fechaFin) {
          whereClauses.push(`r.FechaCheckOut <= @fechaFin`);
          request.input('fechaFin', sql.Date, filtros.fechaFin);
        }
        if (filtros.estado && filtros.estado !== 'Todas') {
          whereClauses.push(`er.NombreEstado = @estado`);
          request.input('estado', sql.VarChar, filtros.estado);
        }
      }

      if (whereClauses.length > 0) {
        query += ` WHERE ` + whereClauses.join(' AND ');
      }

      query += ` ORDER BY r.FechaCheckOut ASC`;

      const result = await request.query(query);
      return result.recordset;
    } catch (err) {
      console.error("Error al obtener las reservas del operador:", err);
      throw new Error('Error del servidor al obtener las reservas.');
    }
  }

  static async cancelarReserva(idReserva) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('idReserva', sql.Int, idReserva)
        .query(`
          UPDATE Reservas 
          SET ID_EstadoReserva = (SELECT ID_EstadoReserva FROM EstadosReserva WHERE NombreEstado = 'Cancelada')
          WHERE ID_Reserva = @idReserva
        `);
      return { message: 'Reserva cancelada correctamente.' };
    } catch (err) {
      console.error("Error al cancelar la reserva:", err);
      throw new Error('Error del servidor al cancelar la reserva.');
    }
  }

  static async marcarReservaPagada(idReserva) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('idReserva', sql.Int, idReserva)
        .query('UPDATE Reservas SET Pagada = 1 WHERE ID_Reserva = @idReserva');
      return { message: 'Reserva marcada como pagada.' };
    } catch (err) {
      console.error("Error al marcar la reserva como pagada:", err);
      throw new Error('Error del servidor al procesar el pago.');
    }
  }
}
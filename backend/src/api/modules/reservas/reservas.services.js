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
            WHERE h.ID_TipoHabitacion = @idTipoHabitacion
            AND NOT EXISTS (
                SELECT 1
                FROM Reservas r
                WHERE r.ID_Habitacion = h.ID_Habitacion
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
}

import { sql, poolPromise } from '../../config/db.js';

export class PacientesService {
  
  static async getAllHabitaciones() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT
          th.ID_TipoHabitacion,
          th.Nombre AS TipoHabitacion,
          th.Descripcion,
          th.PrecioPorNoche,
          th.ImagenURL,
          (
            SELECT s.Nombre + ', '
            FROM Servicios s
            JOIN TiposHabitacion_Servicios ths ON s.ID_Servicio = ths.ID_Servicio
            WHERE ths.ID_TipoHabitacion = th.ID_TipoHabitacion
            FOR XML PATH('')
          ) AS Servicios
        FROM TiposHabitacion th
      `);
      return result.recordset;
    } catch (err) {
      console.error('Error en la consulta a la base de datos:', err);
      throw new Error('Error al obtener los datos de las habitaciones');
    }
  }

  static async getHabitacionById(id) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT 
            th.ID_TipoHabitacion,
            th.Nombre AS TipoHabitacion,
            th.Descripcion,
            th.PrecioPorNoche,
            th.ImagenURL,
            (SELECT STRING_AGG(s.Nombre, ', ') 
             FROM TiposHabitacion_Servicios ths
             JOIN Servicios s ON ths.ID_Servicio = s.ID_Servicio
             WHERE ths.ID_TipoHabitacion = th.ID_TipoHabitacion) AS Servicios
          FROM TiposHabitacion th
          WHERE th.ID_TipoHabitacion = @id
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error en la consulta a la BD:", err);
      throw new Error('Error al obtener los datos de la habitación');
    }
  }

  static async checkDisponibilidad(id, checkIn, checkOut) {
    try {
      const pool = await poolPromise;

      const totalHabitacionesResult = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT COUNT(*) as total FROM Habitaciones WHERE ID_TipoHabitacion = @id');
      
      const totalHabitaciones = totalHabitacionesResult.recordset[0].total;

      if (totalHabitaciones === 0) {
        return { disponible: false, mensaje: 'No existen habitaciones de este tipo.' };
      }

      const reservadasResult = await pool.request()
        .input('id', sql.Int, id)
        .input('checkIn', sql.Date, checkIn)
        .input('checkOut', sql.Date, checkOut)
        .query(`
          SELECT COUNT(DISTINCT r.ID_Habitacion) as reservadas
          FROM Reservas r
          JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
          WHERE h.ID_TipoHabitacion = @id AND NOT (r.FechaCheckOut <= @checkIn OR r.FechaCheckIn >= @checkOut)
        `);
      
      const habitacionesReservadas = reservadasResult.recordset[0].reservadas;
      
      if (habitacionesReservadas < totalHabitaciones) {
        return { disponible: true, mensaje: '¡Habitación disponible!' };
      } else {
        return { disponible: false, mensaje: 'No hay disponibilidad para las fechas seleccionadas.' };
      }
    } catch (err) {
      console.error("Error al verificar disponibilidad:", err);
      throw new Error('Error del servidor al verificar la disponibilidad.');
    }
  }
}
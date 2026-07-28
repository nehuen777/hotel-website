import { sql, poolPromise } from '../../config/db.js';

export class HabitacionesService {
  
  // --- MÉTODOS PÚBLICOS ORIGINALES ---
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
        WHERE EXISTS (
          SELECT 1 FROM Habitaciones h WHERE h.ID_TipoHabitacion = th.ID_TipoHabitacion AND h.Abierta = 1
        )
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
        .query('SELECT COUNT(*) as total FROM Habitaciones WHERE ID_TipoHabitacion = @id AND Abierta = 1');
      
      const totalHabitaciones = totalHabitacionesResult.recordset[0].total;

      if (totalHabitaciones === 0) {
        return { disponible: false, mensaje: 'No existen habitaciones de este tipo o no están disponibles.' };
      }

      const reservadasResult = await pool.request()
        .input('id', sql.Int, id)
        .input('checkIn', sql.Date, checkIn)
        .input('checkOut', sql.Date, checkOut)
        .query(`
          SELECT COUNT(DISTINCT r.ID_Habitacion) as reservadas
          FROM Reservas r
          JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
          WHERE h.ID_TipoHabitacion = @id AND h.Abierta = 1 AND r.ID_EstadoReserva = 1 AND NOT (r.FechaCheckOut <= @checkIn OR r.FechaCheckIn >= @checkOut)
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

  static async getEstadoMapaHabitaciones() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT 
          h.ID_Habitacion, 
          h.ID_TipoHabitacion, 
          th.Nombre AS TipoHabitacionNombre, 
          h.NumeroHabitacion, 
          h.Piso, 
          h.Abierta,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM Reservas r 
              WHERE r.ID_Habitacion = h.ID_Habitacion AND r.ID_EstadoReserva = 1 AND GETDATE() BETWEEN r.FechaCheckIn AND r.FechaCheckOut
            ) THEN 1
            ELSE 0
          END AS Ocupada
        FROM Habitaciones h
        JOIN TiposHabitacion th ON h.ID_TipoHabitacion = th.ID_TipoHabitacion
      `);
      return result.recordset;
    } catch (err) {
      console.error("Error al obtener el estado del mapa de habitaciones:", err);
      throw new Error('Error del servidor al obtener el mapa de habitaciones.');
    }
  }

  static async actualizarEstadoHabitacion(id, estado) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('estado', sql.Bit, estado)
        .query('UPDATE Habitaciones SET Abierta = @estado WHERE ID_Habitacion = @id');
      return { mensaje: 'Estado de la habitación actualizado correctamente.' };
    } catch (err) {
      console.error("Error al actualizar el estado de la habitación:", err);
      throw new Error('Error del servidor al actualizar el estado de la habitación.');
    }
  }

  // --- NUEVOS MÉTODOS PARA EL PANEL DE ADMINISTRADOR (CRUD) ---
  
  static async getAdminHabitaciones() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT h.*, t.Nombre as NombreTipo 
        FROM Habitaciones h
        LEFT JOIN TiposHabitacion t ON h.ID_TipoHabitacion = t.ID_TipoHabitacion
      `);
      return result.recordset;
    } catch (err) {
      throw new Error('Error al obtener la lista administrativa de habitaciones.');
    }
  }

  static async createHabitacion(data) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('idTipo', sql.Int, data.ID_TipoHabitacion)
        .input('numero', sql.VarChar, data.NumeroHabitacion)
        .input('piso', sql.Int, data.Piso)
        .input('abierta', sql.Bit, data.Abierta) 
        .query('INSERT INTO Habitaciones (ID_TipoHabitacion, NumeroHabitacion, Piso, Abierta) VALUES (@idTipo, @numero, @piso, @abierta)');
    } catch (err) {
      throw new Error('Error al crear la habitación. Verifique que el número no esté duplicado.');
    }
  }

  static async updateHabitacion(id, data) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('idTipo', sql.Int, data.ID_TipoHabitacion)
        .input('numero', sql.VarChar, data.NumeroHabitacion)
        .input('piso', sql.Int, data.Piso)
        .input('abierta', sql.Bit, data.Abierta)
        .query('UPDATE Habitaciones SET ID_TipoHabitacion = @idTipo, NumeroHabitacion = @numero, Piso = @piso, Abierta = @abierta WHERE ID_Habitacion = @id');
    } catch (err) {
      throw new Error('Error al actualizar la habitación.');
    }
  }

  static async deleteHabitacion(id) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Habitaciones WHERE ID_Habitacion = @id');
    } catch (err) {
      throw new Error('No se puede eliminar. Es posible que haya reservas vinculadas a esta habitación física.');
    }
  }
}
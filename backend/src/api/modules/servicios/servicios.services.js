import { sql, poolPromise } from '../../config/db.js';

export class ServiciosService {
  
  static async getAllServicios() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT ID_Servicio, Nombre, Descripcion FROM Servicios');
      return result.recordset; 
    } catch (err) {
      throw new Error('Error al obtener el catálogo de servicios');
    }
  }

  static async createServicio(nombre, descripcion) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('nombre', sql.VarChar, nombre)
        .input('descripcion', sql.Text, descripcion)
        .query('INSERT INTO Servicios (Nombre, Descripcion) VALUES (@nombre, @descripcion)');
    } catch (err) {
      throw new Error('Error al crear el servicio');
    }
  }

  static async updateServicio(id, nombre, descripcion) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, nombre)
        .input('descripcion', sql.Text, descripcion)
        .query('UPDATE Servicios SET Nombre = @nombre, Descripcion = @descripcion WHERE ID_Servicio = @id');
    } catch (err) {
      throw new Error('Error al actualizar el servicio');
    }
  }

  static async deleteServicio(id) {
      try {
        const pool = await poolPromise;
        await pool.request()
          .input('id', sql.Int, id)
          .query('DELETE FROM Servicios WHERE ID_Servicio = @id');
      } catch (err) {
        // Catcheamos el error y lanzamos uno amigable para el usuario
        throw new Error('No se puede eliminar. Este servicio ya está vinculado a un Tipo de Habitación. Por favor, desvincule el servicio primero e intente nuevamente.');
      }
    }
}
import { sql, poolPromise } from '../../config/db.js';

export class TiposService {
  
  static async getAllTipos() {
    try {
      const pool = await poolPromise;
      // Traemos los tipos
      const tipos = await pool.request().query('SELECT * FROM TiposHabitacion');
      // Traemos las relaciones
      const relaciones = await pool.request().query('SELECT * FROM TiposHabitacion_Servicios');

      // Unimos todo en un solo JSON en Node
      return tipos.recordset.map(tipo => {
        const serviciosDelTipo = relaciones.recordset
          .filter(rel => rel.ID_TipoHabitacion === tipo.ID_TipoHabitacion)
          .map(rel => rel.ID_Servicio); // Guardamos un array solo con los IDs
        
        return { ...tipo, ServiciosAsignados: serviciosDelTipo };
      });
    } catch (err) {
      throw new Error('Error al obtener los tipos de habitación.');
    }
  }

  static async createTipo(tipoData, serviciosIds) {
    const pool = await poolPromise;
    const transaction = pool.transaction();
    
    try {
      await transaction.begin();
      
      // 1. Insertamos el tipo de habitación y obtenemos su ID nuevo
      const result = await transaction.request()
        .input('nombre', sql.VarChar, tipoData.Nombre)
        .input('desc', sql.Text, tipoData.Descripcion)
        .input('precio', sql.Decimal(10,2), tipoData.PrecioPorNoche)
        .input('img', sql.VarChar, tipoData.ImagenURL)
        .query(`
          INSERT INTO TiposHabitacion (Nombre, Descripcion, PrecioPorNoche, ImagenURL) 
          OUTPUT INSERTED.ID_TipoHabitacion
          VALUES (@nombre, @desc, @precio, @img)
        `);
      
      const newId = result.recordset[0].ID_TipoHabitacion;

      // 2. Insertamos las relaciones con los servicios elegidos
      if (serviciosIds && serviciosIds.length > 0) {
        for (let sId of serviciosIds) {
          await transaction.request()
            .input('idTipo', sql.Int, newId)
            .input('idServicio', sql.Int, sId)
            .query('INSERT INTO TiposHabitacion_Servicios (ID_TipoHabitacion, ID_Servicio) VALUES (@idTipo, @idServicio)');
        }
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new Error('Error al crear el tipo de habitación.');
    }
  }

  static async updateTipo(id, tipoData, serviciosIds) {
    const pool = await poolPromise;
    const transaction = pool.transaction();
    
    try {
      await transaction.begin();
      
      // 1. Actualizamos los datos base
      await transaction.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, tipoData.Nombre)
        .input('desc', sql.Text, tipoData.Descripcion)
        .input('precio', sql.Decimal(10,2), tipoData.PrecioPorNoche)
        .input('img', sql.VarChar, tipoData.ImagenURL)
        .query(`
          UPDATE TiposHabitacion 
          SET Nombre = @nombre, Descripcion = @desc, PrecioPorNoche = @precio, ImagenURL = @img
          WHERE ID_TipoHabitacion = @id
        `);

      // 2. Borramos todos los servicios viejos vinculados a esta habitación
      await transaction.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM TiposHabitacion_Servicios WHERE ID_TipoHabitacion = @id');

      // 3. Insertamos los nuevos servicios elegidos
      if (serviciosIds && serviciosIds.length > 0) {
        for (let sId of serviciosIds) {
          await transaction.request()
            .input('idTipo', sql.Int, id)
            .input('idServicio', sql.Int, sId)
            .query('INSERT INTO TiposHabitacion_Servicios (ID_TipoHabitacion, ID_Servicio) VALUES (@idTipo, @idServicio)');
        }
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new Error('Error al actualizar el tipo de habitación.');
    }
  }

  static async deleteTipo(id) {
    const pool = await poolPromise;
    const transaction = pool.transaction();

    try {
      await transaction.begin();

      // 1. Borramos los servicios vinculados
      await transaction.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM TiposHabitacion_Servicios WHERE ID_TipoHabitacion = @id');

      // 2. Borramos el tipo de habitación
      await transaction.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM TiposHabitacion WHERE ID_TipoHabitacion = @id');

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new Error('No se puede eliminar. Verifique que no haya habitaciones físicas vinculadas a este tipo.');
    }
  }
}
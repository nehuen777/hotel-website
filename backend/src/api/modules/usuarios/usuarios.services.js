import { sql, poolPromise } from '../../config/db.js';
import bcrypt from 'bcrypt'; // Asegúrate de tener instalada esta librería

export class UsuariosService {
  
  static async getOperadores() {
    try {
      const pool = await poolPromise;
      // Filtramos estrictamente donde esAdmin = 0
      const result = await pool.request().query(`
        SELECT ID_Usuario, Email, Nombre, Apellido, Activo 
        FROM Usuarios 
        WHERE esAdmin = 0
      `);
      return result.recordset;
    } catch (err) {
      throw new Error('Error al obtener los operadores.');
    }
  }

  static async createOperador(data) {
    try {
      const pool = await poolPromise;
      
      // Encriptar la contraseña (costo 10 es el estándar recomendado)
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(data.Contrasena, salt);

      // Forzamos esAdmin = 0 y Activo = 1 al crear
      await pool.request()
        .input('email', sql.VarChar, data.Email)
        .input('hash', sql.VarChar, hash)
        .input('nombre', sql.VarChar, data.Nombre)
        .input('apellido', sql.VarChar, data.Apellido)
        .query(`
          INSERT INTO Usuarios (Email, ContrasenaHash, Nombre, Apellido, esAdmin, Activo) 
          VALUES (@email, @hash, @nombre, @apellido, 0, 1)
        `);
    } catch (err) {
      if (err.message.includes('UNIQUE KEY')) {
        throw new Error('Ya existe un usuario con este correo electrónico.');
      }
      throw new Error('Error al crear el operador.');
    }
  }

  static async updateOperador(id, data) {
    try {
      const pool = await poolPromise;
      
      let query = 'UPDATE Usuarios SET Nombre = @nombre, Apellido = @apellido, Email = @email';
      const request = pool.request()
        .input('id', sql.Int, id)
        .input('nombre', sql.VarChar, data.Nombre)
        .input('apellido', sql.VarChar, data.Apellido)
        .input('email', sql.VarChar, data.Email);

      // Si se envió una nueva contraseña, la encriptamos y la añadimos al UPDATE
      if (data.Contrasena && data.Contrasena.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data.Contrasena, salt);
        query += ', ContrasenaHash = @hash';
        request.input('hash', sql.VarChar, hash);
      }

      query += ' WHERE ID_Usuario = @id AND esAdmin = 0';
      await request.query(query);
    } catch (err) {
      if (err.message.includes('UNIQUE KEY')) {
        throw new Error('El correo electrónico ya está en uso por otra cuenta.');
      }
      throw new Error('Error al actualizar el operador.');
    }
  }

  static async toggleEstadoOperador(id, estadoActivo) {
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('id', sql.Int, id)
        .input('activo', sql.Bit, estadoActivo)
        .query('UPDATE Usuarios SET Activo = @activo WHERE ID_Usuario = @id AND esAdmin = 0');
    } catch (err) {
      throw new Error('Error al cambiar el estado del operador.');
    }
  }
}
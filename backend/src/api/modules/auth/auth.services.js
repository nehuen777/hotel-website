import { poolPromise, sql } from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key'; // ¡Mover a una variable de entorno en producción!

export async function autenticarUsuario(email, contrasena) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Usuarios WHERE Email = @email');

    if (result.recordset.length === 0) {
      throw new Error('Authentication failed. User not found.');
    }

    const usuario = result.recordset[0];

    // ---> AQUÍ AGREGAMOS LA VALIDACIÓN DEL SOFT-DELETE <---
    // En SQL Server el BIT suele llegar como un booleano (true/false) en Node
    if (usuario.Activo === false) {
      throw new Error('Su cuenta ha sido suspendida. Contacte al administrador.');
    }
    // -------------------------------------------------------

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.ContrasenaHash);

    if (!contrasenaValida) {
      throw new Error('Authentication failed. Invalid password.');
    }

    const token = jwt.sign(
      { 
        id: usuario.ID_Usuario,
        email: usuario.Email,
        esAdmin: usuario.esAdmin 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token, esAdmin: usuario.esAdmin };
  } catch (error) {
    throw error;
  }
}
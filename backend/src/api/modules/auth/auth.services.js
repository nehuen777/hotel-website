import { poolPromise, sql } from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key'; // ¡Mover a una variable de entorno en producción!

export async function autenticarOperador(email, contrasena) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Operadores WHERE Email = @email');

    if (result.recordset.length === 0) {
      throw new Error('Authentication failed. Operator not found.');
    }

    const operador = result.recordset[0];
    const contrasenaValida = await bcrypt.compare(contrasena, operador.ContrasenaHash);

    if (!contrasenaValida) {
      throw new Error('Authentication failed. Invalid password.');
    }

    const token = jwt.sign(
      { id: operador.ID_Operador, email: operador.Email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token };
  } catch (error) {
    throw error;
  }
}
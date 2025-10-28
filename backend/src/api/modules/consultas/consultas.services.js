import nodemailer from 'nodemailer';
import 'dotenv/config';
import { poolPromise, sql } from '../../config/db.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class ConsultasService {
  static async sendConsultaEmail(consultaData) {
    const { email, asunto, mensaje } = consultaData;

    if (!email || !asunto || !mensaje) {
      throw new Error('Faltan campos obligatorios.');
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `Nueva consulta: ${asunto}`,
      text: `Has recibido una nueva consulta:\n\nDe: ${email}\nAsunto: ${asunto}\nMensaje:\n${mensaje}`,
      html: `
        <h4>Has recibido una nueva consulta:</h4>
        <p><strong>De:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      const pool = await poolPromise;
      await pool.request()
        .input('Email', sql.VarChar(100), email)
        .input('Asunto', sql.VarChar(255), asunto)
        .input('Mensaje', sql.Text, mensaje)
        .query('INSERT INTO Consultas (Email, Asunto, Mensaje) VALUES (@Email, @Asunto, @Mensaje)');

      const info = await transporter.sendMail(mailOptions);
      console.log('Correo de consulta enviado:', info.messageId);
      return { message: 'Consulta enviada con éxito.' };
    } catch (error) {
      console.error('Error al procesar la consulta:', error);
      throw new Error('Error al procesar la consulta.');
    }
  }
}
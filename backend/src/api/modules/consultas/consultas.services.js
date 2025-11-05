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

  static async getConsultas(filtros) {
    try {
      const pool = await poolPromise;
      const request = pool.request();
      let query = 'SELECT * FROM Consultas';

      if (filtros && filtros.respondida !== undefined) {
        query += ' WHERE Respondida = @respondida';
        request.input('respondida', sql.Bit, filtros.respondida);
      }

      query += ' ORDER BY FechaEnvio DESC';

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error al obtener las consultas:', error);
      throw new Error('Error al obtener las consultas.');
    }
  }

  static async responderConsulta(idConsulta, textoRespuesta) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      const consultaResult = await new sql.Request(transaction)
        .input('idConsulta', sql.Int, idConsulta)
        .query('SELECT Email, Asunto FROM Consultas WHERE ID_Consulta = @idConsulta');

      if (consultaResult.recordset.length === 0) {
        throw new Error('Consulta no encontrada.');
      }

      const { Email, Asunto } = consultaResult.recordset[0];

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: Email,
        subject: `Re: ${Asunto}`,
        text: textoRespuesta,
        html: `<p>${textoRespuesta.replace(/\n/g, '<br>')}</p>`,
      };

      await transporter.sendMail(mailOptions);

      await new sql.Request(transaction)
        .input('idConsulta', sql.Int, idConsulta)
        .query('UPDATE Consultas SET Respondida = 1 WHERE ID_Consulta = @idConsulta');

      await transaction.commit();

      return { message: 'Respuesta enviada con éxito.' };
    } catch (error) {
      await transaction.rollback();
      console.error('Error al responder la consulta:', error);
      throw new Error('Error al responder la consulta.');
    }
  }
}
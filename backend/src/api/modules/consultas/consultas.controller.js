import { ConsultasService } from './consultas.services.js';

export class ConsultasController {
  static async handleConsulta(req, res) {
    try {
      const result = await ConsultasService.sendConsultaEmail(req.body);
      res.status(200).json(result);
    } catch (err) {
      console.error("Error en el controlador de consultas:", err);
      if (err.message === 'Faltan campos obligatorios.') {
        return res.status(400).json({ message: err.message });
      } else if (err.message === 'Error al procesar la consulta.') {
        return res.status(500).json({ message: 'Error interno del servidor al procesar la consulta.' });
      } else {
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }
    }
  }

  static async getConsultas(req, res) {
    try {
      const consultas = await ConsultasService.getConsultas(req.query);
      res.json(consultas);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async responderConsulta(req, res) {
    try {
      const { id } = req.params;
      const { textoRespuesta } = req.body;
      if (!textoRespuesta) {
        return res.status(400).json({ message: 'El texto de la respuesta es requerido.' });
      }
      const resultado = await ConsultasService.responderConsulta(id, textoRespuesta);
      res.json(resultado);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
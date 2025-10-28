import { ConsultasService } from './consultas.services.js';

export class ConsultasController {
  static async handleConsulta(req, res) {
    try {
      const result = await ConsultasService.sendConsultaEmail(req.body);
      res.status(200).json(result);
    } catch (err) {
      console.error("Error en el controlador de consultas:", err);
      if (err.message === 'Faltan campos obligatorios.') {
         res.status(400).json({ message: err.message });
      } else {
         res.status(500).json({ message: 'Error interno del servidor al procesar la consulta.' });
      }
    }
  }
}
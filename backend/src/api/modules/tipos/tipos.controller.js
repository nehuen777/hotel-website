import { TiposService } from './tipos.services.js';

export class TiposController {
  
  static async getAllTipos(req, res) {
    try {
      const tipos = await TiposService.getAllTipos();
      res.json(tipos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createTipo(req, res) {
    try {
      // Separamos los datos de la habitación de los IDs de los servicios elegidos
      const { ServiciosAsignados, ...tipoData } = req.body;
      await TiposService.createTipo(tipoData, ServiciosAsignados);
      res.status(201).json({ message: 'Tipo de habitación creado exitosamente' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateTipo(req, res) {
    try {
      const { id } = req.params;
      const { ServiciosAsignados, ...tipoData } = req.body;
      await TiposService.updateTipo(id, tipoData, ServiciosAsignados);
      res.json({ message: 'Tipo actualizado exitosamente' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteTipo(req, res) {
    try {
      const { id } = req.params;
      await TiposService.deleteTipo(id);
      res.json({ message: 'Tipo eliminado exitosamente' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
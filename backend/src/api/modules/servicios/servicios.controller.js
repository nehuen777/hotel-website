import { ServiciosService } from './servicios.services.js';

export class ServiciosController {
  
  static async getAllServicios(req, res) {
    try {
      const servicios = await ServiciosService.getAllServicios();
      res.json(servicios);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createServicio(req, res) {
    try {
      const { Nombre, Descripcion } = req.body;
      await ServiciosService.createServicio(Nombre, Descripcion);
      res.status(201).json({ message: 'Servicio creado exitosamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateServicio(req, res) {
    try {
      const { id } = req.params;
      const { Nombre, Descripcion } = req.body;
      await ServiciosService.updateServicio(id, Nombre, Descripcion);
      res.json({ message: 'Servicio actualizado exitosamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteServicio(req, res) {
      try {
        const { id } = req.params;
        await ServiciosService.deleteServicio(id);
        res.json({ message: 'Servicio eliminado exitosamente' });
      } catch (err) {
        // AQUÍ: Cambiamos "error:" por "message:" para que fetchProtegido lo lea bien
        res.status(400).json({ message: err.message });
      }
    }
}
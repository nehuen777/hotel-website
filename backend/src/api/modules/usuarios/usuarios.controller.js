import { UsuariosService } from './usuarios.services.js';

export class UsuariosController {
  
  static async getOperadores(req, res) {
    try {
      const operadores = await UsuariosService.getOperadores();
      res.json(operadores);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createOperador(req, res) {
    try {
      await UsuariosService.createOperador(req.body);
      res.status(201).json({ message: 'Operador creado exitosamente.' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async updateOperador(req, res) {
    try {
      const { id } = req.params;
      await UsuariosService.updateOperador(id, req.body);
      res.json({ message: 'Operador actualizado exitosamente.' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async toggleEstadoOperador(req, res) {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      await UsuariosService.toggleEstadoOperador(id, activo);
      res.json({ message: activo ? 'Operador reactivado.' : 'Operador suspendido.' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
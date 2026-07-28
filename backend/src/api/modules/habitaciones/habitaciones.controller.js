import { HabitacionesService } from './habitaciones.services.js';

export class HabitacionesController {

  // --- MÉTODOS PÚBLICOS ORIGINALES ---
  static async getAllHabitaciones(req, res) {
    try {
      const habitaciones = await HabitacionesService.getAllHabitaciones();
      res.json(habitaciones);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getHabitacionById(req, res) {
    try {
      const { id } = req.params;
      const habitacion = await HabitacionesService.getHabitacionById(id);
      if (habitacion) {
        res.json(habitacion);
      } else {
        res.status(404).send('Tipo de habitación no encontrado');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async checkDisponibilidad(req, res) {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: 'Las fechas de check-in y check-out son requeridas.' });
    }

    try {
      const disponibilidad = await HabitacionesService.checkDisponibilidad(id, checkIn, checkOut);
      res.json(disponibilidad);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getEstadoMapaHabitaciones(req, res) {
    try {
      const mapa = await HabitacionesService.getEstadoMapaHabitaciones();
      res.json(mapa);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async actualizarEstadoHabitacion(req, res) {
    try {
      const { id } = req.params;
      const { abierta } = req.body;
      if (typeof abierta !== 'boolean') {
        return res.status(400).json({ error: 'El estado \'abierta\' debe ser un booleano.' });
      }
      const resultado = await HabitacionesService.actualizarEstadoHabitacion(id, abierta);
      res.json(resultado);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  // --- NUEVOS MÉTODOS PARA EL ADMINISTRADOR ---
  
  static async getAdminHabitaciones(req, res) {
    try {
      const habitaciones = await HabitacionesService.getAdminHabitaciones();
      res.json(habitaciones);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async createHabitacion(req, res) {
    try {
      await HabitacionesService.createHabitacion(req.body);
      res.status(201).json({ message: 'Habitación creada exitosamente' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateHabitacion(req, res) {
    try {
      const { id } = req.params;
      await HabitacionesService.updateHabitacion(id, req.body);
      res.json({ message: 'Habitación actualizada exitosamente' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteHabitacion(req, res) {
    try {
      const { id } = req.params;
      await HabitacionesService.deleteHabitacion(id);
      res.json({ message: 'Habitación eliminada exitosamente' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
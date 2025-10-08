import { PacientesService } from './habitaciones.services.js';

export class HabitacionesController {

  static async getAllHabitaciones(req, res) {
    try {
      const habitaciones = await PacientesService.getAllHabitaciones();
      res.json(habitaciones);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  static async getHabitacionById(req, res) {
    try {
      const { id } = req.params;
      const habitacion = await PacientesService.getHabitacionById(id);
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
      const disponibilidad = await PacientesService.checkDisponibilidad(id, checkIn, checkOut);
      res.json(disponibilidad);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}
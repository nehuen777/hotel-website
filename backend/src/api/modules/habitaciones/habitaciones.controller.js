import { HabitacionesService } from './habitaciones.services.js';

export class HabitacionesController {

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
}

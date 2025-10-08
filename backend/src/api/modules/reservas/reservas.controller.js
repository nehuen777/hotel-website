import { ReservasService } from './reservas.services.js';

export class ReservasController {
  static async createReserva(req, res) {
    const { 
      idTipoHabitacion, checkIn, checkOut, nombre, apellido, dni, email 
    } = req.body;
    if (!idTipoHabitacion || !checkIn || !checkOut || !nombre || !apellido || !dni || !email) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }
    try {
      const result = await ReservasService.createReserva(req.body);
      res.status(201).json(result);
    } catch (err) {
      console.error("Error al crear la reserva:", err);
      if (err.message === 'No hay disponibilidad') {
        return res.status(409).json({ message: 'Lo sentimos, ya no hay disponibilidad para estas fechas. Por favor, intente con otras.' });
      }
      res.status(500).json({ message: 'Error en el servidor al procesar la reserva.' });
    }
  }
}
import express from 'express';
import { verificarToken } from '../../middleware/auth.middleware.js';
import { HabitacionesController } from '../habitaciones/habitaciones.controller.js';
import { ReservasController } from '../reservas/reservas.controller.js';
import { ConsultasController } from '../consultas/consultas.controller.js';

const router = express.Router();

// Proteger todas las rutas de este módulo
router.use(verificarToken);

// Rutas para la gestión de habitaciones por parte del operador
router.get('/habitaciones/mapa', HabitacionesController.getEstadoMapaHabitaciones);
router.patch('/habitaciones/:id/estado', HabitacionesController.actualizarEstadoHabitacion);

// Rutas para la gestión de reservas por parte del operador
router.get('/reservas', ReservasController.getReservasOperador);
router.patch('/reservas/:id/cancelar', ReservasController.cancelarReserva);
router.patch('/reservas/:id/pago', ReservasController.marcarReservaPagada);

// Rutas para la gestión de consultas por parte del operador
router.get('/consultas', ConsultasController.getConsultas);
router.post('/consultas/:id/responder', ConsultasController.responderConsulta);

export default router;

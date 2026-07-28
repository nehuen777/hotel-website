import { Router } from 'express';
import { HabitacionesController } from './habitaciones.controller.js';
import { verificarToken, esAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// --- RUTAS NUEVAS EXCLUSIVAS DEL PANEL ADMIN (Protegidas) ---
router.get('/admin/all', verificarToken, esAdmin, HabitacionesController.getAdminHabitaciones);
router.post('/', verificarToken, esAdmin, HabitacionesController.createHabitacion);
router.put('/:id', verificarToken, esAdmin, HabitacionesController.updateHabitacion);
router.delete('/:id', verificarToken, esAdmin, HabitacionesController.deleteHabitacion);

// (Opcional) Rutas de mapa y actualización rápida de estado que tenías en el controlador
router.get('/mapa/estado', verificarToken, esAdmin, HabitacionesController.getEstadoMapaHabitaciones);
router.patch('/:id/estado', verificarToken, esAdmin, HabitacionesController.actualizarEstadoHabitacion);

// --- RUTAS PÚBLICAS ORIGINALES ---
router.get('/', HabitacionesController.getAllHabitaciones);
router.get('/:id/disponibilidad', HabitacionesController.checkDisponibilidad);
router.get('/:id', HabitacionesController.getHabitacionById);

export default router;
import { Router } from 'express';
import { HabitacionesController } from './habitaciones.controller.js';

const router = Router();

router.get('/', HabitacionesController.getAllHabitaciones);
router.get('/:id/disponibilidad', HabitacionesController.checkDisponibilidad);
router.get('/:id', HabitacionesController.getHabitacionById);

export default router;
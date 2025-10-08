import { Router } from 'express';
import { ReservasController } from './reservas.controller.js';

const router = Router();

router.post('/', ReservasController.createReserva);

export default router;
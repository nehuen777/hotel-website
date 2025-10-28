import { Router } from 'express';
import { ConsultasController } from './consultas.controller.js';

const router = Router();

router.post('/', ConsultasController.handleConsulta);

export default router;
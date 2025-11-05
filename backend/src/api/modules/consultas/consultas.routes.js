import { Router } from 'express';
import { ConsultasController } from './consultas.controller.js';
import { verificarToken } from '../../middleware/auth.middleware.js';


const router = Router();

router.post('/', ConsultasController.handleConsulta);
router.get('/', verificarToken, ConsultasController.getConsultas);
router.post('/:id/responder', verificarToken, ConsultasController.responderConsulta);


export default router;
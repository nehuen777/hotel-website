import { Router } from 'express';
import { ConsultasController } from './consultas.controller.js';
import { verificarToken, esOperador } from '../../middleware/auth.middleware.js';


const router = Router();

router.post('/', ConsultasController.handleConsulta);
router.get('/', verificarToken, esOperador, ConsultasController.getConsultas);
router.post('/:id/responder', verificarToken, esOperador, ConsultasController.responderConsulta);


export default router;
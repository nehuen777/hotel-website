import { Router } from 'express';
import { TiposController } from './tipos.controller.js';
import { verificarToken, esAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', verificarToken, esAdmin, TiposController.getAllTipos);
router.post('/', verificarToken, esAdmin, TiposController.createTipo);
router.put('/:id', verificarToken, esAdmin, TiposController.updateTipo);
router.delete('/:id', verificarToken, esAdmin, TiposController.deleteTipo);

export default router;
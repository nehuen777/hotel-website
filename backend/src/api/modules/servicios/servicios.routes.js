import { Router } from 'express';
import { ServiciosController } from './servicios.controller.js';
import { verificarToken, esAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Todas las rutas protegidas para administradores
router.get('/', verificarToken, esAdmin, ServiciosController.getAllServicios);
router.post('/', verificarToken, esAdmin, ServiciosController.createServicio);
router.put('/:id', verificarToken, esAdmin, ServiciosController.updateServicio);
router.delete('/:id', verificarToken, esAdmin, ServiciosController.deleteServicio);

export default router;
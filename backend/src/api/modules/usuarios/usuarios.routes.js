import { Router } from 'express';
import { UsuariosController } from './usuarios.controller.js';
import { verificarToken, esAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Todo protegido para administradores
router.use(verificarToken, esAdmin);

router.get('/operadores', UsuariosController.getOperadores);
router.post('/operadores', UsuariosController.createOperador);
router.put('/operadores/:id', UsuariosController.updateOperador);
router.patch('/operadores/:id/estado', UsuariosController.toggleEstadoOperador);

export default router;
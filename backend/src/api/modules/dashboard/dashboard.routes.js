import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { verificarToken, esAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Todo protegido exclusivamente para administradores
router.get('/metrics', verificarToken, esAdmin, DashboardController.getMétricas);

export default router;
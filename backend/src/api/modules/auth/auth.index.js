import authRoutes from './auth.routes.js';

export function mount(app) {
  app.use('/api/auth', authRoutes);
  console.log('  -> Módulo de autenticación montado en /api/auth');
}
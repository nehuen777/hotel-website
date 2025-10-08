import habitacionesRoutes from './habitaciones.routes.js';

export function mount(app) {
  console.log('🏥 Montando módulo de habitaciones...');
  app.use('/api/habitaciones', habitacionesRoutes);
  console.log('✅ Módulo de habitaciones montado correctamente');
}
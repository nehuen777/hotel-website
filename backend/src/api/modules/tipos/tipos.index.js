import tiposRoutes from './tipos.routes.js';

export function mount(app) {
  console.log('🛏️  Montando módulo de Tipos de Habitación...');
  app.use('/api/tipos', tiposRoutes);
  console.log('✅ Módulo de Tipos montado correctamente');
}
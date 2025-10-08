import reservasRoutes from './reservas.routes.js';

export function mount(app) {
  console.log('📝 Montando módulo de reservas...');
  app.use('/api/reservas', reservasRoutes);
  console.log('✅ Módulo de reservas montado correctamente');
}
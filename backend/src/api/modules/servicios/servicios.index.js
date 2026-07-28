import serviciosRoutes from './servicios.routes.js';

export function mount(app) {
  console.log('⚙️ Montando módulo de servicios...');
  app.use('/api/servicios', serviciosRoutes);
  console.log('✅ Módulo de servicios montado correctamente');
}
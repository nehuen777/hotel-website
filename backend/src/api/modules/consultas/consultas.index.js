import consultasRoutes from './consultas.routes.js';

export function mount(app) {
  console.log('📧 Montando módulo de consultas...');
  app.use('/api/consultas', consultasRoutes);
  console.log('✅ Módulo de consultas montado correctamente');
}
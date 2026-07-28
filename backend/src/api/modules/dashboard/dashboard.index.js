import dashboardRoutes from './dashboard.routes.js';

export function mount(app) {
  console.log('📊 Montando módulo de dashboard e informes...');
  app.use('/api/dashboard', dashboardRoutes);
  console.log('✅ Módulo de dashboard montado correctamente');
}
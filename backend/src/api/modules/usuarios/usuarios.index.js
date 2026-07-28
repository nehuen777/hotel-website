import usuariosRoutes from './usuarios.routes.js';

export function mount(app) {
  console.log('👥 Montando módulo de gestión de usuarios...');
  app.use('/api/usuarios', usuariosRoutes);
  console.log('✅ Módulo de usuarios montado correctamente');
}
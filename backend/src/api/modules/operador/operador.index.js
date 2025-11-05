import operadorRoutes from './operador.routes.js';

export function mount(app) {
  app.use('/api/operador', operadorRoutes);
  console.log('  -> Módulo de operador montado en /api/operador');
}

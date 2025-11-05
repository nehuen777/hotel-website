import * as habitacionesModule from './modules/habitaciones/habitaciones.index.js';
import * as reservasModule from './modules/reservas/reservas.index.js';
import * as consultasModule from './modules/consultas/consultas.index.js';
import * as authModule from './modules/auth/auth.index.js';
import * as operadorModule from './modules/operador/operador.index.js';

export function registerModules(app) {
  console.log('🚀 Iniciando registro de módulos...');
  habitacionesModule.mount(app);
  reservasModule.mount(app);
  consultasModule.mount(app);
  authModule.mount(app);
  operadorModule.mount(app);
  console.log('✅ Módulos registrados.');
}
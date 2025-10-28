import * as habitacionesModule from './modules/pacientes/habitaciones.index.js';
import * as reservasModule from './modules/reservas/reservas.index.js';
import * as consultasModule from './modules/consultas/consultas.index.js';

export function registerModules(app) {
  console.log('🚀 Iniciando registro de módulos...');
  habitacionesModule.mount(app);
  reservasModule.mount(app);
  consultasModule.mount(app);
  console.log('✅ Módulos registrados.');
}
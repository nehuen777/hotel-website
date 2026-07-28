import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomeCarousel from './components/home/HomeCarousel';
import Welcome from './components/home/Welcome';
import Footer from './components/layout/Footer';
import Habitaciones from './components/habitaciones/Habitaciones';
import HabitacionDetalle from './components/habitaciones/HabitacionDetalle';
import Consultas from './components/consultas/Consultas.js';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OperadorPanel from './components/operador/OperadorPanel';
import MapaHabitaciones from './components/operador/MapaHabitaciones';
import GestionReservas from './components/operador/GestionReservas';
import GestionConsultas from './components/operador/GestionConsultas';
import AdminPanel from './components/admin/AdminstradorPanel.js';
import HabitacionesAdmin from './components/admin/Habitaciones';
import Operadores from './components/admin/Operadores';
import Graficos from './components/admin/Graficos.js';

import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  // CAMBIO: Ahora validamos si es página de operador O de administrador para ocultar el footer
  const isDashboardPage = location.pathname.startsWith('/operador') || location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HomeCarousel />
            <Welcome />
          </>
        } />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="/habitaciones/:id" element={<HabitacionDetalle />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/login" element={<Login />} />

        {/* CAMBIO: Agregamos allowedRole="operador" a la ruta protegida existente */}
        <Route path="/operador" element={<ProtectedRoute allowedRole="operador" />}>
          <Route path="" element={<OperadorPanel />}>
            <Route index element={<Navigate to="mapa" replace />} />
            <Route path="mapa" element={<MapaHabitaciones />} />
            <Route path="reservas" element={<GestionReservas />} />
            <Route path="consultas" element={<GestionConsultas />} />
          </Route>
        </Route>

        {/* NUEVO: Panel de Administrador estructurado */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="" element={<AdminPanel />}>
            <Route index element={<Navigate to="habitaciones" replace />} />
            <Route path="habitaciones" element={<HabitacionesAdmin />} />
            <Route path="operadores" element={<Operadores />} />
            <Route path="graficos" element={<Graficos />} />
          </Route>
        </Route>

      </Routes>
      
      {/* CAMBIO: Usamos la nueva variable isDashboardPage */}
      {!isDashboardPage && <Footer />}
    </>
  );
}

export default App;
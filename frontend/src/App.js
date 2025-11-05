import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const isOperadorPage = location.pathname.startsWith('/operador');

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

        <Route path="/operador" element={<ProtectedRoute />}>
          <Route path="" element={<OperadorPanel />}>
            <Route index element={<Navigate to="mapa" replace />} />
            <Route path="mapa" element={<MapaHabitaciones />} />
            <Route path="reservas" element={<GestionReservas />} />
            <Route path="consultas" element={<GestionConsultas />} />
          </Route>
        </Route>

      </Routes>
      {!isOperadorPage && <Footer />}
    </>
  );
}

export default App;
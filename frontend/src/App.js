import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomeCarousel from './components/home/HomeCarousel';
import Welcome from './components/home/Welcome';
import Footer from './components/layout/Footer';
import Habitaciones from './components/habitaciones/Habitaciones';
import HabitacionDetalle from './components/habitaciones/HabitacionDetalle';
import Consultas from './components/consultas/Consultas.js';

import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  return (
    <Router>
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
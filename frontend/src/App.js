// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeCarousel from './components/HomeCarousel';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import Habitaciones from './components/Habitaciones'; // Importamos el nuevo componente
import HabitacionDetalle from './components/HabitacionDetalle'; // Importamos el nuevo componente

function App() {
  return (
    <Router>
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
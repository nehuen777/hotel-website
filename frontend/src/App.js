import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeCarousel from './components/HomeCarousel';
import Welcome from './components/Welcome';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HomeCarousel />
              <Welcome />
            </>
          } />
          {/* Aquí se agregarán las rutas para "Habitaciones", etc. en futuras HU */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
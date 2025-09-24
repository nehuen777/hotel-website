// frontend/src/components/HabitacionDetalle.js

import React from 'react';
import { useParams } from 'react-router-dom';

const HabitacionDetalle = () => {
  let { id } = useParams();

  // Aquí iría la lógica para cargar los detalles de la habitación
  // y el formulario de consulta de disponibilidad (HU-03)

  return (
    <div>
      <h2>Detalles de la Habitación {id}</h2>
      <p>Próximamente: Galería de imágenes, lista completa de servicios y selector de fechas.</p>
    </div>
  );
};

export default HabitacionDetalle;
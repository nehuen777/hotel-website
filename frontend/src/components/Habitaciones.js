import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Habitaciones.css';

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/habitaciones')
      .then(res => {
        if (!res.ok) {
          throw new Error('La respuesta de la red no fue exitosa');
        }
        return res.json();
      })
      .then(data => {
        setHabitaciones(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error en el fetch:", err);
        setError('No se pudieron cargar las habitaciones. Intente de nuevo más tarde.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando habitaciones...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="habitaciones-container">
      <h2 className="text-center mb-4">Nuestras Habitaciones</h2>
      <div className="habitaciones-grid">
        {habitaciones.map(habitacion => (
          <div key={habitacion.ID_TipoHabitacion} className="habitacion-card">
            <img src={habitacion.ImagenURL} alt={`Habitación ${habitacion.TipoHabitacion}`} className="habitacion-imagen" />
            
            <div className="habitacion-contenido">
              <div className="habitacion-info">
                <h3>{habitacion.TipoHabitacion}</h3>
                <p className="precio">${habitacion.PrecioPorNoche} por noche</p>
                <p className="descripcion">{habitacion.Descripcion}</p>
                {habitacion.Servicios ? (
                  <ul className="servicios-lista">
                    {habitacion.Servicios.slice(0, -2).split(', ').map((servicio, index) => (
                      <li key={index}>{servicio}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay servicios principales especificados.</p>
                )}
              </div>
              <Link to={`/habitaciones/${habitacion.ID_TipoHabitacion}`} className="btn-consultar">
                Consultar disponibilidad
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Habitaciones;
import React, { useState, useEffect } from 'react';
import { fetchProtegido } from '../../utils/fetchProtegido';

const MapaHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState('');

  const cargarHabitaciones = async () => {
    try {
      const data = await fetchProtegido('http://localhost:5000/api/operador/habitaciones/mapa');
      setHabitaciones(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const handleEstadoChange = async (id, estadoActual) => {
    try {
      await fetchProtegido(`http://localhost:5000/api/operador/habitaciones/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ abierta: !estadoActual }),
      });
      // Recargar para ver los cambios
      cargarHabitaciones();
    } catch (err) {
      setError(err.message);
    }
  };

  const getCardClass = (habitacion) => {
    if (!habitacion.Abierta) return 'bg-secondary text-white';
    if (habitacion.Ocupada) return 'bg-danger text-white';
    return 'bg-success text-white';
  };

  return (
    <div className="container mt-4">
      <h2>Mapa de Habitaciones</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {habitaciones.map(h => (
          <div key={h.ID_Habitacion} className="col-md-3 mb-4">
            <div className={`card ${getCardClass(h)}`}>
              <div className="card-body">
                <h5 className="card-title">Habitación {h.NumeroHabitacion}</h5>
                <p className="card-text">Piso: {h.Piso}</p>
                <p className="card-text">Tipo: {h.TipoHabitacionNombre}</p>
                <p className="card-text">Estado: {!h.Abierta ? 'Cerrada' : h.Ocupada ? 'Ocupada' : 'Libre'}</p>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={() => handleEstadoChange(h.ID_Habitacion, h.Abierta)}
                >
                  {h.Abierta ? 'Cerrar' : 'Abrir'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapaHabitaciones;

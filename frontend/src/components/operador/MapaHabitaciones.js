import React, { useState, useEffect, useCallback } from 'react';
import { fetchProtegido } from '../../utils/fetchProtegido';
import { Card, Form } from 'react-bootstrap';
import { BuildingFillSlash, DoorClosedFill, DoorOpenFill } from 'react-bootstrap-icons';
import './MapaHabitaciones.css';

const MapaHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState('');

  const cargarHabitaciones = useCallback(async () => {
    try {
      const data = await fetchProtegido('http://localhost:5000/api/operador/habitaciones/mapa');
      setHabitaciones(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    cargarHabitaciones();
  }, [cargarHabitaciones]);

  const handleEstadoChange = async (id, estadoActual) => {
    try {
      await fetchProtegido(`http://localhost:5000/api/operador/habitaciones/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ abierta: !estadoActual }),
      });
      cargarHabitaciones();
    } catch (err) {
      setError(err.message);
    }
  };

  const groupByPiso = habitaciones.reduce((acc, habitacion) => {
    const piso = habitacion.Piso;
    if (!acc[piso]) {
      acc[piso] = [];
    }
    acc[piso].push(habitacion);
    return acc;
  }, {});

  return (
    <div className="container-fluid mt-4">
      <h2>Mapa de Habitaciones</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {Object.entries(groupByPiso).map(([piso, habitacionesDelPiso]) => (
        <div key={piso} className="mb-5">
          <h4>Piso {piso}</h4>
          <hr />
          <div className="floor-grid">
            {habitacionesDelPiso.map(h => (
              <Card 
                key={h.ID_Habitacion} 
                className="room-card"
                bg={!h.Abierta ? 'secondary' : h.Ocupada ? 'warning' : 'success'}
                text="white"
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <div className="mb-2">
                    {!h.Abierta ? <BuildingFillSlash size={32} /> : h.Ocupada ? <DoorClosedFill size={32} /> : <DoorOpenFill size={32} />}
                  </div>
                  <Card.Title style={{ fontSize: '1.5rem' }}>{h.NumeroHabitacion}</Card.Title>
                  <Card.Text className="mb-0">
                    {!h.Abierta ? 'Mantenimiento' : h.Ocupada ? 'Ocupada' : 'Libre'}
                  </Card.Text>
                  <Card.Text>{h.TipoHabitacionNombre}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Form.Check 
                    type="switch"
                    id={`switch-${h.ID_Habitacion}`}
                    label={h.Abierta ? 'Cerrar Habitación' : 'Abrir Habitación'}
                    checked={h.Abierta}
                    onChange={() => handleEstadoChange(h.ID_Habitacion, h.Abierta)}
                  />
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapaHabitaciones;

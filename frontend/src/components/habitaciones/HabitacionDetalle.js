// frontend/src/components/habitaciones/HabitacionDetalle.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Row, Col, Button, Card, Spinner, Alert } from 'react-bootstrap';
import './HabitacionDetalle.css'; // Crearemos este archivo para estilos

const HabitacionDetalle = () => {
  const { id } = useParams();
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el selector de fechas
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));

  // Estados para la consulta de disponibilidad
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState({ status: null, message: '' }); // 'disponible', 'no_disponible'

  useEffect(() => {
    // Cargar los detalles de la habitación
    fetch(`/api/habitaciones/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar la información de la habitación.');
        return res.json();
      })
      .then(data => {
        setHabitacion(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAvailabilityCheck = () => {
    setIsChecking(true);
    setAvailability({ status: null, message: '' });

    // Formatear fechas a YYYY-MM-DD
    const formattedCheckIn = checkInDate.toISOString().split('T')[0];
    const formattedCheckOut = checkOutDate.toISOString().split('T')[0];

    fetch(`/api/habitaciones/${id}/disponibilidad?checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}`)
      .then(res => res.json())
      .then(data => {
        if (data.disponible) {
          setAvailability({ status: 'disponible', message: data.mensaje });
        } else {
          setAvailability({ status: 'no_disponible', message: data.mensaje });
        }
        setIsChecking(false);
      })
      .catch(() => {
        setAvailability({ status: 'error', message: 'Error al consultar. Intente de nuevo.' });
        setIsChecking(false);
      });
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!habitacion) return null;

  return (
    <Container className="my-5">
      <Card>
        <Card.Img variant="top" src={habitacion.ImagenURL} />
        <Card.Body>
          <Card.Title as="h2">{habitacion.TipoHabitacion}</Card.Title>
          <Card.Text>{habitacion.Descripcion}</Card.Text>
          <p><strong>Precio por noche:</strong> ${habitacion.PrecioPorNoche}</p>
          <h5>Servicios Incluidos:</h5>
          <ul>
            {habitacion.Servicios ? habitacion.Servicios.split(', ').map((servicio, index) => (
              <li key={index}>{servicio}</li>
            )) : <li>No especificados</li>}
          </ul>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header as="h4">Consultar Disponibilidad</Card.Header>
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4} className="mb-3">
              <label htmlFor="checkin-date" className="form-label">Fecha de Entrada</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                id="checkin-date"
              />
            </Col>
            <Col md={4} className="mb-3">
              <label htmlFor="checkout-date" className="form-label">Fecha de Salida</label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                id="checkout-date"
              />
            </Col>
            <Col md={4} className="mb-3 d-grid">
              <Button onClick={handleAvailabilityCheck} disabled={isChecking}>
                {isChecking ? <Spinner as="span" animation="border" size="sm" /> : 'Verificar Disponibilidad'}
              </Button>
            </Col>
          </Row>
          {availability.status && (
            <Alert variant={availability.status === 'disponible' ? 'success' : 'danger'} className="mt-3">
              {availability.message}
            </Alert>
          )}
          {availability.status === 'disponible' && (
             <div className="d-grid mt-3">
                {/* Este botón nos servirá para la HU-04 */}
                <Button variant="primary" size="lg">Reservar Ahora</Button>
             </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HabitacionDetalle;
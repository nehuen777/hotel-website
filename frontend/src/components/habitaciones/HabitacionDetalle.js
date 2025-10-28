import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Row, Col, Button, Card, Spinner, Alert, Modal } from 'react-bootstrap'; // Se añade Modal
import { BsCheckCircleFill } from 'react-icons/bs';
import './HabitacionDetalle.css';
import ReservaModal from './ReservaModal';

const HabitacionDetalle = () => {
  const { id } = useParams();
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState({ status: null, message: '' });

  const [showReservaModal, setShowReservaModal] = useState(false);
  
  // --- ¡NUEVOS ESTADOS PARA EL MODAL DE ÉXITO! ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Carga de datos de la habitación... (sin cambios)
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
    // Lógica para verificar disponibilidad... (sin cambios)
    setIsChecking(true);
    setAvailability({ status: null, message: '' });
    const formattedCheckIn = checkInDate.toISOString().split('T')[0];
    const formattedCheckOut = checkOutDate.toISOString().split('T')[0];
    fetch(`/api/habitaciones/${id}/disponibilidad?checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}`)
      .then(res => res.json())
      .then(data => {
        setAvailability({ status: data.disponible ? 'disponible' : 'no_disponible', message: data.mensaje });
      })
      .catch(() => {
        setAvailability({ status: 'error', message: 'Error al consultar. Intente de nuevo.' });
      })
      .finally(() => setIsChecking(false));
  };

  // --- FUNCIÓN ACTUALIZADA ---
  // Ahora, en lugar de mostrar un Alert, muestra el modal de éxito.
  const handleReservationSuccess = (message) => {
    setSuccessMessage(message); // Guarda el mensaje de éxito
    setShowSuccessModal(true); // ¡Muestra el modal de éxito!
    setAvailability({ status: null, message: '' }); // Oculta el verificador de disponibilidad
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!habitacion) return null;

  return (
    <Container className="my-5 fade-in">
      {/* El Alert de éxito de arriba se ha eliminado */}

      <Card>
        {/* ... Detalles de la habitación (sin cambios) ... */}
        <Card.Img variant="top" src={habitacion.ImagenURL} />
        <Card.Body>
          <Card.Title as="h2">{habitacion.TipoHabitacion}</Card.Title>
          <Card.Text>{habitacion.Descripcion}</Card.Text>
          <p><strong>Precio por noche:</strong> ${habitacion.PrecioPorNoche}</p>
          <h5>Servicios Incluidos:</h5>
          <ul className="list-unstyled">
            {habitacion.Servicios ? habitacion.Servicios.split(', ').map((servicio, index) => (
              <li key={index}><BsCheckCircleFill className="me-2 text-success" />{servicio}</li>
            )) : <li>No especificados</li>}
          </ul>
        </Card.Body>
      </Card>
      
      {/* El verificador de disponibilidad sigue igual, pero ahora se oculta si `successMessage` tiene contenido */}
      {!successMessage && (
        <Card className="mt-4">
          <Card.Header as="h4">Consultar Disponibilidad</Card.Header>
          <Card.Body>
            <Row className="align-items-end">
              <Col md={4} className="mb-3">
                <label htmlFor="checkin-date" className="form-label">Fecha de Entrada</label>
                <DatePicker selected={checkInDate} onChange={(date) => setCheckInDate(date)} selectsStart startDate={checkInDate} endDate={checkOutDate} minDate={new Date()} dateFormat="dd/MM/yyyy" className="form-control" id="checkin-date" />
              </Col>
              <Col md={4} className="mb-3">
                <label htmlFor="checkout-date" className="form-label">Fecha de Salida</label>
                <DatePicker selected={checkOutDate} onChange={(date) => setCheckOutDate(date)} selectsEnd startDate={checkInDate} endDate={checkOutDate} minDate={checkInDate} dateFormat="dd/MM/yyyy" className="form-control" id="checkout-date" />
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
                <Button variant="primary" size="lg" onClick={() => setShowReservaModal(true)}>
                  Reservar Ahora
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Modal de Reserva (sin cambios en su lógica interna) */}
      {habitacion && <ReservaModal
        show={showReservaModal}
        handleClose={() => setShowReservaModal(false)}
        habitacion={habitacion}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        onReservationSuccess={handleReservationSuccess}
      />}

      {/* --- ¡NUEVO MODAL DE CONFIRMACIÓN DE ÉXITO! --- */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 ¡Confirmación!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="fs-5">{successMessage}</p>
          <p>Hemos enviado los detalles a su correo electrónico.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HabitacionDetalle;
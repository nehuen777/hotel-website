import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsCheckCircleFill } from 'react-icons/bs';
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
    <Container className="my-5 fade-in">
      <h2 className="text-center mb-4">Nuestras Habitaciones</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {habitaciones.length === 0 ? (
          <Col className="text-center w-100">
            <p className="lead">No hay habitaciones disponibles en este momento. Por favor, inténtelo de nuevo más tarde.</p>
          </Col>
        ) : (
          habitaciones.map((habitacion, index) => (
            <Col key={habitacion.ID_TipoHabitacion} className="card-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={habitacion.ImagenURL} alt={`Habitación ${habitacion.TipoHabitacion}`} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{habitacion.TipoHabitacion}</Card.Title>
                  <Card.Text className="text-muted">${habitacion.PrecioPorNoche} por noche</Card.Text>
                  <Card.Text>{habitacion.Descripcion}</Card.Text>
                  {habitacion.Servicios ? (
                    <ul className="list-unstyled mt-3">
                      {habitacion.Servicios.slice(0, -2).split(', ').map((servicio, index) => (
                        <li key={index}><BsCheckCircleFill className="me-2 text-success" />{servicio}</li>
                      ))}
                    </ul>
                  ) : (
                    <Card.Text>No hay servicios principales especificados.</Card.Text>
                  )}
                  <Button 
                    as={Link} 
                    to={`/habitaciones/${habitacion.ID_TipoHabitacion}`} 
                    variant="primary" 
                    className="mt-auto"
                  >
                    Consultar disponibilidad
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Habitaciones;
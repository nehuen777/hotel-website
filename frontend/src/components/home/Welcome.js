import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DoorOpenFill } from 'react-bootstrap-icons'; // Importar el icono

function Welcome() {
  return (
    <Container className="my-5 text-center fade-in">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2>Bienvenido al nuestro Hotel</h2>
          <p className="lead">
            Ubicado en el corazón de la ciudad, nuestro hotel ofrece una combinación perfecta de lujo, confort y hospitalidad. Ya sea que viaje por negocios o por placer, nuestras instalaciones de primer nivel y nuestro personal atento asegurarán que su estadía sea inolvidable. Explore nuestras habitaciones, descubra nuestros servicios y prepárese para vivir una experiencia única.
          </p>
          <Button as={Link} to="/habitaciones" variant="primary" size="lg" className="mt-3">
            <DoorOpenFill className="me-2" /> {/* Añadir el icono */}
            Consultar Habitaciones
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Welcome;
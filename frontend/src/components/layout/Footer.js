import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Envelope, Telephone, GeoAlt, ChatDots } from 'react-bootstrap-icons';

function Footer() {
  return (
    <footer id="consultas" className="bg-light text-dark mt-5 p-4 text-center">
      <Container>
        <Row className="mb-4">
          <Col>
            <h4>¿Necesitás ayuda o tenés alguna consulta?</h4>
            <p>¡No dudes en contactarnos!</p>
            <Button as={Link} to="/consultas" variant="primary" size="lg">
              <ChatDots className="me-2" /> Enviar una Consulta
            </Button>
          </Col>
        </Row>
        <hr />
        <Row className="mt-4">
          <Col>
            <h4>Contacto</h4>
            <p><GeoAlt /> Dirección: Av. Ficticia 123, Ciudad Ejemplo, País</p>
            <p><Telephone /> Teléfono: +123 456 7890</p>
            <p><Envelope /> Email: <a href="mailto:contacto@hotel.com" className="text-dark">contacto@hotel.com</a></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer id="consultas" className="bg-dark text-white mt-5 p-4 text-center">
      <Container>
        <Row>
          <Col>
            <h4>Hotel</h4>
            <p>Dirección: Av. Ficticia 123, Ciudad Ejemplo, País</p>
            <p>Teléfono: +123 456 7890</p>
            <p>Email: <a href="mailto:contacto@hotel.com" className="text-white">contacto@hotel.com</a></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
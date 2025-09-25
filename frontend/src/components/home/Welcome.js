import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Welcome() {
  return (
    <Container className="my-5">
      <Row>
        <Col className="text-center">
          <h2>Bienvenido al nuestro Hotel</h2>
          <p className="lead">
            Ubicado en el corazón de la ciudad, nuestro hotel ofrece una combinación perfecta de lujo, confort y hospitalidad. Ya sea que viaje por negocios o por placer, nuestras instalaciones de primer nivel y nuestro personal atento asegurarán que su estadía sea inolvidable. Explore nuestras habitaciones, descubra nuestros servicios y prepárese para vivir una experiencia única.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Welcome;
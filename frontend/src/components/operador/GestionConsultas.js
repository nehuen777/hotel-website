import React, { useState, useEffect, useCallback } from 'react';
import { fetchProtegido } from '../../utils/fetchProtegido';
import { Alert, Row, Col, Card, Spinner, ListGroup, Form, Button } from 'react-bootstrap';
import { Envelope, ChevronRight } from 'react-bootstrap-icons';

const GestionConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusVariant, setStatusVariant] = useState('light');

  const cargarConsultas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProtegido('http://localhost:5000/api/consultas?respondida=0');
      setConsultas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarConsultas();
  }, [cargarConsultas]);

  const handleSelectConsulta = (consulta) => {
    setSelectedConsulta(consulta);
    setRespuesta('');
    setStatusMsg('');
  };

  const handleResponder = async (e) => {
    e.preventDefault();
    if (!selectedConsulta || !respuesta) return;

    try {
      await fetchProtegido(`http://localhost:5000/api/consultas/${selectedConsulta.ID_Consulta}/responder`, {
        method: 'POST',
        body: JSON.stringify({ textoRespuesta: respuesta }),
      });
      setStatusVariant('success');
      setStatusMsg('Respuesta enviada con éxito.');
      setSelectedConsulta(null);
      setRespuesta('');
      cargarConsultas(); // Recargar para quitar la consulta respondida
    } catch (err) {
      setStatusVariant('danger');
      setStatusMsg('Error al enviar la respuesta. Intente de nuevo.');
      setError(err.message);
    }
  };

  const renderListaConsultas = () => {
    if (loading) {
      return <div className="text-center"><Spinner animation="border" /></div>;
    }
    if (consultas.length === 0) {
      return <Alert variant="info">No hay consultas pendientes.</Alert>;
    }
    return (
      <ListGroup>
        {consultas.map(c => (
          <ListGroup.Item 
            key={c.ID_Consulta} 
            action
            active={selectedConsulta && selectedConsulta.ID_Consulta === c.ID_Consulta}
            onClick={() => handleSelectConsulta(c)}
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{c.Asunto}</div>
              <small className="text-muted">{c.Email}</small>
            </div>
            <ChevronRight size={20} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Gestión de Consultas</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={5} lg={4}>
          <h4 className="mb-3">Consultas Pendientes</h4>
          {renderListaConsultas()}
        </Col>
        <Col md={7} lg={8}>
          {selectedConsulta ? (
            <Card>
              <Card.Header as="h5">Detalle de la Consulta</Card.Header>
              <Card.Body>
                <Card.Title>{selectedConsulta.Asunto}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  De: {selectedConsulta.Email}
                </Card.Subtitle>
                <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedConsulta.Mensaje}
                </Card.Text>
                <hr />
                <h5 className="mb-3">Responder</h5>
                <Form onSubmit={handleResponder}>
                  {statusMsg && <Alert variant={statusVariant} onClose={() => setStatusMsg('')} dismissible>{statusMsg}</Alert>}
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="respuesta">Mensaje de Respuesta</Form.Label>
                    <Form.Control 
                      as="textarea"
                      id="respuesta"
                      rows="6"
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                      required
                      placeholder="Escriba su respuesta aquí..."
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    <Envelope className="me-2" />
                    Enviar Respuesta
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="text-center">
              <Card.Body>
                <Card.Text className="text-muted">
                  Seleccione una consulta de la lista para ver el detalle y enviar una respuesta.
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default GestionConsultas;

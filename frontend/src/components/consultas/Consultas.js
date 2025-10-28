import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner, Modal, Card } from 'react-bootstrap'; // Añadimos Modal y Card

const Consultas = () => {
  const [formData, setFormData] = useState({
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- Estados para el Modal ---
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: '', body: '', variant: 'light' }); // variant: success, danger, etc.

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El formato del email no es válido.';
    }
    if (!formData.asunto.trim()) errors.asunto = 'El asunto es requerido.';
    if (!formData.mensaje.trim()) errors.mensaje = 'El mensaje es requerido.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCloseModal = () => setShowStatusModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Ya no usamos setSubmitStatus, preparamos para el modal

    fetch('/api/consultas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(res => res.json().then(data => ({ ok: res.ok, status: res.status, data })))
    .then(({ ok, data }) => {
      if (ok) {
        setModalInfo({
          title: '¡Consulta Enviada!',
          body: data.message || 'Tu consulta ha sido enviada con éxito. Te responderemos a la brevedad.',
          variant: 'success',
        });
        setFormData({ email: '', asunto: '', mensaje: '' }); // Limpiar formulario
      } else {
        throw new Error(data.message || 'Ocurrió un error al procesar tu consulta.');
      }
    })
    .catch((err) => {
      setModalInfo({
        title: 'Error al Enviar',
        body: err.message || 'No se pudo enviar la consulta. Por favor, intenta de nuevo más tarde.',
        variant: 'danger',
      });
    })
    .finally(() => {
      setIsSubmitting(false);
      setShowStatusModal(true); // Mostrar el modal al finalizar (éxito o error)
    });
  };

  return (
    <Container className="my-5 d-flex justify-content-center fade-in">
      <Card style={{ width: '100%', maxWidth: '700px' }}>
        <Card.Header as="h3" className="text-center">Contacto y Consultas</Card.Header>
        <Card.Body>
          <p className="text-center mb-4">
            ¿Tienes alguna pregunta? Completa el formulario y te responderemos a la brevedad.
          </p>

          {/* El Alert se elimina de aquí */}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Tu Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!formErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicSubject">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Asunto de tu consulta"
                name="asunto"
                value={formData.asunto}
                onChange={handleInputChange}
                isInvalid={!!formErrors.asunto}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.asunto}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicMessage">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Escribe aquí tu mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleInputChange}
                isInvalid={!!formErrors.mensaje}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.mensaje}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid mt-4">
              <Button variant="primary" type="submit" disabled={isSubmitting} size="lg">
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    {' '}Enviando...
                  </>
                ) : (
                  'Enviar Consulta'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* --- Modal para mostrar el estado del envío --- */}
      <Modal show={showStatusModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className={`bg-${modalInfo.variant} text-white`}>
          <Modal.Title>{modalInfo.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalInfo.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Consultas;
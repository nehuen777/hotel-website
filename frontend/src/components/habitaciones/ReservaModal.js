// frontend/src/components/habitaciones/ReservaModal.js

import React, { useState } from 'react';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';

const ReservaModal = ({ show, handleClose, habitacion, checkInDate, checkOutDate, onReservationSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido.';
    if (!formData.apellido.trim()) errors.apellido = 'El apellido es requerido.';
    if (!formData.dni.trim()) errors.dni = 'El DNI es requerido.';
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El formato del email no es válido.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError('');

    const reservaData = {
        ...formData,
        idTipoHabitacion: habitacion.ID_TipoHabitacion,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
    };

    fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData),
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
        if (ok) {
            onReservationSuccess(data.message);
            handleClose(); // Cierra el modal
        } else {
            setSubmissionError(data.message || 'Ocurrió un error al procesar la reserva.');
        }
    })
    .catch(() => {
        setSubmissionError('Error de red. Por favor, intente de nuevo más tarde.');
    })
    .finally(() => {
        setIsSubmitting(false);
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{habitacion.TipoHabitacion}</h5>
        <p>
          <strong>Desde:</strong> {checkInDate.toLocaleDateString()} <br/>
          <strong>Hasta:</strong> {checkOutDate.toLocaleDateString()}
        </p>
        <hr />
        
        {submissionError && (
          <Alert variant="danger">{submissionError}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} isInvalid={!!formErrors.nombre} />
            <Form.Control.Feedback type="invalid">{formErrors.nombre}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} isInvalid={!!formErrors.apellido} />
            <Form.Control.Feedback type="invalid">{formErrors.apellido}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>DNI</Form.Label>
            <Form.Control type="text" name="dni" value={formData.dni} onChange={handleInputChange} isInvalid={!!formErrors.dni} />
            <Form.Control.Feedback type="invalid">{formErrors.dni}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} isInvalid={!!formErrors.email} />
            <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-grid mt-4">
            <Button variant="success" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Finalizar Reserva'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReservaModal;
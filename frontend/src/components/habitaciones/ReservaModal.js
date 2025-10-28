import React, { useState } from 'react';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';

const ReservaModal = ({ show, handleClose, habitacion, checkInDate, checkOutDate, onReservationSuccess }) => {
  // ... (estados existentes: formData, formErrors, isSubmitting, submissionError) ...
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // --- handleInputChange (sin cambios respecto a la versión anterior) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'nombre' || name === 'apellido') {
      processedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
    }

    if (name === 'dni') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 8) {
        processedValue = processedValue.slice(0, 8);
      }
    }

    setFormData({ ...formData, [name]: processedValue });

     if (formErrors[name]) {
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: null }));
     }
  };

  // --- NUEVA: Función específica para validar DNI ---
  const validateDni = () => {
    const dniValue = formData.dni.trim();
    if (!dniValue) {
      return 'El DNI es requerido.';
    } else if (dniValue.length !== 8) {
      return 'El DNI debe tener exactamente 8 dígitos.';
    } else if (!/^\d{8}$/.test(dniValue)) {
      return 'El DNI solo debe contener números.';
    }
    return null; // Sin error
  };

  // --- NUEVA: Handler para el evento onBlur del DNI ---
  const handleDniBlur = () => {
    const dniError = validateDni();
    setFormErrors(prevErrors => ({ ...prevErrors, dni: dniError }));
  };

  // --- validateForm MODIFICADO ---
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido.';
    if (!formData.apellido.trim()) errors.apellido = 'El apellido es requerido.';

    // Usar la función específica de validación de DNI
    const dniError = validateDni();
    if (dniError) errors.dni = dniError;

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El formato del email no es válido.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- handleSubmit (sin cambios en la lógica de fetch) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Re-valida todo al enviar

    setIsSubmitting(true);
    setSubmissionError('');
    // ... (resto del fetch igual) ...
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
            handleClose();
        } else {
            setSubmissionError(data?.message || 'Ocurrió un error al procesar la reserva.');
        }
    })
    .catch(() => {
        setSubmissionError('Error de red. Por favor, intente de nuevo más tarde.');
    })
    .finally(() => {
        setIsSubmitting(false);
    });
  };

  // --- JSX del Modal ---
  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* ... (Modal.Header y datos de habitación sin cambios) ... */}
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
          {/* ... (Campos Nombre, Apellido sin cambios) ... */}
           <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} isInvalid={!!formErrors.nombre} placeholder="Tu nombre" />
            <Form.Control.Feedback type="invalid">{formErrors.nombre}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} isInvalid={!!formErrors.apellido} placeholder="Tu apellido" />
            <Form.Control.Feedback type="invalid">{formErrors.apellido}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              isInvalid={!!formErrors.dni}
              maxLength={8}
              placeholder="8 dígitos numéricos"
              disabled={isSubmitting}
            />
            <Form.Control.Feedback type="invalid">{formErrors.dni}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} isInvalid={!!formErrors.email} placeholder="tu@ejemplo.com" />
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
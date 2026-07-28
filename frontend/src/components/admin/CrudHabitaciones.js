import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Row, Col, Modal, Form, Badge } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { fetchProtegido } from '../../utils/fetchProtegido';

const CrudHabitaciones = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [tiposDisponibles, setTiposDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Estado adaptado a tu esquema SQL
    const [formData, setFormData] = useState({ 
        ID_Habitacion: '', 
        ID_TipoHabitacion: '', 
        NumeroHabitacion: '', 
        Piso: '', 
        Abierta: true // Por defecto en 1 (true)
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [habitacionToDelete, setHabitacionToDelete] = useState(null);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [habData, tiposData] = await Promise.all([
                fetchProtegido('/api/habitaciones/admin/all'),
                fetchProtegido('/api/tipos')
            ]);
            setHabitaciones(habData);
            setTiposDisponibles(tiposData);
        } catch (err) {
            setError('Error al cargar datos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleCloseForm = () => {
        setShowFormModal(false);
        setFormData({ ID_Habitacion: '', ID_TipoHabitacion: '', NumeroHabitacion: '', Piso: '', Abierta: true });
        setError(null);
    };

    const handleShowCreate = () => {
        setIsEditing(false);
        setFormData({ ID_Habitacion: '', ID_TipoHabitacion: '', NumeroHabitacion: '', Piso: '', Abierta: true });
        setShowFormModal(true);
    };

    const handleShowEdit = (hab) => {
        setIsEditing(true);
        setFormData({
            ID_Habitacion: hab.ID_Habitacion,
            ID_TipoHabitacion: hab.ID_TipoHabitacion,
            NumeroHabitacion: hab.NumeroHabitacion,
            Piso: hab.Piso,
            Abierta: hab.Abierta
        });
        setShowFormModal(true);
    };

    // Modificado para poder leer Checkboxes (el switch de Abierta) y text/numbers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isEditing) {
                await fetchProtegido(`/api/habitaciones/${formData.ID_Habitacion}`, {
                    method: 'PUT', body: JSON.stringify(formData)
                });
                setSuccessMsg('Habitación actualizada.');
            } else {
                await fetchProtegido('/api/habitaciones', {
                    method: 'POST', body: JSON.stringify(formData)
                });
                setSuccessMsg('Habitación creada.');
            }
            handleCloseForm();
            cargarDatos();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleShowDelete = (hab) => {
        setHabitacionToDelete(hab);
        setShowDeleteModal(true);
    };

    const executeDelete = async () => {
        try {
            await fetchProtegido(`/api/habitaciones/${habitacionToDelete.ID_Habitacion}`, { method: 'DELETE' });
            setSuccessMsg('Habitación eliminada.');
            cargarDatos();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(null), 6000);
        } finally {
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="fade-in">
            <Row className="align-items-center mb-3">
                <Col><h4>Gestión de Habitaciones Físicas</h4></Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowCreate}>+ Nueva Habitación</Button>
                </Col>
            </Row>

            {successMsg && <Alert variant="success" className="fade-in">{successMsg}</Alert>}
            {error && !showFormModal && <Alert variant="danger" className="fade-in">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
                <Table striped bordered hover responsive className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nº Habitación</th>
                            <th>Piso</th>
                            <th>Tipo Asignado</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habitaciones.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted">No hay habitaciones registradas.</td></tr>
                        ) : (
                            habitaciones.map((hab) => (
                                <tr key={hab.ID_Habitacion}>
                                    <td><strong>{hab.NumeroHabitacion}</strong></td>
                                    <td>{hab.Piso}</td>
                                    <td>{hab.NombreTipo || 'Sin asignar'}</td>
                                    <td>
                                        {hab.Abierta 
                                            ? <Badge bg="success">Habilitada</Badge> 
                                            : <Badge bg="secondary">Clausurada</Badge>}
                                    </td>
                                    <td className="text-center">
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEdit(hab)}><PencilSquare /></Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleShowDelete(hab)}><Trash /></Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {/* MODAL FORMULARIO */}
            <Modal show={showFormModal} onHide={handleCloseForm} dialogClassName="fade-in">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton><Modal.Title>{isEditing ? 'Editar Habitación' : 'Nueva Habitación'}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger" className="fade-in">{error}</Alert>}
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número de Habitación</Form.Label>
                                    <Form.Control type="text" name="NumeroHabitacion" value={formData.NumeroHabitacion} onChange={handleChange} required placeholder="Ej: 101" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Piso</Form.Label>
                                    <Form.Control type="number" name="Piso" value={formData.Piso} onChange={handleChange} required placeholder="Ej: 1" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>Tipo de Habitación</Form.Label>
                            <Form.Select name="ID_TipoHabitacion" value={formData.ID_TipoHabitacion} onChange={handleChange} required>
                                <option value="">Seleccione un tipo...</option>
                                {tiposDisponibles.map(t => (
                                    <option key={t.ID_TipoHabitacion} value={t.ID_TipoHabitacion}>{t.Nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 p-3 bg-light rounded border">
                            <Form.Check 
                                type="switch"
                                id="abierta-switch"
                                name="Abierta"
                                label={formData.Abierta ? "Habitación Operativa (Abierta)" : "Habitación Clausurada/Mantenimiento"}
                                checked={formData.Abierta}
                                onChange={handleChange}
                                className={formData.Abierta ? "text-success fw-bold" : "text-muted"}
                            />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseForm}>Cancelar</Button>
                        <Button variant="primary" type="submit">{isEditing ? 'Guardar Cambios' : 'Crear Habitación'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL ELIMINAR */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered dialogClassName="fade-in">
                <Modal.Header closeButton className="border-0 pb-0"><Modal.Title className="text-danger">Eliminar Habitación</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p>¿Deseas eliminar la habitación <strong>{habitacionToDelete?.NumeroHabitacion}</strong>?</p>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={executeDelete}>Sí, eliminar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrudHabitaciones;
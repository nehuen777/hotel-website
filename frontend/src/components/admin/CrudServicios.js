import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Row, Col, Modal, Form } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { fetchProtegido } from '../../utils/fetchProtegido';

const CrudServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Estados del Modal de Formulario (Crear/Editar)
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ID_Servicio: '', Nombre: '', Descripcion: '' });

    // Estados del Modal de Confirmación (Eliminar)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [servicioToDelete, setServicioToDelete] = useState(null);

    const cargarServicios = async () => {
        try {
            setLoading(true);
            const data = await fetchProtegido('/api/servicios');
            setServicios(data);
        } catch (err) {
            setError('Error al cargar los servicios: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarServicios();
    }, []);

    // --- MANEJO DEL FORMULARIO (CREAR/EDITAR) ---
    const handleCloseForm = () => {
        setShowFormModal(false);
        setFormData({ ID_Servicio: '', Nombre: '', Descripcion: '' });
        setError(null);
    };

    const handleShowCreate = () => {
        setIsEditing(false);
        setFormData({ ID_Servicio: '', Nombre: '', Descripcion: '' });
        setShowFormModal(true);
    };

    const handleShowEdit = (servicio) => {
        setIsEditing(true);
        setFormData(servicio);
        setShowFormModal(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (isEditing) {
                await fetchProtegido(`/api/servicios/${formData.ID_Servicio}`, {
                    method: 'PUT',
                    body: JSON.stringify({ Nombre: formData.Nombre, Descripcion: formData.Descripcion })
                });
                setSuccessMsg('Servicio actualizado con éxito.');
            } else {
                await fetchProtegido('/api/servicios', {
                    method: 'POST',
                    body: JSON.stringify({ Nombre: formData.Nombre, Descripcion: formData.Descripcion })
                });
                setSuccessMsg('Servicio creado con éxito.');
            }
            
            handleCloseForm();
            cargarServicios(); 
            setTimeout(() => setSuccessMsg(null), 3000); 
        } catch (err) {
            setError(err.message);
        }
    };

    // --- MANEJO DE ELIMINACIÓN (MODAL LINDO) ---
    const handleShowDelete = (servicio) => {
        setServicioToDelete(servicio);
        setShowDeleteModal(true);
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setServicioToDelete(null);
    };

    const executeDelete = async () => {
        try {
            await fetchProtegido(`/api/servicios/${servicioToDelete.ID_Servicio}`, { method: 'DELETE' });
            setSuccessMsg('Servicio eliminado.');
            cargarServicios();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setError(err.message); 
            setTimeout(() => setError(null), 6000);
        } finally {
            handleCloseDelete();
        }
    };

    return (
        <div className="fade-in">
            <Row className="align-items-center mb-3">
                <Col>
                    <h4>Catálogo General de Servicios</h4>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowCreate}>
                        + Nuevo Servicio
                    </Button>
                </Col>
            </Row>

            {successMsg && <Alert variant="success" className="fade-in">{successMsg}</Alert>}
            {error && !showFormModal && <Alert variant="danger" className="fade-in">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Cargando catálogo...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Descripción</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">No hay servicios registrados.</td>
                            </tr>
                        ) : (
                            servicios.map((servicio) => (
                                <tr key={servicio.ID_Servicio}>
                                    <td>{servicio.ID_Servicio}</td>
                                    <td><strong>{servicio.Nombre}</strong></td>
                                    <td>{servicio.Descripcion}</td>
                                    <td className="text-center">
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEdit(servicio)}>
                                            <PencilSquare />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleShowDelete(servicio)}>
                                            <Trash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {/* MODAL PARA CREAR O EDITAR */}
            <Modal show={showFormModal} onHide={handleCloseForm} dialogClassName="fade-in">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger" className="fade-in">{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Servicio</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="Nombre"
                                value={formData.Nombre} 
                                onChange={handleChange} 
                                required 
                                placeholder="Ej: Gimnasio, Desayuno..."
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                name="Descripcion"
                                value={formData.Descripcion} 
                                onChange={handleChange} 
                                placeholder="Detalles del servicio..."
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseForm}>Cancelar</Button>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Guardar Cambios' : 'Crear Servicio'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL PARA CONFIRMAR ELIMINACIÓN */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete} centered dialogClassName="fade-in">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-danger">Eliminar Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro que deseas eliminar el servicio <strong>{servicioToDelete?.Nombre}</strong>?</p>
                    <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={handleCloseDelete}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={executeDelete}>
                        Sí, eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrudServicios;
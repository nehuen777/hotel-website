import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Row, Col, Modal, Form, Badge } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { fetchProtegido } from '../../utils/fetchProtegido';

const CrudTipos = () => {
    const [tipos, setTipos] = useState([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Estados del Modal de Formulario
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        ID_TipoHabitacion: '', 
        Nombre: '', 
        Descripcion: '', 
        PrecioPorNoche: '', 
        ImagenURL: '',
        ServiciosAsignados: [] // Arreglo para guardar los IDs de los checkboxes
    });

    // Estados del Modal de Eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tipoToDelete, setTipoToDelete] = useState(null);

    const cargarDatosInit = async () => {
        try {
            setLoading(true);
            // Traemos ambas listas al mismo tiempo
            const [tiposData, serviciosData] = await Promise.all([
                fetchProtegido('/api/tipos'),
                fetchProtegido('/api/servicios')
            ]);
            setTipos(tiposData);
            setServiciosDisponibles(serviciosData);
        } catch (err) {
            setError('Error al cargar la información: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatosInit();
    }, []);

    // --- MANEJO DEL FORMULARIO ---
    const handleCloseForm = () => {
        setShowFormModal(false);
        setFormData({ ID_TipoHabitacion: '', Nombre: '', Descripcion: '', PrecioPorNoche: '', ImagenURL: '', ServiciosAsignados: [] });
        setError(null);
    };

    const handleShowCreate = () => {
        setIsEditing(false);
        setFormData({ ID_TipoHabitacion: '', Nombre: '', Descripcion: '', PrecioPorNoche: '', ImagenURL: '', ServiciosAsignados: [] });
        setShowFormModal(true);
    };

    const handleShowEdit = (tipo) => {
        setIsEditing(true);
        setFormData({
            ID_TipoHabitacion: tipo.ID_TipoHabitacion,
            Nombre: tipo.Nombre,
            Descripcion: tipo.Descripcion || '',
            PrecioPorNoche: tipo.PrecioPorNoche,
            ImagenURL: tipo.ImagenURL || '',
            ServiciosAsignados: tipo.ServiciosAsignados || []
        });
        setShowFormModal(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (idServicio) => {
        setFormData((prev) => {
            const asignados = prev.ServiciosAsignados;
            if (asignados.includes(idServicio)) {
                return { ...prev, ServiciosAsignados: asignados.filter(id => id !== idServicio) };
            } else {
                return { ...prev, ServiciosAsignados: [...asignados, idServicio] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            if (isEditing) {
                await fetchProtegido(`/api/tipos/${formData.ID_TipoHabitacion}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                setSuccessMsg('Tipo de habitación actualizado con éxito.');
            } else {
                await fetchProtegido('/api/tipos', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                setSuccessMsg('Tipo de habitación creado con éxito.');
            }
            
            handleCloseForm();
            cargarDatosInit(); 
            setTimeout(() => setSuccessMsg(null), 3000); 
        } catch (err) {
            setError(err.message);
        }
    };

    // --- MANEJO DE ELIMINACIÓN ---
    const handleShowDelete = (tipo) => {
        setTipoToDelete(tipo);
        setShowDeleteModal(true);
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setTipoToDelete(null);
    };

    const executeDelete = async () => {
        try {
            await fetchProtegido(`/api/tipos/${tipoToDelete.ID_TipoHabitacion}`, { method: 'DELETE' });
            setSuccessMsg('Tipo de habitación eliminado.');
            cargarDatosInit();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setError(err.message); 
            setTimeout(() => setError(null), 6000);
        } finally {
            handleCloseDelete();
        }
    };

    // Función auxiliar para mostrar los nombres de los servicios en la tabla
    const getNombresServicios = (ids) => {
        if (!ids || ids.length === 0) return <span className="text-muted">Ninguno</span>;
        const nombres = ids.map(id => {
            const serv = serviciosDisponibles.find(s => s.ID_Servicio === id);
            return serv ? serv.Nombre : `ID:${id}`;
        });
        return nombres.map((nombre, i) => (
            <Badge bg="info" className="me-1 mb-1" key={i}>{nombre}</Badge>
        ));
    };

    return (
        <div className="fade-in">
            <Row className="align-items-center mb-3">
                <Col>
                    <h4>Gestión de Tipos de Habitación</h4>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowCreate}>
                        + Nuevo Tipo
                    </Button>
                </Col>
            </Row>

            {successMsg && <Alert variant="success" className="fade-in">{successMsg}</Alert>}
            {error && !showFormModal && <Alert variant="danger" className="fade-in">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Cargando datos...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive className="align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Precio/Noche</th>
                            <th>Servicios Incluidos</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipos.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No hay tipos de habitación registrados.</td>
                            </tr>
                        ) : (
                            tipos.map((tipo) => (
                                <tr key={tipo.ID_TipoHabitacion}>
                                    <td>{tipo.ID_TipoHabitacion}</td>
                                    <td><strong>{tipo.Nombre}</strong></td>
                                    <td>${tipo.PrecioPorNoche}</td>
                                    <td>{getNombresServicios(tipo.ServiciosAsignados)}</td>
                                    <td className="text-center">
                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEdit(tipo)}>
                                            <PencilSquare />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleShowDelete(tipo)}>
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
            <Modal show={showFormModal} onHide={handleCloseForm} size="lg" dialogClassName="fade-in">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Editar Tipo de Habitación' : 'Nuevo Tipo de Habitación'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger" className="fade-in">{error}</Alert>}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Tipo</Form.Label>
                                    <Form.Control type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} required placeholder="Ej: Suite Presidencial" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio por Noche ($)</Form.Label>
                                    <Form.Control type="number" step="0.01" name="PrecioPorNoche" value={formData.PrecioPorNoche} onChange={handleChange} required placeholder="Ej: 15000.50" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>URL de Imagen (Opcional)</Form.Label>
                                    <Form.Control type="text" name="ImagenURL" value={formData.ImagenURL} onChange={handleChange} placeholder="https://..." />
                                </Form.Group>
                            <div 
                                    className="mt-3 text-center border rounded bg-light overflow-hidden d-flex align-items-center justify-content-center" 
                                    style={{ height: '180px' }}
                                >
                                    {formData.ImagenURL ? (
                                        <img 
                                            src={formData.ImagenURL} 
                                            alt="Vista previa" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            // Si la URL está rota o no es una imagen, mostramos un error genérico
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = 'https://via.placeholder.com/400x200?text=Imagen+No+Disponible';
                                            }}
                                        />
                                    ) : (
                                        <span className="text-muted">Vista previa de la imagen</span>
                                    )}
                                </div>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control as="textarea" rows={4} name="Descripcion" value={formData.Descripcion} onChange={handleChange} placeholder="Detalles de la habitación..." />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="d-block border-bottom pb-2">Servicios Incluidos</Form.Label>
                                    <div style={{ maxHeight: '150px', overflowY: 'auto' }} className="pe-2">
                                        {serviciosDisponibles.length === 0 ? (
                                            <small className="text-muted">No hay servicios en el catálogo.</small>
                                        ) : (
                                            serviciosDisponibles.map(servicio => (
                                                <Form.Check 
                                                    key={servicio.ID_Servicio}
                                                    type="checkbox"
                                                    id={`servicio-${servicio.ID_Servicio}`}
                                                    label={servicio.Nombre}
                                                    checked={formData.ServiciosAsignados.includes(servicio.ID_Servicio)}
                                                    onChange={() => handleCheckboxChange(servicio.ID_Servicio)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseForm}>Cancelar</Button>
                        <Button variant="primary" type="submit">{isEditing ? 'Guardar Cambios' : 'Guardar Tipo'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL PARA CONFIRMAR ELIMINACIÓN */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete} centered dialogClassName="fade-in">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-danger">Eliminar Tipo de Habitación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro que deseas eliminar el tipo <strong>{tipoToDelete?.Nombre}</strong>?</p>
                    <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={handleCloseDelete}>Cancelar</Button>
                    <Button variant="danger" onClick={executeDelete}>Sí, eliminar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrudTipos;
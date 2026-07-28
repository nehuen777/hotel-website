import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Row, Col, Modal, Form, Badge } from 'react-bootstrap';
import { PencilSquare, LockFill, UnlockFill } from 'react-bootstrap-icons';
import { fetchProtegido } from '../../utils/fetchProtegido';

const CrudOperadores = () => {
    const [operadores, setOperadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Estados del Modal de Formulario
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ 
        ID_Usuario: '', 
        Nombre: '', 
        Apellido: '', 
        Email: '', 
        Contrasena: '' 
    });

    // Estados del Modal de Suspensión (Soft Delete)
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [operadorToToggle, setOperadorToToggle] = useState(null);

    const cargarOperadores = async () => {
        try {
            setLoading(true);
            const data = await fetchProtegido('/api/usuarios/operadores');
            setOperadores(data);
        } catch (err) {
            setError('Error al cargar operadores: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarOperadores();
    }, []);

    // --- MANEJO DEL FORMULARIO ---
    const handleCloseForm = () => {
        setShowFormModal(false);
        setFormData({ ID_Usuario: '', Nombre: '', Apellido: '', Email: '', Contrasena: '' });
        setError(null);
    };

    const handleShowCreate = () => {
        setIsEditing(false);
        setFormData({ ID_Usuario: '', Nombre: '', Apellido: '', Email: '', Contrasena: '' });
        setShowFormModal(true);
    };

    const handleShowEdit = (operador) => {
        setIsEditing(true);
        setFormData({
            ID_Usuario: operador.ID_Usuario,
            Nombre: operador.Nombre || '',
            Apellido: operador.Apellido || '',
            Email: operador.Email,
            Contrasena: '' // Siempre vacío al editar por seguridad
        });
        setShowFormModal(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validación extra: contraseña obligatoria al crear
        if (!isEditing && !formData.Contrasena) {
            setError('La contraseña es obligatoria para registrar un nuevo operador.');
            return;
        }

        try {
            if (isEditing) {
                await fetchProtegido(`/api/usuarios/operadores/${formData.ID_Usuario}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                setSuccessMsg('Datos del operador actualizados.');
            } else {
                await fetchProtegido('/api/usuarios/operadores', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                setSuccessMsg('Operador registrado con éxito.');
            }
            
            handleCloseForm();
            cargarOperadores(); 
            setTimeout(() => setSuccessMsg(null), 3000); 
        } catch (err) {
            setError(err.message);
        }
    };

    // --- MANEJO DE ESTADO (SUSPENDER / ACTIVAR) ---
    const handleShowToggle = (operador) => {
        setOperadorToToggle(operador);
        setShowToggleModal(true);
    };

    const executeToggle = async () => {
        try {
            const nuevoEstado = !operadorToToggle.Activo;
            await fetchProtegido(`/api/usuarios/operadores/${operadorToToggle.ID_Usuario}/estado`, { 
                method: 'PATCH',
                body: JSON.stringify({ activo: nuevoEstado })
            });
            setSuccessMsg(nuevoEstado ? 'Operador reactivado.' : 'Acceso de operador suspendido.');
            cargarOperadores();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            setError(err.message); 
            setTimeout(() => setError(null), 6000);
        } finally {
            setShowToggleModal(false);
            setOperadorToToggle(null);
        }
    };

    return (
        <div className="fade-in container mt-4">
            <h2 className="mb-4 text-primary">Gestión de Operadores</h2>
            
            <div className="bg-white p-4 rounded shadow-sm border fade-in">
                <Row className="align-items-center mb-3">
                    <Col>
                        <h4>Nómina del Personal</h4>
                    </Col>
                    <Col className="text-end">
                        <Button variant="primary" onClick={handleShowCreate}>
                            + Nuevo Operador
                        </Button>
                    </Col>
                </Row>

                {successMsg && <Alert variant="success" className="fade-in">{successMsg}</Alert>}
                {error && !showFormModal && <Alert variant="danger" className="fade-in">{error}</Alert>}

                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">Cargando operadores...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive className="align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Email (Usuario)</th>
                                <th>Estado</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operadores.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">No hay operadores registrados.</td>
                                </tr>
                            ) : (
                                operadores.map((op) => (
                                    <tr key={op.ID_Usuario}>
                                        <td>{op.ID_Usuario}</td>
                                        <td><strong>{op.Nombre} {op.Apellido}</strong></td>
                                        <td>{op.Email}</td>
                                        <td>
                                            {op.Activo 
                                                ? <Badge bg="success">Activo</Badge> 
                                                : <Badge bg="secondary">Suspendido</Badge>}
                                        </td>
                                        <td className="text-center">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEdit(op)}>
                                                <PencilSquare />
                                            </Button>
                                            {/* Botón dinámico: Candado cerrado rojo si está activo, Candado abierto verde si está suspendido */}
                                            <Button 
                                                variant={op.Activo ? "outline-danger" : "outline-success"} 
                                                size="sm" 
                                                onClick={() => handleShowToggle(op)}
                                                title={op.Activo ? "Suspender acceso" : "Reactivar acceso"}
                                            >
                                                {op.Activo ? <LockFill /> : <UnlockFill />}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* MODAL PARA CREAR O EDITAR */}
            <Modal show={showFormModal} onHide={handleCloseForm} dialogClassName="fade-in">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Editar Operador' : 'Nuevo Operador'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger" className="fade-in">{error}</Alert>}
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Apellido</Form.Label>
                                    <Form.Control type="text" name="Apellido" value={formData.Apellido} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico (Usuario de acceso)</Form.Label>
                            <Form.Control type="email" name="Email" value={formData.Email} onChange={handleChange} required placeholder="ejemplo@hotel.com" />
                        </Form.Group>

                        <Form.Group className="mb-3 p-3 bg-light rounded border">
                            <Form.Label className="fw-bold text-dark">Contraseña</Form.Label>
                            <Form.Control 
                                type="password" 
                                name="Contrasena" 
                                value={formData.Contrasena} 
                                onChange={handleChange} 
                                placeholder={isEditing ? "••••••••" : "Escribe una contraseña segura"} 
                            />
                            {isEditing ? (
                                <Form.Text className="text-muted text-sm">
                                    * Déjalo en blanco si no deseas cambiar la contraseña actual.
                                </Form.Text>
                            ) : (
                                <Form.Text className="text-danger text-sm">
                                    * Obligatorio para nuevos operadores.
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseForm}>Cancelar</Button>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Guardar Cambios' : 'Registrar Operador'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* MODAL PARA CONFIRMAR SUSPENSIÓN / REACTIVACIÓN */}
            <Modal show={showToggleModal} onHide={() => setShowToggleModal(false)} centered dialogClassName="fade-in">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className={operadorToToggle?.Activo ? "text-danger" : "text-success"}>
                        {operadorToToggle?.Activo ? 'Suspender Operador' : 'Reactivar Operador'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        ¿Estás seguro que deseas {operadorToToggle?.Activo ? 'suspender' : 'reactivar'} el acceso de <strong>{operadorToToggle?.Nombre} {operadorToToggle?.Apellido}</strong> al sistema?
                    </p>
                    {operadorToToggle?.Activo && (
                        <p className="text-muted small mb-0">Esta acción cerrará sus sesiones y no podrá volver a ingresar hasta que lo reactives.</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={() => setShowToggleModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant={operadorToToggle?.Activo ? "danger" : "success"} onClick={executeToggle}>
                        Sí, {operadorToToggle?.Activo ? 'suspender' : 'reactivar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CrudOperadores;
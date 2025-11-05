import React, { useState, useEffect, useCallback } from 'react';
import { fetchProtegido } from '../../utils/fetchProtegido';
import { Form, Table, Badge, Button, Spinner, Alert, Card, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CheckCircle, XCircle, CashCoin } from 'react-bootstrap-icons';

const GestionReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ 
    estado: 'Todas',
    fechaInicio: null,
    fechaFin: null
  });

  const cargarReservas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('estado', filtros.estado);
      if (filtros.fechaInicio) {
        params.append('fechaInicio', filtros.fechaInicio.toISOString().split('T')[0]);
      }
      if (filtros.fechaFin) {
        params.append('fechaFin', filtros.fechaFin.toISOString().split('T')[0]);
      }
      
      const data = await fetchProtegido(`http://localhost:5000/api/operador/reservas?${params.toString()}`);
      setReservas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  const handleMarcarPagada = async (id) => {
    try {
      await fetchProtegido(`http://localhost:5000/api/operador/reservas/${id}/pago`, { method: 'PATCH' });
      cargarReservas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelar = async (id) => {
    try {
      await fetchProtegido(`http://localhost:5000/api/operador/reservas/${id}/cancelar`, { method: 'PATCH' });
      cargarReservas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setFiltros(prev => ({ ...prev, [name]: date }));
  };

  const formatFecha = (fechaISO) => {
    if (!fechaISO) return '';
    return new Date(fechaISO).toLocaleDateString('es-ES');
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Activa': return 'success';
      case 'Cancelada': return 'danger';
      case 'Completada': return 'secondary';
      default: return 'primary';
    }
  };

  const renderTablaReservas = () => {
    if (loading) {
      return <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>;
    }
    if (reservas.length === 0) {
      return <Alert variant="info">No se encontraron reservas con los filtros seleccionados.</Alert>;
    }
    return (
      <Table striped bordered hover responsive="sm" className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Habitación</th>
            <th>Estado</th>
            <th>Pagada</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.ID_Reserva}>
              <td>{r.ID_Reserva}</td>
              <td>{`${r.NombreCliente} ${r.ApellidoCliente}`}</td>
              <td>{formatFecha(r.FechaCheckIn)}</td>
              <td>{formatFecha(r.FechaCheckOut)}</td>
              <td>{r.NumeroHabitacion}</td>
              <td>
                <Badge pill bg={getEstadoBadge(r.NombreEstado)}>
                  {r.NombreEstado}
                </Badge>
              </td>
              <td>{r.Pagada ? <CheckCircle color="green" /> : <XCircle color="red" />}</td>
              <td className="text-center">
                {!r.Pagada && r.NombreEstado === 'Activa' && (
                  <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleMarcarPagada(r.ID_Reserva)}>
                    <CashCoin className="me-1" /> Marcar Pagada
                  </Button>
                )}
                {r.NombreEstado === 'Activa' && (
                  <Button variant="outline-danger" size="sm" onClick={() => handleCancelar(r.ID_Reserva)}>
                    <XCircle className="me-1" /> Cancelar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Gestión de Reservas</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filtros</Card.Title>
          <Form className="row g-3 align-items-end">
            <Col md={3}>
              <Form.Label>Estado:</Form.Label>
              <Form.Select name="estado" value={filtros.estado} onChange={handleFilterChange}>
                <option value="Todas">Todas</option>
                <option value="Activa">Activas</option>
                <option value="Completada">Completadas</option>
                <option value="Cancelada">Canceladas</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Check-Out Desde:</Form.Label>
              <DatePicker
                selected={filtros.fechaInicio}
                onChange={(date) => handleDateChange(date, 'fechaInicio')}
                selectsStart
                startDate={filtros.fechaInicio}
                endDate={filtros.fechaFin}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Desde"
              />
            </Col>
            <Col md={3}>
              <Form.Label>Check-Out Hasta:</Form.Label>
              <DatePicker
                selected={filtros.fechaFin}
                onChange={(date) => handleDateChange(date, 'fechaFin')}
                selectsEnd
                startDate={filtros.fechaInicio}
                endDate={filtros.fechaFin}
                minDate={filtros.fechaInicio}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Hasta"
              />
            </Col>
          </Form>
        </Card.Body>
      </Card>

      {renderTablaReservas()}
    </div>
  );
};

export default GestionReservas;

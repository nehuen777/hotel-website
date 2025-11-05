import React, { useState, useEffect, useCallback } from 'react';
import { fetchProtegido } from '../../utils/fetchProtegido';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GestionReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ 
    estado: 'Todas',
    fechaInicio: null,
    fechaFin: null
  });

  const cargarReservas = useCallback(async () => {
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

  return (
    <div className="container-fluid mt-4">
      <h2>Gestión de Reservas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Form className="row g-3 align-items-center mb-3">
        <div className="col-auto">
          <Form.Label>Estado:</Form.Label>
          <Form.Select name="estado" value={filtros.estado} onChange={handleFilterChange}>
            <option value="Todas">Todas</option>
            <option value="Activa">Activas</option>
            <option value="Completada">Completadas</option>
            <option value="Cancelada">Canceladas</option>
          </Form.Select>
        </div>
        <div className="col-auto">
          <Form.Label>Fecha Inicio Check-Out:</Form.Label>
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
        </div>
        <div className="col-auto">
          <Form.Label>Fecha Fin Check-Out:</Form.Label>
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
        </div>
      </Form>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Habitación</th>
              <th>Estado</th>
              <th>Pagada</th>
              <th>Acciones</th>
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
                <td><span className={`badge bg-${r.NombreEstado === 'Activa' ? 'success' : r.NombreEstado === 'Cancelada' ? 'danger' : 'secondary'}`}>{r.NombreEstado}</span></td>
                <td>{r.Pagada ? 'Sí' : 'No'}</td>
                <td>
                  {!r.Pagada && r.NombreEstado === 'Activa' && (
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleMarcarPagada(r.ID_Reserva)}>Marcar Pagada</button>
                  )}
                  {r.NombreEstado === 'Activa' && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleCancelar(r.ID_Reserva)}>Cancelar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionReservas;

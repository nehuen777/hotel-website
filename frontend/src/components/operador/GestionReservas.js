import React, { useState, useEffect } from 'react';
import { fetchProtegido } from '../../utils/fetchProtegido';

const GestionReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');

  const cargarReservas = async () => {
    try {
      const data = await fetchProtegido('http://localhost:5000/api/operador/reservas');
      setReservas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

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

  return (
    <div className="container-fluid mt-4">
      <h2>Gestión de Reservas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
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
                <td>{new Date(r.FechaCheckIn).toLocaleDateString()}</td>
                <td>{new Date(r.FechaCheckOut).toLocaleDateString()}</td>
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

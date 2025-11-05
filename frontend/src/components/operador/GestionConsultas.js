import React, { useState, useEffect } from 'react';
import { fetchProtegido } from '../../utils/fetchProtegido';

const GestionConsultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState('');
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [respuesta, setRespuesta] = useState('');

  const cargarConsultas = async () => {
    try {
      const data = await fetchProtegido('http://localhost:5000/api/consultas?respondida=0');
      setConsultas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  const handleSelectConsulta = (consulta) => {
    setSelectedConsulta(consulta);
    setRespuesta('');
  };

  const handleResponder = async (e) => {
    e.preventDefault();
    if (!selectedConsulta || !respuesta) return;

    try {
      await fetchProtegido(`http://localhost:5000/api/consultas/${selectedConsulta.ID_Consulta}/responder`, {
        method: 'POST',
        body: JSON.stringify({ textoRespuesta: respuesta }),
      });
      setSelectedConsulta(null);
      cargarConsultas(); // Recargar para quitar la consulta respondida
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Consultas</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-5">
          <h4>Consultas Pendientes</h4>
          <ul className="list-group">
            {consultas.map(c => (
              <li 
                key={c.ID_Consulta} 
                className={`list-group-item ${selectedConsulta && selectedConsulta.ID_Consulta === c.ID_Consulta ? 'active' : ''}`}
                onClick={() => handleSelectConsulta(c)}
              >
                <strong>{c.Asunto}</strong>
                <br />
                <small>{c.Email}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-7">
          {selectedConsulta ? (
            <div>
              <h4>Detalle de la Consulta</h4>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{selectedConsulta.Asunto}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">De: {selectedConsulta.Email}</h6>
                  <p className="card-text">{selectedConsulta.Mensaje}</p>
                  <hr />
                  <form onSubmit={handleResponder}>
                    <div className="mb-3">
                      <label htmlFor="respuesta" className="form-label">Escribir Respuesta</label>
                      <textarea 
                        className="form-control"
                        id="respuesta"
                        rows="5"
                        value={respuesta}
                        onChange={(e) => setRespuesta(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Enviar Respuesta</button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <p>Seleccione una consulta para ver el detalle y responder.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionConsultas;

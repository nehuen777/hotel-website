import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Form, Table, Badge } from 'react-bootstrap';
import { CurrencyDollar, EnvelopeExclamation, Receipt, ArrowRightCircleFill, ArrowLeftCircleFill, ExclamationOctagonFill } from 'react-bootstrap-icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { fetchProtegido } from '../../utils/fetchProtegido';

const COLORES_ESTADOS = {
    'Activa': '#198754', 
    'Cancelada': '#dc3545', 
    'Liberada': '#6c757d'
};

const DashboardAdmin = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroFecha, setFiltroFecha] = useState('esteMes');

    useEffect(() => {
        const cargarMetricas = async () => {
            setLoading(true);
            try {
                const hoy = new Date();
                let start = new Date();
                let end = new Date();

                if (filtroFecha === 'esteMes') {
                    start = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                } else if (filtroFecha === 'mesAnterior') {
                    start = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
                    end = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
                } else if (filtroFecha === 'ultimos7Dias') {
                    start.setDate(hoy.getDate() - 7);
                } else if (filtroFecha === 'todoElAnio') {
                    start = new Date(hoy.getFullYear(), 0, 1);
                }

                const startStr = start.toISOString().split('T')[0];
                const endStr = end.toISOString().split('T')[0];

                const data = await fetchProtegido(`/api/dashboard/metrics?startDate=${startStr}&endDate=${endStr}`);
                setMetrics(data);
            } catch (err) {
                setError('Error al cargar métricas: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        cargarMetricas();
    }, [filtroFecha]);

    if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;

    return (
        <div className="fade-in container-fluid py-4">
            <Row className="align-items-center mb-4">
                <Col md={8}>
                    <h2 className="text-primary fw-bold mb-0">Panel General</h2>
                </Col>
                <Col md={4} className="text-end">
                    <Form.Select 
                        value={filtroFecha} 
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="shadow-sm border-primary"
                    >
                        <option value="esteMes">Este Mes</option>
                        <option value="ultimos7Dias">Últimos 7 Días</option>
                        <option value="mesAnterior">Mes Anterior</option>
                        <option value="todoElAnio">Año Actual</option>
                    </Form.Select>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5 py-5"><Spinner animation="border" variant="primary" /></div>
            ) : (
                <>
                    {/* NIVEL 1: 4 KPIs */}
                    <Row className="g-3 mb-4">
                        <Col xl={3} md={6}>
                            <Card className="border-0 shadow-sm h-100 border-start border-success border-4">
                                <Card.Body className="d-flex align-items-center p-3">
                                    <div className="flex-grow-1">
                                        <span className="text-muted text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Ingresos Cobrados</span>
                                        <h4 className="mb-0 fw-bold text-success mt-1">${metrics?.kpis.ingresosTotales.toLocaleString()}</h4>
                                    </div>
                                    <div className="p-2 bg-success bg-opacity-10 rounded-circle text-success fs-4"><CurrencyDollar /></div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col xl={3} md={6}>
                            <Card className="border-0 shadow-sm h-100 border-start border-danger border-4">
                                <Card.Body className="d-flex align-items-center p-3">
                                    <div className="flex-grow-1">
                                        <span className="text-muted text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Pendiente de Cobro</span>
                                        <h4 className="mb-0 fw-bold text-danger mt-1">
                                            ${metrics?.kpis.montoPendiente.toLocaleString()}
                                        </h4>
                                        <small className="text-danger fw-bold">{metrics?.kpis.reservasPendientes} reservas</small>
                                    </div>
                                    <div className="p-2 bg-danger bg-opacity-10 rounded-circle text-danger fs-4"><ExclamationOctagonFill /></div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={3} md={6}>
                            <Card className="border-0 shadow-sm h-100 border-start border-info border-4">
                                <Card.Body className="d-flex align-items-center p-3">
                                    <div className="flex-grow-1">
                                        <span className="text-muted text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Ticket Promedio</span>
                                        <h4 className="mb-0 fw-bold text-info mt-1">${metrics?.kpis.ticketPromedio.toLocaleString(undefined, {maximumFractionDigits: 2})}</h4>
                                    </div>
                                    <div className="p-2 bg-info bg-opacity-10 rounded-circle text-info fs-4"><Receipt /></div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={3} md={6}>
                            <Card className="border-0 shadow-sm h-100 border-start border-warning border-4">
                                <Card.Body className="d-flex align-items-center p-3">
                                    <div className="flex-grow-1">
                                        <span className="text-muted text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Consultas Pendientes</span>
                                        <h4 className="mb-0 fw-bold text-warning mt-1">{metrics?.kpis.consultasPendientes}</h4>
                                    </div>
                                    <div className="p-2 bg-warning bg-opacity-10 rounded-circle text-warning fs-4"><EnvelopeExclamation /></div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* NIVEL 2: GRÁFICOS */}
                    <Row className="g-4 mb-4">
                        <Col lg={8}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-white py-3 border-0"><h5 className="mb-0 fw-bold text-dark">Demanda por Tipo de Habitación</h5></Card.Header>
                                <Card.Body style={{ height: '280px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={metrics?.graficoTipos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="TipoHabitacion" />
                                            <YAxis allowDecimals={false} />
                                            <RechartsTooltip />
                                            <Bar dataKey="CantidadReservas" name="Reservas" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-white py-3 border-0"><h5 className="mb-0 fw-bold text-dark">Estado de Reservas</h5></Card.Header>
                                <Card.Body style={{ height: '280px' }} className="d-flex justify-content-center align-items-center">
                                    {metrics?.graficoEstados.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={metrics.graficoEstados} dataKey="Cantidad" nameKey="NombreEstado" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                                                    {metrics.graficoEstados.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORES_ESTADOS[entry.NombreEstado] || '#000'} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                                <Legend verticalAlign="bottom" height={36}/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <span className="text-muted">No hay datos en este período</span>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* NIVEL 3: WIDGET DE RECEPCIÓN (FRONT-DESK) ACTUALIZADO */}
                    <Row>
                        <Col lg={12}>
                            <Card className="border-0 shadow-sm border-top border-primary border-3">
                                <Card.Header className="bg-white py-3 border-0"><h5 className="mb-0 fw-bold text-dark">Agenda de Recepción: Hoy</h5></Card.Header>
                                <Card.Body>
                                    <Table hover responsive className="align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Movimiento</th>
                                                <th>Huésped</th>
                                                <th>Nº Habitación</th>
                                                <th className="text-end">Estado de Cobro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metrics?.movimientosHoy.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center text-muted py-4">No hay check-ins ni check-outs programados para hoy.</td></tr>
                                            ) : (
                                                metrics?.movimientosHoy.map((mov, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {mov.Movimiento === 'Check-in' 
                                                                ? <Badge bg="success"><ArrowRightCircleFill className="me-1"/> Check-in</Badge>
                                                                : <Badge bg="danger"><ArrowLeftCircleFill className="me-1"/> Check-out</Badge>}
                                                        </td>
                                                        <td className="fw-bold">{mov.Huesped}</td>
                                                        <td>Hab. {mov.Habitacion}</td>
                                                        <td className="text-end">
                                                            {mov.Pagada ? (
                                                                <Badge bg="success" className="px-3 py-2">PAGADO</Badge>
                                                            ) : (
                                                                <Badge bg="danger" className="px-3 py-2 fw-bold text-uppercase pulse-animation">Falta Pagar</Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default DashboardAdmin;
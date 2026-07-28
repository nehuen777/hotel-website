import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Form, Table, Badge, ProgressBar } from 'react-bootstrap';
import { CurrencyDollar, Receipt, ExclamationOctagonFill, XCircleFill } from 'react-bootstrap-icons';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
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

    // Cálculo del ingreso total para sacar los porcentajes de participación en la tabla
    const totalIngresosTabla = metrics?.tablaRentabilidad.reduce((acc, item) => acc + item.IngresoGenerado, 0) || 1;

    return (
        <div className="fade-in container-fluid py-4">
            <Row className="align-items-center mb-4">
                <Col md={8}>
                    <h2 className="text-primary fw-bold mb-0">Rendimiento Gerencial</h2>
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
                    {/* NIVEL 1: 4 KPIs FINANCIEROS Y DE RIESGO */}
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
                            <Card className="border-0 shadow-sm h-100 border-start border-warning border-4">
                                <Card.Body className="d-flex align-items-center p-3">
                                    <div className="flex-grow-1">
                                        <span className="text-muted text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Pendiente de Cobro</span>
                                        <h4 className="mb-0 fw-bold text-warning mt-1">
                                            ${metrics?.kpis.montoPendiente.toLocaleString()}
                                        </h4>
                                        <small className="text-warning fw-bold">{metrics?.kpis.reservasPendientes} reservas</small>
                                    </div>
                                    <div className="p-2 bg-warning bg-opacity-10 rounded-circle text-warning fs-4"><ExclamationOctagonFill /></div>
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
                            <Card className="border-0 shadow-sm h-100 border-start border-danger border-4">
                                <Card.Body className="d-flex align-items-center p-3">
                                    <div className="flex-grow-1">
                                        <span className="text-muted text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Tasa de Cancelación</span>
                                        <h4 className="mb-0 fw-bold text-danger mt-1">{metrics?.kpis.tasaCancelacion}%</h4>
                                    </div>
                                    <div className="p-2 bg-danger bg-opacity-10 rounded-circle text-danger fs-4"><XCircleFill /></div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* NIVEL 2: GRÁFICOS (Evolución temporal + Distribución) */}
                    <Row className="g-4 mb-4">
                        <Col lg={8}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-white py-3 border-0"><h5 className="mb-0 fw-bold text-dark">Evolución de Ingresos (Reservas Creadas)</h5></Card.Header>
                                <Card.Body style={{ height: '280px' }}>
                                    {metrics?.curvaIngresos.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={metrics.curvaIngresos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="Fecha" tick={{fontSize: 12}} />
                                                <YAxis tickFormatter={(val) => `$${val}`} width={80} />
                                                <RechartsTooltip formatter={(value) => [`$${value}`, 'Ingreso Diario']} />
                                                <Line type="monotone" dataKey="IngresoDiario" stroke="#0d6efd" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="d-flex h-100 justify-content-center align-items-center text-muted">No hay datos financieros en este período.</div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Header className="bg-white py-3 border-0"><h5 className="mb-0 fw-bold text-dark">Estado General</h5></Card.Header>
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
                                        <span className="text-muted">Sin datos</span>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* NIVEL 3: TABLA DE ESTRUCTURA Y RENTABILIDAD POR CATEGORÍA */}
                    <Row>
                        <Col lg={12}>
                            <Card className="border-0 shadow-sm border-top border-primary border-3">
                                <Card.Header className="bg-white py-3 border-0"><h5 className="mb-0 fw-bold text-dark">Desglose Financiero por Tipo de Habitación</h5></Card.Header>
                                <Card.Body>
                                    <Table hover responsive className="align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Categoría</th>
                                                <th className="text-center">Noches Vendidas</th>
                                                <th className="text-end">Ingreso Generado</th>
                                                <th className="text-center" style={{width: '25%'}}>Participación en Ventas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {metrics?.tablaRentabilidad.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center text-muted py-4">No hay ventas registradas en este período.</td></tr>
                                            ) : (
                                                metrics?.tablaRentabilidad.map((item, index) => {
                                                    const porcentaje = ((item.IngresoGenerado / totalIngresosTabla) * 100).toFixed(1);
                                                    return (
                                                        <tr key={index}>
                                                            <td className="fw-bold text-dark">{item.Categoria}</td>
                                                            <td className="text-center"><Badge bg="secondary" className="px-3 py-2">{item.NochesVendidas}</Badge></td>
                                                            <td className="text-end fw-bold text-success">${item.IngresoGenerado.toLocaleString()}</td>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <span className="me-2 text-muted" style={{minWidth: '40px'}}>{porcentaje}%</span>
                                                                    <ProgressBar now={porcentaje} variant="primary" className="flex-grow-1" style={{height: '8px'}} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
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
import React, { useState } from 'react';
import { Tabs, Tab, Table, Button, Container, Row, Col } from 'react-bootstrap';
import CrudServicios from './CrudServicios';

const HabitacionesAdmin = () => {
    const [key, setKey] = useState('habitaciones');

    return (
        <Container className="mt-4 fade-in">
            <h2 className="mb-4 text-primary">Administración de Habitaciones</h2>
            
            <div className="bg-white p-4 rounded shadow-sm border">
                <Tabs
                    id="admin-habitaciones-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-4"
                >
                    
                    {/* --- PESTAÑA 1: Habitaciones Físicas --- */}
                    <Tab eventKey="habitaciones" title="1. Habitaciones Físicas">
                        <div className="fade-in">
                            <p>En construcción...</p>
                        </div>
                    </Tab>

                    {/* --- PESTAÑA 2: Tipos y Servicios --- */}
                    <Tab eventKey="tipos" title="2. Tipos y Servicios">
                         <div className="fade-in">
                           <p>En construcción...</p>
                        </div>
                    </Tab>

                    {/* --- PESTAÑA 3: Catálogo de Servicios --- */}
                    <Tab eventKey="servicios" title="3. Catálogo de Servicios">
                        {/* Aquí insertamos el componente externo */}
                        <CrudServicios />
                    </Tab>

                </Tabs>
            </div>
        </Container>
    );
};

export default HabitacionesAdmin;
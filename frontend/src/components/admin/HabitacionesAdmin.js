import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import CrudTipos from './CrudTipos';
import CrudServicios from './CrudServicios';
import CrudHabitaciones from './CrudHabitaciones.js';

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
                    
                    {/* Añadimos unmountOnExit a cada Tab */}
                    <Tab eventKey="habitaciones" title="1. Habitaciones Físicas" unmountOnExit>
                        <CrudHabitaciones />
                    </Tab>

                    <Tab eventKey="tipos" title="2. Tipos y Servicios" unmountOnExit>
                         <CrudTipos />
                    </Tab>

                    <Tab eventKey="servicios" title="3. Catálogo de Servicios" unmountOnExit>
                        <CrudServicios />
                    </Tab>

                </Tabs>
            </div>
        </Container>
    );
};

export default HabitacionesAdmin;
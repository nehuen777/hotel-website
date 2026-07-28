import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  House, 
  DoorOpen, 
  ChatDots, 
  BoxArrowRight, 
  PersonCircle, 
  Grid3x3Gap, 
  CalendarCheck, 
  ChatDots as ChatDotsFill,
  People,
  GraphUp,
  Tools
} from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navigation() {
  // CAMBIO: Ahora también extraemos 'esAdmin' del contexto
  const { isAuthenticated, esAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" variant="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <Building className="me-2" />
          Hotel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            {/* 1. VISTA CUANDO EL USUARIO NO ESTÁ LOGUEADO */}
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/" className="d-flex align-items-center">
                  <House className="me-1" /> Inicio
                </Nav.Link>
                <Nav.Link as={Link} to="/habitaciones" className="d-flex align-items-center">
                  <DoorOpen className="me-1" /> Habitaciones
                </Nav.Link>
                <Nav.Link as={Link} to="/consultas" className="d-flex align-items-center">
                  <ChatDots className="me-1" /> Consultas
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                  <PersonCircle className="me-1" /> Login
                </Nav.Link>
              </>
            )}

            {/* 2. VISTA CUANDO EL USUARIO ESTÁ LOGUEADO Y ES OPERADOR */}
            {isAuthenticated && !esAdmin && (
              <>
                <Nav.Link as={Link} to="/operador/mapa" className="d-flex align-items-center">
                  <Grid3x3Gap className="me-2" /> Mapa de Habitaciones
                </Nav.Link>
                <Nav.Link as={Link} to="/operador/reservas" className="d-flex align-items-center">
                  <CalendarCheck className="me-2" /> Gestionar Reservas
                </Nav.Link>
                <Nav.Link as={Link} to="/operador/consultas" className="d-flex align-items-center">
                  <ChatDotsFill className="me-2" /> Gestionar Consultas
                </Nav.Link>
              </>
            )}

            {/* 3. VISTA CUANDO EL USUARIO ESTÁ LOGUEADO Y ES ADMINISTRADOR */}
            {isAuthenticated && esAdmin && (
              <>
                <Nav.Link as={Link} to="/admin/habitaciones" className="d-flex align-items-center">
                  <Tools className="me-2" /> CRUD Habitaciones
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/operadores" className="d-flex align-items-center">
                  <People className="me-2" /> CRUD Operadores
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/dashboard" className="d-flex align-items-center">
                  <GraphUp className="me-2" /> Dashboard
                </Nav.Link>
              </>
            )}

            {/* BOTÓN DE CERRAR SESIÓN (VISIBLE PARA CUALQUIER LOGUEADO) */}
            {isAuthenticated && (
              <Button variant="outline-danger" onClick={handleLogout} className="ms-3 d-flex align-items-center">
                <BoxArrowRight className="me-1" /> Salir
              </Button>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Building, House, DoorOpen, ChatDots, Map, CardList, ChatLeftDots, BoxArrowRight } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
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
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/operador/mapa" className="d-flex align-items-center">
                  <Map className="me-1" /> Mapa de Habitaciones
                </Nav.Link>
                <Nav.Link as={Link} to="/operador/reservas" className="d-flex align-items-center">
                  <CardList className="me-1" /> Gestionar Reservas
                </Nav.Link>
                <Nav.Link as={Link} to="/operador/consultas" className="d-flex align-items-center">
                  <ChatLeftDots className="me-1" /> Gestionar Consultas
                </Nav.Link>
                <Button variant="outline-secondary" onClick={handleLogout} className="ms-2 d-flex align-items-center">
                  <BoxArrowRight className="me-1" /> Cerrar Sesión
                </Button>
              </>
            ) : (
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
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;

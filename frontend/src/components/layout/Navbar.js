import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Building, House, DoorOpen, ChatDots } from 'react-bootstrap-icons';

import './Navbar.css';

function Navigation() {
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
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <House className="me-1" /> Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/habitaciones" className="d-flex align-items-center">
              <DoorOpen className="me-1" /> Habitaciones
            </Nav.Link>
            <Nav.Link as={Link} to="/consultas" className="d-flex align-items-center">
              <ChatDots className="me-1" /> Consultas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
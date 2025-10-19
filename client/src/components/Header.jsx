// This file is: client/src/components/Header.jsx
import { FiLogOut } from "react-icons/fi";
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('healthmate-token');
    // Navigate back to the login page
    navigate('/login');
  };

  return (
    <Navbar bg="white" variant="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        {/* Brand link points to the dashboard */}
        <Navbar.Brand as={Link} to="/dashboard">
          HealthMate
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/timeline">Full Timeline</Nav.Link>
            </Nav>
            {/* We will add links here later (e.g., Upload, Add Vitals) */}

          {/* This pushes the button to the right */}
          <Nav>
            <Button variant="outline-danger" onClick={handleLogout}> {/* Changed variant to danger */}
  <FiLogOut className="me-2" /> Log Out {/* Added icon */}
</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
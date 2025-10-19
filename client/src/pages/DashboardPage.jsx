// This file is: client/src/pages/DashboardPage.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/header.jsx'; // Using lowercase 'h'
import AddVitalsForm from '../components/AddVitalsForm.jsx';
import UploadReport from '../components/UploadReport.jsx'; // <-- 1. IMPORT

export default function DashboardPage() {
  return (
    <>
      <Header />

      <Container>
        <h1 className="mt-4">HealthMate Dashboard</h1>
        <p className="mb-4">You are successfully logged in!</p>

        <Row>
          <Col lg={6}>
            <AddVitalsForm /> 
          </Col>

          <Col lg={6}>
            <UploadReport /> {/* <-- 2. ADD COMPONENT HERE */}
          </Col>
        </Row>
      </Container>
    </>
  );
}
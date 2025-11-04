// This file is: client/src/components/AddVitalsForm.jsx

import React, { useState } from 'react';
import { Form, Button, Card, Col, Row, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function AddVitalsForm() {
  // State for the form data
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    bloodSugar: '',
    weight: '',
    notes: '',
  });
  // State for loading/error/success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setVitals((prevVitals) => ({
      ...prevVitals,
      [id]: value,
    }));
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // 1. Get the token from localStorage
      const token = localStorage.getItem('healthmate-token');
      if (!token) {
        setError('You must be logged in to add vitals.');
        setLoading(false);
        return;
      }

      // 2. Create the 'config' object to send the token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // This is how our middleware reads the token
        },
      };

      // 3. Send the data to the backend
     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/vitals`, vitals, config);

      // 4. Handle success
      setSuccess('Vitals added successfully!');
      console.log('Vitals saved:', res.data);
      // Clear the form
      setVitals({
        bloodPressure: '',
        bloodSugar: '',
        weight: '',
        notes: '',
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Failed to add vitals. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <h3 className="mb-3">Add Manual Vitals</h3>

        {/* Show success or error messages */}
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group id="bloodPressure" className="mb-3">
                <Form.Label>Blood Pressure (e.g., 120/80)</Form.Label>
                <Form.Control
                  type="text"
                  id="bloodPressure"
                  value={vitals.bloodPressure}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group id="bloodSugar" className="mb-3">
                <Form.Label>Blood Sugar (e.g., 95)</Form.Label>
                <Form.Control
                  type="number"
                  id="bloodSugar"
                  value={vitals.bloodSugar}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group id="weight" className="mb-3">
                <Form.Label>Weight (e.g., 70)</Form.Label>
                <Form.Control
                  type="number"
                  id="weight"
                  value={vitals.weight}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group id="notes" className="mb-3">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              id="notes"
              value={vitals.notes}
              onChange={handleChange}
            />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            {loading ? 'Saving...' : 'Save Vitals'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
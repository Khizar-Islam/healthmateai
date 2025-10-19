// This file is: client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send the login data to the backend API
      const res = await axios.post(
        'http://localhost:5001/api/auth/login', // The login endpoint
        formData // The data (email, password)
      );

      // If login is successful, the server sends back a token
      const { token } = res.data;

      // --- THIS IS THE KEY ---
      // Store the token in localStorage
      // This is how our app "remembers" the user is logged in
      localStorage.setItem('healthmate-token', token);

      // Send the user to the dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        // Show the error from the server (e.g., "Invalid credentials")
        setError(err.response.data.msg);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">HealthMate - Log In</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group id="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button disabled={loading} className="w-100 mt-4" type="submit">
                {loading ? 'Logging In...' : 'Log In'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </Container>
  );
}
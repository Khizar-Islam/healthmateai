// This file is: client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // <-- Import useNavigate
import axios from 'axios'; // <-- Import axios

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <-- Initialize navigate

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send the formData to the backend API
      const res = await axios.post(
        'http://localhost:5001/api/auth/register', // Our backend URL
        formData // The data we're sending (username, email, password)
      );

      // If registration is successful:
      console.log('User registered:', res.data); // Log the response (includes the token)
      
      // Send the user to the login page
      navigate('/login');

    } catch (err) {
      // If there's an error
      console.error(err);
      
      // Set the error state to the message from the server (e.g., "User already exists")
      // The 'err.response.data.msg' is the JSON error message we set up in our server
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      // This runs whether it succeeded or failed
      setLoading(false);
    }
  };
  // --- END OF UPDATED FUNCTION ---

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">HealthMate - Sign Up</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group id="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

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
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </Container>
  );
}
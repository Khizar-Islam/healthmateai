// This file is: client/src/pages/TimelinePage.jsx
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import Header from '../components/header.jsx'; // Using lowercase 'h'
import axios from 'axios';

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const token = localStorage.getItem('healthmate-token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get('http://localhost:5001/api/timeline', config);
        setTimeline(res.data);
      } catch (err) {
        setError('Failed to load timeline. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // Helper to format the date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Component to render a Vitals card
  const VitalsCard = ({ item }) => (
    <ListGroup.Item className="mb-3">
      <Card>
        <Card.Header as="h5">
          Manual Vitals Entry
          <span className="float-end fs-6 fw-normal">{formatDate(item.createdAt)}</span>
        </Card.Header>
        <Card.Body>
          {item.bloodPressure && <Card.Text><strong>Blood Pressure:</strong> {item.bloodPressure}</Card.Text>}
          {item.bloodSugar && <Card.Text><strong>Blood Sugar:</strong> {item.bloodSugar} mg/dL</Card.Text>}
          {item.weight && <Card.Text><strong>Weight:</strong> {item.weight} kg</Card.Text>}
          {item.notes && <Card.Text><strong>Notes:</strong> {item.notes}</Card.Text>}
        </Card.Body>
      </Card>
    </ListGroup.Item>
  );

  // Component to render a File card
  const FileCard = ({ item }) => (
    <ListGroup.Item className="mb-3">
      <Card>
        <Card.Header as="h5">
          Medical Report Uploaded
          <span className="float-end fs-6 fw-normal">{formatDate(item.createdAt)}</span>
        </Card.Header>
        <Card.Body>
          <Card.Title>{item.originalFilename}</Card.Title>
          <Card.Text>
            This file is securely stored.
          </Card.Text>
          {/* This link will view the file in a new tab */}
          <Button as={Link} to={`/view-report/${item._id}`} variant="primary">
  View Details
</Button>
          {/* In the next step, we could make this link to our /view-report page */}
        </Card.Body>
      </Card>
    </ListGroup.Item>
  );

  return (
    <>
      <Header />
      <Container>
        <h1 className="my-4">Your Medical Timeline</h1>
        {loading && <Spinner animation="border" className="d-block mx-auto" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && timeline.length === 0 && (
          <Alert variant="info">Your timeline is empty. Add vitals or upload a report to get started.</Alert>
        )}

        <ListGroup variant="flush">
          {timeline.map((item) => 
            item.type === 'vitals' 
              ? <VitalsCard key={item._id} item={item} /> 
              : <FileCard key={item._id} item={item} />
          )}
        </ListGroup>
      </Container>
    </>
  );
}
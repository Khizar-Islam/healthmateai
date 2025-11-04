// This file is: client/src/pages/ViewReportPage.jsx

// This file is: client/src/pages/ViewReportPage.jsx
// This version removes the broken preview and just adds a Download button.

import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header.jsx'; // Using lowercase 'h'

export default function ViewReportPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { fileId } = useParams();

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const token = localStorage.getItem('healthmate-token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        
        const res = await axios.get(`http://localhost:5001/api/files/${fileId}`, config);
        setFile(res.data);
      } catch (err) {
        setError('Failed to load file. It may not exist or you may not have permission.');
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
  };

  return (
    <>
      <Header />
      <Container className="my-4">
        {loading && <Spinner animation="border" className="d-block mx-auto" />}
        {error && <Alert variant="danger">{error}</Alert>}
        
        {file && (
          <>
            <Button as={Link} to="/timeline" variant="secondary" className="mb-3">
              &larr; Back to Timeline
            </Button>
            
            <Card className="mb-4">
              <Card.Header as="h3">{file.originalFilename}</Card.Header>
              <Card.Body>
                <Card.Text>
                  <strong>Uploaded On:</strong> {formatDate(file.createdAt)}
                </Card.Text>
                <Card.Text className="mb-3">
                  <strong>File Type:</strong> {file.fileType}
                </Card.Text>
                
                {/* --- THIS IS THE NEW BUTTON --- */}
                <Button 
                  href={file.cloudinaryUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download // This suggests the browser should download it
                >
                  Download File
                </Button>
              </Card.Body>
            </Card>
            
            <Card className="mt-4">
              <Card.Header as="h4">AI Analysis</Card.Header>
              <Card.Body>
                <Alert variant="warning">
                  AI analysis is currently unavailable.
                </Alert>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}
// This file is: client/src/components/UploadReport.jsx

import React, { useState } from 'react';
import { Form, Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import axios from 'axios';

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // <-- NEW STATE

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // --- UPDATED SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setError('');
    setSuccess('');
    setIsAnalyzing(false);
    setUploadPercent(0);

    const formData = new FormData();
    formData.append('reportFile', file);

    try {
      const token = localStorage.getItem('healthmate-token');
      if (!token) {
        setError('You must be logged in.');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadPercent(percent);
        },
      };

      // --- STEP 1: UPLOAD THE FILE ---
     const uploadRes = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/files/upload`,
  formData,
  config
);

      setSuccess('Upload complete! Starting AI analysis...');
      setIsAnalyzing(true); // <-- Show analyzing message

      // --- STEP 2: TRIGGER AI ANALYSIS ---
      // Get the new file's ID from the upload response
      const newFileId = uploadRes.data.file._id;

      // Must re-use the token for the next API call
      const authConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };

      // Call our new AI endpoint
      const aiRes = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/ai/analyze/${newFileId}`,
  null, // No POST body needed
  authConfig
);

      // --- STEP 3: ALL DONE ---
      setSuccess('File uploaded and analyzed successfully!');
      console.log('AI Analysis:', aiRes.data);

      setFile(null);
      e.target.reset();

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || 'An error occurred.';
      setError(msg);
    } finally {
      setUploadPercent(0);
      setIsAnalyzing(false); // <-- Hide analyzing message
    }
  };
  // --- END OF UPDATED FUNCTION ---

  return (
    <Card className="mt-4">
      <Card.Body>
        <h3 className="mb-3">Upload Medical Report</h3>
        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select PDF or Image</Form.Label>
            <Form.Control 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.png,.jpg,.jpeg"
            />
          </Form.Group>

          {uploadPercent > 0 && (
            <ProgressBar 
              now={uploadPercent} 
              label={`${uploadPercent}%`} 
              className="mb-3" 
              animated 
            />
          )}

          <Button 
            className="w-100" 
            type="submit" 
            disabled={!file || uploadPercent > 0 || isAnalyzing}
          >
            {/* Show different button text based on state */}
            {uploadPercent > 0 && 'Uploading...'}
            {isAnalyzing && 'Analyzing...'}
            {!uploadPercent && !isAnalyzing && 'Upload and Analyze'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
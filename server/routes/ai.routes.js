// This file is: server/routes/ai.routes.js

import express from 'express';
// ADD THIS
import { GoogleGenAI } from "@google/genai"; // <-- This is the new library
// ... all your other imports

// Initialize Google Gemini
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
// DELETE THE "const model = ..." LINE. IT IS WRONG.

import authMiddleware from '../middleware/auth.middleware.js';
import File from '../models/File.model.js';
import AiInsight from '../models/AiInsight.model.js';
import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
 



const router = express.Router();

// Initialize Hugging Face


// This is the prompt template for the new AI
// --- HELPER 2: Get AI Prompt ---
const getPrompt = (reportText) => {
  // This is the single, combined prompt
  return `You are HealthMate, an AI assistant. You are analyzing the following medical report text:
  ---
  ${reportText}
  ---
  Provide a clear, kind, and simple analysis. Your response MUST be in this exact JSON format, with no other text before or after the JSON:
  {
    "summary": "A simple one-paragraph summary of the report.",
    "romanUrduSummary": "The same summary, but in Roman Urdu.",
    "abnormalValues": ["List any abnormal values (e.g., 'WBC high: 11.5', 'Hb low: 9.2')"],
    "doctorQuestions": ["Suggest 3-5 simple questions the user can ask their doctor."],
    "foodSuggestions": "Suggest foods to eat or avoid.",
    "remedySuggestions": "Suggest 1-2 simple home remedies, if applicable."
  }`;
};

// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
// USES 'pdf-to-text' LIBRARY
// --- HELPER 1: Get Text from PDF Buffer ---
// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
// Helper function to get text from a PDF URL
const getTextFromPdf = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    // This will now work
    const data = await pdf(response.data); 
    return data.text;
  } catch (error) {
    console.error("Error reading PDF:", error.message);
    throw new Error("Could not read text from PDF.");
  }
};
// @route   POST /api/ai/analyze/:fileId
// @desc    Analyze an uploaded file using Hugging Face
// @access  Private
router.post('/analyze/:fileId', authMiddleware, async (req, res) => {
  try {
    // 1. Find the file in our DB
    const file = await File.findById(req.params.fileId);
    if (!file || file.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'File not found or unauthorized' });
    }

    // 2. Check if analysis already exists
    let insight = await AiInsight.findOne({ file: file._id });
    if (insight) {
      return res.status(200).json(insight); // Return existing insight
    }

    // 3. Get text from the file
    // For now, we ONLY support PDF. This is a hackathon limitation.
    let reportText = '';
    if (file.fileType === 'application/pdf') {
      reportText = await getTextFromPdf(file.cloudinaryUrl);
    } else {
      // We can't read images without a more complex (and slow) AI
      return res.status(400).json({ msg: 'AI analysis currently supports PDF files only.' });
    }

    if (reportText.length < 20) {
       return res.status(400).json({ msg: 'Could not find enough text in the PDF to analyze.' });
    }

    // 4. Call Hugging Face API
    // We limit the text to 3000 chars to stay within free limits
   // IT SHOULD LOOK LIKE THIS WHEN YOU ARE DONE
// 4. Call Google Gemini API
// 4. Call Google Gemini API
console.log("Text found. Sending to AI...");
const prompt = getPrompt(reportText.substring(0, 3000));

// This is the new, correct way to call the API
const result = await genAI.models.generateContent({
  model: "models/gemini-2.5-flash", // <-- This is the correct, free model
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  }
});

// 5. Clean and parse the JSON response
// 5. Clean and parse the JSON response
    let aiData; // <-- YOU ARE RIGHT, THIS LINE IS NEEDED HERE
    try {
      // THIS IS THE FIX: Get the response object
      const response = result.response;

      // Get the text from the correct location
      const jsonText = response.candidates[0].content.parts[0].text;

      aiData = JSON.parse(jsonText);
      console.log("AI analysis successful.");
    } catch (parseError) {
      console.error('Gemini JSON parse error:', parseError, 'Raw text:', result.response);
      return res.status(500).json({ msg: 'Error reading AI response. The AI returned invalid format.' });
    }

// 6. Save the new insight to our database
insight = new AiInsight({
// ... (the rest of the function stays the same) ...
      user: req.user.id,
      file: file._id,
      summary: aiData.summary,
      romanUrduSummary: aiData.romanUrduSummary,
      abnormalValues: aiData.abnormalValues,
      doctorQuestions: aiData.doctorQuestions,
      foodSuggestions: aiData.foodSuggestions,
      remedySuggestions: aiData.remedySuggestions,
    });

    await insight.save();

    // 7. Send the new insight back to the user
    res.status(201).json(insight);

  } catch (err) {
    console.error(err.message);
    // Check if it's a "model is loading" error from HF
    if (err.message.includes('503') && err.message.includes('model is loading')) {
      return res.status(503).json({ msg: 'AI model is warming up. Please try again in 1-2 minutes.' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;
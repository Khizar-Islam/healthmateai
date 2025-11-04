// This file is: server/routes/file.routes.js
// This is the new "Smart" version

import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import multerUpload from '../middleware/multer.middleware.js';
import cloudinary from '../config/cloudinary.config.js';
import File from '../models/File.model.js';
import AiInsight from '../models/AiInsight.model.js';
import streamifier from 'streamifier';
// ADD THIS
import { GoogleGenAI } from "@google/genai"; // <-- This is the new library
// ... all your other imports

// Initialize Google Gemini
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
// DELETE THE "const model = ..." LINE. IT IS WRONG.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');




const router = express.Router();

// Initialize Hugging Face


// --- HELPER 1: Get Text from PDF Buffer ---
// --- HELPER 1: Get Text from PDF Buffer ---
// --- HELPER 1: Get Text from PDF Buffer ---
// --- HELPER 1: Get Text from PDF Buffer ---
// --- HELPER 1: Get Text from PDF Buffer ---
// --- HELPER 1: Get Text from PDF Buffer ---
// USES 'pdf-to-text' LIBRARY
// --- HELPER 1: Get Text from PDF Buffer ---
// --- HELPER 1: Get Text from PDF Buffer ---
// --- HELPER 1: Get Text from PDF Buffer ---
const getTextFromPdfBuffer = async (buffer) => {
  try {
    // This will now work because we are using the correct import
    const data = await pdf(buffer); 
    return data.text;
  } catch (error) {
    console.error("Error reading PDF buffer:", error.message);
    throw new Error("Could not read text from PDF buffer.");
  }
};

// --- HELPER 2: Get AI Prompt ---
// --- HELPER 2: Get AI Prompt ---
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
// --- THE NEW UPLOAD ROUTE ---
// @route   POST /api/files/upload
// @desc    Upload a file, analyze it, and save all data
// @access  Private
router.post(
  '/upload',
  authMiddleware, // 1. Check if user is logged in
  multerUpload.single('reportFile'), // 2. Use Multer to get the file
  async (req, res) => {
     
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }

    let aiData = null; // We'll store the AI response here
    let isPDF = req.file.mimetype === 'application/pdf';

    try {
      // --- AI ANALYSIS STEP (ONLY FOR PDFs) ---
      if (isPDF) {
        console.log("File is a PDF. Reading text...");
        // 3. Read text from the file buffer
        const reportText = await getTextFromPdfBuffer(req.file.buffer);

      // IT SHOULD LOOK LIKE THIS WHEN YOU ARE DONE
if (reportText.length > 20) {

    // --- PASTE THE NEW GEMINI CODE HERE ---
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
    try {
      // THIS IS THE FIX: Get the response object
      const response = result.response;
      
      // Get the text from the correct location
      const jsonText = response.candidates[0].content.parts[0].text; 
      
      aiData = JSON.parse(jsonText);
      console.log("AI analysis successful.");
    } catch (parseError) {
      console.error('Gemini JSON parse error:', parseError, 'Raw text:', result.response);
      aiData = null;
    }
    // --- END OF THE NEW GEMINI CODE ---

} else {
    console.log("Not enough text in PDF to analyze.");
}
      } else {
        console.log("File is not a PDF, skipping AI analysis.");
      }

      // --- CLOUDINARY UPLOAD STEP (ALWAYS RUNS) ---
      console.log("Uploading file to Cloudinary...");
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            upload_preset: 'healthmate_preset', // Our public preset
            folder: `healthmate/${req.user.id}`,
            resource_type: isPDF ? 'image' : 'auto', // Force PDF to be 'image' to fix preview
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      const cloudinaryResult = await uploadPromise;
      console.log("File uploaded to Cloudinary.");

      // --- SAVE TO DATABASE STEP ---
      // 7. Save the File record
      const newFile = new File({
        user: req.user.id,
        cloudinaryUrl: cloudinaryResult.secure_url,
        cloudinaryPublicId: cloudinaryResult.public_id,
        originalFilename: req.file.originalname,
        fileType: req.file.mimetype,
      });
      await newFile.save();

      // 8. If AI was successful, save the Insight record
      if (aiData) {
        const insight = new AiInsight({
          user: req.user.id,
          file: newFile._id, // Link to the file we just saved
          summary: aiData.summary,
          romanUrduSummary: aiData.romanUrduSummary,
          abnormalValues: aiData.abnormalValues,
          doctorQuestions: aiData.doctorQuestions,
          foodSuggestions: aiData.foodSuggestions,
          remedySuggestions: aiData.remedySuggestions,
        });
        await insight.save();
      }

      // 9. Send success response
      res.status(201).json({
        msg: 'File uploaded successfully!',
        file: newFile,
      });

    } catch (err) {
      console.error("Full upload process error:", err.message);
      if (err.message.includes('503') && err.message.includes('model is loading')) {
        return res.status(503).json({ msg: 'AI model is warming up. Please try again in 1-2 minutes.' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// --- We still need the "Get Single File" route for the preview page ---
// @route   GET /api/files/:fileId
// @desc    Get a single file's details
// @access  Private
router.get('/:fileId', authMiddleware, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res.status(4.04).json({ msg: 'File not found' });
    }
    if (file.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
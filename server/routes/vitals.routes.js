// This file is: server/routes/vitals.routes.js

import express from 'express';
import Vitals from '../models/Vitals.model.js';
import authMiddleware from '../middleware/auth.middleware.js'; // Import our middleware

const router = express.Router();

// @route   POST /api/vitals
// @desc    Add a new manual vitals entry
// @access  Private (we use our authMiddleware)
router.post('/', authMiddleware, async (req, res) => {
  // Get the data from the request body
  const { bloodPressure, bloodSugar, weight, notes } = req.body;

  try {
    // Create a new Vitals document
    const newVitals = new Vitals({
      bloodPressure,
      bloodSugar,
      weight,
      notes,
      user: req.user.id, // <-- We get this ID from the authMiddleware!
    });

    // Save it to the database
    const savedVitals = await newVitals.save();

    // Send back the saved data
    res.status(201).json(savedVitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
// This file is: server/routes/timeline.routes.js

import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import Vitals from '../models/Vitals.model.js';
import File from '../models/File.model.js';

const router = express.Router();

// @route   GET /api/timeline
// @desc    Get all user's files and vitals, sorted by date
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // 1. Get all vitals for this user
    const vitals = await Vitals.find({ user: req.user.id }).sort({ createdAt: -1 });

    // 2. Get all files for this user
    const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });

    // 3. Add a 'type' to each object so the frontend knows what it is
    const vitalsTyped = vitals.map(v => ({ ...v.toObject(), type: 'vitals' }));
    const filesTyped = files.map(f => ({ ...f.toObject(), type: 'file' }));

    // 4. Combine them into one big array
    const timeline = [...vitalsTyped, ...filesTyped];

    // 5. Sort the combined array by date (newest first)
    timeline.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(timeline);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
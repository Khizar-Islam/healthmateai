
// This file is: server/index.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import vitalsRoutes from './routes/vitals.routes.js';
import fileRoutes from './routes/file.routes.js';
import aiRoutes from './routes/ai.routes.js'; // <-- 1. THIS LINE IS NEW
import timelineRoutes from './routes/timeline.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- ROUTES ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the HealthMate server!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vDitals', vitalsRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/ai', aiRoutes); // <-- 2. THIS LINE IS NEW
app.use('/api/timeline', timelineRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
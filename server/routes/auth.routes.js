// This file is: server/routes/auth.routes.js

import express from 'express';
import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// --- Helper Function to Create a JWT Token ---
const createToken = (userId) => {
  // The "payload" is the data we want to store in the token
  const payload = {
    user: {
      id: userId,
    },
  };

  // We "sign" the token with a secret key (from our .env file)
  // This token will expire in 1 day
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// --- ROUTE 1: Register a new user ---
// @route   POST /api/auth/register
// @desc    Create a new user in the database
router.post('/register', async (req, res) => {
  // Get the username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user instance
    user = new User({
      username,
      email,
      password, // The password will be hashed by our 'pre-save' middleware
    });

    // 3. Save user to database
    await user.save();

    // 4. Create a token for the new user
    const token = createToken(user.id);

    // 5. Send back the token (and success message)
    res.status(201).json({ token, msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- ROUTE 2: Login an existing user ---
// @route   POST /api/auth/login
// @desc    Log a user in and get a token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the entered password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Create a token
    const token = createToken(user.id);

    // 4. Send back the token
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
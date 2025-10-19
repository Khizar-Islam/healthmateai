// This file is: server/middleware/auth.middleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get token from the 'Authorization' header
  // It's usually sent as "Bearer <token>"
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if it's a Bearer token
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token format is invalid (must be "Bearer <token>")' });
  }

  const token = tokenParts[1];

  try {
    // Verify the token using our JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user's ID from the token payload to the request object
    req.user = decoded.user;

    // Call the next function in the chain (our route handler)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;
// src/middleware/authMiddleware.js
// ─────────────────────────────────────────────────────────────────────────────
// This middleware protects routes that require a logged-in user.
// It reads the JWT token from the request header, verifies it, and
// attaches the decoded user info to req.user so the next handler can use it.
// ─────────────────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  // Step 1: Read the Authorization header
  // Expected format: "Bearer <token>"
  const authHeader = req.headers['authorization'];

  // Step 2: Check if the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  // Step 3: Extract just the token part (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  // Step 4: Verify the token using our secret key
  try {
    // jwt.verify() decodes the token and checks if it's valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Attach the decoded user data to the request object
    // Now any route that uses this middleware can access req.user
    req.user = decoded;

    // Step 6: Call next() to pass control to the actual route handler
    next();
  } catch (error) {
    // If verification fails (wrong secret or expired), return 401
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

export default protect;

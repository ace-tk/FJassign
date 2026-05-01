// src/routes/authRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Routes define the URL paths and which HTTP method they respond to.
// They act as the "traffic director" — pointing each request to the right controller.
// ─────────────────────────────────────────────────────────────────────────────

import express            from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router(); // Create a mini Express app (a "router")

// POST /api/auth/register → handled by the `register` function
router.post('/register', register);

// POST /api/auth/login → handled by the `login` function
router.post('/login', login);

export default router;

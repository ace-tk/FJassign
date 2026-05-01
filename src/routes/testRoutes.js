// src/routes/testRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// This file defines the test route.
// The `protect` middleware is added BETWEEN the path and the controller.
// Express runs middleware in order → protect runs first, then getTestRoute.
// ─────────────────────────────────────────────────────────────────────────────

import express          from 'express';
import protect          from '../middleware/authMiddleware.js'; // JWT check
import { getTestRoute } from '../controllers/testController.js';

const router = express.Router();

// GET /api/test
// protect runs first → if token is valid, getTestRoute runs
// if token is missing or invalid, protect returns 401 and stops here
router.get('/', protect, getTestRoute);

export default router;

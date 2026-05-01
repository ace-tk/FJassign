// src/routes/dashboardRoutes.js

import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(protect);
router.get('/', getDashboardSummary);

export default router;

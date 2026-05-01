// src/routes/budgetRoutes.js

import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { createBudget, getBudgets } from '../controllers/budgetController.js';

const router = express.Router();

router.use(protect);
router.post('/', createBudget);
router.get('/', getBudgets);

export default router;

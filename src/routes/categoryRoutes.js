// src/routes/categoryRoutes.js

import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createCategory,
  getCategories,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// All category routes require the user to be logged in
router.use(protect);

router.post('/', createCategory);
router.get('/', getCategories);
router.delete('/:id', deleteCategory);

export default router;

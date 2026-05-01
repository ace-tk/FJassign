// src/routes/transactionRoutes.js

import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Setup Multer for receipt uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// All transaction routes require the user to be logged in
router.use(protect);

// Use upload.single('receipt') middleware for the POST route
router.post('/', upload.single('receipt'), createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;

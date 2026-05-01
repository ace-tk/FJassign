// src/controllers/transactionController.js

import pool from '../config/db.js';

// ─── POST /api/transactions ─────────────────────────────────────────────────
export const createTransaction = async (req, res) => {
  const { category_id, type, amount, currency, date, description } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!type || amount === undefined || !date) {
    return res.status(400).json({ message: 'Type, amount, and date are required' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ message: 'Type must be "income" or "expense"' });
  }

  try {
    // Optional: Validate that category belongs to the user if category_id is provided
    if (category_id) {
      const categoryCheck = await pool.query(
        'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
        [category_id, userId]
      );
      if (categoryCheck.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Receipt URL from multer
    const receiptUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, currency, date, description, receipt_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category_id || null, type, amount, currency || 'INR', date, description || '', receiptUrl]
    );

    // Budget check and email notification for expenses
    if (type === 'expense' && category_id) {
      const monthStr = new Date(date).toISOString().slice(0, 7); // 'YYYY-MM'
      const budgetQuery = await pool.query(
        `SELECT b.limit_amount, c.name as category_name, u.email,
           (SELECT COALESCE(SUM(amount), 0) FROM transactions 
            WHERE user_id = $1 AND category_id = $2 AND type = 'expense' 
            AND TO_CHAR(date, 'YYYY-MM') = $3) as spent
         FROM budgets b
         JOIN categories c ON b.category_id = c.id
         JOIN users u ON b.user_id = u.id
         WHERE b.user_id = $1 AND b.category_id = $2 AND b.month = $3`,
        [userId, category_id, monthStr]
      );

      if (budgetQuery.rows.length > 0) {
        const { limit_amount, spent, category_name, email } = budgetQuery.rows[0];
        if (parseFloat(spent) > parseFloat(limit_amount)) {
          import('../utils/email.js').then(({ sendBudgetExceededEmail }) => {
            sendBudgetExceededEmail(email, category_name, spent, limit_amount);
          }).catch(err => console.error(err));
        }
      }
    }

    return res.status(201).json({
      message: 'Transaction created successfully',
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating transaction:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── GET /api/transactions ──────────────────────────────────────────────────
export const getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    // Join with categories to get the category name
    const result = await pool.query(
      `SELECT t.*, c.name as category_name 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.date DESC, t.created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      transactions: result.rows,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── PUT /api/transactions/:id ──────────────────────────────────────────────
export const updateTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;
  const { category_id, type, amount, currency, date, description } = req.body;

  try {
    // Check if transaction belongs to user
    const checkTx = await pool.query(
      'SELECT id FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, userId]
    );

    if (checkTx.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    const result = await pool.query(
      `UPDATE transactions 
       SET category_id = COALESCE($1, category_id),
           type = COALESCE($2, type),
           amount = COALESCE($3, amount),
           currency = COALESCE($4, currency),
           date = COALESCE($5, date),
           description = COALESCE($6, description)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [category_id, type, amount, currency, date, description, transactionId, userId]
    );

    return res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── DELETE /api/transactions/:id ───────────────────────────────────────────
export const deleteTransaction = async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

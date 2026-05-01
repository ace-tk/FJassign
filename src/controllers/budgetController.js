// src/controllers/budgetController.js

import pool from '../config/db.js';

// ─── POST /api/budgets ──────────────────────────────────────────────────────
export const createBudget = async (req, res) => {
  const { category_id, limit_amount, month } = req.body;
  const userId = req.user.id;

  if (!category_id || !limit_amount || !month) {
    return res.status(400).json({ message: 'Category, limit_amount, and month (YYYY-MM) are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, limit_amount, month)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, category_id, month) 
       DO UPDATE SET limit_amount = EXCLUDED.limit_amount
       RETURNING *`,
      [userId, category_id, limit_amount, month]
    );

    return res.status(201).json({
      message: 'Budget set successfully',
      budget: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating budget:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── GET /api/budgets ───────────────────────────────────────────────────────
export const getBudgets = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query; // Optional filter by YYYY-MM

  try {
    let query = `
      SELECT b.*, c.name as category_name,
             COALESCE(SUM(t.amount), 0) as spent_amount
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      LEFT JOIN transactions t ON t.category_id = b.category_id 
           AND t.user_id = b.user_id 
           AND t.type = 'expense'
           AND TO_CHAR(t.date, 'YYYY-MM') = b.month
      WHERE b.user_id = $1
    `;
    const params = [userId];

    if (month) {
      query += ` AND b.month = $2`;
      params.push(month);
    }

    query += ` GROUP BY b.id, c.name ORDER BY b.month DESC`;

    const result = await pool.query(query, params);

    // Map through and mark if exceeded
    const budgets = result.rows.map(row => {
      const limit = parseFloat(row.limit_amount);
      const spent = parseFloat(row.spent_amount);
      return {
        ...row,
        limit_amount: limit,
        spent_amount: spent,
        exceeded: spent > limit
      };
    });

    return res.status(200).json({ budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// src/controllers/dashboardController.js

import pool from '../config/db.js';

export const getDashboardSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Get total income and expenses
    const totalsResult = await pool.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
       FROM transactions 
       WHERE user_id = $1`,
      [userId]
    );

    const totalIncome = parseFloat(totalsResult.rows[0].total_income);
    const totalExpense = parseFloat(totalsResult.rows[0].total_expense);
    const savings = totalIncome - totalExpense;

    // 2. Get category-wise breakdown (for expenses)
    const categoryBreakdown = await pool.query(
      `SELECT 
         c.name as category_name, 
         SUM(t.amount) as total_amount
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.type = 'expense'
       GROUP BY c.name
       ORDER BY total_amount DESC`,
      [userId]
    );

    return res.status(200).json({
      totals: {
        income: totalIncome,
        expense: totalExpense,
        savings: savings
      },
      categoryBreakdown: categoryBreakdown.rows.map(row => ({
        category: row.category_name,
        amount: parseFloat(row.total_amount)
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

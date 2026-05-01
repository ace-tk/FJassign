// src/controllers/reportController.js

import pool from '../config/db.js';

export const getMonthlyReport = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
         TO_CHAR(date, 'YYYY-MM') as month,
         COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
       FROM transactions
       WHERE user_id = $1
       GROUP BY TO_CHAR(date, 'YYYY-MM')
       ORDER BY month DESC`,
      [userId]
    );

    const report = result.rows.map(row => ({
      month: row.month,
      income: parseFloat(row.income),
      expense: parseFloat(row.expense)
    }));

    return res.status(200).json({ report });
  } catch (error) {
    console.error('Error fetching monthly report:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

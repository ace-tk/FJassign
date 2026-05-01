// src/controllers/categoryController.js

import pool from '../config/db.js';

// ─── POST /api/categories ───────────────────────────────────────────────────
export const createCategory = async (req, res) => {
  const { name, type } = req.body;
  const userId = req.user.id;

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required' });
  }

  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ message: 'Type must be "income" or "expense"' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, type]
    );

    return res.status(201).json({
      message: 'Category created successfully',
      category: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating category:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── GET /api/categories ────────────────────────────────────────────────────
export const getCategories = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return res.status(200).json({
      categories: result.rows,
    });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─── DELETE /api/categories/:id ─────────────────────────────────────────────
export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user.id;

  try {
    // We rely on "ON DELETE SET NULL" in our schema for the transactions.
    // So if a category is deleted, its transactions are not deleted but the category_id becomes NULL.
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
      [categoryId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found or unauthorized' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

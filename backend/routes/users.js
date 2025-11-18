const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// GET user profile (for Profile page)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, monthly_income, created_at FROM Users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length) res.json({ user: rows[0] });
    else res.status(404).json({ error: "User not found" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// UPDATE user's monthly income (for Profile editing)
router.put('/me/income', authenticateToken, async (req, res) => {
  const { monthly_income } = req.body;
  try {
    await db.query(
      'UPDATE Users SET monthly_income = ? WHERE id = ?',
      [monthly_income, req.user.id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update income" });
  }
});

// Get user's transactions with category_id
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, c.type_name, c.id AS category_id
      FROM Transactions t
      JOIN UserCategory uc ON t.unique_user_cat = uc.id
      JOIN Categories c ON uc.category_id = c.id
      WHERE uc.user_id = ?
      ORDER BY t.date DESC
    `, [req.user.id]);
    res.json({ transactions: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

module.exports = router;

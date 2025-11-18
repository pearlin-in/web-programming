const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// All categories (for frontend filters, etc)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Categories');
    res.json({ categories: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// GET /api/categories/user/transactions
router.get('/user/transactions', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id, c.type_name, c.colour
      FROM UserCategory uc
      JOIN Categories c ON uc.category_id = c.id
      WHERE uc.user_id = ? AND c.reference = 'transactions'
    `, [req.user.id]);
    res.json({ categories: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get user transaction categories' });
  }
});



module.exports = router;

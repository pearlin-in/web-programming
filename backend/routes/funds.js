const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Get savings funds
router.get('/funds', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM SavingsFunds WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ funds: rows || [] });
  } catch (e) {
    console.error("CREATE FUND ERROR:", e, JSON.stringify(e));
    res.status(500).json({ error: 'Failed to get funds' });
  }
});

// Create a new fund
router.post('/funds', authenticateToken, async (req, res) => {
  try {
    const { name, target_amount, priority } = req.body;
    await db.query(
      'INSERT INTO SavingsFunds (user_id, name, target_amount, priority) VALUES (?, ?, ?, ?)',
      [req.user.id, name, target_amount, priority || 'medium']
    );
    res.json({ message: 'Fund created' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fund creation failed' });
  }
});


// Update fund (amount, name, target)
router.put('/funds/:id', authenticateToken, async (req, res) => {
  try {
    const fundId = req.params.id;
    const { name, current_amount, target_amount } = req.body;
    await db.query('UPDATE SavingsFunds SET name=?, current_amount=?, target_amount=? WHERE id=?', [name, current_amount, target_amount, fundId]);
    res.json({ message: 'Fund updated' });
  } catch (e) {
    res.status(500).json({ error: 'Fund update failed' });
  }
});

// Delete fund
router.delete('/funds/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM SavingsFunds WHERE id=?', [req.params.id]);
    res.json({ message: 'Fund deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Fund deletion failed' });
  }
});

module.exports = router;

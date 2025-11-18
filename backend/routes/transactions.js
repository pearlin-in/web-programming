const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Get user's transactions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, c.type_name
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

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { category_id, amount, description, date, is_important } = req.body;
    const [userCat] = await db.query(
      'SELECT id FROM UserCategory WHERE user_id=? AND category_id=?',
      [req.user.id, category_id]
    );
    if (!userCat[0]) return res.status(400).json({ error: 'Category not found' });

    await db.query(
      'INSERT INTO Transactions (unique_user_cat, amount, description, date, is_important) VALUES (?, ?, ?, ?, ?)',
      [userCat[0].id, amount, description, date, is_important || false]
    );

    // If expense (amount negative), update Users.monthly_income
    if (Number(amount) < 0) {
      await db.query(
        'UPDATE Users SET monthly_income = monthly_income + ? WHERE id = ?',
        [Number(amount), req.user.id] // amount is negative, so this subtracts
      );
    }

    res.json({ message: 'Transaction created' });
  } catch (e) {
    console.error("Transaction creation failed:", e);
    res.status(500).json({ error: 'Transaction creation failed' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { description, amount, category_id, is_important } = req.body;
  try {
    // Find user's UserCategory for this category_id
    const [uc] = await db.query(
      "SELECT id FROM UserCategory WHERE user_id=? AND category_id=?",
      [req.user.id, category_id]
    );
    if (!uc[0]) return res.status(400).json({ error: "Category not found" });

    await db.query(
      "UPDATE Transactions SET unique_user_cat=?, amount=?, description=?, is_important=? WHERE id=?",
      [uc[0].id, amount, description, is_important, req.params.id]
    );
    res.json({ success: true });
  } catch (e) {
    console.error("Transaction update error:", e);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Make sure to only delete transactions belonging to this user
    // Find the transaction and join with UserCategory to confirm ownership
    const [found] = await db.query(
      `SELECT t.id FROM Transactions t
       JOIN UserCategory uc ON t.unique_user_cat = uc.id
       WHERE t.id = ? AND uc.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!found.length) return res.status(404).json({ error: "Transaction not found or not yours" });

    await db.query(
      `DELETE FROM Transactions WHERE id = ?`, [req.params.id]
    );
    res.json({ success: true });
  } catch (e) {
    console.error("Delete transaction error:", e);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password ||
      password.length < 8 || !/\d/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include a number.' });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    await db.query('INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);
    res.json({ message: 'Sign up successful' });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Sign up failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
});


module.exports = router;

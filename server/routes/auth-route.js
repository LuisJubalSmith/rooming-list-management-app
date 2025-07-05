/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const config = require('config');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // For simplicity, hardcoded validation (use database in production)
  if (username === 'admin' && password === '123456') {
    const token = jwt.sign({ user: 'admin' }, config.get('jwtSecret'), { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ msg: 'Invalid credentials' });
  }
});

module.exports = router;

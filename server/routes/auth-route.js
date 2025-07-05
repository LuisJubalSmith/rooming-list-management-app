/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const config = require('config');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticates the user and returns a JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

   // 🔐 In production, replace this with database user lookup
  if (username === 'admin' && password === '123456') {
    // Create a JWT token with a 1 hour expiration
    const token = jwt.sign({ user: 'admin' }, config.get('jwtSecret'), { expiresIn: '1h' });
    // Return token to the client
    res.json({ token });
  } else {
    // If credentials don't match, return 401 Unauthorized
    res.status(401).json({ msg: 'Invalid credentials' });
  }
});

module.exports = router;

/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get all rooming list bookings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooming_list_bookings');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooming lists:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Get all rooming lists
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooming_lists');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooming lists:', err.message);
    res.status(500).send('Server Error');
  }
});

// Create new rooming list
router.post('/create', auth, async (req, res) => {
  const {
    rooming_list_id,
    event_id,
    hotel_id,
    rfp_name,
    cut_off_date,
    status,
    agreement_type
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO rooming_lists (
        rooming_list_id, event_id, hotel_id, rfp_name,
        cut_off_date, status, agreement_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [rooming_list_id, event_id, hotel_id, rfp_name, cut_off_date, status, agreement_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating rooming list:', err.message);
    res.status(500).send('Server Error');
  }
});

//Modify one rooming list by id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const {
    event_id,
    hotel_id,
    rfp_name,
    cut_off_date,
    status,
    agreement_type
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE rooming_lists SET
        event_id = $1,
        hotel_id = $2,
        rfp_name = $3,
        cut_off_date = $4,
        status = $5,
        agreement_type = $6
      WHERE rooming_list_id = $7
      RETURNING *`,
      [event_id, hotel_id, rfp_name, cut_off_date, status, agreement_type, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Rooming List not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating rooming list:', err.message);
    res.status(500).send('Server Error');
  }
});

//Delete one rooming list by id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM rooming_lists WHERE rooming_list_id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Rooming List not found' });
    }

    res.json({ msg: 'Rooming List deleted successfully' });
  } catch (err) {
    console.error('Error deleting rooming list:', err.message);
    res.status(500).send('Server Error');
  }
});

// Get filter by eventId, rfpName, agreementType
router.get('/search-bar', auth, async (req, res) => {
  const { q } = req.query;

  if (!q || q.toString().trim() === '') {
    return res.status(400).json({ msg: 'Debe proporcionar un valor de búsqueda' });
  }

  const value = q.toString().trim().toLowerCase();
  const isNumber = !isNaN(Number(value));

  let query = `SELECT * FROM rooming_lists WHERE `;
  const conditions = [];
  const values = [];

  if (isNumber) {
    values.push(Number(value));
    conditions.push(`event_id = $${values.length}`);
  } else {
    values.push(`%${value}%`);
    conditions.push(`LOWER(rfp_name) ILIKE $${values.length}`);

    values.push(`%${value}%`);
    conditions.push(`LOWER(agreement_type) ILIKE $${values.length}`);

    values.push(`%${value}%`);
    conditions.push(`LOWER(status) ILIKE $${values.length}`);
  }

  query += conditions.join(' OR ');

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error al buscar datos' });
  }
});

// Get rooming list by rfpStatus
router.get('/status', async (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ msg: 'Missing status query parameter' });
  }

  const statusMap = {
    active: [
      'received', 
      'confirmed'
    ],
    closed: ['completed'],
    cancelled: [
      'archived', 
      'cancelled'
    ],
  };

  const allowedValues = statusMap[status.toLowerCase()];

  if (!allowedValues) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }

  try {
    const placeholders = allowedValues.map((_, i) => `$${i + 1}`).join(', ');

    const result = await pool.query(
      `SELECT * FROM rooming_lists WHERE LOWER(status) IN (${placeholders}) ORDER BY rooming_list_id`,
      allowedValues.map(val => val.toLowerCase())
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error filtering by status:', err.message);
    res.status(500).send('Server Error');
  }
});

// Get by date
router.get('/sorted', auth, async (req, res) => {
  const { order } = req.query;
  const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

  try {
    const result = await pool.query(
      `SELECT * FROM rooming_lists ORDER BY cut_off_date ${sortOrder}`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error sorting rooming lists:', err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;

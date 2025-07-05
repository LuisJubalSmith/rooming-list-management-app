/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (no auth required)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooming lists:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/bookings/bookings-for-rooming
 * @desc    Get bookings grouped by Rooming List
 * @access  Public
 */
router.get('/bookings-for-rooming', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        rl.rooming_list_id,
        rl.rfp_name,
        b.guest_name,
        b.check_in_date,
        b.check_out_date
      FROM rooming_list_bookings rlb
      JOIN bookings b ON rlb.booking_id = b.booking_id
      JOIN rooming_lists rl ON rl.rooming_list_id = rlb.rooming_list_id
      ORDER BY rl.rooming_list_id, b.check_in_date;
    `);

    // Group bookings by rooming_list_id
    const grouped = {};

    result.rows.forEach(row => {
      const { rooming_list_id, rfp_name, guest_name, check_in_date, check_out_date } = row;

      if (!grouped[rooming_list_id]) {
        grouped[rooming_list_id] = {
          rooming_list_id,
          rfp_name,
          bookings: [],
        };
      }

      grouped[rooming_list_id].bookings.push({
        guest_name,
        check_in_date,
        check_out_date,
      });
    });

    const response = Object.values(grouped);
    res.json(response);
    // res.json(result.rows);

  } catch (err) {
    console.error('Error fetching grouped bookings:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET /api/bookings/:id/bookings-by-id
 * @desc    Get bookings for a specific Rooming List
 * @access  Private (requires token)
 */
router.get('/:id/bookings-by-id', auth, async (req, res) => {
  const { id } = req.params;
  const roomingListId = parseInt(id, 10);

  if (isNaN(roomingListId)) {
    return res.status(400).json({ msg: 'Invalid rooming_list_id' });
  }

  try {
    const query = `
      SELECT b.*
      FROM bookings b
      INNER JOIN rooming_list_bookings rlb ON b.booking_id = rlb.booking_id
      WHERE rlb.rooming_list_id = $1
      ORDER BY b.check_in_date
    `;
    const result = await pool.query(query, [roomingListId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bookings for rooming list:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

/**
 * @route   POST /api/bookings/:rooming_list_id/create
 * @desc    Create a new booking and associate it with a Rooming List
 * @access  Private (requires token)
 */
router.post('/:rooming_list_id/create', auth, async (req, res) => {
  const { rooming_list_id } = req.params;

  console.log("📥 Body recibido:", req.body);
  console.log("🧾 rooming_list_id:", rooming_list_id);

  const {
    hotel_id,
    event_id,
    guest_name,
    guest_phone_number,
    check_in_date,
    check_out_date,
  } = req.body;

  try {
    // 1. Insert the booking
    const bookingResult = await pool.query(
      `INSERT INTO bookings (
        hotel_id, event_id, guest_name, guest_phone_number,
        check_in_date, check_out_date
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING booking_id`,
      [
        hotel_id,
        event_id,
        guest_name,
        guest_phone_number,
        check_in_date,
        check_out_date,
      ]
    );

    const bookingId = bookingResult.rows[0].booking_id;

    // 2. Associate it with the rooming list
    await pool.query(
      `INSERT INTO rooming_list_bookings (rooming_list_id, booking_id)
       VALUES ($1, $2)`,
      [rooming_list_id, bookingId]
    );

    res.status(201).json({ msg: 'Booking creado y asociado con éxito' });
  } catch (err) {
    console.error('Error al crear booking:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
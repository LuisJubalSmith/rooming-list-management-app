/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');


// POST /api/import/data
router.post('/data', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM rooming_list_bookings');
    await pool.query('DELETE FROM bookings');
    await pool.query('DELETE FROM rooming_lists');

    const bookings = require('../data/bookings.json');
    const roomingLists = require('../data/rooming-lists.json');
    const roomingListBookings = require('../data/rooming-list-bookings.json');

    for (const rl of roomingLists) {
  await pool.query(`
    INSERT INTO rooming_lists (
      rooming_list_id, event_id, hotel_id, rfp_name,
      cut_off_date, status, agreement_type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [
    rl.roomingListId,
    rl.eventId,
    rl.hotelId,
    rl.rfpName,
    rl.cutOffDate,
    rl.status,
    rl.agreement_type
  ]);
}

    const bookingIdMap = {};

    for (const b of bookings) {
  await pool.query(`
    INSERT INTO bookings (
      booking_id, hotel_id, event_id, guest_name,
      guest_phone_number, check_in_date, check_out_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [
    b.bookingId,
    b.hotelId,
    b.eventId,
    b.guestName,
    b.guestPhoneNumber,
    b.checkInDate,
    b.checkOutDate
  ]);
}

for (const rlb of roomingListBookings) {
  await pool.query(`
    INSERT INTO rooming_list_bookings (
      rooming_list_id, booking_id
    ) VALUES ($1, $2)
  `, [rlb.roomingListId, rlb.bookingId]);
}

    for (const rlb of roomingListBookings) {
      const generatedBookingId = bookingIdMap[rlb.bookingId];

      if (!generatedBookingId) {
        console.warn('bookingId not found in bookingIdMap:', rlb.bookingId);
        continue;
      }

      await pool.query(`
        INSERT INTO rooming_list_bookings (
          rooming_list_id, booking_id
        ) VALUES ($1, $2)
      `, [rlb.roomingListId, generatedBookingId]);
    }

    await pool.query(`
      SELECT setval('bookings_booking_id_seq', (
        SELECT COALESCE(MAX(booking_id), 1) FROM bookings
      ))
    `);

    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Data import failed', details: error.message });
  }
});


//DELETE /api/import/clear
router.delete('/clear', async (req, res) => {
    try {
      await pool.query('DELETE FROM rooming_list_bookings');
      await pool.query('DELETE FROM rooming_lists');
      await pool.query('DELETE FROM bookings');
      res.json({msg: 'Base de datos borrada con éxito.'})
    } catch (error) {
      console.error('Error al borrar la base de datos:', error.message);
    res.status(500).json({ msg: 'Error interno del servidor al borrar la base de datos.' });
    }
});

module.exports = router;

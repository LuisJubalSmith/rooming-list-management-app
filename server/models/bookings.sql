CREATE TABLE IF NOT EXISTS bookings (
  booking_id SERIAL PRIMARY KEY,
  hotel_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone_number TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

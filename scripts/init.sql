-- Crear tabla rooming_lists
CREATE TABLE
IF NOT EXISTS rooming_lists
(
  rooming_list_id BIGINT PRIMARY KEY,  -- CAMBIO AQUÍ
  event_id INTEGER,
  hotel_id INTEGER,
  rfp_name TEXT,
  cut_off_date DATE,
  status TEXT,
  agreement_type TEXT
);

CREATE TABLE
IF NOT EXISTS bookings
(
  booking_id SERIAL PRIMARY KEY,       -- AUTOINCREMENT
  hotel_id INTEGER,
  event_id INTEGER,
  guest_name TEXT,
  guest_phone_number TEXT,
  check_in_date DATE,
  check_out_date DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
IF NOT EXISTS rooming_list_bookings
(
  id SERIAL PRIMARY KEY,
  rooming_list_id BIGINT REFERENCES rooming_lists
(rooming_list_id) ON
DELETE CASCADE,
  booking_id INTEGER
REFERENCES bookings
(booking_id) ON
DELETE CASCADE
);




-- models/rooming_lists.sql

CREATE TABLE
IF NOT EXISTS rooming_lists
(
  rooming_list_id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  hotel_id INTEGER,
  rfp_name VARCHAR
(255) NOT NULL,
  cut_off_date DATE NOT NULL,
  status VARCHAR
(20) DEFAULT 'active',
  agreement_type VARCHAR
(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

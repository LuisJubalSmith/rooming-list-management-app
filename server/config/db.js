/* eslint-disable no-undef */
const { Pool } = require('pg');
const config = require('config');

// Get database configuration from config files (config/default.json, etc.)
const dbConfig = config.get('db');

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
});

/**
 * Function to connect and verify PostgreSQL connection.
 * Logs success message if not in test environment.
 */
const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ PostgreSQL Connected...');
    }
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
    process.exit(1);
  }
};

// Export both connect function and pool
module.exports = connectDB;
module.exports.pool = pool;
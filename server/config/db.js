/* eslint-disable no-undef */
const { Pool } = require('pg');
const config = require('config');

const dbConfig = config.get('db');

const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
});

const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()');
    if (process.env.NODE_ENV !== 'test') {
      console.log('PostgreSQL Connected...');
    }
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.pool = pool;
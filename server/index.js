/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const httpServer = http.createServer(app);
// Connect DB
connectDB();

// Middleware global
app.use(cors());
app.use(express.json());

// Servir statict file (opcional)
app.use(express.static(path.join(__dirname, 'public')));
// base Route
app.get('/', (req, res) => res.send('API Running'));
//API Route
app.use('/api/rooming-lists', require('./routes/rooming-list-route'));
app.use('/api/rooming-lists/create', require('./routes/rooming-list-route'));
app.use('/api/rooming-list-bookings', require('./routes/rooming-list-bookings'));
app.use('/api/rooming-lists/search-bar', require('./routes/rooming-list-route'))

app.use('/api/bookings', require('./routes/bookings-route'));
app.use('/api/bookings/bookings-for-rooming', require('./routes/bookings-route'));
app.use('/api/bookings/:id/bookings-by-id', require('./routes/bookings-route'));
app.use('/api/bookings/:rooming_list_id/create', require('./routes/bookings-route'));

app.use('/api/import', require('./routes/import-route'));
app.use('/api/import/clear', require('./routes/import-route'));
app.use('/api/auth', require('./routes/auth-route'));

// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
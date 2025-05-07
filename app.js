// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/directors', require('./routes/directorRoutes'));
app.use('/api/actors', require('./routes/actorRoutes'));
app.use('/api/genres', require('./routes/genreRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;
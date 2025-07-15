const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Updated paths based on new structure
const postRoutes = require('./src/routes/postRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;

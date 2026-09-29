const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large (max 2MB)' });
  }

  return res.status(500).json({ message: 'Unexpected server error' });
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
// const chatRoutes = require('./routes/chatRoutes');

const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Welcome to the StudyStack API');
});

app.use('/api/courses', courseRoutes);
app.use('/', authRoutes);
// app.use('/api', chatRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
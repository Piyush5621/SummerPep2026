const express = require('express');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
// const chatRoutes = require('./routes/chatRoutes');

const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

const defaultFrontendUrl = 'https://studystackdevv.vercel.app';
const allowedOrigins = [
  process.env.FRONTEND_URL || defaultFrontendUrl,
  'https://studystackdevv.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
]
  .filter(Boolean)
  .map((url) => url.replace(/\/+$/, ''));

console.log('Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin} (normalized: ${normalizedOrigin})`);
    callback(new Error(`CORS policy blocked origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      res.header('Access-Control-Allow-Origin', normalizedOrigin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
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
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const axios = require('axios');

const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const genAIBaseUrl = process.env.GENAI_BASE_URL || 'http://localhost:4000';

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

app.post('/api/genai/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file.' });
    }

    const formData = new FormData();
    formData.append('pdf', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype || 'application/pdf',
    });

    const response = await axios.post(`${genAIBaseUrl}/api/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const statusCode = error?.response?.status || 500;
    const message = error?.response?.data?.error || error.message || 'Upload failed.';
    res.status(statusCode).json({ error: message });
  }
});

app.post('/api/genai/ask', async (req, res) => {
  try {
    const response = await axios.post(`${genAIBaseUrl}/api/ask`, {
      question: req.body.question,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const statusCode = error?.response?.status || 500;
    const message = error?.response?.data?.error || error.message;
    res.status(statusCode).json({ error: message });
  }
});

app.use('/api/courses', courseRoutes);
app.use('/', authRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
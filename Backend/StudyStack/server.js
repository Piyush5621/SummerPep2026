require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

console.log('Starting StudyStack backend');
console.log('PORT:', PORT);
console.log('DATABASE configured:', Boolean(process.env.DATABASE));
console.log('JWT_SECRET configured:', Boolean(process.env.JWT_SECRET));
if (process.env.FRONTEND_URL) {
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Express server is live on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    if (error && error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

startServer();

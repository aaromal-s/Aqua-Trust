import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import Routes
import sensorRoutes from './routes/sensorRoutes';
import authRoutes from './routes/authRoutes';
import alertRoutes from './routes/alertRoutes';
import locationRoutes from './routes/locationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/locations', locationRoutes);

// Root Status Route
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', service: 'Aqua Trust Core API' });
});

// Database Connection and Server Start
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/aqua-trust';

    // Start listening immediately so API and mock endpoints are instant (< 200ms)
    app.listen(PORT, () => {
      console.log(`🚀 AquaTrust Core API server running on port ${PORT}`);
    });

    // Attempt MongoDB connection in background with short timeout so server does not hang
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 })
      .then(() => {
        console.log(`✅ MongoDB Connected Successfully`);
      })
      .catch((dbError) => {
        console.warn(`\n⚠️ Note: MongoDB not detected locally or timed out.`);
        console.warn(`Running backend API in resilient mock/in-memory fallback mode.\n`);
      });
  } catch (error) {
    console.error(`Fatal Server Error:`, error);
    process.exit(1);
  }
};

startServer();

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
    console.log(`Attempting to connect to MongoDB at ${mongoUri}...`);
    
    try {
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected Successfully`);
    } catch (dbError) {
      console.warn(`\n⚠️ WARNING: Could not connect to MongoDB (is it running?).`);
      console.warn(`Starting backend API anyway, but database-dependent features may fail. Mock endpoints will still work.\n`);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Fatal Server Error:`, error);
    process.exit(1);
  }
};

startServer();

import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  parameters: {
    pH: { type: Number },
    turbidity: { type: Number },
    temperature: { type: Number },
    dissolvedOxygen: { type: Number },
    conductivity: { type: Number }
  },
  anomalyDetected: { type: Boolean, default: false }
});

export default mongoose.model('Reading', readingSchema);

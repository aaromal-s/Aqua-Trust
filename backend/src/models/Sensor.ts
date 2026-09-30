import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['ONLINE', 'OFFLINE', 'WARNING'], default: 'ONLINE' },
  battery: { type: Number, default: 100 },
  signal: { type: String, enum: ['STRONG', 'WEAK', 'NONE'], default: 'STRONG' },
  lastSync: { type: Date, default: Date.now },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model('Sensor', sensorSchema);

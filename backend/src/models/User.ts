import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['PUBLIC', 'MONITOR', 'ADMIN', 'SUPERADMIN'], default: 'PUBLIC' },
  firstName: { type: String },
  lastName: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

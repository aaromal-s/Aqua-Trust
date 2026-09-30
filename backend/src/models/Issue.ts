import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['REPORTED', 'INVESTIGATING', 'RESOLVED'], default: 'REPORTED' },
  photoUrl: { type: String },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Issue', issueSchema);

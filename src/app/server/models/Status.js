import mongoose from 'mongoose';

const StatusSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: [true, 'Status ID is required'],
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Status name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#6366f1',
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update the updatedAt field
StatusSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Status || mongoose.model('Status', StatusSchema);

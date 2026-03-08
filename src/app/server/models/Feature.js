import mongoose from 'mongoose';

const FeatureSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: [true, 'Feature ID is required'],
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Feature name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['amenities', 'security', 'outdoor', 'indoor', 'utilities'],
    default: 'amenities'
  },
  icon: {
    type: String,
    default: 'star'
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
FeatureSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Feature || mongoose.model('Feature', FeatureSchema);

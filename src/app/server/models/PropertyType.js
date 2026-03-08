import mongoose from 'mongoose';

const PropertyTypeSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: [true, 'Property Type ID is required'],
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Property Type name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: 'home'
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
PropertyTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.PropertyType || mongoose.model('PropertyType', PropertyTypeSchema);

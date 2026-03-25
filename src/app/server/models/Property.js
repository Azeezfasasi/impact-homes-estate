import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    trim: true,
    default: 'house'
  },
  status: {
    type: String,
    required: [true, 'Property status is required'],
    trim: true,
    default: 'available'
  },
  category: {
    type: String,
    required: [true, 'Property category is required'],
    trim: true,
    default: 'residential'
  },
  // Location details
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: 'Nigeria' }
  },
  // Property features
  bedrooms: {
    type: Number
  },
  bathrooms: {
    type: Number
  },
  squareFootage: {
    type: Number
  },
  lotSize: {
    type: Number
  },
  yearBuilt: {
    type: Number,
    min: [1800, 'Year built must be reasonable'],
    max: [new Date().getFullYear() + 1, 'Year built cannot be in the future']
  },
  // Images
  images: [{
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String },
    isMain: { type: Boolean, default: false }
  }],
  // Additional features
  features: [{
    type: String,
    trim: true
  }],
  // Agent/Owner information
  agent: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  // Metadata
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dateListed: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
PropertySchema.index({ title: 'text', description: 'text' });
PropertySchema.index({ 'address.city': 1, 'address.state': 1 });
PropertySchema.index({ propertyType: 1, status: 1, category: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ isFeatured: 1, isActive: 1 });

// Update lastUpdated on save
PropertySchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);

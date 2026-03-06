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
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial', 'other'],
    default: 'house'
  },
  status: {
    type: String,
    required: [true, 'Property status is required'],
    enum: ['available', 'sold', 'rented', 'pending', 'off-market'],
    default: 'available'
  },
  category: {
    type: String,
    required: [true, 'Property category is required'],
    enum: ['residential', 'commercial', 'industrial', 'land', 'investment'],
    default: 'residential'
  },
  // Location details
  address: {
    street: { type: String, required: [true, 'Street address is required'] },
    city: { type: String, required: [true, 'City is required'] },
    state: { type: String, required: [true, 'State is required'] },
    zipCode: { type: String, required: [true, 'Zip code is required'] },
    country: { type: String, default: 'USA' }
  },
  // Property features
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative'],
    default: 0
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative'],
    default: 0
  },
  squareFootage: {
    type: Number,
    min: [0, 'Square footage cannot be negative']
  },
  lotSize: {
    type: Number,
    min: [0, 'Lot size cannot be negative']
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
    name: { type: String, required: [true, 'Agent name is required'] },
    email: { type: String, required: [true, 'Agent email is required'] },
    phone: { type: String, required: [true, 'Agent phone is required'] }
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

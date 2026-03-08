import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Category ID is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  color: {
    type: String,
    default: 'bg-gray-100 text-gray-800',
    enum: [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-orange-100 text-orange-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-gray-100 text-gray-800'
    ]
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
}, {
  timestamps: true
});

// Index for faster queries
CategorySchema.index({ id: 1 });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);

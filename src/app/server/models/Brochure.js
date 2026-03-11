import mongoose from 'mongoose';

const brochureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Brochure title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['general', 'properties', 'projects', 'services', 'investment', 'other'],
      default: 'general',
    },
    pdfUrl: {
      type: String,
      required: [true, 'PDF URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required for deletion'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    fileSize: {
      type: Number, // in bytes
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    version: {
      type: String,
      default: '1.0',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
brochureSchema.index({ status: 1, featured: -1, displayOrder: 1 });
brochureSchema.index({ category: 1 });
brochureSchema.index({ createdAt: -1 });

export default mongoose.models.Brochure || mongoose.model('Brochure', brochureSchema);

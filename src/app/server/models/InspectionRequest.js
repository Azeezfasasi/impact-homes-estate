import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  adminName: String,
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InspectionRequestSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    project: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    replies: [replySchema],
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.InspectionRequest ||
  mongoose.model('InspectionRequest', InspectionRequestSchema);

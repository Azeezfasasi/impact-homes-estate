import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  icon: {
    type: String,
    default: '🚀',
  },
  number: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const WelcomeCtaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  buttonLabel: {
    type: String,
    default: 'Speak with an Investment Advisor',
  },
  stats: [StatSchema],
  active: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.WelcomeCta || mongoose.model("WelcomeCta", WelcomeCtaSchema);

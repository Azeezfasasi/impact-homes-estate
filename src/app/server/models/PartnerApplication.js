import mongoose from 'mongoose';

const PartnerApplicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['individual', 'corporate'],
    required: true,
  },
  // Individual Fields
  firstName: String,
  lastName: String,
  homeAddress: String,
  yearsAtAddress: String,
  reference1Name: String,
  reference1Phone: String,
  reference2Name: String,
  reference2Phone: String,
  // Corporate Fields
  companyName: String,
  rcNumber: String,
  companyAddress: String,
  representativeName: String,
  representativePosition: String,
  // Common Fields
  emailAddress: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  howHeardAboutUs: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PartnerApplication || mongoose.model('PartnerApplication', PartnerApplicationSchema);

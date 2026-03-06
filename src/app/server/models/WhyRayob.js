import mongoose from "mongoose";

const WhyRayobReasonSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WhyRayobSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Why Choose Rayob Engineering & Mgt. Co. Ltd?",
    },
    subheading: {
      type: String,
    //   default: "Delivering innovative, reliable, and cost-effective engineering solutions across industrial, commercial, and residential sectors.",
    },
    reasons: [WhyRayobReasonSchema],
    ctaHeading: {
      type: String,
      default: "Ready to Partner With Us?",
    },
    ctaDescription: {
      type: String,
      default: "Experience the Rayob difference in your next project. Let's turn your engineering challenges into innovative solutions.",
    },
    ctaButton1: {
      label: {
        type: String,
        default: "Contact Us Today",
      },
      href: {
        type: String,
        default: "/contact-us",
      },
    },
    ctaButton2: {
      label: {
        type: String,
        default: "Learn More",
      },
      href: {
        type: String,
        default: "#",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.WhyRayob || mongoose.model("WhyRayob", WhyRayobSchema);

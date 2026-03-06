import WhyRayob from "../models/WhyRayob";
import { connectDB } from "../../server/db/connect";
import mongoose from "mongoose";

// GET all why rayob content
export async function getWhyRayobContent() {
  await connectDB();
  let content = await WhyRayob.findOne();

  // Initialize if doesn't exist
  if (!content) {
    const defaultReasons = [
      {
        _id: new mongoose.Types.ObjectId(),
        id: 1,
        title: "Proven Multidisciplinary Engineering Expertise",
        description:
          "Rayob Engineering & Mgt. Co. Ltd brings together deep expertise across civil engineering, telecommunications infrastructure, fibre-optic networks, and project management. This multidisciplinary strength enables the company to deliver integrated, end-to-end solutions that are technically sound, cost-effective, and aligned with client objectives.",
        icon: "Zap",
        order: 1,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        id: 2,
        title: "Innovative, Extensive Industry Experience with Real Project Success",
        description:
          "With years of hands-on experience executing complex projects in construction, telecoms, and infrastructure development, Rayob has a strong track record of successfully delivering projects of varying scale and complexity. Clients benefit from practical know-how, foresight, innovations, and lessons learned from real-world project environments.",
        icon: "Target",
        order: 2,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        id: 3,
        title: "Strong Project Management and Delivery Discipline",
        description:
          "Rayob adopts globally accepted project management best practices to ensure projects are delivered on time, within budget, and to the highest quality standards. Clear planning, risk management, progress tracking, and stakeholder coordination are embedded in every project, giving clients confidence and transparency throughout execution.",
        icon: "Briefcase",
        order: 3,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        id: 4,
        title: "Commitment to Quality, Safety, and Standards Compliance",
        description:
          "Quality assurance and safety are non-negotiable at Rayob. All projects are executed in strict compliance with industry standards, regulatory requirements, and best engineering practices. This commitment minimizes rework, enhances asset longevity, and ensures safe, reliable, and sustainable project outcomes.",
        icon: "Shield",
        order: 4,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        id: 5,
        title: "Client-Centric and Solution-Driven Approach",
        description:
          "Rayob places clients at the center of every engagement, taking time to understand specific needs, challenges, and expectations. Rather than offering generic solutions, the company delivers tailored, practical, and innovative approaches that add real value and align with each client’s strategic goals",
        icon: "Users",
        order: 5,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        id: 6,
        title: "Strong Technical Leadership and Skilled Workforce",
        description:
          "Projects at Rayob are led by experienced engineers and managed by skilled professionals with strong technical and leadership capabilities. The company invests in continuous training and capacity development, ensuring that clients benefit from competent personnel who are up-to- date with modern technologies and industry trends.",
        order: 6,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        id: 7,
        title: "Integrity, Reliability, and Long-Term Partnership Focus",
        description:
          "Rayob Engineering & Mgt. Co. Ltd operates with a strong culture of integrity, professionalism, and accountability. Clients can rely on honest communication, dependable delivery, and ethical business practices, making Rayob not just a contractor, but a trusted long-term project partner.",
        icon: "Handshake",
        order: 7,
      },
    ];

    content = await WhyRayob.create({
      reasons: defaultReasons,
    });
  }

  return content;
}

// UPDATE heading and subheading
export async function updateWhyRayobHeading(data) {
  await connectDB();

  let content = await WhyRayob.findOne();
  if (!content) {
    content = await WhyRayob.create(data);
  } else {
    if (data.heading) content.heading = data.heading;
    if (data.subheading) content.subheading = data.subheading;
    await content.save();
  }

  return content;
}

// CREATE new reason
export async function createReason(reasonData) {
  await connectDB();

  const newReason = {
    _id: new mongoose.Types.ObjectId(),
    ...reasonData,
  };

  let content = await WhyRayob.findOne();
  if (!content) {
    content = await WhyRayob.create({ reasons: [newReason] });
  } else {
    const nextId = Math.max(...content.reasons.map((r) => r.id || 0), 0) + 1;
    const maxOrder =
      content.reasons.length > 0
        ? Math.max(...content.reasons.map((r) => r.order || 0))
        : 0;

    newReason.id = nextId;
    newReason.order = maxOrder + 1;
    content.reasons.push(newReason);
    await content.save();
  }

  return newReason;
}

// UPDATE reason
export async function updateReason(reasonId, reasonData) {
  await connectDB();

  const content = await WhyRayob.findOne();
  if (!content) {
    throw new Error("WhyRayob content not found");
  }

  const reason = content.reasons.id(reasonId);
  if (!reason) {
    throw new Error("Reason not found");
  }

  if (reasonData.title) reason.title = reasonData.title;
  if (reasonData.description) reason.description = reasonData.description;
  if (reasonData.icon) reason.icon = reasonData.icon;

  await content.save();
  return reason;
}

// DELETE reason
export async function deleteReason(reasonId) {
  await connectDB();

  const content = await WhyRayob.findOne();
  if (!content) {
    throw new Error("WhyRayob content not found");
  }

  content.reasons.id(reasonId).deleteOne();
  await content.save();

  return { success: true };
}

// REORDER reasons
export async function reorderReasons(reorderedReasons) {
  await connectDB();

  const content = await WhyRayob.findOne();
  if (!content) {
    throw new Error("WhyRayob content not found");
  }

  // Update order for each reason
  reorderedReasons.forEach((item) => {
    const reason = content.reasons.id(item._id);
    if (reason) {
      reason.order = item.order;
      reason.id = item.id;
    }
  });

  await content.save();
  return content.reasons;
}

// UPDATE CTA content
export async function updateCTAContent(data) {
  await connectDB();

  let content = await WhyRayob.findOne();
  if (!content) {
    content = await WhyRayob.create(data);
  } else {
    if (data.ctaHeading) content.ctaHeading = data.ctaHeading;
    if (data.ctaDescription) content.ctaDescription = data.ctaDescription;
    if (data.ctaButton1) content.ctaButton1 = data.ctaButton1;
    if (data.ctaButton2) content.ctaButton2 = data.ctaButton2;
    await content.save();
  }

  return content;
}

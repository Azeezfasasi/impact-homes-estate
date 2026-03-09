import WelcomeCta from "../models/WelcomeCta";
import { connectDB } from "../db/connect.js";
import mongoose from "mongoose";

// GET WelcomeCta content
export async function getWelcomeCta() {
  await connectDB();
  let welcomeCta = await WelcomeCta.findOne();

  // Initialize with default content if doesn't exist
  if (!welcomeCta) {
    welcomeCta = await WelcomeCta.create({
      title: "Enjoy Free Investment Advisory Services",
      description:
        "Would you like to get started with investments in real estate? Our trained and well experienced Investment Advisors are willing to guide you on your journey to a profitable real estate investment",
      buttonLabel: "Speak with an Investment Advisor",
      stats: [
        {
          _id: new mongoose.Types.ObjectId(),
          icon: "🚀",
          number: "1000+",
          label: "Homes delivered",
          order: 0,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          icon: "🚀",
          number: "1,000,500+",
          label: "Square foot Developed",
          order: 1,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          icon: "🚀",
          number: "50+",
          label: "Experienced Professionals",
          order: 2,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          icon: "🚀",
          number: "10+",
          label: "Years of Progressive Excellence",
          order: 3,
        },
      ],
      active: true,
    });
  }

  return welcomeCta;
}

// UPDATE WelcomeCta main content
export async function updateWelcomeCta(data) {
  await connectDB();

  let welcomeCta = await WelcomeCta.findOne();

  if (!welcomeCta) {
    welcomeCta = await WelcomeCta.create(data);
  } else {
    welcomeCta.title = data.title || welcomeCta.title;
    welcomeCta.description = data.description || welcomeCta.description;
    welcomeCta.buttonLabel = data.buttonLabel || welcomeCta.buttonLabel;
    welcomeCta.active = data.active !== undefined ? data.active : welcomeCta.active;
    welcomeCta.updatedAt = new Date();

    if (data.stats) {
      welcomeCta.stats = data.stats;
    }

    await welcomeCta.save();
  }

  return welcomeCta;
}

// ADD stat
export async function addStat(statData) {
  await connectDB();

  let welcomeCta = await WelcomeCta.findOne();

  if (!welcomeCta) {
    welcomeCta = await WelcomeCta.create({ title: "Welcome CTA", stats: [] });
  }

  const newStat = {
    _id: new mongoose.Types.ObjectId(),
    icon: statData.icon || "🚀",
    number: statData.number,
    label: statData.label,
    order: welcomeCta.stats.length,
  };

  welcomeCta.stats.push(newStat);
  welcomeCta.updatedAt = new Date();
  await welcomeCta.save();

  return newStat;
}

// UPDATE stat
export async function updateStat(statId, statData) {
  await connectDB();

  let welcomeCta = await WelcomeCta.findOne();

  if (!welcomeCta) {
    throw new Error("WelcomeCta document not found");
  }

  const stat = welcomeCta.stats.find((s) => s._id.toString() === statId);

  if (!stat) {
    throw new Error("Stat not found");
  }

  stat.icon = statData.icon !== undefined ? statData.icon : stat.icon;
  stat.number = statData.number || stat.number;
  stat.label = statData.label || stat.label;
  welcomeCta.updatedAt = new Date();
  await welcomeCta.save();

  return stat;
}

// DELETE stat
export async function deleteStat(statId) {
  await connectDB();

  let welcomeCta = await WelcomeCta.findOne();

  if (!welcomeCta) {
    throw new Error("WelcomeCta document not found");
  }

  welcomeCta.stats = welcomeCta.stats.filter(
    (s) => s._id.toString() !== statId
  );

  // Reorder remaining stats
  welcomeCta.stats.forEach((stat, index) => {
    stat.order = index;
  });

  welcomeCta.updatedAt = new Date();
  await welcomeCta.save();

  return { success: true, message: "Stat deleted successfully" };
}

// REORDER stats
export async function reorderStats(statIds) {
  await connectDB();

  let welcomeCta = await WelcomeCta.findOne();

  if (!welcomeCta) {
    throw new Error("WelcomeCta document not found");
  }

  // Reorder based on provided order
  const reorderedStats = statIds
    .map((id, index) => {
      const stat = welcomeCta.stats.find((s) => s._id.toString() === id);
      if (stat) {
        stat.order = index;
      }
      return stat;
    })
    .filter(Boolean);

  welcomeCta.stats = reorderedStats;
  welcomeCta.updatedAt = new Date();
  await welcomeCta.save();

  return welcomeCta.stats;
}

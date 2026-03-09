import CompanyOverview from '../models/CompanyOverview.js';
import { connectDB } from '../db/connect.js';

const DEFAULT_COMPANY_OVERVIEW = {
  companyInfo: {
    title: 'Who We Are',
    image: '/images/fibre1.jpeg',
    paragraphs: [
      {
        text: 'Impact Homes Real Estate is a dynamic and forward-thinking company specializing in engineering excellence, telecommunications infrastructure development, and strategic project delivery across Africa.',
        order: 0,
      },
      {
        text: 'Founded by a visionary Chairman/CEO with over 20 years of experience in real estate and property development, we are committed to delivering innovative solutions that drive progress and create lasting value for our clients and communities.',
        order: 1,
      },
      {
        text: 'Our team of highly skilled professionals combines technical expertise with a customer-centric approach, ensuring that every project we undertake is executed with precision, integrity, and a focus on exceeding expectations.',
        order: 2,
      },
      {
        text: 'Our goal: To be the leading real estate company in Africa, known for our commitment to quality, innovation, and sustainable development.',
        order: 3,
      },
    ],
  },
  vision: {
    title: 'Our Vision',
    description: 'To be a Globally Recognized Leader in Real Estate and Property Development.',
  },
  mission: {
    title: 'Our Mission',
    description: 'To Provide Superior Real Estate and Property Development Services Using Modern Technology, Professional Expertise, and a Commitment to Quality, Safety, and Customer Satisfaction.',
  },
  coreValues: [
    { name: 'Excellence', description: 'We deliver superior outcomes in every project.', color: 'indigo', order: 0 },
    { name: 'Integrity', description: 'Ethical, transparent, and trustworthy operations.', color: 'blue', order: 1 },
    { name: 'Innovation', description: 'Smart, modern, technology-driven solutions.', color: 'green', order: 2 },
    { name: 'Professionalism', description: 'High standards, certified competence, quality delivery.', color: 'yellow', order: 3 },
    { name: 'Customer-centric', description: 'Solutions tailored to each client\'s needs.', color: 'pink', order: 4 },
  ],
};

export async function getCompanyOverview() {
  try {
    await connectDB();

    let overviewData = await CompanyOverview.findOne();

    if (!overviewData) {
      overviewData = await CompanyOverview.create(DEFAULT_COMPANY_OVERVIEW);
    }

    return {
      success: true,
      data: overviewData,
    };
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateCompanyOverview(updateData) {
  try {
    await connectDB();

    let overviewData = await CompanyOverview.findOne();

    if (!overviewData) {
      overviewData = await CompanyOverview.create(DEFAULT_COMPANY_OVERVIEW);
    }

    // Update fields
    if (updateData.companyInfo) {
      overviewData.companyInfo = updateData.companyInfo;
    }
    if (updateData.vision) {
      overviewData.vision = updateData.vision;
    }
    if (updateData.mission) {
      overviewData.mission = updateData.mission;
    }
    if (updateData.coreValues) {
      overviewData.coreValues = updateData.coreValues;
    }

    overviewData.updatedAt = new Date();
    await overviewData.save();

    return {
      success: true,
      data: overviewData,
    };
  } catch (error) {
    console.error('Error updating company overview:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateCompanyInfo(companyInfoData) {
  try {
    await connectDB();

    let overviewData = await CompanyOverview.findOne();
    if (!overviewData) {
      overviewData = await CompanyOverview.create(DEFAULT_COMPANY_OVERVIEW);
    }

    overviewData.companyInfo = companyInfoData;
    overviewData.updatedAt = new Date();
    await overviewData.save();

    return {
      success: true,
      data: overviewData,
    };
  } catch (error) {
    console.error('Error updating company info:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateVision(visionData) {
  try {
    await connectDB();

    let overviewData = await CompanyOverview.findOne();
    if (!overviewData) {
      overviewData = await CompanyOverview.create(DEFAULT_COMPANY_OVERVIEW);
    }

    overviewData.vision = visionData;
    overviewData.updatedAt = new Date();
    await overviewData.save();

    return {
      success: true,
      data: overviewData,
    };
  } catch (error) {
    console.error('Error updating vision:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateMission(missionData) {
  try {
    await connectDB();

    let overviewData = await CompanyOverview.findOne();
    if (!overviewData) {
      overviewData = await CompanyOverview.create(DEFAULT_COMPANY_OVERVIEW);
    }

    overviewData.mission = missionData;
    overviewData.updatedAt = new Date();
    await overviewData.save();

    return {
      success: true,
      data: overviewData,
    };
  } catch (error) {
    console.error('Error updating mission:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateCoreValues(coreValuesData) {
  try {
    await connectDB();

    let overviewData = await CompanyOverview.findOne();
    if (!overviewData) {
      overviewData = await CompanyOverview.create(DEFAULT_COMPANY_OVERVIEW);
    }

    overviewData.coreValues = coreValuesData;
    overviewData.updatedAt = new Date();
    await overviewData.save();

    return {
      success: true,
      data: overviewData,
    };
  } catch (error) {
    console.error('Error updating core values:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

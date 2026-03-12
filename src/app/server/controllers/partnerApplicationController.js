import PartnerApplication from '../models/PartnerApplication.js';
import { connectDB } from '../db/connect.js';

export async function createPartnerApplication(applicationData) {
  try {
    await connectDB();

    const application = await PartnerApplication.create({
      ...applicationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      data: application,
      message: 'Application submitted successfully',
    };
  } catch (error) {
    console.error('Error creating partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to create application',
    };
  }
}

export async function getAllPartnerApplications(filters = {}) {
  try {
    await connectDB();

    const query = {};
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;

    const applications = await PartnerApplication.find(query)
      .sort({ createdAt: -1 });

    return {
      success: true,
      applications: applications,
    };
  } catch (error) {
    console.error('Error fetching partner applications:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch applications',
    };
  }
}

export async function getPartnerApplication(applicationId) {
  try {
    await connectDB();

    const application = await PartnerApplication.findById(applicationId);

    if (!application) {
      return {
        success: false,
        error: 'Application not found',
      };
    }

    return {
      success: true,
      data: application,
    };
  } catch (error) {
    console.error('Error fetching partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch application',
    };
  }
}

export async function updatePartnerApplicationStatus(applicationId, status, notes = '') {
  try {
    await connectDB();

    const application = await PartnerApplication.findByIdAndUpdate(
      applicationId,
      {
        status,
        notes,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!application) {
      return {
        success: false,
        error: 'Application not found',
      };
    }

    return {
      success: true,
      data: application,
      message: 'Application status updated',
    };
  } catch (error) {
    console.error('Error updating partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to update application',
    };
  }
}

export async function deletePartnerApplication(applicationId) {
  try {
    await connectDB();

    const application = await PartnerApplication.findByIdAndDelete(applicationId);

    if (!application) {
      return {
        success: false,
        error: 'Application not found',
      };
    }

    return {
      success: true,
      message: 'Application deleted',
    };
  } catch (error) {
    console.error('Error deleting partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete application',
    };
  }
}

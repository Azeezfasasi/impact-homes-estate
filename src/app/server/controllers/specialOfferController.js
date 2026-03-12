import SpecialOffer from '../models/SpecialOffer.js';
import { connectDB } from '../db/connect.js';

export async function createSpecialOffer(offerData) {
  try {
    await connectDB();

    const offer = await SpecialOffer.create({
      ...offerData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      data: offer,
      message: 'Special offer created successfully',
    };
  } catch (error) {
    console.error('Error creating special offer:', error);
    return {
      success: false,
      error: error.message || 'Failed to create special offer',
    };
  }
}

export async function getAllSpecialOffers(filters = {}) {
  try {
    await connectDB();

    const query = {};
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.featured !== undefined) query.featured = filters.featured;

    const offers = await SpecialOffer.find(query).sort({ createdAt: -1 });

    return {
      success: true,
      offers: offers,
    };
  } catch (error) {
    console.error('Error fetching special offers:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch special offers',
    };
  }
}

export async function getSpecialOffer(offerId) {
  try {
    await connectDB();

    const offer = await SpecialOffer.findById(offerId);

    if (!offer) {
      return {
        success: false,
        error: 'Special offer not found',
      };
    }

    return {
      success: true,
      data: offer,
    };
  } catch (error) {
    console.error('Error fetching special offer:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch special offer',
    };
  }
}

export async function updateSpecialOffer(offerId, updateData) {
  try {
    await connectDB();

    const offer = await SpecialOffer.findByIdAndUpdate(
      offerId,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!offer) {
      return {
        success: false,
        error: 'Special offer not found',
      };
    }

    return {
      success: true,
      data: offer,
      message: 'Special offer updated successfully',
    };
  } catch (error) {
    console.error('Error updating special offer:', error);
    return {
      success: false,
      error: error.message || 'Failed to update special offer',
    };
  }
}

export async function deleteSpecialOffer(offerId) {
  try {
    await connectDB();

    const offer = await SpecialOffer.findByIdAndDelete(offerId);

    if (!offer) {
      return {
        success: false,
        error: 'Special offer not found',
      };
    }

    return {
      success: true,
      message: 'Special offer deleted',
    };
  } catch (error) {
    console.error('Error deleting special offer:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete special offer',
    };
  }
}

import Property from '../models/Property.js';
import { connectDB } from '../../../utils/db.js';

// Helper function to connect to database
const ensureDBConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

// Get all properties with filtering and pagination
export const getAllProperties = async (req, res) => {
  try {
    await ensureDBConnection();

    const {
      page = 1,
      limit = 10,
      status,
      propertyType,
      category,
      minPrice,
      maxPrice,
      city,
      state,
      sortBy = 'dateListed',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (status) filter.status = status;
    if (propertyType) filter.propertyType = propertyType;
    if (category) filter.category = category;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (state) filter['address.state'] = new RegExp(state, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const properties = await Property.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProperties: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// Get single property by ID
export const getPropertyById = async (req, res) => {
  try {
    await ensureDBConnection();

    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

// Create new property
export const createProperty = async (req, res) => {
  try {
    await ensureDBConnection();

    const propertyData = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'price', 'propertyType', 'status', 'category', 'address'];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate address fields
    const addressFields = ['street', 'city', 'state', 'zipCode'];
    for (const field of addressFields) {
      if (!propertyData.address[field]) {
        return res.status(400).json({
          success: false,
          message: `Address ${field} is required`
        });
      }
    }

    // Validate agent fields
    if (!propertyData.agent || !propertyData.agent.name || !propertyData.agent.email || !propertyData.agent.phone) {
      return res.status(400).json({
        success: false,
        message: 'Agent information is required'
      });
    }

    const property = new Property(propertyData);
    const savedProperty = await property.save();

    res.status(201).json({
      success: true,
      data: savedProperty,
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Error creating property:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    await ensureDBConnection();

    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;

    const property = await Property.findByIdAndUpdate(
      id,
      { ...updateData, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('Error updating property:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

// Delete property (soft delete by setting isActive to false)
export const deleteProperty = async (req, res) => {
  try {
    await ensureDBConnection();

    const { id } = req.params;

    const property = await Property.findByIdAndUpdate(
      id,
      { isActive: false, lastUpdated: new Date() },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

// Get property statistics
export const getPropertyStats = async (req, res) => {
  try {
    await ensureDBConnection();

    const stats = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          availableProperties: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          soldProperties: {
            $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] }
          },
          rentedProperties: {
            $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] }
          },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const propertyTypes = await Property.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProperties: 0,
          availableProperties: 0,
          soldProperties: 0,
          rentedProperties: 0,
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0
        },
        propertyTypes
      }
    });
  } catch (error) {
    console.error('Error fetching property stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property statistics',
      error: error.message
    });
  }
};

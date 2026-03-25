import { NextResponse } from 'next/server';
import Property from '../../server/models/Property.js';
import { connectDB } from '../../../utils/db.js';

// Helper function to connect to database
const ensureDBConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

// GET /api/property - Get all properties with filtering
export async function GET(request) {
  try {
    await ensureDBConnection();

    const { searchParams } = new URL(request.url);
    const stats = searchParams.get('stats');

    if (stats === 'true') {
      // Return statistics
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

      return NextResponse.json({
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
    }

    // Regular property listing
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const propertyType = searchParams.get('propertyType');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'dateListed';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter = { isActive: true };

    if (status) filter.status = status;
    if (propertyType) filter.propertyType = propertyType;
    if (category) filter.category = category;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (state) filter['address.state'] = new RegExp(state, 'i');
    if (featured === 'true') filter.isFeatured = true;
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

    return NextResponse.json({
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
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/property - Create new property
export async function POST(request) {
  try {
    await ensureDBConnection();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'status', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          message: `${field} is required`
        }, { status: 400 });
      }
    }

    // Validate address fields
    // const addressFields = ['street', 'city', 'state', 'zipCode'];
    // for (const field of addressFields) {
    //   if (!body.address[field]) {
    //     return NextResponse.json({
    //       success: false,
    //       message: `Address ${field} is required`
    //     }, { status: 400 });
    //   }
    // }

    // Validate agent fields
    // if (!body.agent || !body.agent.name || !body.agent.email || !body.agent.phone) {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Agent information is required'
    //   }, { status: 400 });
    // }

    const property = new Property(body);
    const savedProperty = await property.save();

    return NextResponse.json({
      success: true,
      data: savedProperty,
      message: 'Property created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors
      }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

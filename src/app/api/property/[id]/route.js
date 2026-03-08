import { NextResponse } from 'next/server';
import Property from '../../../server/models/Property.js';
import { connectDB } from '../../../../utils/db.js';

// Helper function to connect to database
const ensureDBConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

// GET /api/property/[id] - Get single property
export async function GET(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;

    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json({
        success: false,
        message: 'Property not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/property/[id] - Update property
export async function PUT(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    delete body._id;
    delete body.createdAt;

    const property = await Property.findByIdAndUpdate(
      id,
      { ...body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!property) {
      return NextResponse.json({
        success: false,
        message: 'Property not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });
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

// DELETE /api/property/[id] - Delete property
export async function DELETE(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;

    const property = await Property.findByIdAndUpdate(
      id,
      { isActive: false, lastUpdated: new Date() },
      { new: true }
    );

    if (!property) {
      return NextResponse.json({
        success: false,
        message: 'Property not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
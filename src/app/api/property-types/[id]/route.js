import { NextResponse } from 'next/server';
import PropertyType from '@/app/server/models/PropertyType';
import { connectDB } from '@/utils/db.js';

// Helper function to connect to database
const ensureDBConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

// PUT /api/property-types/[id] - Update a property type
export async function PUT(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;
    const body = await request.json();
    const { name, description, icon } = body;

    // Find the property type
    const propertyType = await PropertyType.findOne({ id });
    if (!propertyType) {
      return NextResponse.json({
        error: 'Property type not found'
      }, { status: 404 });
    }

    // Update fields
    if (name) propertyType.name = name;
    if (description !== undefined) propertyType.description = description;
    if (icon) propertyType.icon = icon;

    const updatedPropertyType = await propertyType.save();

    return NextResponse.json({
      success: true,
      data: updatedPropertyType
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update property type', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/property-types/[id] - Delete a property type
export async function DELETE(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;

    // Find the property type
    const propertyType = await PropertyType.findOne({ id });
    if (!propertyType) {
      return NextResponse.json({
        error: 'Property type not found'
      }, { status: 404 });
    }

    // Prevent deletion of default property types
    if (propertyType.isDefault) {
      return NextResponse.json({
        error: 'Cannot delete default property types'
      }, { status: 400 });
    }

    await PropertyType.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: 'Property type deleted successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete property type', message: error.message },
      { status: 500 }
    );
  }
}

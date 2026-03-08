import { NextResponse } from 'next/server';
import Feature from '@/app/server/models/Feature';
import { connectDB } from '@/utils/db.js';

// Helper function to connect to database
const ensureDBConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

// PUT /api/features/[id] - Update a feature
export async function PUT(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;
    const body = await request.json();
    const { name, description, category, icon } = body;

    // Find the feature
    const feature = await Feature.findOne({ id });
    if (!feature) {
      return NextResponse.json({
        error: 'Feature not found'
      }, { status: 404 });
    }

    // Update fields
    if (name) feature.name = name;
    if (description !== undefined) feature.description = description;
    if (category) feature.category = category;
    if (icon) feature.icon = icon;

    const updatedFeature = await feature.save();

    return NextResponse.json({
      success: true,
      data: updatedFeature
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update feature', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/features/[id] - Delete a feature
export async function DELETE(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;

    // Find the feature
    const feature = await Feature.findOne({ id });
    if (!feature) {
      return NextResponse.json({
        error: 'Feature not found'
      }, { status: 404 });
    }

    // Prevent deletion of default features
    if (feature.isDefault) {
      return NextResponse.json({
        error: 'Cannot delete default features'
      }, { status: 400 });
    }

    await Feature.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: 'Feature deleted successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature', message: error.message },
      { status: 500 }
    );
  }
}

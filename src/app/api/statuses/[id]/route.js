import { NextResponse } from 'next/server';
import Status from '@/app/server/models/Status';
import { connectDB } from '@/utils/db.js';

// Helper function to connect to database
const ensureDBConnection = async () => {
  try {
    await connectDB();
  } catch (error) {
    throw new Error('Database connection failed');
  }
};

// PUT /api/statuses/[id] - Update a status
export async function PUT(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;
    const body = await request.json();
    const { name, description, color } = body;

    // Find the status
    const status = await Status.findOne({ id });
    if (!status) {
      return NextResponse.json({
        error: 'Status not found'
      }, { status: 404 });
    }

    // Prevent modification of certain default fields
    if (status.isDefault && !name && !description && !color) {
      return NextResponse.json({
        error: 'Cannot modify default status without changes'
      }, { status: 400 });
    }

    // Update fields
    if (name) status.name = name;
    if (description !== undefined) status.description = description;
    if (color) status.color = color;

    const updatedStatus = await status.save();

    return NextResponse.json({
      success: true,
      data: updatedStatus
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update status', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/statuses/[id] - Delete a status
export async function DELETE(request, { params }) {
  try {
    await ensureDBConnection();

    const { id } = await params;

    // Find the status
    const status = await Status.findOne({ id });
    if (!status) {
      return NextResponse.json({
        error: 'Status not found'
      }, { status: 404 });
    }

    // Prevent deletion of default statuses
    if (status.isDefault) {
      return NextResponse.json({
        error: 'Cannot delete default statuses'
      }, { status: 400 });
    }

    await Status.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: 'Status deleted successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete status', message: error.message },
      { status: 500 }
    );
  }
}

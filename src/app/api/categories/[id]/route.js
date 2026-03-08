import { NextResponse } from 'next/server';
import Category from '@/app/server/models/Category';
import { connectDB } from '@/utils/db';

// PUT /api/categories/[id] - Update category
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    // Prevent changing isDefault flag
    if (body.hasOwnProperty('isDefault')) {
      delete body.isDefault;
    }

    const category = await Category.findOneAndUpdate(
      { id: id.toLowerCase() },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('API Error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // Prevent deleting default categories
    const category = await Category.findOne({ id: id.toLowerCase() });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    if (category.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete default categories' },
        { status: 403 }
      );
    }

    await Category.findOneAndDelete({ id: id.toLowerCase() });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

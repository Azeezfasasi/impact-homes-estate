import { NextResponse } from 'next/server';
import Category from '@/app/server/models/Category';
import { connectDB } from '@/utils/db';

const DEFAULT_CATEGORIES = [
  { id: 'residential', name: 'Residential', description: 'Houses, apartments, and condos for living', color: 'bg-blue-100 text-blue-800', isDefault: true },
  { id: 'commercial', name: 'Commercial', description: 'Office spaces, retail locations, and business properties', color: 'bg-green-100 text-green-800', isDefault: true },
  { id: 'industrial', name: 'Industrial', description: 'Warehouses, factories, and industrial facilities', color: 'bg-orange-100 text-orange-800', isDefault: true },
  { id: 'land', name: 'Land', description: 'Vacant land and lots for development', color: 'bg-yellow-100 text-yellow-800', isDefault: true },
  { id: 'investment', name: 'Investment', description: 'Properties for investment and rental income', color: 'bg-purple-100 text-purple-800', isDefault: true }
];

async function ensureDefaultCategories() {
  try {
    for (const defaultCat of DEFAULT_CATEGORIES) {
      const exists = await Category.findOne({ id: defaultCat.id });
      if (!exists) {
        await Category.create(defaultCat);
      }
    }
  } catch (error) {
    console.error('Error creating default categories:', error);
  }
}

// GET /api/categories - Get all categories
export async function GET(request) {
  try {
    await connectDB();

    // Ensure default categories exist
    await ensureDefaultCategories();

    const categories = await Category.find().sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.name || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, description' },
        { status: 400 }
      );
    }

    // Check if category ID already exists
    const existingCategory = await Category.findOne({ id: body.id.toLowerCase() });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category ID already exists' },
        { status: 409 }
      );
    }

    const category = new Category({
      id: body.id.toLowerCase(),
      name: body.name,
      description: body.description,
      color: body.color || 'bg-gray-100 text-gray-800',
      isDefault: false
    });

    await category.save();

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Category created successfully'
      },
      { status: 201 }
    );
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

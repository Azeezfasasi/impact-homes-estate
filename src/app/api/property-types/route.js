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

// Default property types to seed
const DEFAULT_PROPERTY_TYPES = [
  {
    id: 'house',
    name: 'House',
    description: 'Single-family home or detached house',
    icon: 'home',
    isDefault: true
  },
  {
    id: 'apartment',
    name: 'Apartment',
    description: 'Multi-unit residential building unit',
    icon: 'building',
    isDefault: true
  },
  {
    id: 'condo',
    name: 'Condo',
    description: 'Condominium unit with shared amenities',
    icon: 'building-2',
    isDefault: true
  },
  {
    id: 'townhouse',
    name: 'Townhouse',
    description: 'Multi-story residential property',
    icon: 'house',
    isDefault: true
  },
  {
    id: 'land',
    name: 'Land',
    description: 'Vacant land or buildable lot',
    icon: 'tree',
    isDefault: true
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Commercial office or retail space',
    icon: 'briefcase',
    isDefault: true
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Other property type',
    icon: 'help-circle',
    isDefault: true
  }
];

// Helper to seed default property types
const seedDefaultPropertyTypes = async () => {
  try {
    const existingCount = await PropertyType.countDocuments();
    if (existingCount === 0) {
      await PropertyType.insertMany(DEFAULT_PROPERTY_TYPES);
      console.log('Default property types seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding property types:', error);
  }
};

// GET /api/property-types - Get all property types
export async function GET(request) {
  try {
    await ensureDBConnection();

    // Seed defaults if no property types exist
    await seedDefaultPropertyTypes();

    const propertyTypes = await PropertyType.find().sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: propertyTypes
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property types', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/property-types - Create a new property type
export async function POST(request) {
  try {
    await ensureDBConnection();

    const body = await request.json();
    const { id, name, description, icon } = body;

    // Validation
    if (!id || !name) {
      return NextResponse.json({
        error: 'Property Type ID and name are required'
      }, { status: 400 });
    }

    // Check if property type already exists
    const existingPropertyType = await PropertyType.findOne({ id: id.toLowerCase() });
    if (existingPropertyType) {
      return NextResponse.json({
        error: 'A property type with this ID already exists'
      }, { status: 400 });
    }

    const newPropertyType = new PropertyType({
      id: id.toLowerCase(),
      name,
      description: description || '',
      icon: icon || 'home',
      isDefault: false
    });

    const savedPropertyType = await newPropertyType.save();

    // Dispatch event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('propertyTypes:updated', { detail: savedPropertyType }));
    }

    return NextResponse.json({
      success: true,
      data: savedPropertyType
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create property type', message: error.message },
      { status: 500 }
    );
  }
}

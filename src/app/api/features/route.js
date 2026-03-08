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

// Default features to seed
const DEFAULT_FEATURES = [
  {
    id: 'swimming-pool',
    name: 'Swimming Pool',
    description: 'In-ground or above-ground swimming pool',
    category: 'outdoor',
    icon: 'droplet',
    isDefault: true
  },
  {
    id: 'garage',
    name: 'Garage',
    description: 'Attached or detached garage',
    category: 'outdoor',
    icon: 'car',
    isDefault: true
  },
  {
    id: 'garden',
    name: 'Garden',
    description: 'Landscaped garden or yard',
    category: 'outdoor',
    icon: 'leaf',
    isDefault: true
  },
  {
    id: 'air-conditioning',
    name: 'Air Conditioning',
    description: 'Central or window air conditioning',
    category: 'utilities',
    icon: 'wind',
    isDefault: true
  },
  {
    id: 'heating',
    name: 'Heating System',
    description: 'Central heating or furnace',
    category: 'utilities',
    icon: 'flame',
    isDefault: true
  },
  {
    id: 'security-system',
    name: 'Security System',
    description: 'Alarm system and surveillance',
    category: 'security',
    icon: 'shield',
    isDefault: true
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    description: 'Wood-burning or gas fireplace',
    category: 'indoor',
    icon: 'flame',
    isDefault: true
  },
  {
    id: 'hardwood-floors',
    name: 'Hardwood Floors',
    description: 'Hardwood or engineered wood flooring',
    category: 'indoor',
    icon: 'home',
    isDefault: true
  },
  {
    id: 'basement',
    name: 'Basement',
    description: 'Finished or unfinished basement',
    category: 'indoor',
    icon: 'layers',
    isDefault: true
  },
  {
    id: 'patio',
    name: 'Patio',
    description: 'Outdoor patio or deck',
    category: 'outdoor',
    icon: 'home',
    isDefault: true
  }
];

// Helper to seed default features
const seedDefaultFeatures = async () => {
  try {
    const existingCount = await Feature.countDocuments();
    if (existingCount === 0) {
      await Feature.insertMany(DEFAULT_FEATURES);
      console.log('Default features seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding features:', error);
  }
};

// GET /api/features - Get all features
export async function GET(request) {
  try {
    await ensureDBConnection();

    // Seed defaults if no features exist
    await seedDefaultFeatures();

    const features = await Feature.find().sort({ category: 1, createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: features
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/features - Create a new feature
export async function POST(request) {
  try {
    await ensureDBConnection();

    const body = await request.json();
    const { id, name, description, category, icon } = body;

    // Validation
    if (!id || !name) {
      return NextResponse.json({
        error: 'Feature ID and name are required'
      }, { status: 400 });
    }

    // Check if feature already exists
    const existingFeature = await Feature.findOne({ id: id.toLowerCase() });
    if (existingFeature) {
      return NextResponse.json({
        error: 'A feature with this ID already exists'
      }, { status: 400 });
    }

    const newFeature = new Feature({
      id: id.toLowerCase(),
      name,
      description: description || '',
      category: category || 'amenities',
      icon: icon || 'star',
      isDefault: false
    });

    const savedFeature = await newFeature.save();

    // Dispatch event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('propertyFeatures:updated', { detail: savedFeature }));
    }

    return NextResponse.json({
      success: true,
      data: savedFeature
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create feature', message: error.message },
      { status: 500 }
    );
  }
}

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

// Default statuses to seed
const DEFAULT_STATUSES = [
  {
    id: 'available',
    name: 'Available',
    description: 'Property is available for sale or rent',
    color: '#10b981',
    isDefault: true
  },
  {
    id: 'sold',
    name: 'Sold',
    description: 'Property has been sold',
    color: '#ef4444',
    isDefault: true
  },
  {
    id: 'rented',
    name: 'Rented',
    description: 'Property is currently rented',
    color: '#3b82f6',
    isDefault: true
  },
  {
    id: 'pending',
    name: 'Pending',
    description: 'Sale or rental is pending',
    color: '#f59e0b',
    isDefault: true
  },
  {
    id: 'off-market',
    name: 'Off Market',
    description: 'Property is off the market',
    color: '#8b5cf6',
    isDefault: true
  }
];

// Helper to seed default statuses
const seedDefaultStatuses = async () => {
  try {
    const existingCount = await Status.countDocuments();
    if (existingCount === 0) {
      await Status.insertMany(DEFAULT_STATUSES);
      console.log('Default statuses seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding statuses:', error);
  }
};

// GET /api/statuses - Get all statuses
export async function GET(request) {
  try {
    await ensureDBConnection();

    // Seed defaults if no statuses exist
    await seedDefaultStatuses();

    const statuses = await Status.find().sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statuses', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/statuses - Create a new status
export async function POST(request) {
  try {
    await ensureDBConnection();

    const body = await request.json();
    const { id, name, description, color } = body;

    // Validation
    if (!id || !name) {
      return NextResponse.json({
        error: 'Status ID and name are required'
      }, { status: 400 });
    }

    // Check if status already exists
    const existingStatus = await Status.findOne({ id: id.toLowerCase() });
    if (existingStatus) {
      return NextResponse.json({
        error: 'A status with this ID already exists'
      }, { status: 400 });
    }

    const newStatus = new Status({
      id: id.toLowerCase(),
      name,
      description: description || '',
      color: color || '#6366f1',
      isDefault: false
    });

    const savedStatus = await newStatus.save();

    // Dispatch event for real-time updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('propertyStatuses:updated', { detail: savedStatus }));
    }

    return NextResponse.json({
      success: true,
      data: savedStatus
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to create status', message: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Brochure from '@/app/server/models/Brochure';
import { uploadToCloudinary, deleteFromCloudinary } from '@/app/server/utils/cloudinaryService';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (featured) query.featured = true;

    const brochures = await Brochure.find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ featured: -1, displayOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Brochure.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: brochures,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching brochures:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const { file, fileName, title, description, category, tags, uploadedBy } = await request.json();

    if (!file || !fileName || !title || !uploadedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: file, fileName, title, uploadedBy' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file, 'brochures');

    // Create brochure document
    const brochure = new Brochure({
      title,
      description: description || '',
      category: category || 'general',
      fileName,
      fileSize: file.length || 0,
      pdfUrl: cloudinaryResult.url,
      publicId: cloudinaryResult.publicId,
      uploadedBy,
      tags: tags || [],
    });

    await brochure.save();
    await brochure.populate('uploadedBy', 'firstName lastName email');

    return NextResponse.json(
      {
        success: true,
        message: 'Brochure uploaded successfully',
        data: brochure,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading brochure:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

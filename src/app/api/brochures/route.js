import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Brochure from '@/app/server/models/Brochure';
import User from '@/app/server/models/User';
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

    // Validate file extension
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file is actually a PDF by checking magic bytes
    // PDF files start with %PDF signature
    let fileData;
    if (file.startsWith('data:')) {
      // It's a data URL, extract the base64 part
      const base64 = file.split(',')[1];
      const buffer = Buffer.from(base64, 'base64');
      fileData = buffer;
    } else {
      // Assume it's base64
      fileData = Buffer.from(file, 'base64');
    }

    // Log the magic bytes for debugging
    console.log(`Validating file: ${fileName}`);
    console.log(`First 4 bytes: 0x${fileData[0]?.toString(16).toUpperCase()} 0x${fileData[1]?.toString(16).toUpperCase()} 0x${fileData[2]?.toString(16).toUpperCase()} 0x${fileData[3]?.toString(16).toUpperCase()}`);

    // Check PDF magic bytes: %PDF (0x25 0x50 0x44 0x46)
    const isPDF = fileData[0] === 0x25 && fileData[1] === 0x50 && fileData[2] === 0x44 && fileData[3] === 0x46;
    
    if (!isPDF) {
      console.error(`❌ File validation FAILED for ${fileName}. Magic bytes do not match PDF signature.`);
      
      // Show what we detected
      let detectedType = 'Unknown';
      if (fileData[0] === 0x89 && fileData[1] === 0x50 && fileData[2] === 0x4E && fileData[3] === 0x47) {
        detectedType = 'PNG Image';
      } else if (fileData[0] === 0xFF && fileData[1] === 0xD8 && fileData[2] === 0xFF) {
        detectedType = 'JPEG Image';
      } else if (fileData[0] === 0x42 && fileData[1] === 0x4D) {
        detectedType = 'BMP Image';
      } else if (fileData[0] === 0x47 && fileData[1] === 0x49 && fileData[2] === 0x46) {
        detectedType = 'GIF Image';
      }
      
      return NextResponse.json(
        { success: false, error: `File is not a valid PDF. Detected file type: ${detectedType}. Please upload a real PDF file, not an image or document that's been renamed.` },
        { status: 400 }
      );
    }

    console.log(`✅ File validation PASSED for ${fileName}`);

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

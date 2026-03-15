import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Brochure from '@/app/server/models/Brochure';
import User from '@/app/server/models/User';
import { deleteFromCloudinary, uploadToCloudinary } from '@/app/server/utils/cloudinaryService';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const brochure = await Brochure.findById(id).populate('uploadedBy', 'firstName lastName email');

    if (!brochure) {
      return NextResponse.json(
        { success: false, error: 'Brochure not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: brochure,
    });
  } catch (error) {
    console.error('Error fetching brochure:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const brochure = await Brochure.findById(id);

    if (!brochure) {
      return NextResponse.json(
        { success: false, error: 'Brochure not found' },
        { status: 404 }
      );
    }

    const { title, description, category, featured, status, displayOrder, tags, version, file, fileName } = await request.json();

    // If new file is provided, delete old one and upload new one
    if (file && fileName) {
      try {
        await deleteFromCloudinary(brochure.publicId);
      } catch (delError) {
        console.error('Error deleting old file from Cloudinary:', delError);
      }

      const cloudinaryResult = await uploadToCloudinary(file, 'brochures');
      brochure.pdfUrl = cloudinaryResult.url;
      brochure.publicId = cloudinaryResult.publicId;
      brochure.fileName = fileName;
      brochure.fileSize = file.length || 0;
    }

    // Update other fields
    if (title !== undefined) brochure.title = title;
    if (description !== undefined) brochure.description = description;
    if (category !== undefined) brochure.category = category;
    if (featured !== undefined) brochure.featured = featured;
    if (status !== undefined) brochure.status = status;
    if (displayOrder !== undefined) brochure.displayOrder = displayOrder;
    if (tags !== undefined) brochure.tags = tags;
    if (version !== undefined) brochure.version = version;

    await brochure.save();
    await brochure.populate('uploadedBy', 'firstName lastName email');

    return NextResponse.json({
      success: true,
      message: 'Brochure updated successfully',
      data: brochure,
    });
  } catch (error) {
    console.error('Error updating brochure:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const brochure = await Brochure.findById(id);

    if (!brochure) {
      return NextResponse.json(
        { success: false, error: 'Brochure not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(brochure.publicId);
    } catch (delError) {
      console.error('Error deleting from Cloudinary:', delError);
    }

    await Brochure.deleteOne({ _id: id });

    return NextResponse.json({
      success: true,
      message: 'Brochure deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting brochure:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

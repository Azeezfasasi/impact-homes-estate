import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Brochure from '@/app/server/models/Brochure';

export async function POST(request, { params }) {
  try {
    await connectDB();

    const brochure = await Brochure.findByIdAndUpdate(
      params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!brochure) {
      return NextResponse.json(
        { success: false, error: 'Brochure not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Download count updated',
      downloadCount: brochure.downloadCount,
    });
  } catch (error) {
    console.error('Error updating download count:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

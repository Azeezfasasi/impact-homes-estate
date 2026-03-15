import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Brochure from '@/app/server/models/Brochure';

export async function GET(request, { params }) {
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

    // Check if the PDF URL is valid
    if (!brochure.pdfUrl) {
      return NextResponse.json(
        { success: false, error: 'No PDF URL found for this brochure' },
        { status: 400 }
      );
    }

    console.log('Fetching PDF from URL:', brochure.pdfUrl);

    // Fetch the PDF from Cloudinary with better error handling
    let pdfResponse;
    try {
      pdfResponse = await fetch(brochure.pdfUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
    } catch (fetchError) {
      console.error('Failed to fetch PDF from URL:', brochure.pdfUrl, fetchError);
      return NextResponse.json(
        { success: false, error: `Failed to access PDF: ${fetchError.message}` },
        { status: 500 }
      );
    }

    console.log('PDF Response Status:', pdfResponse.status);
    console.log('PDF Response Content-Type:', pdfResponse.headers.get('content-type'));

    if (!pdfResponse.ok) {
      console.error(`PDF fetch returned status ${pdfResponse.status}`, brochure.pdfUrl);
      return NextResponse.json(
        { success: false, error: `Failed to fetch PDF from storage (status: ${pdfResponse.status})` },
        { status: 500 }
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Verify buffer is not empty
    if (pdfBuffer.byteLength === 0) {
      console.error('Downloaded PDF is empty');
      return NextResponse.json(
        { success: false, error: 'Downloaded PDF file is empty' },
        { status: 500 }
      );
    }

    // Check if it's actually a PDF by checking magic bytes
    const view = new Uint8Array(pdfBuffer);
    const isPDF = view[0] === 0x25 && view[1] === 0x50 && view[2] === 0x44 && view[3] === 0x46; // %PDF
    
    console.log('First 4 bytes:', Array.from(view.slice(0, 4)).map(b => '0x' + b.toString(16).toUpperCase()).join(' '));
    console.log('Is PDF:', isPDF);
    console.log('Buffer size:', pdfBuffer.byteLength);
    
    if (!isPDF) {
      // Log what we actually got
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const firstChars = textDecoder.decode(view.slice(0, 200));
      console.error('Downloaded file is not a valid PDF. First 200 chars:', firstChars);
      
      return NextResponse.json(
        { success: false, error: 'Downloaded file is not a valid PDF. Check server logs.', preview: firstChars.substring(0, 100) },
        { status: 500 }
      );
    }

    // Return PDF with proper headers for download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Content-Disposition': `attachment; filename="${brochure.fileName || brochure.title}.pdf"`,
        'Cache-Control': 'public, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error downloading brochure:', error);
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const brochure = await Brochure.findByIdAndUpdate(
      id,
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

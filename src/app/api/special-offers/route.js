import { NextResponse } from 'next/server';
import {
  createSpecialOffer,
  getAllSpecialOffers,
  getSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
} from '@/app/server/controllers/specialOfferController';

// POST - Create new special offer
export async function POST(req) {
  try {
    const body = await req.json();
    const result = await createSpecialOffer(body);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Fetch special offers
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const isActive = searchParams.get('isActive');
    const featured = searchParams.get('featured');

    if (id) {
      const result = await getSpecialOffer(id);
      return NextResponse.json(result);
    }

    const result = await getAllSpecialOffers({
      ...(isActive !== null && { isActive: isActive === 'true' }),
      ...(featured !== null && { featured: featured === 'true' }),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update special offer
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    const result = await updateSpecialOffer(id, updateData);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete special offer
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteSpecialOffer(id);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

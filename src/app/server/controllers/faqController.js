import { connectDB } from '@/utils/db';
import FAQ from '../models/FAQ';
import { NextResponse } from 'next/server';

// Create a new FAQ
export async function createFAQ(req) {
  await connectDB();
  try {
    const { question, answer, order } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const faq = new FAQ({
      question,
      answer,
      order: order || 0,
      isActive: true,
    });

    await faq.save();
    return NextResponse.json(faq, { status: 201 });
  } catch (err) {
    console.error('FAQ creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Get all FAQs
export async function getAllFAQs() {
  await connectDB();
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(faqs, { status: 200 });
  } catch (err) {
    console.error('Get FAQs error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get all FAQs (including inactive) - for admin
export async function getAllFAQsAdmin() {
  await connectDB();
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json(faqs, { status: 200 });
  } catch (err) {
    console.error('Get FAQs admin error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get FAQ by ID
export async function getFAQById(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const faq = await FAQ.findById(id);

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json(faq, { status: 200 });
  } catch (err) {
    console.error('Get FAQ by ID error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update FAQ
export async function updateFAQ(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const { question, answer, order, isActive } = await req.json();

    const faq = await FAQ.findByIdAndUpdate(
      id,
      {
        ...(question && { question }),
        ...(answer && { answer }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json(faq, { status: 200 });
  } catch (err) {
    console.error('FAQ update error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Delete FAQ
export async function deleteFAQ(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('FAQ deletion error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { connectDB } from '@/utils/db';
import { getFAQById, updateFAQ, deleteFAQ } from '../../../server/controllers/faqController';

export async function GET(req, { params: paramsPromise }) {
  await connectDB();
  const params = await paramsPromise;
  return getFAQById(req, { params });
}

export async function PUT(req, { params: paramsPromise }) {
  await connectDB();
  const params = await paramsPromise;
  return updateFAQ(req, { params });
}

export async function DELETE(req, { params: paramsPromise }) {
  await connectDB();
  const params = await paramsPromise;
  return deleteFAQ(req, { params });
}

import { connectDB } from '@/utils/db';
import { createFAQ, getAllFAQs, getAllFAQsAdmin } from '../../server/controllers/faqController';

export async function POST(req) {
  await connectDB();
  return createFAQ(req);
}

export async function GET(req) {
  await connectDB();
  return getAllFAQs();
}

import { connectDB } from '@/utils/db';
import { addReplyToInspectionRequest } from '@/app/server/controllers/inspectionController';

export async function POST(req, { params: paramsPromise }) {
  await connectDB();
  const params = await paramsPromise;
  return addReplyToInspectionRequest(req, { params });
}

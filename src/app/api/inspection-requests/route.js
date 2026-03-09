import { connectDB } from '@/utils/db';
import {
  createInspectionRequest,
  getAllInspectionRequests,
} from '../../server/controllers/inspectionController';

export async function POST(req) {
  await connectDB();
  return createInspectionRequest(req);
}

export async function GET(req) {
  await connectDB();
  return getAllInspectionRequests();
}

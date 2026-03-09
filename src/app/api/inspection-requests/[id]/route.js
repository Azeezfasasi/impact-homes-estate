import { connectDB } from '@/utils/db';
import {
  getInspectionRequestById,
  updateInspectionRequestStatus,
  deleteInspectionRequest,
} from '../../../server/controllers/inspectionController';

export async function GET(req, { params: paramsPromise }) {
  await connectDB();
  const params = await paramsPromise;
  return getInspectionRequestById(req, { params });
}

export async function PUT(req, { params: paramsPromise }) {
  await connectDB();
  const params = await paramsPromise;
  return updateInspectionRequestStatus(req, { params });
}

export async function DELETE(req, { params: paramsPromise }) {
  await connectDB();
  const params = await paramsPromise;
  return deleteInspectionRequest(req, { params });
}

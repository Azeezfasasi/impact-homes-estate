import { connectDB } from '../db/connect';
import InspectionRequest from '../models/InspectionRequest';
import { NextResponse } from 'next/server';

// Create a new inspection request
export async function createInspectionRequest(req) {
  await connectDB();
  try {
    const { firstName, lastName, phone, email, project } = await req.json();

    if (!firstName || !lastName || !phone || !email || !project) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const inspectionRequest = new InspectionRequest({
      firstName,
      lastName,
      phone,
      email,
      project,
      status: 'pending',
    });

    await inspectionRequest.save();
    return NextResponse.json(inspectionRequest, { status: 201 });
  } catch (err) {
    console.error('Inspection request creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Get all inspection requests
export async function getAllInspectionRequests() {
  await connectDB();
  try {
    const requests = await InspectionRequest.find().sort({ createdAt: -1 });
    return NextResponse.json(requests, { status: 200 });
  } catch (err) {
    console.error('Get inspection requests error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get inspection request by ID
export async function getInspectionRequestById(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const request = await InspectionRequest.findById(id);

    if (!request) {
      return NextResponse.json(
        { error: 'Inspection request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(request, { status: 200 });
  } catch (err) {
    console.error('Get inspection request by ID error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update inspection request status
export async function updateInspectionRequestStatus(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const { status, notes } = await req.json();

    const validStatuses = ['pending', 'approved', 'scheduled', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const request = await InspectionRequest.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return NextResponse.json(
        { error: 'Inspection request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(request, { status: 200 });
  } catch (err) {
    console.error('Update status error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Add reply to inspection request
export async function addReplyToInspectionRequest(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const { message, adminName } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const request = await InspectionRequest.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: {
            message,
            adminName: adminName || 'Admin',
            createdAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return NextResponse.json(
        { error: 'Inspection request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(request, { status: 200 });
  } catch (err) {
    console.error('Add reply error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Delete inspection request
export async function deleteInspectionRequest(req, { params }) {
  await connectDB();
  try {
    const { id } = params;
    const request = await InspectionRequest.findByIdAndDelete(id);

    if (!request) {
      return NextResponse.json(
        { error: 'Inspection request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Inspection request deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Deletion error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

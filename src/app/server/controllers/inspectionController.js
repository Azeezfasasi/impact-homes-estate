import { connectDB } from '../db/connect';
import InspectionRequest from '../models/InspectionRequest';
import { sendEmailViaBrevo } from '../utils/brevoEmailService';
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

    // Send confirmation email to client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1e3a8a; }
            .details-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .label { font-weight: bold; color: #666; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Inspection Request Received</h2>
            </div>
            <div class="content">
              <p>Hello ${firstName},</p>
              <p>Thank you for submitting your inspection request for <strong>${project}</strong>. We have received your request and will review it shortly.</p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #1e3a8a;">Request Details:</h3>
                <div class="details-row">
                  <span class="label">Name:</span>
                  <span>${firstName} ${lastName}</span>
                </div>
                <div class="details-row">
                  <span class="label">Email:</span>
                  <span>${email}</span>
                </div>
                <div class="details-row">
                  <span class="label">Phone:</span>
                  <span>${phone}</span>
                </div>
                <div class="details-row">
                  <span class="label">Project:</span>
                  <span>${project}</span>
                </div>
                <div class="details-row">
                  <span class="label">Status:</span>
                  <span style="color: #f59e0b; font-weight: bold;">Pending Review</span>
                </div>
              </div>

              <p>Our team will review your request and get back to you within 24 hours with next steps.</p>
              <p>If you have any questions in the meantime, please feel free to contact us.</p>
              
              <hr>
              <p><small>Best regards,<br>Impact Homes Real Estate Team</small></p>
            </div>
            <div class="footer">
              <p>© 2026 Impact Homes Real Estate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send notification email to admins
    const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert { background: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .details-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .label { font-weight: bold; color: #666; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Inspection Request Received</h2>
            </div>
            <div class="content">
              <div class="alert">
                <strong>⚠️ New inspection request to review</strong>
              </div>
              
              <p>A new inspection request has been submitted and requires your attention.</p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #1e3a8a;">Client Information:</h3>
                <div class="details-row">
                  <span class="label">Name:</span>
                  <span>${firstName} ${lastName}</span>
                </div>
                <div class="details-row">
                  <span class="label">Email:</span>
                  <span>${email}</span>
                </div>
                <div class="details-row">
                  <span class="label">Phone:</span>
                  <span>${phone}</span>
                </div>
                <div class="details-row">
                  <span class="label">Project:</span>
                  <span>${project}</span>
                </div>
                <div class="details-row">
                  <span class="label">Status:</span>
                  <span style="color: #f59e0b; font-weight: bold;">Pending Review</span>
                </div>
              </div>

              <p>Please log in to the admin dashboard to review and respond to this request.</p>
              
              <hr>
              <p><small>Impact Homes Real Estate Admin Notification</small></p>
            </div>
            <div class="footer">
              <p>© 2026 Impact Homes Real Estate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send emails
    try {
      // Send to client
      await sendEmailViaBrevo({
        to: email,
        subject: `Inspection Request Received | Impact Homes Real Estate`,
        htmlContent: clientEmailHtml,
        senderEmail: process.env.BREVO_SENDER_EMAIL,
        senderName: process.env.BREVO_SENDER_NAME,
      });

      // Send to admins
      if (adminEmails.length > 0) {
        for (const adminEmail of adminEmails) {
          await sendEmailViaBrevo({
            to: adminEmail,
            subject: `New Inspection Request - ${firstName} ${lastName}`,
            htmlContent: adminEmailHtml,
            senderEmail: process.env.BREVO_SENDER_EMAIL,
            senderName: process.env.BREVO_SENDER_NAME,
          });
        }
      }
    } catch (emailError) {
      console.error('Failed to send inspection request emails:', emailError);
      // Don't fail the request creation if email fails
    }

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

    // Get the current request to access client info
    const currentRequest = await InspectionRequest.findById(id);
    if (!currentRequest) {
      return NextResponse.json(
        { error: 'Inspection request not found' },
        { status: 404 }
      );
    }

    const oldStatus = currentRequest.status;

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

    // Send status update emails if status changed
    if (status && status !== oldStatus) {
      const statusMessages = {
        approved: 'Your inspection request has been approved!',
        scheduled: 'Your inspection has been scheduled.',
        completed: 'Your inspection is now complete.',
        cancelled: 'Your inspection request has been cancelled.',
      };

      const clientEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .status-badge { display: inline-block; padding: 8px 16px; border-radius: 5px; font-weight: bold; margin: 15px 0; }
              .status-approved { background: #d1fae5; color: #065f46; }
              .status-scheduled { background: #dbeafe; color: #1e40af; }
              .status-completed { background: #dcfce7; color: #15803d; }
              .status-cancelled { background: #fee2e2; color: #991b1b; }
              .notes { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3a8a; margin: 20px 0; }
              .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Inspection Request Status Update</h2>
              </div>
              <div class="content">
                <p>Hello ${request.firstName},</p>
                <p>${statusMessages[status] || 'Your inspection request status has been updated.'}</p>
                
                <div class="status-badge status-${status}">
                  Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
                </div>

                <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Project:</strong> ${request.project}</p>
                  <p><strong>Request ID:</strong> ${request._id}</p>
                </div>

                ${notes ? `
                  <div class="notes">
                    <h4 style="margin-top: 0;">Admin Notes:</h4>
                    <p>${notes}</p>
                  </div>
                ` : ''}

                <p>If you have any questions, please don't hesitate to contact us.</p>
                
                <hr>
                <p><small>Best regards,<br>Impact Homes Real Estate Team</small></p>
              </div>
              <div class="footer">
                <p>© 2026 Impact Homes Real Estate. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .details-row { display: flex; justify-content: space-between; padding: 8px 0; }
              .label { font-weight: bold; color: #666; }
              .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Status Update Notification</h2>
              </div>
              <div class="content">
                <p>An inspection request status has been updated.</p>
                
                <div class="details">
                  <h3 style="margin-top: 0;">Update Details:</h3>
                  <div class="details-row">
                    <span class="label">Client:</span>
                    <span>${request.firstName} ${request.lastName}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Email:</span>
                    <span>${request.email}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Project:</span>
                    <span>${request.project}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Previous Status:</span>
                    <span>${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">New Status:</span>
                    <span style="color: #10b981; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </div>
                  ${notes ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                      <span class="label">Admin Notes:</span>
                      <p>${notes}</p>
                    </div>
                  ` : ''}
                </div>

                <hr>
                <p><small>Impact Homes Real Estate Admin Notification</small></p>
              </div>
              <div class="footer">
                <p>© 2026 Impact Homes Real Estate. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        // Send to client
        await sendEmailViaBrevo({
          to: request.email,
          subject: `Inspection Request Status Updated - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          htmlContent: clientEmailHtml,
          senderEmail: process.env.BREVO_SENDER_EMAIL,
          senderName: process.env.BREVO_SENDER_NAME,
        });

        // Send to admins
        if (adminEmails.length > 0) {
          for (const adminEmail of adminEmails) {
            await sendEmailViaBrevo({
              to: adminEmail,
              subject: `Status Updated - ${request.firstName} ${request.lastName}`,
              htmlContent: adminEmailHtml,
              senderEmail: process.env.BREVO_SENDER_EMAIL,
              senderName: process.env.BREVO_SENDER_NAME,
            });
          }
        }
      } catch (emailError) {
        console.error('Failed to send status update emails:', emailError);
        // Don't fail the status update if email fails
      }
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

    // Send reply notification email to client
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #1e3a8a; margin: 20px 0; }
            .admin-info { font-size: 12px; color: #666; margin-top: 10px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Reply to Your Inspection Request</h2>
            </div>
            <div class="content">
              <p>Hello ${request.firstName},</p>
              <p>Our team has sent you a reply regarding your inspection request for <strong>${request.project}</strong>.</p>
              
              <div class="message-box">
                <p style="margin-top: 0;"><strong>${adminName || 'Admin'} replied:</strong></p>
                <p>${message}</p>
                <div class="admin-info">
                  <p style="margin: 0;">— ${adminName || 'Impact Homes Real Estate Team'}</p>
                  <p style="margin: 5px 0 0 0;">${new Date().toLocaleString()}</p>
                </div>
              </div>

              <p>If you have any questions or need further assistance, please don't hesitate to reach out.</p>
              
              <hr>
              <p><small>Best regards,<br>Impact Homes Real Estate Team</small></p>
            </div>
            <div class="footer">
              <p>© 2026 Impact Homes Real Estate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send notification email to admins about the reply
    const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981; margin: 20px 0; }
            .details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .details-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .label { font-weight: bold; color: #666; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Admin Reply Sent Notification</h2>
            </div>
            <div class="content">
              <p>A reply has been sent to a client regarding their inspection request.</p>
              
              <div class="details">
                <h3 style="margin-top: 0;">Client Information:</h3>
                <div class="details-row">
                  <span class="label">Name:</span>
                  <span>${request.firstName} ${request.lastName}</span>
                </div>
                <div class="details-row">
                  <span class="label">Email:</span>
                  <span>${request.email}</span>
                </div>
                <div class="details-row">
                  <span class="label">Project:</span>
                  <span>${request.project}</span>
                </div>
              </div>

              <div class="message-box">
                <p style="margin-top: 0;"><strong>Reply sent:</strong></p>
                <p>${message}</p>
              </div>

              <hr>
              <p><small>Impact Homes Real Estate Admin Notification</small></p>
            </div>
            <div class="footer">
              <p>© 2026 Impact Homes Real Estate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      // Send to client
      await sendEmailViaBrevo({
        to: request.email,
        subject: `New Reply - Your Inspection Request for ${request.project}`,
        htmlContent: clientEmailHtml,
        senderEmail: process.env.BREVO_SENDER_EMAIL,
        senderName: process.env.BREVO_SENDER_NAME,
      });

      // Send to admins
      if (adminEmails.length > 0) {
        for (const adminEmail of adminEmails) {
          await sendEmailViaBrevo({
            to: adminEmail,
            subject: `Reply Sent - ${request.firstName} ${request.lastName}`,
            htmlContent: adminEmailHtml,
            senderEmail: process.env.BREVO_SENDER_EMAIL,
            senderName: process.env.BREVO_SENDER_NAME,
          });
        }
      }
    } catch (emailError) {
      console.error('Failed to send reply notification emails:', emailError);
      // Don't fail the reply if email fails
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

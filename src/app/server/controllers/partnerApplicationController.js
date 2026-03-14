import PartnerApplication from '../models/PartnerApplication.js';
import { connectDB } from '../db/connect.js';
import { sendEmailViaBrevo } from '../utils/brevoEmailService.js';

export async function createPartnerApplication(applicationData) {
  try {
    await connectDB();

    const application = await PartnerApplication.create({
      ...applicationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Determine applicant name based on type
    const applicantName = application.type === 'corporate' 
      ? `${application.representativeName} (${application.companyName})`
      : `${application.firstName} ${application.lastName}`;

    // Email to client
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
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 5px; font-weight: bold; background: #fef3c7; color: #92400e; margin: 15px 0; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Partner Application Received</h2>
            </div>
            <div class="content">
              <p>Hello ${application.type === 'corporate' ? application.representativeName : application.firstName},</p>
              <p>Thank you for submitting your partnership application to Impact Homes Real Estate. We have received your application and will review it carefully.</p>
              
              <div class="status-badge">Status: Pending Review</div>

              <div class="details">
                <h3 style="margin-top: 0; color: #1e3a8a;">Application Details:</h3>
                <div class="details-row">
                  <span class="label">Application Type:</span>
                  <span>${application.type.charAt(0).toUpperCase() + application.type.slice(1)}</span>
                </div>
                ${application.type === 'corporate' ? `
                  <div class="details-row">
                    <span class="label">Company Name:</span>
                    <span>${application.companyName}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Representative:</span>
                    <span>${application.representativeName}</span>
                  </div>
                ` : `
                  <div class="details-row">
                    <span class="label">Name:</span>
                    <span>${application.firstName} ${application.lastName}</span>
                  </div>
                `}
                <div class="details-row">
                  <span class="label">Email:</span>
                  <span>${application.emailAddress}</span>
                </div>
                <div class="details-row">
                  <span class="label">Phone:</span>
                  <span>${application.phoneNumber}</span>
                </div>
                <div class="details-row">
                  <span class="label">Submitted Date:</span>
                  <span>${new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <p>Our team will review your application and contact you within 5-7 business days with a decision.</p>
              <p>If you have any questions in the meantime, please feel free to reach out to us.</p>
              
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

    // Email to admins
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
              <h2>New Partner Application Received</h2>
            </div>
            <div class="content">
              <div class="alert">
                <strong>⚠️ New ${application.type} partnership application to review</strong>
              </div>
              
              <p>A new partnership application has been submitted and requires your attention.</p>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #1e3a8a;">Applicant Information:</h3>
                <div class="details-row">
                  <span class="label">Type:</span>
                  <span>${application.type.charAt(0).toUpperCase() + application.type.slice(1)}</span>
                </div>
                ${application.type === 'corporate' ? `
                  <div class="details-row">
                    <span class="label">Company Name:</span>
                    <span>${application.companyName}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">RC Number:</span>
                    <span>${application.rcNumber || 'N/A'}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Representative:</span>
                    <span>${application.representativeName} (${application.representativePosition})</span>
                  </div>
                ` : `
                  <div class="details-row">
                    <span class="label">Name:</span>
                    <span>${application.firstName} ${application.lastName}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Address:</span>
                    <span>${application.homeAddress || 'N/A'}</span>
                  </div>
                `}
                <div class="details-row">
                  <span class="label">Email:</span>
                  <span>${application.emailAddress}</span>
                </div>
                <div class="details-row">
                  <span class="label">Phone:</span>
                  <span>${application.phoneNumber}</span>
                </div>
                <div class="details-row">
                  <span class="label">How They Heard About Us:</span>
                  <span>${application.howHeardAboutUs}</span>
                </div>
                <div class="details-row">
                  <span class="label">Date Submitted:</span>
                  <span>${new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <p>Please log in to the admin dashboard to review and take action on this application.</p>
              
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
        to: application.emailAddress,
        subject: 'Partnership Application Received - Impact Homes Real Estate',
        htmlContent: clientEmailHtml,
        senderEmail: process.env.BREVO_SENDER_EMAIL,
        senderName: process.env.BREVO_SENDER_NAME,
      });

      // Send to admins
      const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
      if (adminEmails.length > 0) {
        for (const adminEmail of adminEmails) {
          await sendEmailViaBrevo({
            to: adminEmail,
            subject: `New Partner Application - ${applicantName}`,
            htmlContent: adminEmailHtml,
            senderEmail: process.env.BREVO_SENDER_EMAIL,
            senderName: process.env.BREVO_SENDER_NAME,
          });
        }
      }
    } catch (emailError) {
      console.error('Failed to send partner application emails:', emailError);
      // Don't fail the application creation if email fails
    }

    return {
      success: true,
      data: application,
      message: 'Application submitted successfully',
    };
  } catch (error) {
    console.error('Error creating partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to create application',
    };
  }
}

export async function getAllPartnerApplications(filters = {}) {
  try {
    await connectDB();

    const query = {};
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;

    const applications = await PartnerApplication.find(query)
      .sort({ createdAt: -1 });

    return {
      success: true,
      applications: applications,
    };
  } catch (error) {
    console.error('Error fetching partner applications:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch applications',
    };
  }
}

export async function getPartnerApplication(applicationId) {
  try {
    await connectDB();

    const application = await PartnerApplication.findById(applicationId);

    if (!application) {
      return {
        success: false,
        error: 'Application not found',
      };
    }

    return {
      success: true,
      data: application,
    };
  } catch (error) {
    console.error('Error fetching partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch application',
    };
  }
}

export async function updatePartnerApplicationStatus(applicationId, status, notes = '') {
  try {
    await connectDB();

    // Get current application
    const currentApplication = await PartnerApplication.findById(applicationId);
    if (!currentApplication) {
      return {
        success: false,
        error: 'Application not found',
      };
    }

    const oldStatus = currentApplication.status;

    const application = await PartnerApplication.findByIdAndUpdate(
      applicationId,
      {
        status,
        notes,
        updatedAt: new Date(),
      },
      { new: true }
    );

    // Send status update emails if status changed
    if (status !== oldStatus) {
      const statusMessages = {
        approved: 'Congratulations! Your partnership application has been approved!',
        rejected: 'Thank you for your interest in partnering with us. Unfortunately, your application has not been approved at this time.',
      };

      const applicantName = application.type === 'corporate' 
        ? `${application.representativeName} (${application.companyName})`
        : `${application.firstName} ${application.lastName}`;

      // Email to client
      const clientEmailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .status-badge { display: inline-block; padding: 10px 20px; border-radius: 5px; font-weight: bold; margin: 15px 0; }
              .status-approved { background: #d1fae5; color: #065f46; }
              .status-rejected { background: #fee2e2; color: #991b1b; }
              .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3a8a; margin: 20px 0; }
              .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Partnership Application Status Update</h2>
              </div>
              <div class="content">
                <p>Hello ${application.type === 'corporate' ? application.representativeName : application.firstName},</p>
                <p>${statusMessages[status] || 'Your partnership application status has been updated.'}</p>
                
                <div class="status-badge status-${status}">
                  Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
                </div>

                <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>Application Type:</strong> ${application.type.charAt(0).toUpperCase() + application.type.slice(1)}</p>
                  ${application.type === 'corporate' ? `<p><strong>Company:</strong> ${application.companyName}</p>` : ''}
                </div>

                ${notes ? `
                  <div class="message-box">
                    <h4 style="margin-top: 0;">Additional Information:</h4>
                    <p>${notes}</p>
                  </div>
                ` : ''}

                <p>If you have any questions or would like to discuss this further, please don't hesitate to contact us.</p>
                
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

      // Email to admins
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
                <h2>Partner Application Status Updated</h2>
              </div>
              <div class="content">
                <p>A partner application status has been updated.</p>
                
                <div class="details">
                  <h3 style="margin-top: 0;">Update Details:</h3>
                  <div class="details-row">
                    <span class="label">Applicant:</span>
                    <span>${applicantName}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Email:</span>
                    <span>${application.emailAddress}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Type:</span>
                    <span>${application.type.charAt(0).toUpperCase() + application.type.slice(1)}</span>
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
                      <span class="label">Notes:</span>
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

      // Send emails
      try {
        // Send to client
        await sendEmailViaBrevo({
          to: application.emailAddress,
          subject: `Partnership Application Status Updated - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          htmlContent: clientEmailHtml,
          senderEmail: process.env.BREVO_SENDER_EMAIL,
          senderName: process.env.BREVO_SENDER_NAME,
        });

        // Send to admins
        const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || '').split(',').map(e => e.trim()).filter(Boolean);
        if (adminEmails.length > 0) {
          for (const adminEmail of adminEmails) {
            await sendEmailViaBrevo({
              to: adminEmail,
              subject: `Status Updated - ${applicantName}`,
              htmlContent: adminEmailHtml,
              senderEmail: process.env.BREVO_SENDER_EMAIL,
              senderName: process.env.BREVO_SENDER_NAME,
            });
          }
        }
      } catch (emailError) {
        console.error('Failed to send partner application status update emails:', emailError);
        // Don't fail the status update if email fails
      }
    }

    return {
      success: true,
      data: application,
      message: 'Application status updated',
    };
  } catch (error) {
    console.error('Error updating partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to update application',
    };
  }
}

export async function deletePartnerApplication(applicationId) {
  try {
    await connectDB();

    const application = await PartnerApplication.findByIdAndDelete(applicationId);

    if (!application) {
      return {
        success: false,
        error: 'Application not found',
      };
    }

    return {
      success: true,
      message: 'Application deleted',
    };
  } catch (error) {
    console.error('Error deleting partner application:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete application',
    };
  }
}

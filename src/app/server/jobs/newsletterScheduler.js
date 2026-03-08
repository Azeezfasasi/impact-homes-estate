import { connectDB } from '@/utils/db.js';
import { Campaign, Subscriber } from '@/app/server/models/Newsletter';
import { sendEmailViaBrevo } from '@/app/server/utils/brevoEmailService';

// Store for the scheduled job
let scheduledJob = null;
let isInitialized = false;
let cron = null;

/**
 * Initialize the newsletter scheduler
 * Runs every minute to check for newsletters that are due to be sent
 */
export const initializeNewsletterScheduler = () => {
  if (isInitialized) {
    console.log('📧 Newsletter scheduler already initialized');
    return;
  }

  isInitialized = true;
  console.log('🚀 Starting newsletter scheduler initialization...');

  try {
    // Lazy load node-cron at runtime
    if (!cron) {
      try {
        cron = require('node-cron');
      } catch (err) {
        console.error('❌ Failed to load node-cron:', err.message);
        console.warn('⚠️  Newsletter scheduler will not run without node-cron');
        isInitialized = false;
        return;
      }
    }
    
    // Run every minute at the beginning of each minute
    scheduledJob = cron.schedule('0 * * * * *', async () => {
      try {
        console.log(`⏰ [${new Date().toISOString()}] Running scheduled campaign check...`);
        await processScheduledCampaigns();
      } catch (error) {
        console.error('❌ Error in newsletter scheduler execution:', error.message);
      }
    }, {
      runOnInit: true, // Run immediately on initialization
    });

    console.log('✅ Newsletter scheduler initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize newsletter scheduler:', error);
    isInitialized = false;
  }
};

/**
 * Stop the newsletter scheduler
 */
export const stopNewsletterScheduler = () => {
  if (scheduledJob) {
    scheduledJob.stop();
    scheduledJob = null;
    console.log('🛑 Newsletter scheduler stopped');
  }
};

/**
 * Process scheduled campaigns that are due
 */
export const processScheduledCampaigns = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected for scheduler');

    // Find campaigns that are scheduled and due to be sent
    const now = new Date();
    console.log(`🔍 Checking for campaigns scheduled before: ${now.toISOString()}`);

    const dueCampaigns = await Campaign.find({
      status: 'scheduled',
      scheduledFor: { $lte: now },
    }).lean();

    console.log(`📊 Found ${dueCampaigns.length} campaign(s) due to be sent`);

    if (dueCampaigns.length === 0) {
      return; // No campaigns to send
    }

    // Process each campaign
    for (const campaign of dueCampaigns) {
      try {
        console.log(`📨 Processing campaign: "${campaign.title}" (ID: ${campaign._id})`);
        await sendScheduledCampaign(campaign);
      } catch (error) {
        console.error(`❌ Error sending campaign ${campaign._id}:`, error.message);
        // Mark as failed but continue processing other campaigns
        await Campaign.findByIdAndUpdate(campaign._id, {
          status: 'paused',
          lastError: error.message,
        });
      }
    }
  } catch (error) {
    console.error('❌ Error in processScheduledCampaigns:', error.message);
  }
};

/**
 * Send a scheduled campaign to all recipients
 */
const sendScheduledCampaign = async (campaign) => {
  console.log(`📤 Sending scheduled campaign: "${campaign.title}" (ID: ${campaign._id})`);

  try {
    // Get recipients based on recipient type
    let recipients = [];

    if (campaign.recipients.type === 'all') {
      // Send to all active subscribers
      recipients = await Subscriber.find({
        subscriptionStatus: 'active',
      }).select('email firstName lastName');
    } else if (campaign.recipients.type === 'tags') {
      // Send to subscribers with specific tags
      recipients = await Subscriber.find({
        subscriptionStatus: 'active',
        tags: { $in: campaign.recipients.selectedTags },
      }).select('email firstName lastName');
    } else if (campaign.recipients.type === 'segment') {
      // Send to specific segment
      recipients = await Subscriber.find({
        subscriptionStatus: 'active',
        tags: campaign.recipients.selectedSegments,
      }).select('email firstName lastName');
    } else if (campaign.recipients.type === 'individual') {
      // Send to specific subscribers
      recipients = await Subscriber.find({
        _id: { $in: campaign.recipients.selectedSubscribers },
      }).select('email firstName lastName');
    }

    if (recipients.length === 0) {
      console.log(`⚠️ No recipients found for campaign ${campaign._id}`);
      await Campaign.findByIdAndUpdate(campaign._id, {
        status: 'sent',
        sentAt: new Date(),
        sentCount: 0,
      });
      return {
        success: true,
        sentCount: 0,
        message: 'No recipients found',
      };
    }

    console.log(`📧 Sending to ${recipients.length} recipient(s)`);

    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    // Send email to each recipient
    for (const recipient of recipients) {
      try {
        const textContent = campaign.content?.replace(/<[^>]*>/g, '').substring(0, 200) || campaign.subject;
        
        console.log(`  📨 Attempting to send to: ${recipient.email}`);
        
        const result = await sendEmailViaBrevo({
          to: [{ email: recipient.email, name: `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() }],
          subject: campaign.subject,
          htmlContent: campaign.htmlContent || campaign.content || '<p>Newsletter</p>',
          textContent: textContent || campaign.subject,
          senderEmail: campaign.senderEmail || process.env.BREVO_SENDER_EMAIL,
          senderName: campaign.senderName || process.env.BREVO_SENDER_NAME || 'Newsletter',
          tags: [campaign.campaignType, `campaign-${campaign._id}`],
        });

        console.log(`  📧 Brevo response:`, JSON.stringify(result));

        if (result && (result.success || result.id || result.messageId)) {
          console.log(`    ✅ Sent successfully`);
          successCount++;
        } else {
          console.log(`    ❌ Send failed - Response:`, result);
          failureCount++;
          errors.push(`${recipient.email}: ${result?.error || 'Failed to send'}`);
        }
      } catch (error) {
        console.error(`  ❌ Exception sending to ${recipient.email}:`, error.message, error.stack);
        failureCount++;
        errors.push(`${recipient.email}: ${error.message}`);
      }
    }

    // Update campaign status
    console.log(`📊 Campaign complete - Sent: ${successCount}, Failed: ${failureCount}`);
    
    await Campaign.findByIdAndUpdate(campaign._id, {
      status: 'sent',
      sentAt: new Date(),
      sentCount: successCount,
      failedCount: failureCount,
      lastError: errors.length > 0 ? errors.slice(0, 3).join('; ') : null,
    });

    console.log(
      `✅ Campaign "${campaign.title}" processed - Sent: ${successCount}, Failed: ${failureCount}`
    );

    return {
      success: true,
      sentCount: successCount,
      failedCount: failureCount,
    };
  } catch (error) {
    console.error(`❌ Error sending campaign ${campaign._id}:`, error.message);

    // Mark as failed
    await Campaign.findByIdAndUpdate(campaign._id, {
      status: 'paused',
      lastError: error.message,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Manually trigger sending of a scheduled campaign
 */
export const triggerScheduledCampaign = async (campaignId) => {
  try {
    await connectDB();

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    if (campaign.status !== 'scheduled') {
      throw new Error(`Campaign status is ${campaign.status}, not scheduled`);
    }

    await sendScheduledCampaign(campaign);

    return {
      success: true,
      message: 'Campaign sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  initializeNewsletterScheduler,
  stopNewsletterScheduler,
  triggerScheduledCampaign,
  processScheduledCampaigns,
};

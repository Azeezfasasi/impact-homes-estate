import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Campaign, Subscriber } from '@/app/server/models/Newsletter';

/**
 * Comprehensive diagnostic endpoint
 * GET /api/test/newsletter-diagnostics
 */
export async function GET(request) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    runtime: process.env.NEXT_RUNTIME,
    apiKey: process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing',
    tests: {},
  };

  try {
    // Test 1: Database Connection
    console.log('📋 Running newsletter diagnostics...');
    await connectDB();
    diagnostics.tests.dbConnection = '✅ Connected';

    // Test 2: Subscriber Count
    const subscriberCount = await Subscriber.countDocuments({});
    const activeSubscribers = await Subscriber.countDocuments({
      subscriptionStatus: 'active',
    });
    diagnostics.tests.subscribers = {
      total: subscriberCount,
      active: activeSubscribers,
      status: subscriberCount > 0 ? '✅' : '⚠️ No subscribers found',
    };

    // Test 3: Campaign Status
    const allCampaigns = await Campaign.countDocuments({});
    const scheduledCampaigns = await Campaign.countDocuments({
      status: 'scheduled',
    });
    const dueCampaigns = await Campaign.find({
      status: 'scheduled',
      scheduledFor: { $lte: new Date() },
    }).lean();

    diagnostics.tests.campaigns = {
      total: allCampaigns,
      scheduled: scheduledCampaigns,
      due: dueCampaigns.length,
      status: '✅',
    };

    // Test 4: Due Campaigns Details
    diagnostics.tests.dueCampaignsDetails = dueCampaigns.map(c => ({
      id: c._id.toString(),
      title: c.title,
      subject: c.subject,
      status: c.status,
      type: c.recipients?.type,
      selectedTags: c.recipients?.selectedTags,
      selectedSegments: c.recipients?.selectedSegments,
      scheduledFor: c.scheduledFor,
      sentCount: c.sentCount,
      sentAt: c.sentAt,
      lastError: c.lastError,
    }));

    // Test 5: Check Recipients for Each Due Campaign
    diagnostics.tests.recipientAnalysis = [];
    for (const campaign of dueCampaigns) {
      let recipientCount = 0;

      if (campaign.recipients?.type === 'all') {
        recipientCount = await Subscriber.countDocuments({
          subscriptionStatus: 'active',
        });
      } else if (campaign.recipients?.type === 'tags') {
        recipientCount = await Subscriber.countDocuments({
          subscriptionStatus: 'active',
          tags: { $in: campaign.recipients?.selectedTags },
        });
      } else if (campaign.recipients?.type === 'segment') {
        recipientCount = await Subscriber.countDocuments({
          subscriptionStatus: 'active',
          tags: campaign.recipients?.selectedSegments,
        });
      }

      diagnostics.tests.recipientAnalysis.push({
        campaignId: campaign._id.toString(),
        title: campaign.title,
        recipientType: campaign.recipients?.type,
        recipientCount,
        status: recipientCount > 0 ? '✅' : '⚠️ No recipients',
      });
    }

    // Test 6: Email Service Config
    diagnostics.tests.emailService = {
      apiKey: process.env.BREVO_API_KEY ? '✅ Configured' : '❌ Not configured',
      senderEmail: process.env.BREVO_SENDER_EMAIL || '❌ Not configured',
      senderName: process.env.BREVO_SENDER_NAME || 'Default',
    };

    console.log('✅ Diagnostics completed');
    diagnostics.tests.diagnosticStatus = '✅ Complete';
  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    diagnostics.tests.error = error.message;
    diagnostics.tests.errorStack = error.stack;
  }

  return NextResponse.json(diagnostics, { status: 200 });
}

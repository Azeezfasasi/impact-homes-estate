import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import { Campaign } from '@/app/server/models/Newsletter';

/**
 * Test endpoint to check scheduled campaigns
 * GET /api/test/check-scheduled-campaigns
 */
export async function GET(request) {
  try {
    console.log('🔍 TEST: Checking scheduled campaigns...');
    
    await connectDB();
    console.log('✅ TEST: Database connected');

    const now = new Date();
    console.log(`TEST: Current time: ${now.toISOString()}`);

    // Find all scheduled campaigns
    const allScheduled = await Campaign.find({ status: 'scheduled' }).lean();
    console.log(`TEST: Found ${allScheduled.length} scheduled campaigns total`);
    console.log('TEST: All scheduled campaigns:', JSON.stringify(allScheduled, null, 2));

    // Find campaigns that are due
    const dueCampaigns = await Campaign.find({
      status: 'scheduled',
      scheduledFor: { $lte: now },
    }).lean();

    console.log(`TEST: Found ${dueCampaigns.length} campaigns due to send`);

    return NextResponse.json({
      success: true,
      currentTime: now.toISOString(),
      totalScheduled: allScheduled.length,
      dueCampaigns: dueCampaigns.length,
      campaigns: dueCampaigns.map(c => ({
        id: c._id,
        title: c.title,
        status: c.status,
        scheduledFor: c.scheduledFor,
        sentCount: c.sentCount,
      })),
    });
  } catch (error) {
    console.error('❌ TEST Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

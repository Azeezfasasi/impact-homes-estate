import { NextResponse } from 'next/server';
import { processScheduledCampaigns } from '@/app/server/jobs/newsletterScheduler';

/**
 * Force test the scheduler NOW
 * GET /api/test/force-send-newsletter
 * This will immediately attempt to send all due scheduled newsletters
 */
export async function GET(request) {
  try {
    console.log('\n\n🚨 FORCE SEND TEST STARTING...\n');
    
    const startTime = Date.now();
    console.log('⏱️ Test started at:', new Date().toISOString());
    
    // Run the scheduler
    await processScheduledCampaigns();
    
    const duration = Date.now() - startTime;
    console.log('\n✅ Force send test completed in', duration, 'ms\n');

    return NextResponse.json({
      success: true,
      message: 'Force send test completed - check server logs for details',
      duration,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('\n❌ Force send test error:', error);
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

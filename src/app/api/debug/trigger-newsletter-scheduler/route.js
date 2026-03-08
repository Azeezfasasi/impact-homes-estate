import { NextResponse } from 'next/server';
import { processScheduledCampaigns } from '@/app/server/jobs/newsletterScheduler';

/**
 * Debug endpoint to manually trigger newsletter scheduler
 * GET /api/debug/trigger-newsletter-scheduler
 */
export async function GET(request) {
  try {
    console.log('🔧 DEBUG: Manually triggering newsletter scheduler...');
    
    const result = await processScheduledCampaigns();

    return NextResponse.json({
      success: true,
      message: 'Newsletter scheduler triggered manually',
      result,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('❌ DEBUG: Error triggering scheduler:', error);
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

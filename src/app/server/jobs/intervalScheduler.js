/**
 * Alternative Simple Scheduler using setInterval
 * Falls back if node-cron doesn't work properly in Next.js environment
 */

let intervalId = null;

export const startSimpleIntervalScheduler = () => {
  if (intervalId) {
    console.log('⚠️ Simple scheduler already running');
    return;
  }

  console.log('🔄 Starting simple interval-based scheduler...');

  // Check every 15 seconds
  intervalId = setInterval(async () => {
    try {
      const { processScheduledCampaigns } = await import('./newsletterScheduler.js');
      await processScheduledCampaigns();
    } catch (error) {
      console.error('❌ Error in interval scheduler:', error.message);
    }
  }, 15000); // 15 seconds

  console.log('✅ Simple interval scheduler started (runs every 15 seconds)');

  return intervalId;
};

export const stopSimpleIntervalScheduler = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('🛑 Simple interval scheduler stopped');
  }
};

export default {
  startSimpleIntervalScheduler,
  stopSimpleIntervalScheduler,
};

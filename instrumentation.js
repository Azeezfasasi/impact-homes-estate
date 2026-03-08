/**
 * Next.js Instrumentation Hook
 * Runs when the server starts (Node.js runtime only)
 * Used to initialize background jobs and other services
 */

export async function register() {
  // Ensure this only runs in Node.js runtime
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  console.log('\n\n==========================================');
  console.log('✅ instrumentation.js register() CALLED');
  console.log('✅ Initializing background services...');
  console.log('==========================================\n');

  try {
    // Dynamic import the scheduler using relative path
    console.log('📧 Importing newsletter scheduler...');
    const { initializeNewsletterScheduler } = await import('./src/app/server/jobs/newsletterScheduler.js');
    
    console.log('📧 Calling initializeNewsletterScheduler()...');
    initializeNewsletterScheduler();
    console.log('✅ Newsletter scheduler initialized successfully!\n');

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR in instrumentation.js:');
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Full error:', error);
  }
}

import { connectDB } from '../utils/db.js';

// Initialize database connection
connectDB().catch(console.error);

export {};
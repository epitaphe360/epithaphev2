import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required!');
  console.error('Available env vars:', Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('SECRET')));
  throw new Error('DATABASE_URL environment variable is required. Please set it in your .env file.');
}

console.log('🔄 Connecting to database...');

// Initialize PostgreSQL client with Supabase/PgBouncer compatible settings
const queryClient = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  connect_timeout: 30,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  prepare: false, // Required for PgBouncer transaction mode
});

// Initialize Drizzle ORM with proper typing
const db = drizzle(queryClient, { schema });

console.log("✅ Database connection initialized");

export { db, queryClient };

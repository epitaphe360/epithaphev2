/**
 * Test Setup — Boot Express app with real Supabase DB for integration tests.
 * Provides a `getApp()` helper + cleanup utilities.
 * Auto-detects if DB is reachable; exports `DB_AVAILABLE` flag for conditional skipping.
 */
import "dotenv/config";
import dns from "dns";
// Force DNS verbatim order so IPv6-only hosts (Supabase) can be reached
dns.setDefaultResultOrder("verbatim");

import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";
import { db } from "../server/db";
import { scoringResults, payments, clientAccounts, passwordResetTokens } from "../shared/schema";
import { like } from "drizzle-orm";

let appInstance: express.Express | null = null;
let dbAvailable: boolean | null = null;

/**
 * Probe DB connectivity with a simple SELECT 1.
 * Caches the result so we only check once.
 */
export async function isDbAvailable(): Promise<boolean> {
  if (dbAvailable !== null) return dbAvailable;
  try {
    await db.execute(/* sql */ `SELECT 1 AS ok`);
    dbAvailable = true;
  } catch {
    console.warn("⚠️  DB not reachable — integration tests will be skipped. Unpause your Supabase project.");
    dbAvailable = false;
  }
  return dbAvailable;
}

/**
 * Create a minimal Express app with all API routes for testing.
 * Re-uses the same instance across tests to avoid port conflicts.
 */
export async function getApp(): Promise<express.Express> {
  if (appInstance) return appInstance;

  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  appInstance = app;
  return app;
}

// Prefix for test data so we can safely clean up
export const TEST_PREFIX = "__vitest__";

/**
 * Clean up all test data inserted during tests.
 * Uses the TEST_PREFIX to identify test rows.
 */
export async function cleanupTestData() {
  if (!(await isDbAvailable())) return;
  try {
    await db.delete(scoringResults).where(like(scoringResults.companyName, `${TEST_PREFIX}%`));
    await db.delete(payments).where(like(payments.paymentMethod, `${TEST_PREFIX}%`));
    await db.delete(clientAccounts).where(like(clientAccounts.email, `${TEST_PREFIX}%`));
    await db.delete(passwordResetTokens).where(like(passwordResetTokens.email, `${TEST_PREFIX}%`));
  } catch (e) {
    console.warn("[cleanup] partial cleanup error:", e);
  }
}

export { db };

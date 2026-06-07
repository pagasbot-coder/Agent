import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | null = null;

/** True when DATABASE_URL is set — does not verify connectivity. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Lazy Drizzle client — returns null when DATABASE_URL is unset (OFF-by-default).
 * Neon HTTP driver suits Vercel serverless; no connection pool on cold start.
 */
export function getDb(): Db | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;

  if (!cached) {
    const sql = neon(url);
    cached = drizzle(sql, { schema });
  }

  return cached;
}

export { schema };

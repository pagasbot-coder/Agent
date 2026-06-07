import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit config — requires DATABASE_URL in shell (Human local / CI).
 * Never commit connection strings; use `npm run db:push` after Neon provision.
 */
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});

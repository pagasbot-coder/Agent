import { NextResponse } from "next/server";

import { getCostGuardSnapshot } from "@/lib/advisor/costGuardrails";
import { getRateLimitBackend } from "@/lib/advisor/redisRateLimit";
import { getWaitlistBackend } from "@/lib/waitlist/store";

/**
 * Liveness for Vercel smoke, reverse proxy, and future Docker healthcheck.
 * No auth — boolean env checks only; never expose secret values.
 */
export async function GET() {
  const posthogDisabled =
    process.env.POSTHOG_DISABLED === "true" ||
    !process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

  return NextResponse.json({
    ok: true,
    service: "quiet-partner",
    version: process.env.npm_package_version ?? "0.1.0",
    timestamp: new Date().toISOString(),
    checks: {
      deepseek_api_key_configured: Boolean(process.env.DEEPSEEK_API_KEY?.trim()),
      posthog_disabled: posthogDisabled,
      auth_enabled: process.env.AUTH_ENABLED === "true",
      auth_secret_configured: Boolean(process.env.AUTH_SECRET?.trim()),
      waitlist_backend: getWaitlistBackend(),
      database_url_configured: Boolean(process.env.DATABASE_URL?.trim()),
      cost_guardrails: {
        ...getCostGuardSnapshot(),
        rate_limit_backend: getRateLimitBackend(),
      },
    },
  });
}

import { NextResponse } from "next/server";

import { getCostGuardSnapshot } from "@/lib/advisor/costGuardrails";

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
      cost_guardrails: getCostGuardSnapshot(),
    },
  });
}

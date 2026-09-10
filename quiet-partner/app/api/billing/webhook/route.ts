import { NextResponse } from "next/server";

import {
  getBillingProvider,
  getBillingProviderName,
  isBillingEnabled,
} from "@/lib/billing";

const MAX_BODY_BYTES = 65_536;

/**
 * Provider-agnostic billing webhook — YooKassa notifications land here.
 * OFF by default; verify provider signature/IP before prod (ADR-005).
 */
export async function POST(request: Request) {
  if (!isBillingEnabled()) {
    return NextResponse.json({ error: "billing_disabled" }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const provider = getBillingProvider();
  let event;
  try {
    event = await provider.parseWebhook(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[billing/webhook] parse failed", message);
    return NextResponse.json({ error: "invalid_webhook" }, { status: 400 });
  }

  if (!event) {
    return NextResponse.json({ error: "unrecognized_event" }, { status: 400 });
  }

  // Persist to Postgres — follow-up when AUTH + db:push active (T-065).
  console.info("[billing/webhook] received", {
    provider: event.provider,
    payment_id: event.providerPaymentId,
    status: event.status,
  });

  return NextResponse.json({
    ok: true,
    provider: getBillingProviderName(),
    payment_id: event.providerPaymentId,
    status: event.status,
  });
}

/** Smoke — mode only, no secrets. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    accepts: ["POST"],
    billing_enabled: isBillingEnabled(),
    provider: getBillingProviderName(),
  });
}

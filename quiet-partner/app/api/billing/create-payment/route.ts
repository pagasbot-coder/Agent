import { NextResponse } from "next/server";

import {
  getBillingProvider,
  getProPriceRub,
  isBillingEnabled,
  isYooKassaConfigured,
} from "@/lib/billing";
import { isAuthEnabled } from "@/lib/auth/flags";

const MAX_BODY_BYTES = 2_048;

function resolveReturnUrl(request: Request): string {
  const configured = process.env.BILLING_RETURN_URL?.trim();
  if (configured) return configured;
  const authUrl = process.env.AUTH_URL?.trim();
  if (authUrl) return `${authUrl.replace(/\/$/, "")}/billing/success`;
  return new URL("/billing/success", request.url).toString();
}

/**
 * Create checkout session — Pro tier monthly (RUB).
 * Requires BILLING_ENABLED=true + YooKassa keys; auth recommended when live.
 */
export async function POST(request: Request) {
  if (!isBillingEnabled()) {
    return NextResponse.json({ error: "billing_disabled" }, { status: 503 });
  }

  if (!isYooKassaConfigured()) {
    return NextResponse.json(
      { error: "billing_not_configured", hint: "set YOOKASSA_* env" },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown = {};
  if (contentLength > 0) {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
  }

  const raw = body as Record<string, unknown>;
  const tier = raw.tier === "pro" ? "pro" : "pro";
  const amountRub =
    typeof raw.amountRub === "number" && raw.amountRub > 0
      ? Math.round(raw.amountRub)
      : getProPriceRub();

  const userId = typeof raw.userId === "string" ? raw.userId : undefined;
  if (isAuthEnabled() && !userId) {
    return NextResponse.json({ error: "auth_required" }, { status: 401 });
  }

  const provider = getBillingProvider();

  try {
    const result = await provider.createPayment({
      userId,
      tier,
      amountRub,
      description: "Тихий напарник — Pro (1 месяц)",
      returnUrl: resolveReturnUrl(request),
    });

    if (result.status === "disabled" || !result.confirmationUrl) {
      return NextResponse.json(
        { error: "checkout_unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      payment_id: result.paymentId,
      confirmation_url: result.confirmationUrl,
      amount_rub: amountRub,
      tier,
      provider: result.provider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    if (message === "yookassa_create_failed") {
      return NextResponse.json({ error: "provider_error" }, { status: 502 });
    }
    console.error("[billing/create-payment] failed", message);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}

/** Smoke — pricing snapshot without creating payment. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    billing_enabled: isBillingEnabled(),
    yookassa_configured: isYooKassaConfigured(),
    pro_price_rub: getProPriceRub(),
    accepts: ["POST"],
  });
}

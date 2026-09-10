/** Phase 5 billing gate — default OFF so staging stays free. */
export function isBillingEnabled(): boolean {
  return process.env.BILLING_ENABLED === "true";
}

/** Active acquirer; only yookassa implemented in MVP stub. */
export function getBillingProviderName(): "yookassa" | "cloudpayments" {
  const raw = process.env.BILLING_PROVIDER?.trim().toLowerCase();
  if (raw === "cloudpayments") return "cloudpayments";
  return "yookassa";
}

export function getProPriceRub(): number {
  const parsed = Number(process.env.BILLING_PRO_PRICE_RUB ?? "990");
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 990;
}

export function isYooKassaConfigured(): boolean {
  return Boolean(
    process.env.YOOKASSA_SHOP_ID?.trim() &&
      process.env.YOOKASSA_SECRET_KEY?.trim(),
  );
}

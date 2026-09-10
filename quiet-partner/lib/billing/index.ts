import {
  getBillingProviderName,
  getProPriceRub,
  isBillingEnabled,
  isYooKassaConfigured,
} from "./flags";
import type { BillingProvider } from "./types";
import { yooKassaProvider } from "./yookassa";

export {
  getBillingProviderName,
  getProPriceRub,
  isBillingEnabled,
  isYooKassaConfigured,
};
export type {
  BillingProvider,
  BillingTier,
  CreatePaymentInput,
  CreatePaymentResult,
  WebhookEvent,
} from "./types";

/** Resolve active billing provider from env. */
export function getBillingProvider(): BillingProvider {
  const name = getBillingProviderName();
  if (name === "cloudpayments") {
    // CloudPayments adapter — Phase 5 follow-up; fall back to stub shape.
    return yooKassaProvider;
  }
  return yooKassaProvider;
}

export function getBillingSnapshot() {
  return {
    enabled: isBillingEnabled(),
    provider: getBillingProviderName(),
    yookassa_configured: isYooKassaConfigured(),
    pro_price_rub: getProPriceRub(),
  };
}

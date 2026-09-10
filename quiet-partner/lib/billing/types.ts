/** Product tiers — maps to CPO freemium option A. */
export type BillingTier = "free" | "pro";

export type PaymentStatus =
  | "pending"
  | "waiting_for_capture"
  | "succeeded"
  | "canceled"
  | "disabled";

export type CreatePaymentInput = {
  userId?: string;
  email?: string;
  tier: BillingTier;
  amountRub: number;
  description: string;
  returnUrl: string;
};

export type CreatePaymentResult = {
  paymentId: string;
  confirmationUrl?: string;
  status: PaymentStatus;
  provider: string;
};

export type WebhookEvent = {
  provider: string;
  providerPaymentId: string;
  status: PaymentStatus;
  amountRub?: number;
  metadata?: Record<string, string>;
};

/** Provider plug-in — YooKassa first; CloudPayments later. */
export interface BillingProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  parseWebhook(request: Request): Promise<WebhookEvent | null>;
}

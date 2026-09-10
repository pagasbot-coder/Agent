import type {
  BillingProvider,
  CreatePaymentInput,
  CreatePaymentResult,
  WebhookEvent,
} from "./types";

const YOOKASSA_API = "https://api.yookassa.ru/v3";

function basicAuthHeader(): string | null {
  const shopId = process.env.YOOKASSA_SHOP_ID?.trim();
  const secret = process.env.YOOKASSA_SECRET_KEY?.trim();
  if (!shopId || !secret) return null;
  const token = Buffer.from(`${shopId}:${secret}`).toString("base64");
  return `Basic ${token}`;
}

/**
 * YooKassa acquirer — live API when keys set; stub id when billing OFF or keys missing.
 * @see knowledge-base/adr-005-payments-russia.md
 */
export const yooKassaProvider: BillingProvider = {
  name: "yookassa",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const auth = basicAuthHeader();
    if (!auth) {
      return {
        paymentId: "stub-disabled",
        status: "disabled",
        provider: "yookassa",
      };
    }

    const idempotenceKey = crypto.randomUUID();
    const body = {
      amount: { value: input.amountRub.toFixed(2), currency: "RUB" },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: input.returnUrl,
      },
      description: input.description.slice(0, 128),
      metadata: {
        tier: input.tier,
        ...(input.userId ? { user_id: input.userId } : {}),
      },
    };

    const response = await fetch(`${YOOKASSA_API}/payments`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[billing/yookassa] create payment failed", response.status, text);
      throw new Error("yookassa_create_failed");
    }

    const payload = (await response.json()) as {
      id?: string;
      status?: string;
      confirmation?: { confirmation_url?: string };
    };

    return {
      paymentId: payload.id ?? "unknown",
      confirmationUrl: payload.confirmation?.confirmation_url,
      status: payload.status === "pending" ? "pending" : "pending",
      provider: "yookassa",
    };
  },

  async parseWebhook(request: Request): Promise<WebhookEvent | null> {
    const auth = basicAuthHeader();
    if (!auth) return null;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return null;
    }

    const event = body as {
      event?: string;
      object?: {
        id?: string;
        status?: string;
        amount?: { value?: string };
        metadata?: Record<string, string>;
      };
    };

    if (!event.object?.id) return null;

    const statusMap: Record<string, WebhookEvent["status"]> = {
      pending: "pending",
      waiting_for_capture: "waiting_for_capture",
      succeeded: "succeeded",
      canceled: "canceled",
    };

    const rawStatus = event.object.status ?? "pending";
    const amountRub = event.object.amount?.value
      ? Math.round(Number(event.object.amount.value))
      : undefined;

    return {
      provider: "yookassa",
      providerPaymentId: event.object.id,
      status: statusMap[rawStatus] ?? "pending",
      amountRub,
      metadata: event.object.metadata,
    };
  },
};

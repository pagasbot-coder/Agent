import { NextResponse } from "next/server";

import {
  checkRateLimit,
  getClientIp,
  getRateLimitRetryAfterSec,
} from "@/lib/advisor/costGuardrails";
import { generateHealthCommentary } from "@/lib/advisor/llm";
import type { HealthCommentaryRequest } from "@/lib/advisor/types";
import { DOMAIN_IDS, type DomainId } from "@/lib/domains";

const MAX_BODY_BYTES = 16_384;

function isValidScore(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value) && value >= 0 && value <= 100;
}

function parseBody(body: unknown): HealthCommentaryRequest | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  if (!raw.domainScores || typeof raw.domainScores !== "object") return null;

  const scores = raw.domainScores as Record<string, unknown>;
  const domainScores = {} as Record<DomainId, number>;

  for (const id of DOMAIN_IDS) {
    const value = scores[id];
    if (!isValidScore(value)) return null;
    domainScores[id] = value;
  }

  const deliveryApproach = raw.deliveryApproach;
  if (
    deliveryApproach !== undefined &&
    deliveryApproach !== "predictive" &&
    deliveryApproach !== "adaptive" &&
    deliveryApproach !== "hybrid"
  ) {
    return null;
  }

  const locale = raw.locale;
  if (locale !== undefined && locale !== "ru" && locale !== "en") return null;

  let projectMeta: HealthCommentaryRequest["projectMeta"];
  if (raw.projectMeta && typeof raw.projectMeta === "object") {
    const meta = raw.projectMeta as Record<string, unknown>;
    projectMeta = {
      name: typeof meta.name === "string" ? meta.name.slice(0, 200) : undefined,
      phase: typeof meta.phase === "string" ? meta.phase.slice(0, 100) : undefined,
    };
  }

  return {
    domainScores,
    deliveryApproach: deliveryApproach as HealthCommentaryRequest["deliveryApproach"],
    locale: (locale as "ru" | "en") ?? "ru",
    projectMeta,
  };
}

/** BFF: health commentary via server-only LLM. */
export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "invalid_input", details: "body too large" },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(getRateLimitRetryAfterSec(ip)) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_input", details: "invalid JSON" },
      { status: 400 },
    );
  }

  const parsed = parseBody(body);
  if (!parsed) {
    return NextResponse.json(
      { error: "invalid_input", details: "domainScores must include D1–D8 (0–100)" },
      { status: 400 },
    );
  }

  const result = await generateHealthCommentary(parsed);
  return NextResponse.json(result);
}

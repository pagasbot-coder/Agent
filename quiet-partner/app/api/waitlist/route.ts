import { NextResponse } from "next/server";

import {
  getWaitlistBackend,
  normalizeWaitlistEmail,
  saveWaitlistSignup,
  type WaitlistSignupInput,
} from "@/lib/waitlist/store";

const MAX_BODY_BYTES = 2_048;
const ROLE_VALUES = new Set(["pm", "tech_lead", "head_of_delivery"]);

function parseBody(body: unknown): WaitlistSignupInput | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  if (typeof raw.email !== "string") return null;
  if (!normalizeWaitlistEmail(raw.email)) return null;

  const input: WaitlistSignupInput = { email: raw.email };

  if (typeof raw.source === "string") {
    input.source = raw.source.trim().slice(0, 64) || "waitlist";
  }

  if (typeof raw.role === "string") {
    const role = raw.role.trim() as WaitlistSignupInput["role"];
    if (role && ROLE_VALUES.has(role)) input.role = role;
  }

  return input;
}

/**
 * Waitlist capture BFF — noop default; optional local JSON file (WAITLIST_BACKEND=file).
 * No Listmonk / Postgres until Human scopes keys (T-044).
 */
export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const input = parseBody(body);
  if (!input) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    const result = await saveWaitlistSignup(input);
    return NextResponse.json({
      ok: true,
      message: result.duplicate
        ? "already_registered"
        : "registered",
      backend: result.backend,
      duplicate: result.duplicate,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    if (message === "postgres_not_ready") {
      return NextResponse.json(
        { error: "postgres_not_ready", backend: getWaitlistBackend() },
        { status: 503 },
      );
    }
    if (message === "invalid_email") {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    console.error("[waitlist] save failed", message);
    return NextResponse.json({ error: "storage_failed" }, { status: 500 });
  }
}

/** Smoke helper — backend mode only, no PII. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    backend: getWaitlistBackend(),
    accepts: ["POST"],
  });
}

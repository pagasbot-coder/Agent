import { NextResponse, type NextRequest } from "next/server";

import { handlers } from "@/auth";
import { isAuthEnabled } from "@/lib/auth/flags";

/** Auth.js route placeholder — 503 when AUTH_ENABLED=false (staging unchanged). */
export async function GET(request: NextRequest) {
  if (!isAuthEnabled()) {
    return NextResponse.json(
      { ok: false, auth_enabled: false, message: "Auth disabled (Phase 5 scaffold)" },
      { status: 503 },
    );
  }
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  if (!isAuthEnabled()) {
    return NextResponse.json(
      { ok: false, auth_enabled: false, message: "Auth disabled (Phase 5 scaffold)" },
      { status: 503 },
    );
  }
  return handlers.POST(request);
}

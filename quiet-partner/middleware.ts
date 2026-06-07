import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isAuthEnabled } from "@/lib/auth/flags";

/**
 * Auth middleware stub (ADR-003). Pass-through when AUTH_ENABLED=false (default).
 * Full session protection wired in T-035 activation pass.
 */
export function middleware(request: NextRequest) {
  void request;
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  // TODO Phase 5: auth() + redirect unauthenticated users from dashboard
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|waitlist|login).*)",
  ],
};

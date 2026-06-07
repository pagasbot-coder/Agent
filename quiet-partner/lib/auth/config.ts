import type { NextAuthConfig } from "next-auth";

import { isAuthEnabled } from "@/lib/auth/flags";

/**
 * Auth.js v5 config (ADR-003). Providers wired when AUTH_ENABLED=true + DATABASE_URL.
 * Scaffold only — no live DB or email until Phase 5 activation.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
  trustHost: true,
  callbacks: {
    authorized({ auth: session }) {
      if (!isAuthEnabled()) return true;
      return Boolean(session?.user);
    },
  },
};

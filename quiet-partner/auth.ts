import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth/config";

/** Auth.js v5 entry — handlers + server `auth()` for BFF (T-035 scaffold). */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

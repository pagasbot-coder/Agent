/** Phase 5 auth gate — default OFF so staging stays anonymous. */
export function isAuthEnabled(): boolean {
  return process.env.AUTH_ENABLED === "true";
}

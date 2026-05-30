/** localStorage key for RU analytics consent (ADR-002 Phase 4). */
export const ANALYTICS_CONSENT_KEY = "quiet-partner-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

/** Read consent — client only; null when unset. */
export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === "granted";
}

export function setAnalyticsConsent(consent: AnalyticsConsent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
}

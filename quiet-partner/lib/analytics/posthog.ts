/**
 * PostHog analytics stubs — OFF by default until Phase 4 (ADR-002).
 * No posthog-js import: zero bundle impact when disabled.
 * Real init/capture wiring — after consent banner + self-host deploy (Phase 4).
 */

/** MVP events per adr-002-analytics-posthog.md (no PII in properties). */
export type AnalyticsEvent =
  | "onboarding_complete"
  | "commentary_refresh"
  | "feedback_positive"
  | "feedback_negative"
  | "action_logged"
  | "landing_view"
  | "waitlist_submit";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

/** True when analytics should send events (Phase 4 only). */
export function isAnalyticsEnabled(): boolean {
  if (process.env.POSTHOG_DISABLED === "true") return false;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  return Boolean(key);
}

/** No-op until Phase 4: key present and POSTHOG_DISABLED !== "true". */
export function initPostHog(): void {
  if (!isAnalyticsEnabled()) return;
  // Phase 4: dynamic import posthog-js + init with NEXT_PUBLIC_POSTHOG_HOST
}

/** No-op capture — call sites stay stable for Phase 4 instrumentation. */
export function capture(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties,
): void {
  if (!isAnalyticsEnabled()) return;
  void event;
  void properties;
  // Phase 4: posthog.capture(event, sanitize(properties))
}

/** ADR-002 event helpers — thin wrappers over capture(). */

export function trackOnboardingComplete(props?: AnalyticsProperties): void {
  capture("onboarding_complete", props);
}

export function trackCommentaryRefresh(props?: AnalyticsProperties): void {
  capture("commentary_refresh", props);
}

export function trackFeedbackPositive(props?: AnalyticsProperties): void {
  capture("feedback_positive", props);
}

export function trackFeedbackNegative(props?: AnalyticsProperties): void {
  capture("feedback_negative", props);
}

export function trackActionLogged(props?: AnalyticsProperties): void {
  capture("action_logged", props);
}

export function trackLandingView(props?: AnalyticsProperties): void {
  capture("landing_view", props);
}

export function trackWaitlistSubmit(props?: AnalyticsProperties): void {
  capture("waitlist_submit", props);
}

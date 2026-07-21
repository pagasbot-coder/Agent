/**
 * PostHog analytics — OFF by default (ADR-002).
 * Self-host runbook: docs/posthog-self-host.md
 * Dynamic posthog-js import only when key present, not disabled, and user consented.
 */

import { hasAnalyticsConsent } from "@/lib/analytics/consent";
import { sanitizeAnalyticsProperties } from "@/lib/analytics/sanitize";

/** MVP events per adr-002-analytics-posthog.md (no PII in properties). */
export type AnalyticsEvent =
  | "onboarding_complete"
  | "commentary_refresh"
  | "feedback_positive"
  | "feedback_negative"
  | "action_logged"
  | "focus_week_view"
  | "focus_week_done"
  | "landing_view"
  | "waitlist_submit";

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

type PostHogClient = {
  init: (
    key: string,
    options: {
      api_host: string;
      capture_pageview: boolean;
      persistence: string;
    },
  ) => void;
  capture: (event: string, properties?: Record<string, unknown>) => void;
};

let posthogClient: PostHogClient | null = null;
let initPromise: Promise<void> | null = null;

/** True when env allows analytics (consent checked separately on client). */
export function isAnalyticsEnabled(): boolean {
  if (process.env.POSTHOG_DISABLED === "true") return false;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  return Boolean(key);
}

/** Lazy init posthog-js after consent — no bundle when disabled. */
export async function initPostHog(): Promise<void> {
  if (!isAnalyticsEnabled()) return;
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (posthogClient) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const mod = await import("posthog-js");
    const posthog = mod.default as PostHogClient;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
    if (!key) return;

    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
        "https://eu.i.posthog.com",
      capture_pageview: false,
      persistence: "localStorage",
    });
    posthogClient = posthog;
  })();

  return initPromise;
}

/** Capture event when enabled + consented; no-op otherwise. */
export function capture(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties,
): void {
  if (!isAnalyticsEnabled()) return;
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  const sanitized = sanitizeAnalyticsProperties(properties);

  void initPostHog().then(() => {
    posthogClient?.capture(event, sanitized);
  });
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

export function trackFocusWeekView(props?: AnalyticsProperties): void {
  capture("focus_week_view", props);
}

export function trackFocusWeekDone(props?: AnalyticsProperties): void {
  capture("focus_week_done", props);
}

export function trackLandingView(props?: AnalyticsProperties): void {
  capture("landing_view", props);
}

export function trackWaitlistSubmit(props?: AnalyticsProperties): void {
  capture("waitlist_submit", props);
}

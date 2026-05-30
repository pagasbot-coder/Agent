import type { AnalyticsProperties } from "@/lib/analytics/posthog";

/** ADR-002: no PII — only whitelisted aggregate props in event payloads. */
const ALLOWED_KEYS = new Set([
  "delivery_approach",
  "domain_count_red",
  "source",
]);

/** Strip unknown keys before PostHog capture. */
export function sanitizeAnalyticsProperties(
  properties?: AnalyticsProperties,
): AnalyticsProperties | undefined {
  if (!properties) return undefined;

  const sanitized: AnalyticsProperties = {};
  for (const [key, value] of Object.entries(properties)) {
    if (ALLOWED_KEYS.has(key) && value !== undefined) {
      sanitized[key] = value;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

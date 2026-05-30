import type { DeliveryApproach } from "@/lib/domains";
import type { AnalyticsProperties } from "@/lib/analytics/posthog";

/** Build ADR-002-safe props — no project name or email. */
export function buildAnalyticsContext(
  deliveryApproach: DeliveryApproach,
  domainCountRed: number,
  source?: string,
): AnalyticsProperties {
  const props: AnalyticsProperties = {
    delivery_approach: deliveryApproach,
    domain_count_red: domainCountRed,
  };
  if (source) props.source = source;
  return props;
}

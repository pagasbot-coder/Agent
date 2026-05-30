"use client";

import { type ReactNode, useEffect } from "react";

import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { hasAnalyticsConsent } from "@/lib/analytics/consent";
import { initPostHog, isAnalyticsEnabled } from "@/lib/analytics/posthog";

type AnalyticsProviderProps = {
  children: ReactNode;
};

/** Init PostHog after consent; passthrough when disabled (ADR-002). */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    if (isAnalyticsEnabled() && hasAnalyticsConsent()) {
      void initPostHog();
    }
  }, []);

  return (
    <>
      {children}
      {isAnalyticsEnabled() ? <AnalyticsConsent /> : null}
    </>
  );
}

"use client";

import { type ReactNode, useEffect } from "react";

import { initPostHog } from "@/lib/analytics/posthog";

type AnalyticsProviderProps = {
  children: ReactNode;
};

/** Passthrough wrapper — initPostHog is no-op until Phase 4 (ADR-002). */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return children;
}

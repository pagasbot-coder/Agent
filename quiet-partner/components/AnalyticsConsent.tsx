"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "@/lib/analytics/consent";
import { initPostHog, isAnalyticsEnabled } from "@/lib/analytics/posthog";

/** Minimal RU consent banner — shown only when PostHog key configured and unset consent. */
export function AnalyticsConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (!isAnalyticsEnabled()) return false;
    return getAnalyticsConsent() === null;
  });

  if (!visible) return null;

  const accept = () => {
    setAnalyticsConsent("granted");
    setVisible(false);
    void initPostHog();
  };

  const decline = () => {
    setAnalyticsConsent("denied");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Согласие на аналитику"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Анонимная аналитика помогает улучшать продукт. Без email и названия
          проекта — только агрегаты (ADR-002).
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={decline}>
            Отклонить
          </Button>
          <Button size="sm" onClick={accept}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}

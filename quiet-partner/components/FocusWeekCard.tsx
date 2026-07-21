"use client";

import { CheckCircle2, HelpCircle, Target } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildAnalyticsContext } from "@/lib/analytics/context";
import {
  trackFocusWeekDone,
  trackFocusWeekView,
} from "@/lib/analytics/posthog";
import {
  DEFAULT_DISCLAIMER,
  DOMAIN_DEFINITIONS,
  STATUS_COLORS,
  deriveDomainStatus,
} from "@/lib/domains";
import {
  formatFocusRefreshDate,
  getNextWeekRefreshDate,
} from "@/lib/focusWeek";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

const STATUS_ZONE_RU = {
  red: "красная зона",
  yellow: "жёлтая зона",
  green: "зелёная зона",
} as const;

/** Weekly focus card — one question from the weakest radar domain (T-080). */
export function FocusWeekCard() {
  const focusWeek = useProjectStore((s) => s.focusWeek);
  const ensureFocusWeek = useProjectStore((s) => s.ensureFocusWeek);
  const markFocusDone = useProjectStore((s) => s.markFocusDone);
  const domains = useProjectStore((s) => s.domains);
  const deliveryApproach = useProjectStore((s) => s.projectProfile.deliveryApproach);
  const getRedDomains = useProjectStore((s) => s.getRedDomains);
  const trackedWeekRef = useRef<string | null>(null);

  useEffect(() => {
    ensureFocusWeek();
  }, [ensureFocusWeek]);

  useEffect(() => {
    if (!focusWeek || trackedWeekRef.current === focusWeek.weekKey) return;
    trackedWeekRef.current = focusWeek.weekKey;
    trackFocusWeekView(
      buildAnalyticsContext(
        deliveryApproach,
        getRedDomains().length,
        "dashboard",
      ),
    );
  }, [focusWeek, deliveryApproach, getRedDomains]);

  if (!focusWeek) return null;

  const domain = domains[focusWeek.domainId];
  const def = DOMAIN_DEFINITIONS.find((d) => d.id === focusWeek.domainId)!;
  const status = deriveDomainStatus(domain.value);
  const colors = STATUS_COLORS[status];
  const isDone = Boolean(focusWeek.markedDoneAt);
  const refreshLabel = formatFocusRefreshDate(getNextWeekRefreshDate());

  const handleMarkDone = () => {
    if (isDone) return;
    markFocusDone();
    trackFocusWeekDone(
      buildAnalyticsContext(
        deliveryApproach,
        getRedDomains().length,
        "dashboard",
      ),
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-accent" aria-hidden />
            <CardTitle className="text-lg">Фокус недели</CardTitle>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Что такое фокус недели"
            title="Один вопрос в неделю из самой слабой зоны радара — чтобы перевести сигнал в действие."
          >
            <HelpCircle className="size-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              colors.bg,
              colors.text,
            )}
          >
            {def.shortLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            · {STATUS_ZONE_RU[status]} · {domain.value}/100
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-lg font-medium leading-snug text-foreground">
          {focusWeek.questionRu}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="sm"
            onClick={handleMarkDone}
            disabled={isDone}
            aria-pressed={isDone}
          >
            <CheckCircle2 className="size-4" aria-hidden />
            {isDone ? "Отмечено ✓" : "Отметить: сделал"}
          </Button>
          <p className="text-sm text-muted-foreground">
            обновится {refreshLabel}
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/60 pt-3">
        <p className="text-xs text-muted-foreground">{DEFAULT_DISCLAIMER}</p>
      </CardFooter>
    </Card>
  );
}

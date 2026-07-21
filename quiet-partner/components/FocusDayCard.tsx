"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  trackFocusDone,
  trackFocusOpenedInStages,
  trackFocusSet,
} from "@/lib/analytics/posthog";
import { isFocusDayDoneToday } from "@/lib/focusDay";
import { DOMAIN_DEFINITIONS } from "@/lib/domains";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

/** RU copy from docs/focus-today-microcopy.md (T-096). */
const COPY = {
  title: "Фокус на сегодня",
  empty:
    "Ещё нет фокуса на сегодня. Возьмите подсказку с радара или напишите свой приоритет.",
  fromRadar: "С радара",
  manual: "Вручную",
  stages: "Из пульта",
  openStages: "Открыть в пульте",
  fromRadarCta: "Взять с радара",
  refreshRadar: "Обновить с радара",
  done: "Сделано сегодня",
  doneLabel: "Отмечено на сегодня.",
  placeholder: "Что важно закрыть сегодня?",
  saveManual: "Сохранить фокус",
  confirmReplace:
    "Заменить ваш фокус подсказкой с радара? Текущая формулировка не сохранится.",
} as const;

type FocusDayCardProps = {
  /** Compact strip for stages/radar headers. */
  variant?: "hub" | "compact";
  className?: string;
};

/** Shared daily focus card (T-093 / T-094). */
export function FocusDayCard({
  variant = "hub",
  className,
}: FocusDayCardProps) {
  const focusDay = useProjectStore((s) => s.focusDay);
  const setFocusFromRadar = useProjectStore((s) => s.setFocusFromRadar);
  const setFocusManual = useProjectStore((s) => s.setFocusManual);
  const markFocusDayDone = useProjectStore((s) => s.markFocusDayDone);
  const [draft, setDraft] = useState("");

  const doneToday = isFocusDayDoneToday(focusDay);
  const domainLabel =
    focusDay?.domainId ?
      DOMAIN_DEFINITIONS.find((d) => d.id === focusDay.domainId)?.labelRu
    : null;

  const sourceLabel =
    focusDay?.source === "radar" ? COPY.fromRadar
    : focusDay?.source === "stages" ? COPY.stages
    : focusDay?.source === "manual" ? COPY.manual
    : null;

  const onRadar = () => {
    if (
      focusDay?.source === "manual" &&
      focusDay.title.trim() &&
      !window.confirm(COPY.confirmReplace)
    ) {
      return;
    }
    setFocusFromRadar();
    trackFocusSet({ source: "radar" });
  };

  const onSaveManual = () => {
    if (!draft.trim()) return;
    setFocusManual(draft);
    setDraft("");
    trackFocusSet({ source: "manual" });
  };

  return (
    <section
      className={cn(
        "rounded-xl border border-border/80 bg-card shadow-sm",
        variant === "hub" ? "p-5 sm:p-6" : "p-4",
        className,
      )}
      aria-label={COPY.title}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          className={cn(
            "font-semibold tracking-tight",
            variant === "hub" ? "text-lg" : "text-base",
          )}
        >
          {COPY.title}
        </h2>
        {sourceLabel && (
          <span className="text-xs text-muted-foreground">{sourceLabel}</span>
        )}
      </div>

      {!focusDay ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {COPY.empty}
        </p>
      ) : (
        <div className="mt-2 space-y-1">
          {domainLabel && (
            <p className="text-xs text-muted-foreground">Домен: {domainLabel}</p>
          )}
          <p
            className={cn(
              "text-sm leading-relaxed text-foreground",
              doneToday && "text-muted-foreground line-through",
            )}
          >
            {focusDay.title}
          </p>
          {doneToday && (
            <p className="text-xs text-muted-foreground">{COPY.doneLabel}</p>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {focusDay && !doneToday && (
          <Link
            href="/stages"
            onClick={() =>
              trackFocusOpenedInStages({ source: focusDay.source })
            }
          >
            <Button size="sm">{COPY.openStages}</Button>
          </Link>
        )}
        <Button
          type="button"
          size="sm"
          variant={focusDay ? "outline" : "default"}
          onClick={onRadar}
        >
          {focusDay ? COPY.refreshRadar : COPY.fromRadarCta}
        </Button>
        {focusDay && !doneToday && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              markFocusDayDone();
              trackFocusDone({ source: focusDay.source });
            }}
          >
            {COPY.done}
          </Button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={COPY.placeholder}
          className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveManual();
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!draft.trim()}
          onClick={onSaveManual}
        >
          {COPY.saveManual}
        </Button>
      </div>
    </section>
  );
}

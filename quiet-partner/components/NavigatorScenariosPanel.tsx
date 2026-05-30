"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { NAVIGATOR_SCENARIOS } from "@/lib/navigatorScenarios";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

/** Static S1–S4 reference — what «questions-first» commentary should look like. */
export function NavigatorScenariosPanel({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const setNavigatorContext = useProjectStore((s) => s.setNavigatorContext);
  const activeId = useProjectStore((s) => s.navigatorContext?.scenarioId);

  return (
    <section
      className={cn(
        "rounded-xl border border-border/80 bg-card p-4 shadow-sm",
        className,
      )}
      aria-label="Эталонные сценарии навигатора"
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <h2 className="text-sm font-semibold">Навигатор неопределённости</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            4 эталона для dogfood и регрессии промпта (T-016). Напарник должен
            сначала задавать вопросы.
          </p>
        </div>
        <span className="shrink-0 text-sm text-muted-foreground" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <ul className="mt-4 space-y-4">
          {NAVIGATOR_SCENARIOS.map((scenario) => (
            <li
              key={scenario.id}
              className="rounded-lg border border-border/60 bg-muted/20 p-3"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {scenario.id} · {scenario.title}
              </p>
              <p className="mt-2 text-sm italic text-foreground">
                «{scenario.userInput}»
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-muted-foreground">
                {scenario.expectations.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <Button
                type="button"
                size="sm"
                variant={activeId === scenario.id ? "default" : "outline"}
                className="mt-3"
                onClick={() =>
                  setNavigatorContext({
                    scenarioId: scenario.id,
                    userInput: scenario.userInput,
                  })
                }
              >
                Спросить напарника
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

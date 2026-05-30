"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { DomainRadar } from "@/components/DomainRadar";
import { HealthCommentary } from "@/components/HealthCommentary";
import { Button } from "@/components/ui/button";
import { DEFAULT_DISCLAIMER } from "@/lib/domains";
import {
  PROJECT_PERSIST_KEY,
  useProjectStore,
} from "@/lib/store/useProjectStore";

export function DashboardShell() {
  const runAudit = useProjectStore((s) => s.runAudit);
  const projectProfile = useProjectStore((s) => s.projectProfile);
  const { deliveryApproach, name, phase } = projectProfile;
  const showOnboardingBanner = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return !localStorage.getItem(PROJECT_PERSIST_KEY);
      } catch {
        return false;
      }
    },
    () => false,
  );

  const approachLabel =
    deliveryApproach === "predictive" ? "предиктивный"
    : deliveryApproach === "adaptive" ? "адаптивный"
    : "гибридный";

  return (
    <div className="min-h-full">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            PMBOK 7 · co-pilot
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Тихий напарник
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Восемь доменов эффективности — один взгляд на здоровье проекта.{" "}
            <span className="font-medium text-foreground">{name}</span>
            {phase ? ` · ${phase}` : ""} · подход: {approachLabel}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                Настроить проект
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => runAudit()}>
              Запустить аудит доменов
            </Button>
            <p className="text-xs text-muted-foreground">{DEFAULT_DISCLAIMER}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {showOnboardingBanner && (
          <div
            className="mb-6 flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            role="status"
          >
            <p className="text-sm text-foreground">
              Проект ещё не настроен — пройдите короткий онбординг, чтобы
              заполнить радар доменов.
            </p>
            <Link href="/onboarding" className="shrink-0">
              <Button>Пройдите настройку</Button>
            </Link>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          <section
            className="rounded-xl border border-border/80 bg-card p-6 shadow-sm lg:col-span-3"
            aria-label="Радар доменов"
          >
            <DomainRadar />
          </section>
          <section className="lg:col-span-2" aria-label="Комментарий напарника">
            <HealthCommentary />
          </section>
        </div>

        <footer className="mt-10 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-center text-xs text-muted-foreground">
          Продукт не сертифицирован PMI и не оценивает соответствие PMBOK.
          Оценки субъективны — настройте проект или меняйте домены вручную.
        </footer>
      </main>
    </div>
  );
}

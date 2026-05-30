"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DeliveryApproach } from "@/lib/domains";
import {
  computeDomainScoresFromOnboarding,
  DELIVERY_APPROACH_OPTIONS,
  DOMAIN_GLOSSARY,
  PAIN_OPTIONS,
  TURBULENCE_QUESTIONS,
  type PainOption,
  type TurbulenceAnswers,
} from "@/lib/onboarding";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 3;
const STEP_LABELS = ["Профиль", "Турбулентность", "Боль"] as const;

type Step = 1 | 2 | 3;

const DEFAULT_TURBULENCE: TurbulenceAnswers = {
  requirements: 3,
  technology: 3,
  stakeholders: 3,
};

/** Three-step onboarding wizard → Zustand hydrate + dashboard redirect. */
export function OnboardingWizard() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const hydrateFromOnboarding = useProjectStore((s) => s.hydrateFromOnboarding);

  const [step, setStep] = useState<Step>(1);
  const [projectName, setProjectName] = useState("");
  const [deliveryApproach, setDeliveryApproach] =
    useState<DeliveryApproach>("hybrid");
  const [turbulence, setTurbulence] =
    useState<TurbulenceAnswers>(DEFAULT_TURBULENCE);
  const [pain, setPain] = useState<PainOption>("schedule");
  const [showGlossary, setShowGlossary] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelector<HTMLElement>(
      'input:not([disabled]), button:not([disabled]), [tabindex="0"]',
    );
    focusable?.focus();
  }, [step, showGlossary]);

  const handleFinish = useCallback(() => {
    const trimmedName = projectName.trim() || "Мой проект";
    const scores = computeDomainScoresFromOnboarding({ turbulence, pain });
    hydrateFromOnboarding(scores, { name: trimmedName, deliveryApproach });
    router.push("/");
  }, [
    deliveryApproach,
    hydrateFromOnboarding,
    pain,
    projectName,
    router,
    turbulence,
  ]);

  const canProceedStep1 = projectName.trim().length > 0;

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-10 sm:px-6">
      <header className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Настройка проекта
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Тихий напарник
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Три коротких шага — меньше 3 минут.
        </p>
      </header>

      <div
        className="mb-6"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step}
        aria-label={`Шаг ${step} из ${TOTAL_STEPS}`}
      >
        <div className="mb-2 flex justify-between text-xs font-medium text-muted-foreground">
          <span>
            Шаг {step} из {TOTAL_STEPS}
          </span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {STEP_LABELS.map((label, index) => (
            <span
              key={label}
              className={cn(step === index + 1 && "font-medium text-primary")}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <Card
        ref={panelRef}
        role="region"
        aria-label={`Онбординг, шаг ${step}`}
        tabIndex={-1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Профиль проекта</CardTitle>
              <CardDescription>
                Название и подход к поставке — для tailoring подсказок
                напарника.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="project-name" className="text-sm font-medium">
                  Название проекта
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Например: Релиз CRM"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus-visible:ring-2"
                  autoComplete="off"
                />
              </div>
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium">
                  Подход к поставке
                </legend>
                {DELIVERY_APPROACH_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name="delivery-approach"
                      value={option.value}
                      checked={deliveryApproach === option.value}
                      onChange={() => setDeliveryApproach(option.value)}
                      className="size-4 accent-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </fieldset>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Турбулентность</CardTitle>
              <CardDescription>
                Оцените по шкале 1 (стабильно) — 5 (очень нестабильно).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {TURBULENCE_QUESTIONS.map((q) => (
                <div key={q.key} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <label
                      htmlFor={`slider-${q.key}`}
                      className="text-sm font-medium leading-snug"
                    >
                      {q.label}
                    </label>
                    <span
                      className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums"
                      aria-live="polite"
                    >
                      {turbulence[q.key]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{q.hint}</p>
                  <input
                    id={`slider-${q.key}`}
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={turbulence[q.key]}
                    onChange={(e) =>
                      setTurbulence((prev) => ({
                        ...prev,
                        [q.key]: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-primary"
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-valuenow={turbulence[q.key]}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>1 — стабильно</span>
                    <span>5 — хаос</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Главная боль</CardTitle>
              <CardDescription>
                Выберите одну зону — мы усилим сигнал на радаре.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <fieldset className="space-y-2">
                <legend className="sr-only">Главная боль проекта</legend>
                {PAIN_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      type="radio"
                      name="pain"
                      value={option.value}
                      checked={pain === option.value}
                      onChange={() => setPain(option.value)}
                      className="size-4 accent-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </fieldset>

              <div className="rounded-lg border border-dashed bg-muted/30 p-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left text-sm font-medium"
                  onClick={() => setShowGlossary((v) => !v)}
                  aria-expanded={showGlossary}
                >
                  <span>8 доменов — что это?</span>
                  <span aria-hidden="true">{showGlossary ? "−" : "?"}</span>
                </button>
                {showGlossary && (
                  <ul className="mt-3 space-y-2 border-t pt-3">
                    {Object.entries(DOMAIN_GLOSSARY).map(([id, hint]) => (
                      <li key={id} className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {id}
                        </span>{" "}
                        — {hint}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="justify-between gap-3">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as Step)}
            >
              Назад
            </Button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS ? (
            <Button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 1 && !canProceedStep1}
            >
              Далее
            </Button>
          ) : (
            <Button onClick={handleFinish}>Показать радар</Button>
          )}
        </CardFooter>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Оценки субъективны и не являются сертификацией PMBOK.
      </p>
    </div>
  );
}

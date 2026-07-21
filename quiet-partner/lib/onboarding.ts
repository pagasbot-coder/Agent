import {
  DOMAIN_DEFINITIONS,
  DOMAIN_IDS,
  type DomainId,
  type DeliveryApproach,
} from "@/lib/domains";

/** Slider value 1–5 → domain score per onboarding-spec draft formula. */
export function sliderToScore(slider: number): number {
  const raw = 100 - slider * 15;
  return Math.max(15, Math.min(85, Math.round(raw)));
}

export type TurbulenceAnswers = {
  requirements: number;
  technology: number;
  stakeholders: number;
};

export type PainOption =
  | "schedule"
  | "team"
  | "stakeholders"
  | "risks"
  | "metrics";

/** T-081 — Alferov «проработать проект» checklist item ids. */
export type ProjectPrepItemId =
  | "goal"
  | "boundaries"
  | "stakeholders_named"
  | "success_4w"
  | "top_risk"
  | "sponsor_clear"
  | "business_value";

export type ProjectPrepChecklist = Partial<Record<ProjectPrepItemId, boolean>>;

export type OnboardingAnswers = {
  projectName: string;
  deliveryApproach: DeliveryApproach;
  turbulence: TurbulenceAnswers;
  prepChecklist?: ProjectPrepChecklist;
  pain: PainOption;
};

/** Checklist labels + domain score bonuses when checked (T-081 handoff). */
export const PREP_CHECKLIST_ITEMS: {
  id: ProjectPrepItemId;
  label: string;
}[] = [
  { id: "goal", label: "Цель проекта сформулирована одной фразой" },
  { id: "boundaries", label: "Понятно, что НЕ входит в проект" },
  { id: "stakeholders_named", label: "Ключевые стороны названы" },
  { id: "success_4w", label: "Критерий успеха на 4 недели есть" },
  { id: "top_risk", label: "Главный риск записан" },
  { id: "sponsor_clear", label: "Есть понятный спонсор/заказчик" },
  { id: "business_value", label: "Ценность для бизнеса понятна команде" },
];

const PREP_CHECKLIST_DELTAS: Record<
  ProjectPrepItemId,
  Partial<Record<DomainId, number>>
> = {
  goal: { D4: 8, D6: 8 },
  boundaries: { D4: 6, D8: 5 },
  stakeholders_named: { D1: 10 },
  success_4w: { D6: 7, D7: 5 },
  top_risk: { D8: 10 },
  sponsor_clear: { D1: 8 },
  business_value: { D1: 5, D6: 5 },
};

/** Apply checked prep items as positive domain deltas (unchecked = no bonus). */
export function computePrepChecklistScoreDelta(
  checklist: ProjectPrepChecklist,
): Partial<Record<DomainId, number>> {
  const deltas: Partial<Record<DomainId, number>> = {};
  for (const item of PREP_CHECKLIST_ITEMS) {
    if (!checklist[item.id]) continue;
    const itemDeltas = PREP_CHECKLIST_DELTAS[item.id];
    for (const [domainId, delta] of Object.entries(itemDeltas) as [
      DomainId,
      number,
    ][]) {
      deltas[domainId] = (deltas[domainId] ?? 0) + delta;
    }
  }
  return deltas;
}

const NEUTRAL_BASELINE = 70;

const PAIN_PENALTIES: Record<PainOption, Partial<Record<DomainId, number>>> = {
  schedule: { D4: -15, D6: -10 },
  team: { D2: -20 },
  stakeholders: { D1: -20, D8: -10 },
  risks: { D8: -25 },
  metrics: { D7: -15 },
};

/** Map onboarding answers → initial domain scores for hydrateFromOnboarding. */
export function computeDomainScoresFromOnboarding(
  answers: Pick<OnboardingAnswers, "turbulence" | "pain" | "prepChecklist">,
): Record<DomainId, number> {
  const scores = Object.fromEntries(
    DOMAIN_IDS.map((id) => [id, NEUTRAL_BASELINE]),
  ) as Record<DomainId, number>;

  scores.D4 = sliderToScore(answers.turbulence.requirements);
  scores.D6 = sliderToScore(answers.turbulence.requirements);
  scores.D5 = sliderToScore(answers.turbulence.technology);
  scores.D8 = sliderToScore(answers.turbulence.technology);
  scores.D1 = sliderToScore(answers.turbulence.stakeholders);
  scores.D8 = Math.min(
    scores.D8,
    sliderToScore(answers.turbulence.stakeholders),
  );

  const prepDeltas = computePrepChecklistScoreDelta(answers.prepChecklist ?? {});
  for (const id of DOMAIN_IDS) {
    const bonus = prepDeltas[id] ?? 0;
    if (bonus) {
      scores[id] = Math.max(0, Math.min(100, scores[id] + bonus));
    }
  }

  const penalties = PAIN_PENALTIES[answers.pain];
  for (const id of DOMAIN_IDS) {
    const delta = penalties[id] ?? 0;
    scores[id] = Math.max(0, Math.min(100, scores[id] + delta));
  }

  return scores;
}

export const DELIVERY_APPROACH_OPTIONS: {
  value: DeliveryApproach;
  label: string;
}[] = [
  { value: "predictive", label: "Предиктивный" },
  { value: "adaptive", label: "Адаптивный" },
  { value: "hybrid", label: "Гибридный" },
];

export const TURBULENCE_QUESTIONS: {
  key: keyof TurbulenceAnswers;
  label: string;
  hint: string;
}[] = [
  {
    key: "requirements",
    label: "Насколько нестабильны требования?",
    hint: "Влияет на планирование и поставку",
  },
  {
    key: "technology",
    label: "Насколько нестабильны технологии?",
    hint: "Влияет на работу проекта и неопределённость",
  },
  {
    key: "stakeholders",
    label: "Насколько сложны стейкхолдеры?",
    hint: "Влияет на заинтересованные стороны и риски",
  },
];

export const PAIN_OPTIONS: { value: PainOption; label: string }[] = [
  { value: "schedule", label: "Сроки и план" },
  { value: "team", label: "Люди и команда" },
  { value: "stakeholders", label: "Заказчик и стейкхолдеры" },
  { value: "risks", label: "Риски и неизвестное" },
  { value: "metrics", label: "Метрики и отчёты" },
];

/** One-line glossary copy for domain tooltips (onboarding-spec). */
export const DOMAIN_GLOSSARY: Record<DomainId, string> = Object.fromEntries(
  DOMAIN_DEFINITIONS.map((d) => {
    const hints: Record<DomainId, string> = {
      D1: "Кто влияет на проект и согласованы ли ожидания",
      D2: "Роли, нагрузка, психологическая безопасность",
      D3: "Waterfall, Agile или гибрид на практике",
      D4: "Живой ли план на 2–3 недели вперёд",
      D5: "Поток задач и ресурсов",
      D6: "Принимается ли ценность заказчиком",
      D7: "Метрики ведут к решениям, а не к отчёту",
      D8: "Риски и «мы не знаем» под контролем",
    };
    return [d.id, hints[d.id]];
  }),
) as Record<DomainId, string>;

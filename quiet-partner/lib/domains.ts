/** PMBOK 7 performance domain identifiers. */
export type DomainId = "D1" | "D2" | "D3" | "D4" | "D5" | "D6" | "D7" | "D8";

export type DomainStatus = "red" | "yellow" | "green";

export type DeliveryApproach = "predictive" | "adaptive" | "hybrid";

export type DomainDefinition = {
  id: DomainId;
  labelRu: string;
  shortLabel: string;
};

/** Canonical RU labels from pmbok-domain-playbook. */
export const DOMAIN_DEFINITIONS: DomainDefinition[] = [
  { id: "D1", labelRu: "Заинтересованные стороны", shortLabel: "Стейкхолдеры" },
  { id: "D2", labelRu: "Команда", shortLabel: "Команда" },
  { id: "D3", labelRu: "Подход и жизненный цикл", shortLabel: "Подход" },
  { id: "D4", labelRu: "Планирование", shortLabel: "Планирование" },
  { id: "D5", labelRu: "Работа проекта", shortLabel: "Работа" },
  { id: "D6", labelRu: "Поставка", shortLabel: "Поставка" },
  { id: "D7", labelRu: "Измерение", shortLabel: "Измерение" },
  { id: "D8", labelRu: "Неопределённость", shortLabel: "Неопределённость" },
];

export const DOMAIN_IDS = DOMAIN_DEFINITIONS.map((d) => d.id);

export const DOMAIN_LABELS_RU: Record<DomainId, string> = Object.fromEntries(
  DOMAIN_DEFINITIONS.map((d) => [d.id, d.labelRu]),
) as Record<DomainId, string>;

/** Health signal thresholds per TZ/playbook: green ≥70, amber ≥40, red <40. */
export const THRESHOLD_RED = 40;
export const THRESHOLD_GREEN = 70;

/** Derive traffic-light status from subjective score 0–100. */
export function deriveDomainStatus(value: number): DomainStatus {
  if (value < THRESHOLD_RED) return "red";
  if (value < THRESHOLD_GREEN) return "yellow";
  return "green";
}

export const STATUS_COLORS: Record<
  DomainStatus,
  { fill: string; stroke: string; text: string; bg: string }
> = {
  green: {
    fill: "oklch(0.72 0.14 145)",
    stroke: "oklch(0.55 0.12 145)",
    text: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  yellow: {
    fill: "oklch(0.82 0.14 85)",
    stroke: "oklch(0.65 0.12 75)",
    text: "text-amber-700",
    bg: "bg-amber-100",
  },
  red: {
    fill: "oklch(0.65 0.18 25)",
    stroke: "oklch(0.52 0.2 25)",
    text: "text-red-700",
    bg: "bg-red-100",
  },
};

export const DEFAULT_DISCLAIMER =
  "Комментарий носит advisory-характер и не является сертификацией или оценкой соответствия PMBOK/PMI.";

/** Alias for UI components (prior agent compat). */
export const DISCLAIMER_RU = DEFAULT_DISCLAIMER;

/** Initial mock scores for spike demo (plan v1.1). */
export const MOCK_DOMAIN_SCORES: Record<DomainId, number> = {
  D1: 45,
  D2: 20,
  D3: 72,
  D4: 58,
  D5: 65,
  D6: 90,
  D7: 78,
  D8: 38,
};

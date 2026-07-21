import {
  DOMAIN_IDS,
  type DomainId,
} from "@/lib/domains";

/** Tie-break when multiple domains share the min score (handoff T-080 / TZ §2.1). */
export const FOCUS_TIE_BREAK_ORDER: DomainId[] = [
  "D6",
  "D1",
  "D8",
  "D2",
  "D4",
  "D5",
  "D7",
  "D3",
];

/** Static co-pilot focus questions — Senior PM approved (handoff v1, no BFF). */
export const FOCUS_QUESTIONS_RU: Record<DomainId, string> = {
  D1: "Кто последний раз менял ожидания — и зафиксировали ли вы это письменно?",
  D2: "Что команда сейчас делает сверх плана — и кто это видит?",
  D3: "Если завтра убрать один ritual — какой не заметят?",
  D4: "Какое одно решение вы отложили из-за нехватки данных в плане?",
  D5: "Какой блокер старше 3 дней — и кто его owner?",
  D6: "Что можно показать stakeholder на этой неделе — даже черновик?",
  D7: "Какая одна метрика, если ухудшится, заставит вас менять план?",
  D8: "Какой риск вы не записали, потому что «и так понятно»?",
};

export type FocusWeekState = {
  weekKey: string;
  domainId: DomainId;
  questionRu: string;
  markedDoneAt?: string;
};

/** ISO week key, e.g. "2026-W24". */
export function getWeekKey(date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Pick domain with lowest score; tie-break via FOCUS_TIE_BREAK_ORDER. */
export function pickWeakestDomain(
  scores: Record<DomainId, number>,
): DomainId {
  let minScore = Infinity;
  let candidates: DomainId[] = [];

  for (const id of DOMAIN_IDS) {
    const score = scores[id];
    if (score < minScore) {
      minScore = score;
      candidates = [id];
    } else if (score === minScore) {
      candidates.push(id);
    }
  }

  if (candidates.length === 1) return candidates[0]!;

  for (const id of FOCUS_TIE_BREAK_ORDER) {
    if (candidates.includes(id)) return id;
  }

  return candidates[0]!;
}

export function getFocusQuestion(domainId: DomainId): string {
  return FOCUS_QUESTIONS_RU[domainId];
}

/** Next ISO week start (Monday 00:00 local) for refresh hint. */
export function getNextWeekRefreshDate(from = new Date()): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  return d;
}

export function formatFocusRefreshDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

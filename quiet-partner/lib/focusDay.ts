import type { DomainId } from "@/lib/domains";
import { getFocusQuestion, pickWeakestDomain } from "@/lib/focusWeek";

/** Daily focus shared across hub / radar / stages (T-092). Distinct from weekly FocusWeek. */
export type FocusDaySource = "radar" | "manual" | "stages";

export type FocusDayState = {
  /** Local calendar day YYYY-MM-DD */
  dayKey: string;
  title: string;
  source: FocusDaySource;
  domainId?: DomainId;
  linkedStageId?: number;
  doneAt?: string;
  updatedAt: string;
};

export function getDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Build a radar-sourced focus from weakest domain scores. */
export function buildRadarFocusDay(
  scores: Record<DomainId, number>,
  linkedStageId?: number,
): FocusDayState {
  const domainId = pickWeakestDomain(scores);
  const now = new Date().toISOString();
  return {
    dayKey: getDayKey(),
    domainId,
    title: getFocusQuestion(domainId),
    source: "radar",
    linkedStageId,
    updatedAt: now,
  };
}

export function buildManualFocusDay(
  title: string,
  linkedStageId?: number,
): FocusDayState {
  const now = new Date().toISOString();
  return {
    dayKey: getDayKey(),
    title: title.trim(),
    source: "manual",
    linkedStageId,
    updatedAt: now,
  };
}

/** True if focus belongs to today and is marked done. */
export function isFocusDayDoneToday(focus: FocusDayState | null): boolean {
  if (!focus?.doneAt) return false;
  return focus.dayKey === getDayKey();
}

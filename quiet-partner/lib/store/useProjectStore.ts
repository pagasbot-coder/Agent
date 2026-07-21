"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  deriveDomainStatus,
  DOMAIN_DEFINITIONS,
  DOMAIN_IDS,
  MOCK_DOMAIN_SCORES,
  type DeliveryApproach,
  type DomainId,
  type DomainStatus,
} from "@/lib/domains";
import {
  getFocusQuestion,
  getWeekKey,
  pickWeakestDomain,
  type FocusWeekState,
} from "@/lib/focusWeek";
import {
  buildManualFocusDay,
  buildRadarFocusDay,
  getDayKey,
  type FocusDayState,
} from "@/lib/focusDay";
import type { ProjectPrepChecklist } from "@/lib/onboarding";
import {
  buildProjectSnapshot,
  type ProjectSnapshot,
} from "@/lib/exportProjectSnapshot";

export type DomainHealth = {
  id: DomainId;
  name: string;
  value: number;
  status: DomainStatus;
};

export type ProjectProfile = {
  name: string;
  deliveryApproach: DeliveryApproach;
  phase?: string;
  workstreamCount?: number;
  locale: "ru" | "en";
  updatedAt: string;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
};

export type CommentaryFeedbackCounts = {
  useful: number;
  notUseful: number;
};

/** Zustand persist key in localStorage (dogfood / onboarding banner). */
export const PROJECT_PERSIST_KEY = "quiet-partner-v1";

export type NavigatorContext = {
  scenarioId: string;
  userInput: string;
};

export type { FocusWeekState };
export type { FocusDayState };

/** T-082 — max 3 stakeholder rows (local only). */
export type StakeholderLite = {
  id: string;
  who: string;
  expectation: string;
  lastContactAt?: string;
  contactStale?: boolean;
};

/** T-083 — weekly snapshot reference (not full JSON blob). */
export type WeeklySnapshotRef = {
  exportedAt: string;
  overallHealth: number;
  weakestDomainId: DomainId;
};

export type RetentionReminder = {
  nextCheckInAt?: string;
  lastSnapshotAt?: string;
  snoozedUntil?: string;
  dismissedOverdue?: boolean;
};

type ProjectStore = {
  domains: Record<DomainId, DomainHealth>;
  projectProfile: ProjectProfile;
  focusWeek: FocusWeekState | null;
  /** Daily «фокус на сегодня» — hub / radar / stages (T-092). */
  focusDay: FocusDayState | null;
  projectPrepChecklist: ProjectPrepChecklist;
  stakeholdersLite: StakeholderLite[];
  weeklySnapshots: WeeklySnapshotRef[];
  retentionReminder: RetentionReminder;
  auditLog: AuditLogEntry[];
  commentaryFeedback: CommentaryFeedbackCounts;
  /** Session-only navigator scenario for BFF (not persisted). */
  navigatorContext: NavigatorContext | null;
  /** Bumps when navigator context applied — triggers commentary refetch. */
  commentaryTrigger: number;

  updateDomainHealth: (id: DomainId, value: number) => void;
  setProjectProfile: (patch: Partial<ProjectProfile>) => void;
  setDeliveryApproach: (approach: DeliveryApproach) => void;
  runAudit: () => { overall: number; weakest: DomainHealth[] };
  logAction: (action: string, details?: string) => void;
  getOverallHealth: () => number;
  getDomainList: () => DomainHealth[];
  getRedDomains: () => DomainHealth[];
  hydrateFromOnboarding: (
    scores: Partial<Record<DomainId, number>>,
    profile?: Pick<ProjectProfile, "name" | "deliveryApproach">,
    prepChecklist?: ProjectPrepChecklist,
  ) => void;
  setPrepChecklistItem: (
    id: keyof ProjectPrepChecklist,
    checked: boolean,
  ) => void;
  upsertStakeholderLite: (row: StakeholderLite) => void;
  removeStakeholderLite: (id: string) => void;
  recordWeeklySnapshot: () => ProjectSnapshot;
  snoozeRetentionReminder: (days?: number) => void;
  dismissRetentionOverdue: () => void;
  setScore: (id: DomainId, value: number) => void;
  recordCommentaryFeedback: (kind: "useful" | "not_useful") => void;
  setNavigatorContext: (context: NavigatorContext) => void;
  clearNavigatorContext: () => void;
  ensureFocusWeek: () => void;
  markFocusDone: () => void;
  setFocusFromRadar: (linkedStageId?: number) => void;
  setFocusManual: (title: string, linkedStageId?: number) => void;
  markFocusDayDone: () => void;
  clearFocusDay: () => void;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildDomainHealth(id: DomainId, value: number): DomainHealth {
  const def = DOMAIN_DEFINITIONS.find((d) => d.id === id)!;
  return {
    id,
    name: def.labelRu,
    value: clampScore(value),
    status: deriveDomainStatus(value),
  };
}

function buildInitialDomains(
  scores: Record<DomainId, number>,
): Record<DomainId, DomainHealth> {
  return Object.fromEntries(
    DOMAIN_IDS.map((id) => [id, buildDomainHealth(id, scores[id])]),
  ) as Record<DomainId, DomainHealth>;
}

/** Zustand store: domain health, project profile, audit trail. */
export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      domains: buildInitialDomains(MOCK_DOMAIN_SCORES),
      focusWeek: null,
      focusDay: null,
      projectPrepChecklist: {},
      stakeholdersLite: [],
      weeklySnapshots: [],
      retentionReminder: {},
      projectProfile: {
        name: "Пилотный проект",
        deliveryApproach: "hybrid",
        phase: "build",
        locale: "ru",
        updatedAt: new Date().toISOString(),
      },
      auditLog: [],
      commentaryFeedback: { useful: 0, notUseful: 0 },
      navigatorContext: null,
      commentaryTrigger: 0,

      updateDomainHealth: (id, value) => {
        set((state) => ({
          domains: {
            ...state.domains,
            [id]: buildDomainHealth(id, value),
          },
          projectProfile: {
            ...state.projectProfile,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      setScore: (id, value) => {
        get().updateDomainHealth(id, value);
      },

      setProjectProfile: (patch) => {
        set((state) => ({
          projectProfile: {
            ...state.projectProfile,
            ...patch,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      setDeliveryApproach: (approach) => {
        get().setProjectProfile({ deliveryApproach: approach });
      },

      runAudit: () => {
        const domains = get().getDomainList();
        const overall = get().getOverallHealth();
        const weakest = [...domains]
          .sort((a, b) => a.value - b.value)
          .slice(0, 3);
        get().logAction("audit", `Общий индекс: ${overall}`);
        return { overall, weakest };
      },

      logAction: (action, details) => {
        set((state) => ({
          auditLog: [
            {
              id: crypto.randomUUID(),
              action,
              timestamp: new Date().toISOString(),
              details,
            },
            ...state.auditLog.slice(0, 49),
          ],
        }));
      },

      getOverallHealth: () => {
        const list = get().getDomainList();
        if (list.length === 0) return 0;
        const sum = list.reduce((acc, d) => acc + d.value, 0);
        return Math.round(sum / list.length);
      },

      getDomainList: () => DOMAIN_IDS.map((id) => get().domains[id]),

      getRedDomains: () =>
        get().getDomainList().filter((d) => d.status === "red"),

      hydrateFromOnboarding: (scores, profile, prepChecklist) => {
        set((state) => {
          const next = { ...state.domains };
          for (const [id, value] of Object.entries(scores) as [
            DomainId,
            number,
          ][]) {
            if (value !== undefined) {
              next[id] = buildDomainHealth(id, value);
            }
          }
          return {
            domains: next,
            projectProfile: {
              ...state.projectProfile,
              ...profile,
              updatedAt: new Date().toISOString(),
            },
            projectPrepChecklist: prepChecklist ?? state.projectPrepChecklist,
          };
        });
        get().logAction("onboarding_hydrate", "Scores from onboarding wizard");
      },

      setPrepChecklistItem: (id, checked) => {
        set((state) => ({
          projectPrepChecklist: {
            ...state.projectPrepChecklist,
            [id]: checked,
          },
        }));
      },

      upsertStakeholderLite: (row) => {
        set((state) => {
          const existing = state.stakeholdersLite.find((s) => s.id === row.id);
          const next =
            existing ?
              state.stakeholdersLite.map((s) => (s.id === row.id ? row : s))
            : state.stakeholdersLite.length < 3 ?
              [...state.stakeholdersLite, row]
            : state.stakeholdersLite;
          return { stakeholdersLite: next };
        });
        get().logAction("stakeholder_lite_save", row.who.slice(0, 40));
      },

      removeStakeholderLite: (id) => {
        set((state) => ({
          stakeholdersLite: state.stakeholdersLite.filter((s) => s.id !== id),
        }));
      },

      recordWeeklySnapshot: () => {
        const snapshot = buildProjectSnapshot(
          get().domains,
          get().projectProfile,
          get().commentaryFeedback,
        );
        const scores = Object.fromEntries(
          DOMAIN_IDS.map((id) => [id, get().domains[id].value]),
        ) as Record<DomainId, number>;
        const weakestDomainId = pickWeakestDomain(scores);
        const ref: WeeklySnapshotRef = {
          exportedAt: snapshot.exportedAt,
          overallHealth: get().getOverallHealth(),
          weakestDomainId,
        };
        const nextCheckIn = new Date();
        nextCheckIn.setDate(nextCheckIn.getDate() + 7);

        set((state) => ({
          weeklySnapshots: [ref, ...state.weeklySnapshots].slice(0, 12),
          retentionReminder: {
            ...state.retentionReminder,
            lastSnapshotAt: snapshot.exportedAt,
            nextCheckInAt: nextCheckIn.toISOString(),
            dismissedOverdue: false,
          },
        }));
        get().logAction("weekly_snapshot", `overall ${ref.overallHealth}`);
        return snapshot;
      },

      snoozeRetentionReminder: (days = 7) => {
        const snoozedUntil = new Date();
        snoozedUntil.setDate(snoozedUntil.getDate() + days);
        set((state) => ({
          retentionReminder: {
            ...state.retentionReminder,
            snoozedUntil: snoozedUntil.toISOString(),
            dismissedOverdue: true,
          },
        }));
      },

      dismissRetentionOverdue: () => {
        set((state) => ({
          retentionReminder: {
            ...state.retentionReminder,
            dismissedOverdue: true,
          },
        }));
      },

      recordCommentaryFeedback: (kind) => {
        set((state) => ({
          commentaryFeedback: {
            ...state.commentaryFeedback,
            useful:
              kind === "useful" ?
                state.commentaryFeedback.useful + 1
              : state.commentaryFeedback.useful,
            notUseful:
              kind === "not_useful" ?
                state.commentaryFeedback.notUseful + 1
              : state.commentaryFeedback.notUseful,
          },
        }));
        get().logAction(
          kind === "useful" ? "feedback_useful" : "feedback_not_useful",
          kind === "useful" ? "Комментарий: полезно" : "Комментарий: не полезно",
        );
      },

      setNavigatorContext: (context) => {
        set((state) => ({
          navigatorContext: context,
          commentaryTrigger: state.commentaryTrigger + 1,
        }));
        get().logAction(
          "navigator_scenario",
          `${context.scenarioId}: ${context.userInput.slice(0, 80)}`,
        );
      },

      clearNavigatorContext: () => {
        set({ navigatorContext: null });
      },

      ensureFocusWeek: () => {
        const currentKey = getWeekKey();
        const existing = get().focusWeek;
        if (existing?.weekKey === currentKey) return;

        const scores = Object.fromEntries(
          DOMAIN_IDS.map((id) => [id, get().domains[id].value]),
        ) as Record<DomainId, number>;
        const domainId = pickWeakestDomain(scores);

        set({
          focusWeek: {
            weekKey: currentKey,
            domainId,
            questionRu: getFocusQuestion(domainId),
          },
        });
      },

      markFocusDone: () => {
        const focus = get().focusWeek;
        if (!focus || focus.markedDoneAt) return;

        const domain = get().domains[focus.domainId];
        const bumped = clampScore(domain.value + 1);

        set((state) => ({
          focusWeek: {
            ...focus,
            markedDoneAt: new Date().toISOString(),
          },
          domains: {
            ...state.domains,
            [focus.domainId]: buildDomainHealth(focus.domainId, bumped),
          },
        }));

        get().logAction(
          "focus_week_done",
          `Фокус недели (${focus.domainId}): отметил «сделал»`,
        );
      },

      setFocusFromRadar: (linkedStageId) => {
        const scores = Object.fromEntries(
          DOMAIN_IDS.map((id) => [id, get().domains[id].value]),
        ) as Record<DomainId, number>;
        const next = buildRadarFocusDay(scores, linkedStageId);
        set({ focusDay: next });
        get().logAction(
          "focus_day_set",
          `radar ${next.domainId}: ${next.title.slice(0, 60)}`,
        );
      },

      setFocusManual: (title, linkedStageId) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const next = buildManualFocusDay(trimmed, linkedStageId);
        set({ focusDay: next });
        get().logAction("focus_day_set", `manual: ${trimmed.slice(0, 60)}`);
      },

      markFocusDayDone: () => {
        const focus = get().focusDay;
        if (!focus || focus.doneAt) return;
        const dayKey = getDayKey();
        set({
          focusDay: {
            ...focus,
            dayKey,
            doneAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
        get().logAction("focus_day_done", focus.title.slice(0, 60));
      },

      clearFocusDay: () => {
        set({ focusDay: null });
        get().logAction("focus_day_clear");
      },
    }),
    {
      name: PROJECT_PERSIST_KEY,
      partialize: (state) => ({
        domains: state.domains,
        projectProfile: state.projectProfile,
        commentaryFeedback: state.commentaryFeedback,
        focusWeek: state.focusWeek,
        focusDay: state.focusDay,
        projectPrepChecklist: state.projectPrepChecklist,
        stakeholdersLite: state.stakeholdersLite,
        weeklySnapshots: state.weeklySnapshots,
        retentionReminder: state.retentionReminder,
      }),
    },
  ),
);

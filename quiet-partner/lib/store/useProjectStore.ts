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

type ProjectStore = {
  domains: Record<DomainId, DomainHealth>;
  projectProfile: ProjectProfile;
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
  ) => void;
  setScore: (id: DomainId, value: number) => void;
  recordCommentaryFeedback: (kind: "useful" | "not_useful") => void;
  setNavigatorContext: (context: NavigatorContext) => void;
  clearNavigatorContext: () => void;
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

      hydrateFromOnboarding: (scores, profile) => {
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
          };
        });
        get().logAction("onboarding_hydrate", "Scores from onboarding wizard");
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
    }),
    {
      name: PROJECT_PERSIST_KEY,
      partialize: (state) => ({
        domains: state.domains,
        projectProfile: state.projectProfile,
        commentaryFeedback: state.commentaryFeedback,
      }),
    },
  ),
);

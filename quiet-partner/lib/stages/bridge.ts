import type { DomainId } from "@/lib/domains";
import { STAGES, type RegisterRow } from "@/lib/stages/registers";
import { suggestScoresFromRegisters } from "@/lib/stages/suggestScores";

export const STAGES_BRIDGE_SCHEMA = 1 as const;

/** Snapshot pulled from pulpit into Quiet Partner (ADR-006). */
export type StagesRadarSnapshot = {
  schemaVersion: typeof STAGES_BRIDGE_SCHEMA;
  projectKey: string;
  stagesUpdatedAt: string;
  source: "stages";
  project: {
    name: string;
    stageId: number;
    stageName: string;
  };
  registers: Record<string, RegisterRow[]>;
  suggestedScores: Record<DomainId, number>;
  registerRowCount: number;
};

/** Link metadata persisted in project store after apply. */
export type StagesBridgeLink = {
  projectKey: string;
  projectName: string;
  stageId: number;
  stageName: string;
  linkedAt: string;
  stagesUpdatedAt: string;
  source: "stages";
};

export function stageNameById(stageId: number): string {
  return STAGES.find((s) => s.id === stageId)?.name ?? `Этап ${stageId}`;
}

/** Stable-ish key for browser session (no server id). */
export function ensureStagesProjectKey(existing?: string | null): string {
  if (existing && existing.trim()) return existing.trim();
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `stages-${Date.now()}`;
}

export function countRegisterRows(
  cache: Record<string, RegisterRow[]>,
): number {
  let n = 0;
  for (const rows of Object.values(cache)) {
    for (const row of rows ?? []) {
      if (Object.values(row).some((v) => String(v ?? "").trim())) n += 1;
    }
  }
  return n;
}

/** Build snapshot from current pulpit state. */
export function buildStagesSnapshot(input: {
  projectName: string;
  stageId: number;
  cache: Record<string, RegisterRow[]>;
  projectKey?: string | null;
}): StagesRadarSnapshot {
  const name = input.projectName.trim() || "Проект из пульта";
  const stageId = Math.min(6, Math.max(0, input.stageId));
  const suggestedScores = suggestScoresFromRegisters(input.cache, stageId);
  const stagesUpdatedAt = new Date().toISOString();
  return {
    schemaVersion: STAGES_BRIDGE_SCHEMA,
    projectKey: ensureStagesProjectKey(input.projectKey),
    stagesUpdatedAt,
    source: "stages",
    project: {
      name,
      stageId,
      stageName: stageNameById(stageId),
    },
    registers: input.cache,
    suggestedScores,
    registerRowCount: countRegisterRows(input.cache),
  };
}

export function bridgeNeedsOverwriteConfirm(
  snapshot: StagesRadarSnapshot,
  current: {
    name: string;
    bridge: StagesBridgeLink | null;
  },
): boolean {
  const currentName = current.name.trim();
  const snapName = snapshot.project.name.trim();
  if (
    current.bridge &&
    current.bridge.projectKey !== snapshot.projectKey &&
    current.bridge.projectName.trim() !== snapName
  ) {
    return true;
  }
  if (
    currentName &&
    currentName !== "Пилотный проект" &&
    currentName !== snapName
  ) {
    return true;
  }
  return false;
}

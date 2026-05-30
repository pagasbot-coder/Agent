import { DEFAULT_DISCLAIMER, DOMAIN_IDS, type DomainId } from "@/lib/domains";
import type { DomainHealth, ProjectProfile } from "@/lib/store/useProjectStore";

/** Client-side share payload — no PII beyond project name user entered. */
export type ProjectSnapshot = {
  exportedAt: string;
  disclaimer: string;
  project: Pick<ProjectProfile, "name" | "deliveryApproach" | "phase">;
  domains: { id: DomainId; label: string; value: number; status: string }[];
  feedback?: { useful: number; notUseful: number };
};

export function buildProjectSnapshot(
  domains: Record<DomainId, DomainHealth>,
  projectProfile: ProjectProfile,
  feedback?: { useful: number; notUseful: number },
): ProjectSnapshot {
  return {
    exportedAt: new Date().toISOString(),
    disclaimer: DEFAULT_DISCLAIMER,
    project: {
      name: projectProfile.name,
      deliveryApproach: projectProfile.deliveryApproach,
      phase: projectProfile.phase,
    },
    domains: DOMAIN_IDS.map((id) => ({
      id,
      label: domains[id].name,
      value: domains[id].value,
      status: domains[id].status,
    })),
    feedback,
  };
}

export function snapshotToJson(snapshot: ProjectSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

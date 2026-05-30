import type { DeliveryApproach, DomainId } from "@/lib/domains";

export type HealthCommentaryRequest = {
  domainScores: Record<DomainId, number>;
  deliveryApproach?: DeliveryApproach;
  locale?: "ru" | "en";
  projectMeta?: { name?: string; phase?: string };
};

export type HealthCommentaryResponse = {
  commentary: string;
  questions?: string[];
  disclaimer: string;
};

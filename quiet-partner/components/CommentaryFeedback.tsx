"use client";

import { CheckCircle2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { buildAnalyticsContext } from "@/lib/analytics/context";
import {
  trackActionLogged,
  trackFeedbackNegative,
  trackFeedbackPositive,
} from "@/lib/analytics/posthog";
import { useProjectStore } from "@/lib/store/useProjectStore";

/** North Star dogfood: thumbs + optional action mark after commentary loads. */
export function CommentaryFeedback() {
  const recordCommentaryFeedback = useProjectStore((s) => s.recordCommentaryFeedback);
  const logAction = useProjectStore((s) => s.logAction);
  const counts = useProjectStore((s) => s.commentaryFeedback);
  const deliveryApproach = useProjectStore((s) => s.projectProfile.deliveryApproach);
  const getRedDomains = useProjectStore((s) => s.getRedDomains);

  const [vote, setVote] = useState<"useful" | "not_useful" | null>(null);
  const [actionMarked, setActionMarked] = useState(false);

  const analyticsContext = buildAnalyticsContext(
    deliveryApproach,
    getRedDomains().length,
    "dashboard",
  );

  const handleVote = (kind: "useful" | "not_useful") => {
    if (vote) return;
    setVote(kind);
    recordCommentaryFeedback(kind);
    if (kind === "useful") {
      trackFeedbackPositive(analyticsContext);
    } else {
      trackFeedbackNegative(analyticsContext);
    }
  };

  const handleMarkAction = () => {
    if (actionMarked) return;
    setActionMarked(true);
    logAction("action_marked", "Отметил действие по комментарию напарника");
    trackActionLogged(analyticsContext);
  };

  return (
    <div
      className="space-y-3 border-t border-border/60 pt-4"
      aria-label="Обратная связь по комментарию"
    >
      <p className="text-xs font-medium text-muted-foreground">
        Было полезно?
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={vote === "useful" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("useful")}
          disabled={vote !== null && vote !== "useful"}
          aria-pressed={vote === "useful"}
        >
          <ThumbsUp className="size-4" aria-hidden />
          Полезно
        </Button>
        <Button
          type="button"
          variant={vote === "not_useful" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("not_useful")}
          disabled={vote !== null && vote !== "not_useful"}
          aria-pressed={vote === "not_useful"}
        >
          <ThumbsDown className="size-4" aria-hidden />
          Не полезно
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleMarkAction}
          disabled={actionMarked}
        >
          <CheckCircle2 className="size-4" aria-hidden />
          Отметить действие
        </Button>
      </div>
      {(counts.useful > 0 || counts.notUseful > 0) && (
        <p className="text-[11px] text-muted-foreground" aria-live="polite">
          Всего отзывов (локально): полезно {counts.useful}, не полезно{" "}
          {counts.notUseful}
        </p>
      )}
    </div>
  );
}

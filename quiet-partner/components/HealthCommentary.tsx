"use client";

import { Brain, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { CommentaryFeedback } from "@/components/CommentaryFeedback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_DISCLAIMER, DOMAIN_IDS, type DomainId } from "@/lib/domains";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { HealthCommentaryResponse } from "@/lib/advisor/types";
import { cn } from "@/lib/utils";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: HealthCommentaryResponse; fetchedAt: string }
  | { status: "error"; message: string };

/** AI health commentary card — fetches BFF on mount and refresh. */
export function HealthCommentary() {
  const domains = useProjectStore((s) => s.domains);
  const projectProfile = useProjectStore((s) => s.projectProfile);
  const getRedDomains = useProjectStore((s) => s.getRedDomains);
  const logAction = useProjectStore((s) => s.logAction);

  const [state, setState] = useState<FetchState>({ status: "idle" });

  const redCount = getRedDomains().length;
  const alertBorder = redCount >= 2;

  const fetchCommentary = useCallback(async () => {
    setState({ status: "loading" });
    logAction("commentary_fetch");

    const domainScores = Object.fromEntries(
      DOMAIN_IDS.map((id) => [id, domains[id].value]),
    ) as Record<DomainId, number>;

    try {
      const res = await fetch("/api/advisor/health-commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainScores,
          deliveryApproach: projectProfile.deliveryApproach,
          locale: projectProfile.locale,
          projectMeta: {
            name: projectProfile.name,
            phase: projectProfile.phase,
          },
        }),
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errBody.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as HealthCommentaryResponse;
      setState({
        status: "success",
        data,
        fetchedAt: new Date().toISOString(),
      });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ?
            err.message
          : "Не удалось получить комментарий",
      });
    }
  }, [domains, projectProfile, logAction]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchCommentary();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchCommentary]);

  return (
    <Card
      className={cn(
        "h-full shadow-sm transition-shadow",
        alertBorder && "border-l-4 border-l-destructive",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-accent" aria-hidden />
            <div>
              <CardTitle>Комментарий напарника</CardTitle>
              <CardDescription>
                Вопросы и наблюдения по сигналам здоровья
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchCommentary()}
            disabled={state.status === "loading"}
            aria-label="Обновить комментарий"
          >
            <RefreshCw
              className={cn(
                "size-4",
                state.status === "loading" && "animate-spin",
              )}
            />
            Обновить
          </Button>
        </div>
      </CardHeader>

      <CardContent className="min-h-[200px] space-y-4">
        {state.status === "loading" || state.status === "idle" ?
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="mt-4 h-3 w-2/3" />
          </div>
        : state.status === "error" ?
          <div className="space-y-3" role="alert">
            <p className="text-sm text-destructive">
              Не удалось загрузить комментарий: {state.message}
            </p>
            <Button variant="outline" size="sm" onClick={() => void fetchCommentary()}>
              Повторить
            </Button>
          </div>
        : <>
            <p className="text-sm leading-relaxed text-foreground">
              {state.data.commentary}
            </p>
            {state.data.questions && state.data.questions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Уточняющие вопросы
                </p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {state.data.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
            <CommentaryFeedback key={state.fetchedAt} />
          </>
        }
      </CardContent>

      <CardFooter className="flex-col items-start gap-1">
        <p className="text-xs text-muted-foreground">
          {state.status === "success" ?
            state.data.disclaimer
          : DEFAULT_DISCLAIMER}
        </p>
        {alertBorder && (
          <p className="text-xs font-medium text-red-700">
            {redCount} домена в красной зоне — стоит разобрать приоритеты на этой неделе.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

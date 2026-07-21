"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

/** Banner after pulpit → radar pull (A with banner). */
export function StagesBridgeBanner({ className }: { className?: string }) {
  const bridge = useProjectStore((s) => s.stagesBridge);
  if (!bridge) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      role="status"
    >
      <div className="space-y-1 text-sm">
        <p className="font-medium text-foreground">
          {bridge.projectName}
          <span className="font-normal text-muted-foreground">
            {" "}
            · этап: {bridge.stageName}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          Проект из пульта этапов. Оценка — подсказка co-pilot, можно поправить
          на радаре. Не сертификация PMBOK — co-pilot для мышления.
        </p>
      </div>
      <Link href="/stages" className="shrink-0">
        <Button type="button" variant="outline" size="sm">
          Открыть пульт
        </Button>
      </Link>
    </div>
  );
}

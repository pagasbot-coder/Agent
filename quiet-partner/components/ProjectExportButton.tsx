"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildProjectSnapshot,
  snapshotToJson,
} from "@/lib/exportProjectSnapshot";
import { useProjectStore } from "@/lib/store/useProjectStore";

/** Copy/download JSON snapshot for dogfood share — no backend (Phase 4 MVP). */
export function ProjectExportButton() {
  const domains = useProjectStore((s) => s.domains);
  const projectProfile = useProjectStore((s) => s.projectProfile);
  const commentaryFeedback = useProjectStore((s) => s.commentaryFeedback);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    try {
      const snapshot = buildProjectSnapshot(
        domains,
        projectProfile,
        commentaryFeedback,
      );
      const json = snapshotToJson(snapshot);
      await navigator.clipboard.writeText(json);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  function handleDownload() {
    const snapshot = buildProjectSnapshot(
      domains,
      projectProfile,
      commentaryFeedback,
    );
    const blob = new Blob([snapshotToJson(snapshot)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `quiet-partner-snapshot-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" type="button" onClick={() => void handleCopy()}>
        {status === "copied" ? "Скопировано" : "Копировать снимок"}
      </Button>
      <Button variant="ghost" size="sm" type="button" onClick={handleDownload}>
        Скачать JSON
      </Button>
      {status === "error" && (
        <span className="text-xs text-destructive" role="alert">
          Не удалось скопировать
        </span>
      )}
      <p className="w-full text-xs text-muted-foreground">
        Снимок радара для dogfood или заметок — без отправки на сервер.
      </p>
    </div>
  );
}

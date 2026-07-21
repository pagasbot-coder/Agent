"use client";

import { Camera } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildProjectSnapshot,
  snapshotToJson,
} from "@/lib/exportProjectSnapshot";
import { useProjectStore } from "@/lib/store/useProjectStore";

/** Copy/download JSON snapshot + weekly snapshot reminder (T-042, T-083). */
export function ProjectExportButton() {
  const domains = useProjectStore((s) => s.domains);
  const projectProfile = useProjectStore((s) => s.projectProfile);
  const commentaryFeedback = useProjectStore((s) => s.commentaryFeedback);
  const recordWeeklySnapshot = useProjectStore((s) => s.recordWeeklySnapshot);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const [snapshotSaved, setSnapshotSaved] = useState(false);

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

  function handleWeeklySnapshot() {
    recordWeeklySnapshot();
    setSnapshotSaved(true);
    window.setTimeout(() => setSnapshotSaved(false), 3000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" type="button" onClick={() => void handleCopy()}>
        {status === "copied" ? "Скопировано" : "Копировать снимок"}
      </Button>
      <Button variant="ghost" size="sm" type="button" onClick={handleDownload}>
        Скачать JSON
      </Button>
      <Button
        variant="default"
        size="sm"
        type="button"
        onClick={handleWeeklySnapshot}
      >
        <Camera className="size-4" aria-hidden />
        {snapshotSaved ? "Снимок сохранён" : "Снимок недели"}
      </Button>
      {status === "error" && (
        <span className="text-xs text-destructive" role="alert">
          Не удалось скопировать
        </span>
      )}
      <p className="w-full text-xs text-muted-foreground">
        «Снимок недели» сохраняет метку локально и напомнит вернуться через ~7
        дней. Co-pilot, не сертификация PMBOK.
      </p>
    </div>
  );
}

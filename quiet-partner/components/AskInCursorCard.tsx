"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { capture } from "@/lib/analytics/posthog";
import {
  buildCursorDeeplink,
  buildCursorInboxMarkdown,
  buildCursorPrompt,
  buildCursorWebLink,
  readStagesLocalSnapshot,
} from "@/lib/cursorBridge";
import { DOMAIN_IDS } from "@/lib/domains";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Ask Cursor about current Quiet Partner project via deeplink + inbox file. */
export function AskInCursorCard({ className }: { className?: string }) {
  const projectProfile = useProjectStore((s) => s.projectProfile);
  const domains = useProjectStore((s) => s.domains);
  const focusDay = useProjectStore((s) => s.focusDay);
  const stagesBridge = useProjectStore((s) => s.stagesBridge);

  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("");

  const buildInput = () => {
    const stages = readStagesLocalSnapshot();
    return {
      question,
      projectProfile,
      domains,
      focusDay,
      stagesBridge,
      stagesCache: stages?.cache,
      stagesName: stages?.name,
      stagesStageId: stages?.stageId,
    };
  };

  const openInCursor = () => {
    const input = buildInput();
    const prompt = buildCursorPrompt(input);
    const deeplink = buildCursorDeeplink(prompt);
    capture("cursor_ask_open", {
      domain_count: DOMAIN_IDS.length,
      has_question: Boolean(question.trim()),
      prompt_chars: prompt.length,
    });
    try {
      window.location.href = deeplink;
      setStatus(
        "Открываю Cursor… подтверди отправку промпта в чате (автозапуска нет).",
      );
    } catch {
      window.open(buildCursorWebLink(prompt), "_blank", "noopener,noreferrer");
      setStatus("Открыта веб-ссылка Cursor — подтверди промпт там.");
    }
  };

  const copyPrompt = async () => {
    const prompt = buildCursorPrompt(buildInput());
    try {
      await navigator.clipboard.writeText(prompt);
      capture("cursor_ask_copy", { prompt_chars: prompt.length });
      setStatus("Промпт скопирован — вставь в новый чат Cursor.");
    } catch {
      setStatus("Не удалось скопировать — скачай MD.");
    }
  };

  const downloadInbox = () => {
    const md = buildCursorInboxMarkdown(buildInput());
    downloadText("quiet-partner-cursor-inbox.md", md);
    capture("cursor_ask_download", { prompt_chars: md.length });
    setStatus(
      "Скачан MD — сохрани как quiet-partner/docs/cursor-inbox/latest.md и в Cursor: /ask-quiet-partner",
    );
  };

  return (
    <section
      className={cn(
        "rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
      aria-label="Спросить в Cursor"
    >
      <h2 className="text-base font-semibold tracking-tight">Спросить в Cursor</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Вопрос уйдёт в Cursor вместе со снимком проекта (радар + выжимка
        пульта). Cursor должен быть установлен; промпт нужно подтвердить вручную.
      </p>
      <label className="mt-3 block space-y-1">
        <span className="text-xs font-medium text-foreground">Вопрос</span>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="Например: что сделать сегодня по красным доменам?"
          className="min-h-[4.5rem] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm leading-snug outline-none focus:ring-1 focus:ring-ring"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={openInCursor}>
          Открыть в Cursor
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={copyPrompt}>
          Копировать промпт
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={downloadInbox}>
          Скачать снимок MD
        </Button>
      </div>
      {status ? (
        <p className="mt-2 text-xs text-muted-foreground" role="status">
          {status}
        </p>
      ) : null}
    </section>
  );
}

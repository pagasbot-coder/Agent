"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CHEATSHEETS,
  emptyRow,
  objectsToMarkdown,
  REGISTERS,
  STAGES,
  type RegisterRow,
} from "@/lib/stages/registers";
import {
  DEMO_PROJECT_NAME,
  DEMO_STAGE_ID,
  DEMO_TEST_RUN,
} from "@/lib/stages/demoTestRun";

const LS_STAGE = "qp-stages-stage";
const LS_NAME = "qp-stages-name";
const LS_CACHE = "qp-stages-cache";

type Cache = Record<string, RegisterRow[]>;

function readStage(): number {
  try {
    const s = Number(localStorage.getItem(LS_STAGE) || "0") || 0;
    return Math.min(6, Math.max(0, s));
  } catch {
    return 0;
  }
}

function readName(): string {
  try {
    return localStorage.getItem(LS_NAME) || "";
  } catch {
    return "";
  }
}

function readCache(): Cache {
  try {
    const raw = localStorage.getItem(LS_CACHE);
    if (!raw) return {};
    return JSON.parse(raw) as Cache;
  } catch {
    return {};
  }
}

function saveCache(cache: Cache) {
  localStorage.setItem(LS_CACHE, JSON.stringify(cache));
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Stage pulpit: rail 0–6 + register tables in localStorage (client-only). */
export function StagesShell() {
  const [stageId, setStageId] = useState(readStage);
  const [projectName, setProjectName] = useState(readName);
  const [cache, setCache] = useState<Cache>(readCache);
  const [activeRegOverride, setActiveRegOverride] = useState<string | null>(
    null,
  );
  const [status, setStatus] = useState("Данные хранятся в этом браузере.");

  const stage = STAGES[stageId] ?? STAGES[0];

  const activeReg = useMemo(() => {
    const editors = stage.editors;
    if (!editors.length) return null;
    if (activeRegOverride && editors.includes(activeRegOverride)) {
      return activeRegOverride;
    }
    return editors[0];
  }, [stage.editors, activeRegOverride]);

  const rows = useMemo(() => {
    if (!activeReg) return [];
    const reg = REGISTERS[activeReg];
    return cache[activeReg]?.length ? cache[activeReg] : [emptyRow(reg)];
  }, [activeReg, cache]);

  const persistCache = useCallback((next: Cache) => {
    setCache(next);
    saveCache(next);
  }, []);

  const updateCell = (ri: number, key: string, value: string) => {
    if (!activeReg) return;
    const reg = REGISTERS[activeReg];
    const base = cache[activeReg]?.length
      ? [...cache[activeReg]]
      : [emptyRow(reg)];
    while (base.length <= ri) base.push(emptyRow(reg));
    base[ri] = { ...base[ri], [key]: value };
    persistCache({ ...cache, [activeReg]: base });
  };

  const addRow = () => {
    if (!activeReg) return;
    const reg = REGISTERS[activeReg];
    const base = cache[activeReg]?.length
      ? [...cache[activeReg]]
      : [emptyRow(reg)];
    base.push(emptyRow(reg));
    persistCache({ ...cache, [activeReg]: base });
  };

  const delRow = (ri: number) => {
    if (!activeReg) return;
    const reg = REGISTERS[activeReg];
    let base = cache[activeReg]?.length
      ? [...cache[activeReg]]
      : [emptyRow(reg)];
    base.splice(ri, 1);
    if (!base.length) base = [emptyRow(reg)];
    persistCache({ ...cache, [activeReg]: base });
  };

  const onSaveMd = () => {
    if (!activeReg) return;
    const reg = REGISTERS[activeReg];
    const data = cache[activeReg]?.length
      ? cache[activeReg]
      : [emptyRow(reg)];
    const md = objectsToMarkdown(reg, data, projectName);
    const filename = reg.path.split("/").pop() || `${reg.id}.md`;
    downloadText(filename, md);
    setStatus(`Скачан файл ${filename}`);
  };

  const selectStage = (id: number) => {
    setStageId(id);
    localStorage.setItem(LS_STAGE, String(id));
    setActiveRegOverride(null);
  };

  const loadDemo = () => {
    const hasContent = Object.values(cache).some((rows) =>
      (rows ?? []).some((row) =>
        Object.values(row).some((v) => String(v ?? "").trim().length > 0),
      ),
    );
    if (
      hasContent &&
      !window.confirm(
        "Заменить текущие реестры данными «Тестовый прогон»? Текущее в браузере будет перезаписано.",
      )
    ) {
      return;
    }
    persistCache({ ...DEMO_TEST_RUN });
    setProjectName(DEMO_PROJECT_NAME);
    localStorage.setItem(LS_NAME, DEMO_PROJECT_NAME);
    setStageId(DEMO_STAGE_ID);
    localStorage.setItem(LS_STAGE, String(DEMO_STAGE_ID));
    setActiveRegOverride(null);
    setStatus(
      "Загружен «Тестовый прогон» — лендинг «Северный Мотор», этап Исполнение.",
    );
  };

  return (
    <div className="min-h-full">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground hover:underline">
              Режимы
            </Link>
            <span aria-hidden>·</span>
            <Link href="/radar" className="hover:text-foreground hover:underline">
              Радар
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Пульт этапов
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Выбери этап → заполни реестр. Сохранение в браузере; «Скачать .md» —
            в папку ProjectM / reestry.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Проект
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  const v = e.target.value;
                  setProjectName(v);
                  localStorage.setItem(LS_NAME, v.trim());
                }}
                placeholder="Название проекта"
                className="h-9 min-w-[12rem] rounded-lg border border-input bg-background px-3 text-sm text-foreground"
              />
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-0.5"
              onClick={loadDemo}
            >
              Загрузить «Тестовый прогон»
            </Button>
            <p className="pb-1.5 text-xs text-muted-foreground">{status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CHEATSHEETS.map((c) => (
              <Link
                key={c.slug}
                href={`/stages/docs/${c.slug}`}
                className="inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-foreground"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <nav
          className="mb-5 grid grid-cols-4 gap-1.5 sm:grid-cols-7"
          aria-label="Этапы"
        >
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectStage(s.id)}
              className={cn(
                "rounded-xl border px-1 py-2.5 text-center transition",
                s.id === stageId
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30",
              )}
            >
              <span className="block text-base font-semibold">{s.id}</span>
              <span className="mt-0.5 block text-[10px] leading-tight">
                {s.short}
              </span>
            </button>
          ))}
        </nav>

        <section className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-semibold tracking-tight">
            Этап {stage.id} — {stage.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{stage.gate}</p>

          {stage.editors.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              На этом этапе реестры не обязательны — зафиксируй уроки в заметках
              проекта.
            </p>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {stage.editors.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveRegOverride(id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      id === activeReg
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {REGISTERS[id].title}
                  </button>
                ))}
              </div>

              {activeReg && (
                <div className="mt-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold">
                      {REGISTERS[activeReg].title}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addRow}
                      >
                        + строка
                      </Button>
                      <Button type="button" size="sm" onClick={onSaveMd}>
                        Скачать .md
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-max min-w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          {REGISTERS[activeReg].columns.map((c) => (
                            <th
                              key={c.key}
                              className={cn(
                                "sticky top-0 z-[1] border-b border-border bg-muted/80 px-2 py-2 text-left text-xs font-medium backdrop-blur-sm",
                                c.multiline ? "min-w-[14rem]" : "whitespace-nowrap",
                              )}
                            >
                              {c.label}
                            </th>
                          ))}
                          <th className="sticky top-0 z-[1] border-b border-border bg-muted/80 px-2 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, ri) => (
                          <tr key={ri} className="odd:bg-background even:bg-muted/20">
                            {REGISTERS[activeReg].columns.map((c) => (
                              <td
                                key={c.key}
                                className={cn(
                                  "border-b border-border p-1.5 align-top",
                                  c.multiline && "min-w-[14rem] max-w-[22rem]",
                                )}
                              >
                                {c.type === "select" ? (
                                  <select
                                    value={row[c.key] ?? ""}
                                    onChange={(e) =>
                                      updateCell(ri, c.key, e.target.value)
                                    }
                                    className="h-9 w-full min-w-[5rem] rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                                  >
                                    <option value="" />
                                    {c.options?.map((o) => (
                                      <option key={o} value={o}>
                                        {o}
                                      </option>
                                    ))}
                                  </select>
                                ) : c.multiline ? (
                                  <textarea
                                    value={row[c.key] ?? ""}
                                    onChange={(e) =>
                                      updateCell(ri, c.key, e.target.value)
                                    }
                                    rows={3}
                                    className="min-h-[4.5rem] w-full resize-y rounded-md border border-input bg-background px-2 py-1.5 text-sm leading-snug whitespace-pre-wrap break-words outline-none focus:ring-1 focus:ring-ring"
                                  />
                                ) : (
                                  <input
                                    value={row[c.key] ?? ""}
                                    onChange={(e) =>
                                      updateCell(ri, c.key, e.target.value)
                                    }
                                    className="h-9 w-full min-w-[6rem] rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                                  />
                                )}
                              </td>
                            ))}
                            <td className="border-b border-border p-1.5 text-center align-top">
                              <button
                                type="button"
                                onClick={() => delRow(ri)}
                                className="px-2 py-1 text-muted-foreground hover:text-destructive"
                                title="Удалить"
                                aria-label="Удалить строку"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Файл:{" "}
                    <code className="rounded bg-muted px-1 py-0.5">
                      {REGISTERS[activeReg].path}
                    </code>
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Co-pilot, не сертификация PMBOK. Полный локальный контур с записью на
          диск — папка ProjectM на Desktop.
        </footer>
      </main>
    </div>
  );
}

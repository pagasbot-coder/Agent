"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FocusDayCard } from "@/components/FocusDayCard";
import { capture } from "@/lib/analytics/posthog";
import { cn } from "@/lib/utils";
import {
  buildStagesSnapshot,
  ensureStagesProjectKey,
} from "@/lib/stages/bridge";
import {
  CHEATSHEETS,
  emptyRow,
  normalizeLevel,
  normalizeRegisterCache,
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
import {
  MTS_EXOLVE_SEED,
  MTS_NEXT_HIGHLIGHTS,
  MTS_PROJECT_ID,
  MTS_PROJECT_NAME,
  MTS_STAGE_ID,
} from "@/lib/stages/mtsExolveSeed";
import { useProjectStore } from "@/lib/store/useProjectStore";

const LS_STAGE = "qp-stages-stage";
const LS_NAME = "qp-stages-name";
const LS_CACHE = "qp-stages-cache";
const LS_PROJECT_KEY = "qp-stages-project-key";
const SAVE_DEBOUNCE_MS = 800;

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
    return localStorage.getItem(LS_NAME) || MTS_PROJECT_NAME;
  } catch {
    return MTS_PROJECT_NAME;
  }
}

function readCache(): Cache {
  try {
    const raw = localStorage.getItem(LS_CACHE);
    if (!raw) return {};
    return normalizeRegisterCache(JSON.parse(raw) as Cache);
  } catch {
    return {};
  }
}

function saveCache(cache: Cache) {
  localStorage.setItem(
    LS_CACHE,
    JSON.stringify(normalizeRegisterCache(cache)),
  );
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

function averageSuggested(scores: Record<string, number>): number {
  const vals = Object.values(scores);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/** Ask before wiping a better radar with a weaker pulpit snapshot. */
function confirmScoreDowngrade(
  currentOverall: number,
  nextOverall: number,
  nextD8: number,
): boolean {
  if (currentOverall <= 0 || nextOverall >= currentOverall) return true;
  return window.confirm(
    `На радаре индекс ${currentOverall}, из пульта выйдет ${nextOverall} (Неопределённость ${nextD8}).\n\nЗаменить текущую оценку? Пульт при этом не трогаем — отмена оставит радар как есть.`,
  );
}

/** Stage pulpit: rail 0–6 + register tables in localStorage (client-only). */
export function StagesShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applyStagesBridge = useProjectStore((s) => s.applyStagesBridge);
  const needsStagesOverwriteConfirm = useProjectStore(
    (s) => s.needsStagesOverwriteConfirm,
  );
  const getOverallHealth = useProjectStore((s) => s.getOverallHealth);
  const [stageId, setStageId] = useState(readStage);
  const [projectName, setProjectName] = useState(readName);
  const [cache, setCache] = useState<Cache>(readCache);
  const [activeRegOverride, setActiveRegOverride] = useState<string | null>(
    null,
  );
  const [status, setStatus] = useState("Загрузка проекта с сервера…");
  const [storageBackend, setStorageBackend] = useState<string>("…");
  const [hydrated, setHydrated] = useState(false);
  const [projectKey, setProjectKey] = useState(() => MTS_PROJECT_ID);
  /** Default off: demo must not silently overwrite a better radar. */
  const [demoAlsoRadar, setDemoAlsoRadar] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSave = useRef(true);

  const stage = STAGES[stageId] ?? STAGES[0];

  const applyUrlRegister = useCallback(() => {
    try {
      const reg = searchParams.get("reg");
      if (!reg || !Object.prototype.hasOwnProperty.call(REGISTERS, reg)) {
        return false;
      }
      const withReg = STAGES.find((s) => s.editors.includes(reg));
      if (withReg) {
        setStageId(withReg.id);
        localStorage.setItem(LS_STAGE, String(withReg.id));
      }
      setActiveRegOverride(reg);
      setStatus(`Открыт реестр «${REGISTERS[reg].title}».`);
      return true;
    } catch {
      return false;
    }
  }, [searchParams]);

  const applyProjectSnapshot = useCallback(
    (input: {
      id: string;
      name: string;
      stageId: number;
      cache: Cache;
    }) => {
      const nextCache = normalizeRegisterCache(input.cache);
      setProjectKey(input.id);
      setProjectName(input.name);
      setCache(nextCache);
      try {
        const urlReg = new URLSearchParams(window.location.search).get("reg");
        const keepReg =
          urlReg && Object.prototype.hasOwnProperty.call(REGISTERS, urlReg)
            ? urlReg
            : null;
        if (keepReg) {
          const withReg = STAGES.find((s) => s.editors.includes(keepReg));
          setStageId(withReg?.id ?? input.stageId);
          setActiveRegOverride(keepReg);
          localStorage.setItem(
            LS_STAGE,
            String(withReg?.id ?? input.stageId),
          );
        } else {
          setStageId(input.stageId);
          setActiveRegOverride(null);
          localStorage.setItem(LS_STAGE, String(input.stageId));
        }
        localStorage.setItem(LS_PROJECT_KEY, input.id);
        localStorage.setItem(LS_NAME, input.name);
        saveCache(nextCache);
      } catch {
        setStageId(input.stageId);
        setActiveRegOverride(null);
      }
    },
    [],
  );

  const saveToServer = useCallback(
    async (id: string, name: string, stage: number, nextCache: Cache) => {
      try {
        const res = await fetch(
          `/api/stages/projects/${encodeURIComponent(id)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              stageId: stage,
              cache: nextCache,
            }),
          },
        );
        if (!res.ok) throw new Error(`save_${res.status}`);
        setStatus("Сохранено на сервере. Радар — после «Подтянуть».");
      } catch {
        setStatus(
          "Не удалось сохранить на сервер — данные пока только в браузере.",
        );
      }
    },
    [],
  );

  const scheduleSave = useCallback(
    (id: string, name: string, stage: number, nextCache: Cache) => {
      if (!hydrated || skipNextSave.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        void saveToServer(id, name, stage, nextCache);
      }, SAVE_DEBOUNCE_MS);
    },
    [hydrated, saveToServer],
  );

  useEffect(() => {
    applyUrlRegister();
  }, [applyUrlRegister, searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const listRes = await fetch("/api/stages/projects");
        const listJson = (await listRes.json()) as {
          ok?: boolean;
          backend?: string;
          defaultProjectId?: string;
        };
        if (cancelled) return;
        if (listJson.backend) setStorageBackend(listJson.backend);

        // Канон: при каждом открытии пульта — Проект МТС (не демо из localStorage).
        const preferred =
          listJson.defaultProjectId?.trim() || MTS_PROJECT_ID;
        localStorage.setItem(LS_PROJECT_KEY, preferred);
        const getRes = await fetch(
          `/api/stages/projects/${encodeURIComponent(preferred)}`,
        );
        if (getRes.ok) {
          const body = (await getRes.json()) as {
            project?: {
              id: string;
              name: string;
              stageId: number;
              cache: Cache;
            };
          };
          if (body.project && !cancelled) {
            skipNextSave.current = true;
            applyProjectSnapshot(body.project);
            setStatus(
              `Загружено с сервера (${listJson.backend ?? "file"}). Правки сохраняются сами.`,
            );
            setHydrated(true);
            queueMicrotask(() => {
              skipNextSave.current = false;
            });
            return;
          }
        }

        if (!cancelled) {
          skipNextSave.current = true;
          applyProjectSnapshot({
            id: MTS_PROJECT_ID,
            name: MTS_PROJECT_NAME,
            stageId: MTS_STAGE_ID,
            cache: { ...MTS_EXOLVE_SEED },
          });
          setStatus("Локальный шаблон МТС — сохраняем на сервер…");
          setHydrated(true);
          queueMicrotask(() => {
            skipNextSave.current = false;
            void saveToServer(
              MTS_PROJECT_ID,
              MTS_PROJECT_NAME,
              MTS_STAGE_ID,
              normalizeRegisterCache({ ...MTS_EXOLVE_SEED }),
            );
          });
        }
      } catch {
        if (!cancelled) {
          setStorageBackend("browser");
          skipNextSave.current = true;
          applyProjectSnapshot({
            id: MTS_PROJECT_ID,
            name: MTS_PROJECT_NAME,
            stageId: MTS_STAGE_ID,
            cache: { ...MTS_EXOLVE_SEED },
          });
          try {
            localStorage.setItem(LS_PROJECT_KEY, MTS_PROJECT_ID);
          } catch {
            /* ignore */
          }
          setStatus(
            "Сервер недоступен — локальный Проект МТС. Запусти npm run dev для сохранения.",
          );
          setHydrated(true);
          queueMicrotask(() => {
            skipNextSave.current = false;
          });
        }
      }
    })();
    return () => {
      cancelled = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [applyProjectSnapshot, saveToServer]);

  /** Live preview of bridge scores — so D8 moves when statuses change, before pull. */
  const previewScores = useMemo(
    () =>
      buildStagesSnapshot({
        projectName,
        stageId,
        cache,
      }).suggestedScores,
    [projectName, stageId, cache],
  );

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

  const persistCache = useCallback(
    (next: Cache) => {
      setCache(next);
      saveCache(next);
      scheduleSave(projectKey, projectName, stageId, next);
    },
    [projectKey, projectName, stageId, scheduleSave],
  );

  const updateCell = (ri: number, key: string, value: string) => {
    if (!activeReg) return;
    const reg = REGISTERS[activeReg];
    const base = cache[activeReg]?.length
      ? [...cache[activeReg]]
      : [emptyRow(reg)];
    while (base.length <= ri) base.push(emptyRow(reg));
    const nextVal =
      key === "influence" || key === "prob" || key === "impact"
        ? normalizeLevel(value) || value
        : value;
    base[ri] = { ...base[ri], [key]: nextVal };
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
    scheduleSave(projectKey, projectName, id, cache);
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
    const nextCache = normalizeRegisterCache({ ...DEMO_TEST_RUN });
    const demoKey = "demo-test-run";
    applyProjectSnapshot({
      id: demoKey,
      name: DEMO_PROJECT_NAME,
      stageId: DEMO_STAGE_ID,
      cache: nextCache,
    });
    void saveToServer(demoKey, DEMO_PROJECT_NAME, DEMO_STAGE_ID, nextCache);

    if (demoAlsoRadar) {
      const snapshot = buildStagesSnapshot({
        projectName: DEMO_PROJECT_NAME,
        stageId: DEMO_STAGE_ID,
        cache: nextCache,
        projectKey: demoKey,
      });
      if (
        needsStagesOverwriteConfirm(snapshot) &&
        !window.confirm(
          "В напарнике уже другой проект. Заменить имя и оценку данными из пульта?",
        )
      ) {
        setStatus(
          "Загружен «Тестовый прогон» в пульт (оценка в напарнике не тронута).",
        );
        return;
      }
      if (
        !confirmScoreDowngrade(
          getOverallHealth(),
          averageSuggested(snapshot.suggestedScores),
          snapshot.suggestedScores.D8,
        )
      ) {
        setStatus(
          "Загружен «Тестовый прогон» в пульт (оценка в напарнике не тронута).",
        );
        return;
      }
      applyStagesBridge(snapshot);
      capture("bridge_pull_to_radar", {
        stage_id: DEMO_STAGE_ID,
        register_count: snapshot.registerRowCount,
        from_demo: true,
      });
      capture("bridge_scores_applied", {
        stage_id: DEMO_STAGE_ID,
        register_count: snapshot.registerRowCount,
      });
      setStatus(
        "«Тестовый прогон» в пульте и оценка в напарнике — открой радар.",
      );
      router.push("/radar?from=stages");
      return;
    }

    setStatus(
      "Загружен «Тестовый прогон» — сохранён на сервере, этап Исполнение.",
    );
  };

  /** Сброс к каноническому шаблону МТС + сохранение на сервер. */
  const loadMts = async () => {
    const hasContent = Object.values(cache).some((rows) =>
      (rows ?? []).some((row) =>
        Object.values(row).some((v) => String(v ?? "").trim().length > 0),
      ),
    );
    if (
      hasContent &&
      !window.confirm(
        "Загрузить «Проект МТС» из шаблона? Текущие реестры в пульте будут заменены.",
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/stages/projects/mts/reset", {
        method: "POST",
      });
      if (res.ok) {
        const body = (await res.json()) as {
          project?: {
            id: string;
            name: string;
            stageId: number;
            cache: Cache;
          };
        };
        if (body.project) {
          skipNextSave.current = true;
          applyProjectSnapshot(body.project);
          setStatus("Проект МТС сброшен к шаблону и сохранён на сервере.");
          queueMicrotask(() => {
            skipNextSave.current = false;
          });
          return;
        }
      }
    } catch {
      /* fallback below */
    }
    const nextCache = normalizeRegisterCache({ ...MTS_EXOLVE_SEED });
    applyProjectSnapshot({
      id: MTS_PROJECT_ID,
      name: MTS_PROJECT_NAME,
      stageId: MTS_STAGE_ID,
      cache: nextCache,
    });
    void saveToServer(
      MTS_PROJECT_ID,
      MTS_PROJECT_NAME,
      MTS_STAGE_ID,
      nextCache,
    );
    setStatus("Проект МТС загружен (локальный шаблон) и отправлен на сервер.");
  };

  const isMtsLoaded =
    projectName.trim() === MTS_PROJECT_NAME ||
    projectName.trim().startsWith("Проект МТС");

  const pullToRadar = () => {
    const key = ensureStagesProjectKey(projectKey);
    localStorage.setItem(LS_PROJECT_KEY, key);
    const snapshot = buildStagesSnapshot({
      projectName,
      stageId,
      cache,
      projectKey: key,
    });
    const overwrite = needsStagesOverwriteConfirm(snapshot);
    if (
      overwrite &&
      !window.confirm(
        "В напарнике уже другой проект. Заменить имя и оценку данными из пульта?",
      )
    ) {
      return;
    }
    if (
      !confirmScoreDowngrade(
        getOverallHealth(),
        averageSuggested(snapshot.suggestedScores),
        snapshot.suggestedScores.D8,
      )
    ) {
      setStatus("Подтягивание отменено — радар без изменений.");
      return;
    }
    applyStagesBridge(snapshot);
    capture("bridge_pull_to_radar", {
      stage_id: stageId,
      register_count: snapshot.registerRowCount,
      overwrite,
    });
    capture("bridge_scores_applied", {
      stage_id: stageId,
      register_count: snapshot.registerRowCount,
    });
    const d8 = snapshot.suggestedScores.D8;
    setStatus(
      `Оценка подтянута: Неопределённость ${d8}, Работа проекта ${snapshot.suggestedScores.D5}`,
    );
    router.push("/radar?from=stages");
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
            Реестры сохраняются на сервер сами (хранилище:{" "}
            <span className="font-medium text-foreground">{storageBackend}</span>
            ). Радар — только после «Подтянуть в напарника».
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
                  scheduleSave(projectKey, v.trim(), stageId, cache);
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mb-0.5"
              onClick={() => void loadMts()}
            >
              Загрузить Проект МТС
            </Button>
            <Button
              type="button"
              size="sm"
              className="mb-0.5"
              onClick={pullToRadar}
            >
              Подтянуть в напарника
            </Button>
            <label className="mb-0.5 flex max-w-xs cursor-pointer items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={demoAlsoRadar}
                onChange={(e) => setDemoAlsoRadar(e.target.checked)}
              />
              <span>
                Также подтянуть оценку в напарника (с демо) — по умолчанию
                выкл., чтобы не затереть радар
              </span>
            </label>
            <p className="pb-1.5 text-xs text-muted-foreground">{status}</p>
          </div>
          <p className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-xs text-foreground">
            Оценка из пульта сейчас:{" "}
            <span className="font-medium">
              Неопределённость {previewScores.D8}
            </span>
            {" · "}
            Работа проекта {previewScores.D5}
            {" · "}
            Поставка {previewScores.D6}
            {" · "}
            индекс ~{averageSuggested(previewScores)}
            <span className="mt-0.5 block text-muted-foreground">
              Реестры пульта сохраняются сами. Радар — только по «Подтянуть»;
              если новая оценка хуже текущей, спросим подтверждение.
            </span>
          </p>
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
          <FocusDayCard variant="compact" className="mt-2" />
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

          {stage.docLinks.length > 0 ? (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Шаблоны этапа
              </p>
              <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-sm">
                {stage.docLinks.map((doc, i) => (
                  <span key={doc.href} className="inline-flex items-center gap-2">
                    {i > 0 ? (
                      <span className="text-muted-foreground/50" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <Link
                      href={doc.href}
                      className="font-medium text-primary underline-offset-2 hover:underline"
                    >
                      {doc.title}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

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
                        Скачать таблицу
                      </Button>
                    </div>
                  </div>
                  {/* Mobile: stacked cards — table stays for md+ (T-101) */}
                  <div className="space-y-3 md:hidden">
                    {rows.length === 0 && (
                      <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                        Пока пусто — нажми «+ строка».
                      </p>
                    )}
                    {rows.map((row, ri) => (
                      <article
                        key={ri}
                        className="rounded-lg border border-border bg-background p-3 shadow-sm"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Строка {ri + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => delRow(ri)}
                            className="px-2 py-1 text-sm text-muted-foreground hover:text-destructive"
                            title="Удалить"
                            aria-label={`Удалить строку ${ri + 1}`}
                          >
                            ×
                          </button>
                        </div>
                        <div className="space-y-3">
                          {REGISTERS[activeReg].columns.map((c) => (
                            <label
                              key={c.key}
                              className="block space-y-1"
                            >
                              <span className="text-xs font-medium text-foreground">
                                {c.label}
                              </span>
                              {c.type === "select" ? (
                                <select
                                  value={
                                    c.key === "influence" ||
                                    c.key === "prob" ||
                                    c.key === "impact"
                                      ? normalizeLevel(row[c.key])
                                      : (row[c.key] ?? "")
                                  }
                                  onChange={(e) =>
                                    updateCell(ri, c.key, e.target.value)
                                  }
                                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
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
                                  rows={c.key === "name" ? 2 : 3}
                                  className="min-h-[3rem] w-full resize-y rounded-md border border-input bg-background px-2 py-1.5 text-sm leading-snug whitespace-pre-wrap break-words outline-none focus:ring-1 focus:ring-ring"
                                />
                              ) : (
                                <input
                                  value={row[c.key] ?? ""}
                                  onChange={(e) =>
                                    updateCell(ri, c.key, e.target.value)
                                  }
                                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                                />
                              )}
                            </label>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
                    <table className="w-max min-w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          {REGISTERS[activeReg].columns.map((c) => (
                            <th
                              key={c.key}
                              className={cn(
                                "sticky top-0 z-[1] border-b border-border bg-muted/80 px-2 py-2 text-left text-xs font-medium backdrop-blur-sm",
                                c.multiline || c.key === "name"
                                  ? "min-w-[14rem]"
                                  : "whitespace-nowrap",
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
                                  c.multiline && "min-w-[16rem] max-w-[28rem]",
                                  c.key === "name" && "min-w-[14rem] max-w-[22rem]",
                                )}
                              >
                                {c.type === "select" ? (
                                  <select
                                    value={
                                      c.key === "influence" ||
                                      c.key === "prob" ||
                                      c.key === "impact"
                                        ? normalizeLevel(row[c.key])
                                        : (row[c.key] ?? "")
                                    }
                                    onChange={(e) =>
                                      updateCell(ri, c.key, e.target.value)
                                    }
                                    className="h-9 w-full min-w-[7rem] rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
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
                                    rows={c.key === "name" ? 2 : 3}
                                    className="min-h-[3rem] w-full resize-y rounded-md border border-input bg-background px-2 py-1.5 text-sm leading-snug whitespace-pre-wrap break-words outline-none focus:ring-1 focus:ring-ring"
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

        {isMtsLoaded ? (
          <aside
            className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-sm text-foreground"
            aria-label="Что ещё нужно для Проекта МТС"
          >
            <p className="font-medium text-amber-950 dark:text-amber-100">
              Что ещё нужно — проект и собес
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-foreground/90">
              {MTS_NEXT_HIGHLIGHTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Полный чеклист в репо:{" "}
              <code className="rounded bg-background/60 px-1">
                docs/mts-exolve-next-checklist.md
              </code>
              . После загрузки нажми «Подтянуть в напарника».
            </p>
          </aside>
        ) : null}

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          Co-pilot, не сертификация PMBOK. Полный локальный контур с записью на
          диск — папка ProjectM на Desktop.
        </footer>
      </main>
    </div>
  );
}

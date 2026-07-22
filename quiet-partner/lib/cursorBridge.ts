import type { DomainId } from "@/lib/domains";
import { DOMAIN_LABELS_RU, deriveDomainStatus } from "@/lib/domains";
import type { FocusDayState } from "@/lib/focusDay";
import type { StagesBridgeLink } from "@/lib/stages/bridge";
import type { RegisterRow } from "@/lib/stages/registers";
import type { DomainHealth, ProjectProfile } from "@/lib/store/useProjectStore";

/** Soft limit under Cursor deeplink ~8k (docs); leave headroom for encoding. */
export const CURSOR_PROMPT_MAX_CHARS = 5500;
/** Shorter body for deeplink — huge URLs freeze some browsers. */
export const CURSOR_DEEPLINK_MAX_CHARS = 2200;

export type CursorBridgeInput = {
  question: string;
  projectProfile: ProjectProfile;
  domains: Record<DomainId, DomainHealth>;
  focusDay: FocusDayState | null;
  stagesBridge: StagesBridgeLink | null;
  /** Optional pulpit cache from localStorage */
  stagesCache?: Record<string, RegisterRow[]>;
  stagesName?: string;
  stagesStageId?: number;
};

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function summarizeRegister(
  id: string,
  rows: RegisterRow[] | undefined,
  maxRows = 3,
): string | null {
  const filled = (rows ?? []).filter((row) =>
    Object.values(row).some((v) => String(v ?? "").trim()),
  );
  if (!filled.length) return null;
  const lines = filled.slice(0, maxRows).map((row, i) => {
    const vals = Object.values(row)
      .map((v) => String(v ?? "").trim())
      .filter(Boolean)
      .slice(0, 4);
    return `  ${i + 1}. ${truncate(vals.join(" · "), 120)}`;
  });
  const more =
    filled.length > maxRows ? `  …ещё ${filled.length - maxRows}` : null;
  return [`### ${id} (${filled.length})`, ...lines, more].filter(Boolean).join("\n");
}

/** Build RU prompt for Cursor deeplink / clipboard / MD export. */
export function buildCursorPrompt(
  input: CursorBridgeInput,
  opts?: { maxChars?: number; includeRegisters?: boolean },
): string {
  const maxChars = opts?.maxChars ?? CURSOR_PROMPT_MAX_CHARS;
  const includeRegisters = opts?.includeRegisters !== false;
  const q = input.question.trim() || "Помоги разобрать здоровье этого проекта.";
  const name = input.projectProfile.name || "Без названия";
  const phase = input.projectProfile.phase ?? "—";
  const approach = input.projectProfile.deliveryApproach;

  const domainLines = (
    Object.entries(input.domains) as [DomainId, DomainHealth][]
  )
    .sort((a, b) => a[1].value - b[1].value)
    .map(([id, d]) => {
      const st = deriveDomainStatus(d.value);
      return `- ${DOMAIN_LABELS_RU[id]} (${id}): ${d.value} · ${st}`;
    });

  const focusLine = input.focusDay
    ? `- Фокус дня: «${truncate(input.focusDay.title, 160)}» (${input.focusDay.source}${input.focusDay.doneAt ? ", сделано" : ""})`
    : "- Фокус дня: не задан";

  const bridgeLine = input.stagesBridge
    ? `- Связь с пультом: ${input.stagesBridge.projectName} · этап ${input.stagesBridge.stageName}`
    : "- Связь с пультом: нет";

  const stagesBits: string[] = [];
  if (input.stagesName || input.stagesStageId != null) {
    stagesBits.push(
      `- Пульт: проект «${input.stagesName || "—"}», stageId=${input.stagesStageId ?? "—"}`,
    );
  }
  if (includeRegisters && input.stagesCache) {
    for (const id of [
      "storony",
      "riski",
      "neznaem",
      "vekhi",
      "byudzhet",
      "resheniya",
    ]) {
      const block = summarizeRegister(id, input.stagesCache[id]);
      if (block) stagesBits.push(block);
    }
  }

  const body = [
    "Ты помогаешь PM в продукте «Тихий напарник» (Quiet Partner).",
    "Контекст ниже — снимок из браузера (localStorage), не live API.",
    "Отвечай по-русски, коротко, questions-first. Не выдавай сертификацию PMBOK.",
    "",
    "## Вопрос пользователя",
    q,
    "",
    "## Проект (радар)",
    `- Имя: ${name}`,
    `- Фаза/этап: ${phase}`,
    `- Подход: ${approach}`,
    focusLine,
    bridgeLine,
    "",
    "## Оценки доменов (слабые сверху)",
    ...domainLines,
    "",
    stagesBits.length ? "## Выжимка пульта этапов" : null,
    ...stagesBits,
    "",
    "## Задача",
    "1) Ответь на вопрос пользователя.",
    "2) Если данных мало — задай 1–3 уточняющих вопроса.",
    "3) Предложи один конкретный фокус на сегодня (если уместно).",
  ]
    .filter((line) => line != null)
    .join("\n");

  return truncate(body, maxChars);
}

/** Compact prompt for deeplink only (avoids browser hang on huge cursor:// URLs). */
export function buildCursorDeeplinkPrompt(input: CursorBridgeInput): string {
  return buildCursorPrompt(input, {
    maxChars: CURSOR_DEEPLINK_MAX_CHARS,
    includeRegisters: false,
  });
}

/** Native Cursor deeplink (user must confirm send). */
export function buildCursorDeeplink(promptText: string): string {
  const url = new URL("cursor://anysphere.cursor-deeplink/prompt");
  url.searchParams.set("text", promptText);
  return url.toString();
}

/** HTTPS fallback for environments that prefer web link. */
export function buildCursorWebLink(promptText: string): string {
  const url = new URL("https://cursor.com/link/prompt");
  url.searchParams.set("text", promptText);
  return url.toString();
}

/** Markdown file body for docs/cursor-inbox/latest.md (save manually). */
export function buildCursorInboxMarkdown(input: CursorBridgeInput): string {
  const prompt = buildCursorPrompt(input);
  const exportedAt = new Date().toISOString();
  return [
    "# Quiet Partner → Cursor inbox",
    "",
    `exportedAt: ${exportedAt}`,
    `project: ${input.projectProfile.name}`,
    "",
    "> Сохрани этот файл как `quiet-partner/docs/cursor-inbox/latest.md` в репо Agent,",
    "> затем в Cursor: команда **/ask-quiet-partner** или «прочитай cursor-inbox».",
    "",
    "---",
    "",
    prompt,
    "",
  ].join("\n");
}

export function readStagesLocalSnapshot(): {
  name: string;
  stageId: number;
  cache: Record<string, RegisterRow[]>;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const name = localStorage.getItem("qp-stages-name") || "";
    const stageId = Number(localStorage.getItem("qp-stages-stage") || "0") || 0;
    const raw = localStorage.getItem("qp-stages-cache");
    const cache = raw
      ? (JSON.parse(raw) as Record<string, RegisterRow[]>)
      : {};
    return { name, stageId, cache };
  } catch {
    return null;
  }
}

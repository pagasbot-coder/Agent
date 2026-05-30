import { getSystemPrompt } from "@/lib/systemPrompt";
import {
  DEFAULT_DISCLAIMER,
  DOMAIN_LABELS_RU,
  deriveDomainStatus,
  type DomainId,
} from "@/lib/domains";

import { isTokenBudgetExceeded, recordTokenUsage } from "./costGuardrails";
import { buildFallbackCommentary } from "./fallback";
import type { HealthCommentaryRequest, HealthCommentaryResponse } from "./types";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MAX_TOKENS = Number(process.env.ADVISOR_MAX_TOKENS ?? 512);

function buildUserMessage(req: HealthCommentaryRequest): string {
  const locale = req.locale ?? "ru";
  const lines = (Object.entries(req.domainScores) as [DomainId, number][]).map(
    ([id, value]) => {
      const status = deriveDomainStatus(value);
      return `- ${DOMAIN_LABELS_RU[id]}: ${value}/100 (${status})`;
    },
  );

  const meta = req.projectMeta;
  const metaLine =
    meta?.name || meta?.phase ?
      `Проект: ${meta.name ?? "—"}, фаза: ${meta.phase ?? "—"}.`
    : "Контекст проекта минимальный.";

  const situationLineRu =
    req.userSituation ?
      `Ситуация от PM (сценарий ${req.navigatorScenarioId ?? "—"}): «${req.userSituation}».`
    : null;
  const situationLineEn =
    req.userSituation ?
      `PM situation (scenario ${req.navigatorScenarioId ?? "—"}): "${req.userSituation}".`
    : null;

  if (locale === "en") {
    return [
      metaLine,
      situationLineEn,
      `Delivery approach: ${req.deliveryApproach ?? "hybrid"}.`,
      "Domain scores:",
      ...lines,
      "",
      "Respond with JSON only:",
      '{"commentary":"...","questions":["...","..."]}',
      "commentary: 2–4 sentences, plain language.",
      "questions: 1–3 clarifying questions if context is thin.",
    ].join("\n");
  }

  return [
    metaLine,
    situationLineRu,
    `Подход к поставке: ${req.deliveryApproach ?? "hybrid"}.`,
    "Оценки доменов:",
    ...lines,
    "",
    "Ответь только JSON:",
    '{"commentary":"...","questions":["...","..."]}',
    "commentary: 2–4 предложения, простой язык, без жаргона PMBOK.",
    "questions: 1–3 уточняющих вопроса, если контекста мало.",
  ].join("\n");
}

function parseLlmJson(content: string): {
  commentary?: string;
  questions?: string[];
} {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { commentary: trimmed };
  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      commentary?: string;
      questions?: string[];
    };
    return parsed;
  } catch {
    return { commentary: trimmed };
  }
}

/** Server-only LLM call — DeepSeek primary, static fallback if no key. */
export async function generateHealthCommentary(
  req: HealthCommentaryRequest,
): Promise<HealthCommentaryResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();

  if (!apiKey) {
    const fallback = buildFallbackCommentary(
      req.domainScores,
      req.userSituation,
    );
    return {
      ...fallback,
      commentary: `${fallback.commentary} (локальный режим — ключ DeepSeek не задан)`,
    };
  }

  if (isTokenBudgetExceeded()) {
    const fallback = buildFallbackCommentary(
      req.domainScores,
      req.userSituation,
    );
    console.warn("[advisor] token budget exceeded — fallback");
    return {
      ...fallback,
      commentary: `${fallback.commentary} (дневной или недельный лимит токенов исчерпан)`,
    };
  }

  const locale = req.locale ?? "ru";
  const weakDomains = (Object.entries(req.domainScores) as [DomainId, number][])
    .filter(([, v]) => deriveDomainStatus(v) !== "green")
    .map(([id]) => DOMAIN_LABELS_RU[id]);

  const systemPrompt = getSystemPrompt({
    locale,
    deliveryApproach: req.deliveryApproach,
    domains: weakDomains.length ? weakDomains : undefined,
  });

  const model = process.env.ADVISOR_LLM_MODEL ?? "deepseek-chat";

  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: buildUserMessage(req) },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[advisor] provider error", res.status);
      const fallback = buildFallbackCommentary(
        req.domainScores,
        req.userSituation,
      );
      return {
        ...fallback,
        commentary: `${fallback.commentary} (сервис LLM временно недоступен)`,
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { total_tokens?: number };
    };

    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = parseLlmJson(content);

    const totalTokens = data.usage?.total_tokens ?? 0;
    if (totalTokens > 0) recordTokenUsage(totalTokens);

    console.info("[advisor] request ok", {
      provider: "deepseek",
      tokens: totalTokens || null,
    });

    return {
      commentary:
        parsed.commentary?.trim() ||
        buildFallbackCommentary(req.domainScores, req.userSituation)
          .commentary,
      questions: parsed.questions?.filter(Boolean).slice(0, 3),
      disclaimer: DEFAULT_DISCLAIMER,
    };
  } catch (err) {
    console.error("[advisor] fetch failed", err);
    return buildFallbackCommentary(req.domainScores, req.userSituation);
  }
}

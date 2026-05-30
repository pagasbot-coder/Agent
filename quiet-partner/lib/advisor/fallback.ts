import {
  DEFAULT_DISCLAIMER,
  DOMAIN_LABELS_RU,
  deriveDomainStatus,
  type DomainId,
} from "@/lib/domains";

/** Offline commentary when LLM key is missing or provider fails. */
export function buildFallbackCommentary(
  domainScores: Record<DomainId, number>,
): { commentary: string; questions: string[]; disclaimer: string } {
  const ranked = (Object.entries(domainScores) as [DomainId, number][])
    .map(([id, value]) => ({
      id,
      label: DOMAIN_LABELS_RU[id],
      value,
      status: deriveDomainStatus(value),
    }))
    .sort((a, b) => a.value - b.value);

  const weakest = ranked.slice(0, 2);
  const redCount = ranked.filter((d) => d.status === "red").length;

  const focus = weakest
    .map((d) => `«${d.label}» (${d.value})`)
    .join(" и ");

  const commentary =
    redCount > 0 ?
      `Сейчас больше всего давят ${focus}. Это субъективные сигналы — не аудит. Прежде чем менять план, уточните, что реально блокирует прогресс на этой неделе.`
    : `На первый взгляд слабее всего ${focus}. Стоит проверить: это временный спад или системная проблема?`;

  const questions = [
    "Что можно показать заинтересованным сторонам на этой неделе — даже черновик?",
    "Какой риск вы не записали, потому что «и так понятно»?",
    "Может ли команда сказать «нет» новой работе без последствий?",
  ].slice(0, redCount > 1 ? 3 : 2);

  return {
    commentary,
    questions,
    disclaimer: DEFAULT_DISCLAIMER,
  };
}

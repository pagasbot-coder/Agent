import type { DomainId } from "@/lib/domains";
import type { RegisterRow } from "@/lib/stages/registers";

/**
 * Pure mapping: pulpit registers → suggested domain scores (T-105 / T-115).
 * Principle: recording risks/unknowns is healthy; punish unmanaged exposure, reward hygiene.
 */
export function suggestScoresFromRegisters(
  cache: Record<string, RegisterRow[]>,
  stageId: number,
): Record<DomainId, number> {
  const scores: Record<DomainId, number> = {
    D1: 62,
    D2: 62,
    D3: 62,
    D4: 62,
    D5: 62,
    D6: 62,
    D7: 62,
    D8: 62,
  };

  const storony = nonEmptyRows(cache.storony);
  const riski = nonEmptyRows(cache.riski);
  const neznaem = nonEmptyRows(cache.neznaem);
  const byudzhet = nonEmptyRows(cache.byudzhet);
  const vekhi = nonEmptyRows(cache.vekhi);
  const resheniya = nonEmptyRows(cache.resheniya);

  if (storony.length === 0) scores.D1 -= 25;
  else if (storony.length <= 2) scores.D1 -= 12;
  else if (storony.length >= 4) scores.D1 += 5;

  // Risks first — silence hit on D8 softens when risk hygiene is already good.
  const openRisks = riski.filter((r) => isOpenStatus(r.status));
  const managedRisks = riski.filter((r) => isManagedRiskStatus(r.status));
  const openHigh = openRisks.filter((r) => isHighImpact(r.impact));

  let silenceHits = 0;
  const silenceD8PerHit = managedRisks.length >= 3 ? 2 : 5;
  for (const row of storony) {
    if (/высок/i.test(row.silence ?? "")) {
      silenceHits += 1;
      if (silenceHits <= 3) {
        scores.D1 -= 8;
        scores.D8 -= silenceD8PerHit;
      }
    }
  }

  // Risks: only unmanaged «открыт» hurts; снижен/закрыт/принят are hygiene bonuses.

  for (const row of openHigh) {
    if (hasText(row.mitigation)) {
      // Working the risk — light hit, not a punish-for-recording
      scores.D8 -= 3;
      scores.D5 -= 3;
      scores.D4 -= 2;
    } else {
      scores.D8 -= 10;
      scores.D5 -= 8;
      scores.D4 -= 5;
    }
  }

  const openOtherUnmanaged = openRisks.filter(
    (r) => !isHighImpact(r.impact) && !hasText(r.mitigation),
  );
  scores.D8 -= Math.min(12, openOtherUnmanaged.length * 3);

  // Reward active risk hygiene (cap so greenwashing is limited)
  scores.D8 += Math.min(15, managedRisks.length * 3);
  scores.D5 += Math.min(9, managedRisks.length * 2);

  // Anti-Goodhart: empty risk register late = hidden risk, not «healthy»
  if (riski.length === 0 && stageId >= 4) {
    scores.D8 -= 15;
  } else if (riski.length === 0 && stageId >= 2) {
    scores.D8 -= 8;
  }

  // «Не знаем»: only open rows penalize; closed/устарел do not (and give small credit)
  const openUnknowns = neznaem.filter((r) => isOpenUnknown(r.status));
  const closedUnknowns = neznaem.filter((r) => isClosedUnknown(r.status));
  scores.D8 -= Math.min(28, openUnknowns.length * 7);
  scores.D8 += Math.min(10, closedUnknowns.length * 2);

  for (const row of byudzhet) {
    const delta = (row.delta ?? "").trim();
    if (delta.startsWith("+")) {
      scores.D6 -= 6;
      scores.D7 -= 5;
    }
  }

  for (const row of vekhi) {
    const st = (row.status ?? "").trim();
    if (!st || /просроч/i.test(st)) {
      scores.D4 -= 6;
      scores.D6 -= 5;
    }
  }

  const accepted = resheniya.filter((r) => /принят/i.test(r.status ?? ""));
  if (accepted.length >= 3) scores.D3 += 6;

  if (stageId <= 1) {
    scores.D3 += 4;
    scores.D4 -= 8;
  }

  if (stageId >= 4 && stageId <= 5) {
    const unmanagedHigh = openHigh.filter((r) => !hasText(r.mitigation));
    if (unmanagedHigh.length === 0 && openRisks.length <= 2) {
      scores.D5 += 5;
      scores.D6 += 4;
    } else if (unmanagedHigh.length >= 2) {
      scores.D5 -= 10;
      scores.D6 -= 8;
    }
  }

  // Team: weak signal from owner diversity on risks
  const owners = new Set(
    riski.map((r) => (r.owner ?? "").trim()).filter(Boolean),
  );
  if (owners.size >= 3) scores.D2 += 4;
  if (storony.length === 0 && riski.length === 0) scores.D2 -= 8;

  return DOMAIN_CLAMP(scores);
}

function nonEmptyRows(rows: RegisterRow[] | undefined): RegisterRow[] {
  return (rows ?? []).filter((row) =>
    Object.values(row).some((v) => String(v ?? "").trim().length > 0),
  );
}

function hasText(value: string | undefined): boolean {
  return String(value ?? "").trim().length > 0;
}

function isOpenStatus(status: string | undefined): boolean {
  return /открыт/i.test(status ?? "");
}

function isManagedRiskStatus(status: string | undefined): boolean {
  const s = (status ?? "").trim();
  return /снижен|закрыт|принят/i.test(s);
}

function isHighImpact(impact: string | undefined): boolean {
  return /^в$/i.test((impact ?? "").trim());
}

/** Empty status treated as still open (legacy / incomplete rows). */
function isOpenUnknown(status: string | undefined): boolean {
  const s = (status ?? "").trim();
  if (!s) return true;
  return /открыт/i.test(s);
}

function isClosedUnknown(status: string | undefined): boolean {
  return /закрыт|устарел/i.test((status ?? "").trim());
}

function DOMAIN_CLAMP(
  scores: Record<DomainId, number>,
): Record<DomainId, number> {
  const out = { ...scores };
  for (const id of Object.keys(out) as DomainId[]) {
    out[id] = Math.max(15, Math.min(95, Math.round(out[id])));
  }
  return out;
}

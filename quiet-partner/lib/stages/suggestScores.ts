import type { DomainId } from "@/lib/domains";
import type { RegisterRow } from "@/lib/stages/registers";

/** Pure mapping: pulpit registers → suggested domain scores (T-105). */
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

  let silenceHits = 0;
  for (const row of storony) {
    if (/высок/i.test(row.silence ?? "")) {
      silenceHits += 1;
      if (silenceHits <= 3) {
        scores.D1 -= 8;
        scores.D8 -= 5;
      }
    }
  }

  const openRisks = riski.filter((r) => /открыт/i.test(r.status ?? ""));
  const openHigh = openRisks.filter((r) => /^в$/i.test((r.impact ?? "").trim()));
  for (const _ of openHigh) {
    scores.D5 -= 8;
    scores.D8 -= 10;
    scores.D4 -= 5;
  }
  scores.D8 -= Math.min(24, openRisks.length * 4);

  const unknownHits = Math.min(4, neznaem.length);
  scores.D8 -= unknownHits * 7;

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
    if (openHigh.length === 0 && openRisks.length <= 2) {
      scores.D5 += 5;
      scores.D6 += 4;
    } else if (openHigh.length >= 2) {
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

function DOMAIN_CLAMP(
  scores: Record<DomainId, number>,
): Record<DomainId, number> {
  const out = { ...scores };
  for (const id of Object.keys(out) as DomainId[]) {
    out[id] = Math.max(15, Math.min(95, Math.round(out[id])));
  }
  return out;
}

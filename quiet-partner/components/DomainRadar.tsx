"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Briefcase,
  CalendarRange,
  CloudRain,
  GitBranch,
  Package,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { cn } from "@/lib/utils";
import {
  DOMAIN_DEFINITIONS,
  DOMAIN_IDS,
  STATUS_COLORS,
  THRESHOLD_GREEN,
  THRESHOLD_RED,
  type DomainId,
  type DomainStatus,
} from "@/lib/domains";
import { DOMAIN_GLOSSARY } from "@/lib/onboarding";
import { useProjectStore, type DomainHealth } from "@/lib/store/useProjectStore";

const DOMAIN_ICONS: Record<DomainId, LucideIcon> = {
  D1: Users,
  D2: UsersRound,
  D3: GitBranch,
  D4: CalendarRange,
  D5: Briefcase,
  D6: Package,
  D7: BarChart3,
  D8: CloudRain,
};

function StatusPill({
  domain,
  highlighted,
}: {
  domain: DomainHealth;
  highlighted: boolean;
}) {
  const Icon = DOMAIN_ICONS[domain.id];
  const colors = STATUS_COLORS[domain.status];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        colors.bg,
        colors.text,
        domain.status === "red" && "animate-pulse",
        highlighted && "ring-2 ring-red-500 ring-offset-1",
      )}
      title={`${domain.name}: ${domain.value} — ${DOMAIN_GLOSSARY[domain.id]}`}
    >
      <Icon className="size-3.5" aria-hidden />
      <span className="hidden sm:inline">{domain.name}</span>
      <span className="sm:hidden">{DOMAIN_DEFINITIONS.find((d) => d.id === domain.id)?.shortLabel}</span>
      <span className="tabular-nums opacity-80">{domain.value}</span>
    </div>
  );
}

function overallLabel(score: number): string {
  if (score >= THRESHOLD_GREEN) return "Устойчиво";
  if (score >= THRESHOLD_RED) return "Напряжение";
  return "Критично";
}

/** Radar chart for 8 PMBOK performance domains. */
export function DomainRadar() {
  const domainsRecord = useProjectStore((s) => s.domains);
  const domains = useMemo(
    () => DOMAIN_IDS.map((id) => domainsRecord[id]),
    [domainsRecord],
  );
  const overall = useMemo(() => {
    if (domains.length === 0) return 0;
    const sum = domains.reduce((acc, d) => acc + d.value, 0);
    return Math.round(sum / domains.length);
  }, [domains]);

  const chartData = domains.map((d) => ({
    domain: DOMAIN_DEFINITIONS.find((def) => def.id === d.id)?.shortLabel ?? d.name,
    fullLabel: d.name,
    value: d.value,
    status: d.status,
  }));

  const redDomains = domains.filter((d) => d.status === "red");
  const criticalId: DomainId | null =
    redDomains.length > 0 ?
      [...redDomains].sort((a, b) => a.value - b.value)[0]!.id
    : null;

  return (
    <section
      aria-labelledby="domain-radar-heading"
      className="flex h-full flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="domain-radar-heading" className="text-lg font-semibold">
            Здоровье по доменам
          </h2>
          <p className="text-sm text-muted-foreground">
            Субъективная оценка 0–100 · не аудит PMBOK
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">{overall}</p>
          <p className="text-xs text-muted-foreground">{overallLabel(overall)}</p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <ResponsiveContainer width="100%" height={320} minWidth={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            <PolarGrid stroke="oklch(0.88 0.01 250)" />
            <PolarAngleAxis
              dataKey="domain"
              tick={{ fill: "oklch(0.45 0.02 250)", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "oklch(0.6 0.02 250)", fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Здоровье"
              dataKey="value"
              stroke="oklch(0.45 0.08 250)"
              fill="oklch(0.62 0.12 230)"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <div className="rounded-full border border-border/80 bg-card/90 px-4 py-2 text-center shadow-sm">
            <p className="text-3xl font-bold tabular-nums">{overall}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              индекс
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2" role="list">
        {domains.map((d) => (
          <div key={d.id} role="listitem">
            <StatusPill domain={d} highlighted={d.id === criticalId} />
          </div>
        ))}
      </div>

      {criticalId && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Сейчас критичнее всего:{" "}
          <strong>{domains.find((d) => d.id === criticalId)?.name}</strong>
          . Один фокус — без лишней тревоги.
        </p>
      )}

      {/* Table fallback for screen readers */}
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Таблица оценок (доступность)
        </summary>
        <table className="mt-2 w-full border-collapse text-left">
          <caption className="sr-only">Оценки здоровья по 8 доменам PMBOK 7</caption>
          <thead>
            <tr className="border-b">
              <th scope="col" className="py-2 pr-4 font-medium">
                Домен
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Оценка
              </th>
              <th scope="col" className="py-2 font-medium">
                Сигнал
              </th>
            </tr>
          </thead>
          <tbody>
            {domains.map((d) => (
              <tr key={d.id} className="border-b border-border/60">
                <td className="py-2 pr-4">{d.name}</td>
                <td className="py-2 pr-4 tabular-nums">{d.value}</td>
                <td className={cn("py-2 capitalize", STATUS_COLORS[d.status as DomainStatus].text)}>
                  {d.status === "yellow" ? "жёлтый" : d.status === "red" ? "красный" : "зелёный"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}

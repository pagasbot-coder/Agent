"use client";

import { useState } from "react";

import { DOMAIN_DEFINITIONS } from "@/lib/domains";
import { DOMAIN_GLOSSARY } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

type DomainGlossaryProps = {
  /** Compact = single-line summary when collapsed */
  variant?: "default" | "compact";
  className?: string;
};

/** Collapsible RU glossary for 8 PMBOK domains (onboarding-spec + dashboard). */
export function DomainGlossary({
  variant = "default",
  className,
}: DomainGlossaryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed bg-muted/30 p-3",
        className,
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-sm font-medium"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>8 доменов PMBOK 7 — кратко</span>
        <span className="text-muted-foreground" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {!open && variant === "compact" && (
        <p className="mt-2 text-xs text-muted-foreground">
          Зелёный ≥70 · жёлтый 40–69 · красный &lt;40 — субъективные оценки.
        </p>
      )}
      {open && (
        <ul className="mt-3 space-y-2 border-t pt-3">
          {DOMAIN_DEFINITIONS.map((def) => (
            <li key={def.id} className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {def.labelRu}
              </span>{" "}
              — {DOMAIN_GLOSSARY[def.id]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import {
  PREP_CHECKLIST_ITEMS,
  type ProjectPrepChecklist,
  type ProjectPrepItemId,
} from "@/lib/onboarding";
import { cn } from "@/lib/utils";

type Props = {
  checklist: ProjectPrepChecklist;
  onChange: (id: ProjectPrepItemId, checked: boolean) => void;
};

/** T-081 — Alferov «проработать проект» checklist (onboarding step 3). */
export function ProjectPrepChecklistStep({ checklist, onChange }: Props) {
  const checkedCount = PREP_CHECKLIST_ITEMS.filter(
    (item) => checklist[item.id],
  ).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Отметьте, что уже ясно (можно не всё):
      </p>
      <fieldset className="space-y-2">
        <legend className="sr-only">Проработка проекта</legend>
        {PREP_CHECKLIST_ITEMS.map((item) => (
          <label
            key={item.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-border px-3 py-2.5",
              "has-[:checked]:border-primary has-[:checked]:bg-primary/5",
            )}
          >
            <input
              type="checkbox"
              checked={Boolean(checklist[item.id])}
              onChange={(e) => onChange(item.id, e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span className="text-sm leading-snug">{item.label}</span>
          </label>
        ))}
      </fieldset>
      <p className="text-xs text-muted-foreground">
        Отмечено: {checkedCount} из {PREP_CHECKLIST_ITEMS.length}
      </p>
      <p className="text-xs text-muted-foreground">
        Чек-лист для размышления, не аудит проекта.
      </p>
    </div>
  );
}

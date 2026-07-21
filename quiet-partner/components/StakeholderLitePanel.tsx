"use client";

import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type StakeholderLite,
  useProjectStore,
} from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

const MAX_STAKEHOLDERS = 3;
const EXPECTATION_MAX = 120;

function isStale(row: StakeholderLite): boolean {
  if (row.contactStale) return true;
  if (!row.lastContactAt) return false;
  const last = new Date(row.lastContactAt);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);
  return last < cutoff;
}

function emptyRow(): StakeholderLite {
  return {
    id: crypto.randomUUID(),
    who: "",
    expectation: "",
  };
}

/** T-082 — collapsible stakeholder map lite (max 3 rows, localStorage). */
export function StakeholderLitePanel() {
  const stakeholdersLite = useProjectStore((s) => s.stakeholdersLite);
  const upsertStakeholderLite = useProjectStore((s) => s.upsertStakeholderLite);
  const removeStakeholderLite = useProjectStore((s) => s.removeStakeholderLite);

  const hasStale = useMemo(
    () => stakeholdersLite.some(isStale),
    [stakeholdersLite],
  );
  const [collapsed, setCollapsed] = useState(
    () => stakeholdersLite.length === 0 || !hasStale,
  );
  const [draft, setDraft] = useState<StakeholderLite | null>(null);

  const count = stakeholdersLite.length;

  const startAdd = () => {
    if (count >= MAX_STAKEHOLDERS) return;
    setDraft(emptyRow());
    setCollapsed(false);
  };

  const startEdit = (row: StakeholderLite) => {
    setDraft({ ...row });
    setCollapsed(false);
  };

  const saveDraft = () => {
    if (!draft || !draft.who.trim()) return;
    upsertStakeholderLite({
      ...draft,
      who: draft.who.trim(),
      expectation: draft.expectation.slice(0, EXPECTATION_MAX),
    });
    setDraft(null);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-accent" aria-hidden />
            <CardTitle className="text-lg">
              Ключевые стороны ({count}/{MAX_STAKEHOLDERS})
            </CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Развернуть" : "Свернуть"}
          >
            {collapsed ?
              <ChevronDown className="size-4" />
            : <ChevronUp className="size-4" />}
          </Button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-4">
          {stakeholdersLite.map((row, index) => (
            <div
              key={row.id}
              className={cn(
                "rounded-lg border border-border p-3",
                isStale(row) && "border-amber-500/50 bg-amber-500/5",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {index + 1}. {row.who}
                    {isStale(row) && (
                      <span className="ml-2 text-xs text-amber-700 dark:text-amber-400">
                        · давно без контакта
                      </span>
                    )}
                  </p>
                  {row.expectation && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ждёт: {row.expectation}
                    </p>
                  )}
                  {row.lastContactAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Контакт:{" "}
                      {new Date(row.lastContactAt).toLocaleDateString("ru-RU")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(row)}
                  >
                    Изменить
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStakeholderLite(row.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {draft && (
            <div className="space-y-3 rounded-lg border border-dashed border-primary/40 p-3">
              <div className="space-y-1">
                <label htmlFor="stakeholder-who" className="text-sm font-medium">
                  Кто влияет *
                </label>
                <input
                  id="stakeholder-who"
                  type="text"
                  value={draft.who}
                  onChange={(e) =>
                    setDraft((d) => d && { ...d, who: e.target.value })
                  }
                  placeholder="Иван Петров · директор IT"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus-visible:ring-2"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="stakeholder-expectation"
                  className="text-sm font-medium"
                >
                  Что ждут (до {EXPECTATION_MAX} символов)
                </label>
                <textarea
                  id="stakeholder-expectation"
                  value={draft.expectation}
                  maxLength={EXPECTATION_MAX}
                  rows={2}
                  onChange={(e) =>
                    setDraft((d) => d && { ...d, expectation: e.target.value })
                  }
                  placeholder="Demo к пятнице, без слайдов"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus-visible:ring-2"
                />
                <p className="text-xs text-muted-foreground">
                  {draft.expectation.length}/{EXPECTATION_MAX}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="stakeholder-contact"
                    className="text-sm font-medium"
                  >
                    Последний контакт
                  </label>
                  <input
                    id="stakeholder-contact"
                    type="date"
                    value={draft.lastContactAt?.slice(0, 10) ?? ""}
                    onChange={(e) =>
                      setDraft(
                        (d) =>
                          d && {
                            ...d,
                            lastContactAt: e.target.value ?
                              new Date(e.target.value).toISOString()
                            : undefined,
                            contactStale: false,
                          },
                      )
                    }
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-2 pt-5 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.contactStale)}
                    onChange={(e) =>
                      setDraft(
                        (d) => d && { ...d, contactStale: e.target.checked },
                      )
                    }
                    className="size-4 accent-primary"
                  />
                  Давно (&gt;2 нед)
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={saveDraft}>
                  Сохранить
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDraft(null)}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}

          {!draft && count < MAX_STAKEHOLDERS && (
            <Button type="button" variant="outline" size="sm" onClick={startAdd}>
              + Добавить сторону
            </Button>
          )}
        </CardContent>
      )}

      <CardFooter className="border-t border-border/60 pt-3">
        <p className="text-xs text-muted-foreground">
          Вы сами вводите данные; продукт не заменяет CRM. Co-pilot, не
          сертификация PMBOK.
        </p>
      </CardFooter>
    </Card>
  );
}

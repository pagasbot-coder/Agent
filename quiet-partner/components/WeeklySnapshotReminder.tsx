"use client";

import { X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store/useProjectStore";

function formatRuDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU");
}

/** T-083 — return reminder banners (no email/push). */
export function WeeklySnapshotReminder() {
  const retentionReminder = useProjectStore((s) => s.retentionReminder);
  const snoozeRetentionReminder = useProjectStore(
    (s) => s.snoozeRetentionReminder,
  );
  const dismissRetentionOverdue = useProjectStore(
    (s) => s.dismissRetentionOverdue,
  );

  const { nextCheckInAt, lastSnapshotAt, snoozedUntil, dismissedOverdue } =
    retentionReminder;

  if (!lastSnapshotAt) return null;

  const now = new Date();
  if (snoozedUntil && now < new Date(snoozedUntil)) return null;

  const overdue = nextCheckInAt && now > new Date(nextCheckInAt);

  if (overdue && !dismissedOverdue) {
    return (
      <div
        className="mb-4 flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        role="status"
      >
        <div>
          <p className="text-sm font-medium">Пора обновить радар</p>
          <p className="text-sm text-muted-foreground">
            Прошла неделя с последнего снимка ({formatRuDate(lastSnapshotAt)}
            ). Обновите оценки или отметьте фокус недели.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/onboarding">
            <Button type="button" size="sm">
              Перейти к настройке
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => snoozeRetentionReminder(7)}
          >
            +7 дней
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label="Закрыть"
            onClick={dismissRetentionOverdue}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (nextCheckInAt && !overdue) {
    return (
      <div
        className="mb-4 rounded-lg border border-border bg-muted/40 px-4 py-3"
        role="status"
      >
        <p className="text-sm">
          Снимок сохранён {formatRuDate(lastSnapshotAt)}. Вернитесь ~
          {formatRuDate(nextCheckInAt)}, чтобы обновить радар.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/onboarding">
            <Button type="button" size="sm" variant="outline">
              Обновить радар сейчас
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => snoozeRetentionReminder(7)}
          >
            Напомнить через 7 дней
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Напоминание только в приложении — без email и push.
        </p>
      </div>
    );
  }

  return null;
}

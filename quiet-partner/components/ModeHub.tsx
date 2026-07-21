"use client";

import Link from "next/link";
import { ClipboardList, Radar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_DISCLAIMER } from "@/lib/domains";

/** First screen: choose stage pulpit vs domain radar co-pilot. */
export function ModeHub() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div
        className="relative flex flex-1 flex-col"
        style={{
          background:
            "radial-gradient(900px 480px at 12% -8%, oklch(0.94 0.02 230) 0%, transparent 55%), radial-gradient(700px 400px at 100% 0%, oklch(0.95 0.015 80) 0%, transparent 50%), var(--background)",
        }}
      >
        <header className="mx-auto w-full max-w-3xl px-4 pb-2 pt-14 sm:px-6 sm:pt-20">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Тихий напарник · ProjectM
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Тихий напарник
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Что нужно сейчас — операционка по этапам или взгляд на здоровье
            доменов?
          </p>
        </header>

        <main className="mx-auto grid w-full max-w-3xl flex-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:gap-5 sm:px-6 sm:py-10">
          <Link
            href="/stages"
            className="group flex flex-col rounded-xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <ClipboardList className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              Пульт этапов
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Этапы 0–6, реестры сторон / рисков / вех, шпаргалки. Данные в
              браузере — можно скачать Markdown.
            </p>
            <span className="mt-5">
              <Button className="pointer-events-none" tabIndex={-1}>
                Открыть пульт
              </Button>
            </span>
          </Link>

          <Link
            href="/radar"
            className="group flex flex-col rounded-xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <Radar className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              Тихий напарник
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Радар 8 доменов PMBOK 7 и короткий AI-комментарий — куда смотреть
              сегодня.
            </p>
            <span className="mt-5">
              <Button
                variant="outline"
                className="pointer-events-none"
                tabIndex={-1}
              >
                Открыть радар
              </Button>
            </span>
          </Link>
        </main>

        <footer className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            {DEFAULT_DISCLAIMER}
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link href="/waitlist" className="underline-offset-2 hover:underline">
              Ранний доступ
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

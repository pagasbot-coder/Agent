"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DEMO_URL = "https://quiet-partner.vercel.app";

const VALUE_BULLETS = [
  {
    title: "8 доменов — одна картина",
    text: "Stakeholders, команда, delivery, неопределённость и ещё четыре домена PMBOK 7 на DomainRadar: зелёный / жёлтый / красный без табличного ада.",
  },
  {
    title: "AI сначала спрашивает",
    text: "HealthCommentary не выдаёт «галочку compliance» — 1–3 plain-language вопроса, чтобы вы сами нашли, что горит (questions-first).",
  },
  {
    title: "Не PMI cert — реальный проект",
    text: "Мы не тренажёр экзамена и не замена PMO. Co-pilot для мышления, не сертификация PMBOK — disclaimer на каждом экране.",
  },
] as const;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Static acquisition landing — copy from landing-waitlist-one-pager; no backend. */
export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Укажите корректный email.");
      setSubmitted(false);
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  return (
    <div className="min-h-full">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-6 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Ранний доступ · waitlist
          </p>
          <Link
            href="/"
            className="w-fit text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← В приложение
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Один экран — здоровье проекта. Без экзамена PMP.
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            <span className="font-medium text-foreground">Тихий напарник</span>{" "}
            — co-pilot для PM в агентстве и SMB: DomainRadar по 8 доменам PMBOK
            7, короткий HealthCommentary от AI и 1–3 уточняющих вопроса. Не ещё
            один Jira и не тренажёр сертификации — инструмент, чтобы понять,{" "}
            <span className="text-foreground">
              куда направить внимание сегодня
            </span>
            , когда ведёте 2–8 проектов параллельно.
          </p>
          <p className="text-sm italic text-muted-foreground">
            Для Ани из PM-агентства: «всё жёлтое, нет приоритета» → один фокус
            на день.
          </p>
        </section>

        <ul className="mt-10 space-y-4" aria-label="Преимущества">
          {VALUE_BULLETS.map((bullet) => (
            <li
              key={bullet.title}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold leading-snug">
                {bullet.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{bullet.text}</p>
            </li>
          ))}
        </ul>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Получить ранний доступ</CardTitle>
            <CardDescription>
              Оставьте email — пришлём invite в закрытый beta для PM агентств и
              SMB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <p
                className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground"
                role="status"
              >
                Спасибо, записали в очередь (демо)
              </p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <label htmlFor="waitlist-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="waitlist-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@agency.ru"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className={cn(
                      "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors",
                      "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring",
                      error ? "border-destructive" : "border-border",
                    )}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "waitlist-email-error" : undefined}
                  />
                  {error && (
                    <p
                      id="waitlist-email-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Получить ранний доступ
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium hover:bg-muted"
          >
            Посмотреть demo
          </a>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Открыть приложение
            </Button>
          </Link>
        </div>

        <footer className="mt-12 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          Не сертификация PMBOK · не замена PMO · не подготовка к PMP. Co-pilot
          для мышления о здоровье проекта, не официальный PMI alignment.
        </footer>
      </main>
    </div>
  );
}

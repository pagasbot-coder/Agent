# PostHog self-host (OSS) — runbook

**Версия:** 1.0  
**Дата:** 2026-05-30  
**Владелец:** DevOps + Developer  
**Контекст:** T-031 · [ADR-002](../knowledge-base/adr-002-analytics-posthog.md) · Phase 4 instrumentation (T-030)

---

## TL;DR

| Параметр | Значение |
|----------|----------|
| **Обязательность** | **Опционально** — приложение работает с `POSTHOG_DISABLED=true` (default) |
| **Credentials** | Не хранить в git; Human задаёт ключи только в Vercel / VPS env |
| **Клиент** | `lib/analytics/posthog.ts` + consent banner (`AnalyticsConsent.tsx`) |
| **Compose** | [`docker/posthog/docker-compose.yml`](../docker/posthog/docker-compose.yml) — reference; prod → official hobby script |
| **EU** | Рекомендуется VPS в EU (GDPR); не блокирует staging Vercel |

---

## 1. Когда включать

1. Gate **G3→4** или позже — PM не блокирует MVP без PostHog.
2. Self-host поднят и доступен по HTTPS (или tunnel для dev).
3. В Vercel: `POSTHOG_DISABLED=false`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.
4. Пользователь дал consent (баннер RU уже в приложении).

Без ключей: все `capture()` — no-op (T-024/T-030).

---

## 2. Развёртывание на VPS (рекомендуется)

### 2.1 Official hobby deploy (prod)

На EU VPS (≥ 4 GB RAM, Ubuntu 22.04+):

```bash
# От root или sudo — см. https://posthog.com/docs/self-host
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/posthog/posthog/HEAD/bin/deploy-hobby)"
```

После установки:

1. Открыть `SITE_URL` (HTTPS через reverse proxy — Caddy/nginx).
2. Создать project → скопировать **Project API Key** (public, для `posthog-js`).
3. Host для клиента: `https://<your-posthog-domain>` (не `eu.i.posthog.com` cloud).

**Human OPTIONAL:** домен, TLS, firewall — не эскалировать для staging MVP.

### 2.2 Local / staging experiment

```bash
cd quiet-partner/docker/posthog
export POSTGRES_PASSWORD=local_dev_only
export POSTHOG_SECRET_KEY=local_dev_secret
docker compose up -d
# UI: http://localhost:8000 — только dev; не production
```

> Compose в репо — **упрощённый reference**. Полный hobby stack (workers, object storage) — только через official script на VPS.

---

## 3. Связка с Next.js (Vercel)

Контракт из [`.env.example`](../.env.example):

| Переменная | Где | Значение |
|------------|-----|----------|
| `POSTHOG_DISABLED` | Vercel | `false` когда готовы к событиям |
| `NEXT_PUBLIC_POSTHOG_KEY` | Vercel | Project API Key (public) |
| `NEXT_PUBLIC_POSTHOG_HOST` | Vercel | `https://posthog.<your-domain>` |
| `POSTHOG_API_KEY` | Vercel (server, опц.) | Personal API Key для server capture |

**Запрещено в payload:** email, имя проекта — см. `sanitizeAnalyticsProperties` (ADR-002).

### Smoke после включения

1. Staging с `POSTHOG_DISABLED=false` + ключи.
2. Пройти onboarding → consent «Принять».
3. В PostHog Live events: `onboarding_complete`, `commentary_refresh`, `feedback_*`.
4. [`qa-checklist.md`](../knowledge-base/qa-checklist.md) §Analytics (A1–A2).

---

## 4. События MVP (уже wired в коде)

| Event | Источник |
|-------|----------|
| `onboarding_complete` | `OnboardingWizard.tsx` |
| `commentary_refresh` | `HealthCommentary.tsx` |
| `feedback_positive` / `feedback_negative` | `CommentaryFeedback.tsx` |
| `action_logged` | `CommentaryFeedback.tsx` |
| `landing_view` / `waitlist_submit` | `app/waitlist/page.tsx` |

---

## 5. Privacy (RU / EU)

- Self-host в EU; `$process_person_profile: false` в `initPostHog()`.
- Consent до init; отказ = no-op.
- Plausible на `/waitlist` — отдельно (Growth), не заменяет in-app PostHog.

---

## 6. Troubleshooting

| Симптом | Действие |
|---------|----------|
| Событий нет | Проверить consent LS, `POSTHOG_DISABLED`, key/host |
| CORS / blocked | `NEXT_PUBLIC_POSTHOG_HOST` должен совпадать с origin PostHog |
| Bundle size | При disabled — dynamic import, нет init (T-030) |
| 429 BFF | Не PostHog — см. `costGuardrails.ts` |

---

## Handoff

| Кому | Действие |
|------|----------|
| **Human** | VPS + domain + TLS (OPTIONAL); project API key в Vercel |
| **Growth** | Дашборды activation в PostHog после live events |
| **QA** | §Analytics A1–A2 при включении ключей |

# ADR-003: Auth Phase 5 (spike / draft)

**Статус:** Draft — **T-033 READY** (Architect sign-off pending)  
**Дата:** 2026-06-07  
**Контекст:** Phase 5 persistence + per-user rate limits; сейчас anonymous + IP guardrails (ADR-001, T-029)

> **Не реализовывать** до подписи Architect и Human scope Phase 5 ([`docs/roadmap-phase5.md`](../docs/roadmap-phase5.md)).

---

## Проблема

| Сейчас (Phase 4) | Нужно (Phase 5) |
|------------------|-----------------|
| Zustand + `localStorage` | Server-side project state |
| Rate limit per IP (in-memory) | Per-user budget (Redis/Upstash) |
| Anonymous waitlist demo ack | Identified beta users |
| PostHog без user id | Consent + optional `distinct_id` после login |

---

## Рекомендация PM/Architect (draft): **Auth.js v5 (NextAuth)**

| Критерий | Auth.js v5 | Clerk (OSS self-host нет) | Lucia + custom |
|----------|------------|---------------------------|----------------|
| Next.js 16 App Router | ✅ официальный паттерн | ✅ SDK | ⚠️ больше glue-кода |
| OSS / self-host | ✅ MIT | ❌ SaaS | ✅ |
| Magic link email | ✅ Resend/Nodemailer adapter | ✅ | ⚠️ DIY |
| OAuth (1 provider) | ✅ Google/GitHub | ✅ | ✅ |
| Session в BFF | ✅ `auth()` server | ✅ | ✅ |
| Vendor lock-in | Низкий | Высокий | Низкий |
| Ops burden | Средний (DB adapter) | Низкий | Высокий |

**Черновик решения:** Auth.js v5 с **PostgreSQL adapter** (та же БД, что P5-ADR-2) + **email magic link** как primary; **Google OAuth** — optional second provider для agency PM.

---

## Альтернативы (отклонены или отложены)

| Вариант | Вердикт | Причина |
|---------|---------|---------|
| Clerk | Отложено | Нет self-host; против OSS-first stack |
| Supabase Auth only | Отложено | Дублирует DB ADR; Auth.js проще с Neon |
| Passkeys-only | Out of MVP | Friction для ICP (agency PM) |
| JWT в localStorage | **Отклонено** | XSS surface; против BFF pattern |

---

## Архитектура (sketch)

```
Browser → Next.js middleware (session cookie)
       → auth() in Route Handlers (/api/advisor/*)
       → PostgreSQL: users, sessions, accounts (Auth.js schema)
       → Optional: migrate localStorage snapshot on first login (P5-ADR-3)
```

- **Session:** HTTP-only cookie; **не** JWT в `localStorage`
- **BFF:** `auth()` перед LLM call; attach `userId` к rate limit / token budget (Phase 5, T-036)
- **Middleware:** protect `/` dashboard post-beta; `/waitlist` и marketing — public

---

## Env contract (draft — добавить в `.env.example` после ADR accepted)

```env
# Auth.js (Phase 5 — NOT active until T-035)
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_URL=https://quiet-partner.vercel.app

# Email magic link (Resend recommended OSS-friendly)
AUTH_RESEND_KEY=
AUTH_EMAIL_FROM=noreply@example.com

# Optional OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Database (shared with app — see phase5-schema-draft.md)
DATABASE_URL=postgresql://...
```

**Запрещено:** `NEXT_PUBLIC_AUTH_*`, session tokens в client bundle.

---

## Миграция localStorage → server (P5-ADR-3, outline)

1. User logs in → check `projects` row for `user_id`
2. If none: POST `/api/projects/import` with encrypted client snapshot (one-time)
3. Clear `quiet-partner-v1` LS after successful import + toast RU
4. Conflict policy: **server wins** if both exist (document in T-034)

---

## Безопасность

1. CSRF: Auth.js built-in for OAuth; SameSite cookies
2. Email enumeration: generic RU copy «Если аккаунт есть — письмо отправлено»
3. Rate limit on `/api/auth/*` (Vercel edge or middleware)
4. No PII in logs — только `userId` hash prefix

---

## Последствия

| Роль | Действие |
|------|----------|
| **Architect** | Sign-off ADR-003; unblock T-034/T-035 |
| **Developer** | T-035: `auth.ts`, middleware, login UI — после ADR accepted |
| **DevOps** | `AUTH_SECRET`, `DATABASE_URL` в Vercel; Resend DNS |
| **QA** | Smoke: login → session → BFF with user context |

---

## Open questions (Architect → Human)

1. **Resend vs SMTP self-host** для magic link (EU data residency)?
2. **Google OAuth** в MVP или только email?
3. **Beta gate:** login required для `/` или soft launch (anonymous + upsell)?

---

## Связи

- [`adr-001-llm-bff.md`](./adr-001-llm-bff.md) — per-user rate limit note
- [`docs/phase5-schema-draft.md`](../docs/phase5-schema-draft.md) — T-034
- [`docs/roadmap-phase5.md`](../docs/roadmap-phase5.md) — P5-ADR-1

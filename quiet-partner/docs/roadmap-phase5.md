# Roadmap Phase 5 — Auth, persistence, billing (RU)

**Версия:** 2.0  
**Дата:** 2026-06-08  
**Владелец:** PM + IT-Architect  
**Статус:** **Active** — Human Go 2026-06-08 («пошли дальше»); billing RU scaffold **DONE**; **activation Deferred by Human** (2026-06-08: «пока не подключать»)

> Scaffold: `AUTH_ENABLED=false`, `BILLING_ENABLED=false`. Postgres waitlist **ACTIVATED**. **Billing path:** scaffold + ADR + runbook готовы; live merchant / webhook / checkout — **paused** до решения Human (не tech blocker).

---

## TL;DR

| Область | Phase 4 (закрыто) | Phase 5 (сейчас) |
|---------|-------------------|------------------|
| Persistence | Zustand + `localStorage` + waitlist Postgres | PostgreSQL projects (schema draft) |
| Identity | Anonymous / IP rate limit | Auth.js scaffold OFF → activation |
| **Billing** | Waitlist demo | **YooKassa RU** — lib + API stub OFF |
| Deploy | Vercel staging | Vercel + Neon |
| Analytics | PostHog OFF | PostHog optional |

---

## Gate G4→5 (критерии входа)

- [x] **M0 Go** — Human directive «пошли дальше» (Pavel, 2026-06-08) → [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)
- [x] Phase 4: cost guardrails + analytics ADR (T-029, T-030 **DONE**)
- [x] ≥3 useful dogfood **или waiver** — waiver на roundtable 2026-06-07
- [x] Human approves Phase 5 scope — **implicit Go** + RU payments path

---

## Scope Phase 5

### In scope (committed)

| Пакет | Описание | Статус |
|-------|----------|--------|
| **Auth** | Auth.js v5 + PostgreSQL adapter | Scaffold DONE (T-035); activation Human |
| **PostgreSQL** | Drizzle schema + waitlist live | T-051 **ACTIVATED** |
| **Billing RU** | YooKassa, freemium + Pro | ADR + scaffold **DONE** (T-064, T-065); **activation Deferred by Human** |
| **Rate limits** | Redis / Upstash | Scaffold DONE (T-036) |
| **Waitlist backend** | Postgres table + API | **DONE** (T-051) |

### Out of scope (до отдельного решения)

| Пакет | Причина |
|-------|---------|
| Multi-tenant / org billing | brief Out |
| **Stripe primary** | RU merchant — см. ADR-005 |
| Jira / MS Project sync | ТЗ §8 DEP |
| PMI certification positioning | anti-persona |

---

## Архитектурные решения

| ID | Вопрос | Статус |
|----|--------|--------|
| P5-ADR-1 | Auth (Auth.js v5) | **Accepted** — [`adr-003-auth-phase5.md`](../knowledge-base/adr-003-auth-phase5.md) |
| P5-ADR-2 | DB host (Neon lean) | **Draft** — [`adr-004-db-host-phase5.md`](../knowledge-base/adr-004-db-host-phase5.md) |
| P5-ADR-3 | Migrate localStorage → server | **Design** — [`localstorage-migrate-phase5.md`](./localstorage-migrate-phase5.md) |
| P5-ADR-4 | Redis rate limit | **Scaffold DONE** (T-036) |
| **P5-ADR-5** | **Payments Russia (YooKassa)** | **Accepted** — [`adr-003-payments-russia.md`](../knowledge-base/adr-003-payments-russia.md) |

---

## Russia payment path

```
/waitlist (RU pricing copy)
    → beta invite + AUTH on
    → POST /api/billing/create-payment → YooKassa redirect
    → POST /api/billing/webhook → subscriptions + payments (Drizzle)
    → Pro tier unlocks AI cap / export
```

| Компонент | Путь |
|-----------|------|
| Provider interface | `lib/billing/` |
| Checkout BFF | `app/api/billing/create-payment/route.ts` |
| Webhook BFF | `app/api/billing/webhook/route.ts` |
| Schema | `subscriptions`, `payments` в `lib/db/schema.ts` |
| Human runbook | [`billing-russia-runbook.md`](./billing-russia-runbook.md) |
| Env | `BILLING_ENABLED=false` default |

**Цена (гипотеза):** Pro от **990 ₽/мес** — `BILLING_PRO_PRICE_RUB`.

---

## Очередь Phase 5

| ID | Задача | Роль | Статус |
|----|--------|------|--------|
| T-033…T-036 | Auth / DB / Redis scaffold | — | **DONE** |
| T-051 | Drizzle + waitlist postgres | Developer | **DONE** |
| T-064 | ADR payments Russia | Architect | **DONE** |
| T-065 | Billing lib + schema + API stub | Developer | **DONE** |
| T-066 | Billing Russia runbook | PM | **DONE** |
| T-067 | M0 Human Go + pm-status v4.1 | PM | **DONE** |
| T-068 | Waitlist RU pricing copy | Developer | **DONE** |
| T-069 | Webhook persist + IP verify | Developer | **BACKLOG** — Human: «пока не подключать» |
| T-070 | AUTH activation + checkout UI | Developer | **BACKLOG** |
| T-071 | YooKassa recurring Pro | Developer | **BACKLOG** |

> **Billing activation** заблокирована **решением Human**, не техническим долгом. Код scaffold (`lib/billing/`, API routes, schema, ADR-005, runbook) **сохранён** — включение по запросу.

**Activation checklist (Human — когда будет готов):**

1. Явное «можно подключать оплату» в чат / journal
2. YooKassa merchant + test keys — [`billing-russia-runbook.md`](./billing-russia-runbook.md)
3. `AUTH_ENABLED=true` + `AUTH_SECRET` (для checkout)
4. `npm run db:push` (subscriptions/payments)
5. `BILLING_ENABLED=true` на Preview → smoke webhook

---

## Трассировка

- [`technical-specification.md`](./technical-specification.md) §8 DEP-7, DEP-8
- [`implementation-plan.md`](./implementation-plan.md) Phase 5
- [`roadmap.md`](./roadmap.md)
- [`cpo-report-m0.md`](./cpo-report-m0.md) §6 monetization

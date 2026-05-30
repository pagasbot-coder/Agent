# Roadmap Phase 5 — Auth, persistence, billing

**Версия:** 1.0  
**Дата:** 2026-05-30  
**Владелец:** PM + IT-Architect  
**Статус:** **BLOCKED** до Human sign-off **M0 Go** и отдельного решения по scope Phase 5+ ([`pm-governance.md`](./pm-governance.md) §Human MUST #2)

> **Не реализовывать** auth / PostgreSQL / billing в приложении без подписи Human (Pavel).

---

## TL;DR

| Область | Phase 4 (сейчас) | Phase 5 (после sign-off) |
|---------|------------------|---------------------------|
| Persistence | Zustand + `localStorage` | PostgreSQL (ADR TBD) |
| Identity | Anonymous / IP rate limit | Auth (NextAuth или ADR) |
| Billing | — | Out of MVP; waitlist demo only |
| Deploy | Vercel staging | VPS prod + DB — TBD с Architect |
| Analytics | PostHog OFF / self-host optional | PostHog + per-user budgets |

---

## Gate G4→5 (критерии входа)

- [ ] **M0 Go** подписан в [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)
- [ ] Phase 4: cost guardrails + analytics ADR исполнены (T-029, T-030 **DONE**)
- [ ] ≥3 useful dogfood (G2→3) или documented waiver Human
- [ ] Human approves **Phase 5 scope** (таблица ниже) — одна строка в queue «Журнал»

---

## Scope Phase 5 (черновик — Human sign-off)

### In scope (кандидаты, не committed)

| Пакет | Описание | Зависимости |
|-------|----------|-------------|
| **Auth** | Email magic link или OAuth (1 provider); session в BFF | ADR auth (новый) |
| **PostgreSQL** | `projects`, `domain_scores`, `feedback` — миграция с localStorage | Neon/Supabase ADR |
| **Rate limits** | Redis / Upstash вместо in-memory per instance | Auth user id |
| **Waitlist backend** | Listmonk или Postgres table + API | M0 Go + Growth |

### Out of scope (до отдельного решения)

| Пакет | Причина |
|-------|---------|
| Multi-tenant / org billing | brief Out; R6 scope creep |
| Jira / MS Project sync | ТЗ §8 DEP |
| PMI certification positioning | anti-persona |
| Full payment / Stripe | Human MUST budget |

---

## Архитектурные решения (TBD — Architect)

| ID | Вопрос | Статус |
|----|--------|--------|
| P5-ADR-1 | Auth provider (NextAuth v5 vs Clerk OSS vs custom) | **BLOCKED** |
| P5-ADR-2 | DB host (Neon vs Supabase vs self-host Postgres) | **BLOCKED** |
| P5-ADR-3 | Migrate localStorage → server on login | **BLOCKED** |
| P5-ADR-4 | Redis for rate limit + token budget per user | **BLOCKED** |

Связь: [`architecture.md`](../knowledge-base/architecture.md) · [`adr-001-llm-bff.md`](../knowledge-base/adr-001-llm-bff.md) (Redis note).

---

## Очередь после sign-off (placeholder)

PM заведёт `T-03x+` после M0 Go:

| ID (draft) | Задача | Роль | Блокер |
|------------|--------|------|--------|
| T-033 | ADR auth + env contract | Architect | M0 + Human scope |
| T-034 | PostgreSQL schema + migrate spike | Developer | T-033 |
| T-035 | Auth UI + session middleware | Developer | T-033 |
| T-036 | BFF rate limit → Redis | Developer + DevOps | T-034 |

**Не создавать READY** до Human sign-off Phase 5.

---

## Трассировка

- [`technical-specification.md`](./technical-specification.md) §8 DEP-7, DEP-8
- [`implementation-plan.md`](./implementation-plan.md) Phase 5 (post calendar week N14+)
- [`roadmap.md`](./roadmap.md) — текущий статус Phase 0–4

---

## Human — одно решение (когда готовы)

> **Подтвердите scope Phase 5:** Auth + PostgreSQL + waitlist backend **да/нет/отложить** — после M0 Go.

До ответа: все Phase 5 app tasks остаются **BLOCKED** в `orchestration-queue.md`.

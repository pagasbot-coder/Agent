# QA Phase 5 prep checklist (T-046)

**Дата:** 2026-06-07 (post T-051 activation)  
**Владелец:** QA  
**Контекст:** Postgres/waitlist **ACTIVATED** on prod; `AUTH_ENABLED=false`; Redis OFF

**Staging:** https://quiet-partner.vercel.app

---

## Compile gate

| # | Команда | Ожидание |
|---|---------|----------|
| P5-Q0 | `npm run build` | PASS |
| P5-Q1 | `npm run lint` | PASS |

---

## Auth scaffold (T-035) — OFF default

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-A1 | `GET /api/health` | `auth_enabled: false` |
| P5-A2 | `GET /login` | Placeholder 200 (public) |
| P5-A3 | Dashboard `/` без сессии | 200 (AUTH off — no redirect) |
| P5-A4 | `GET /api/auth/*` when AUTH off | 503 или disabled stub per ADR-003 |

---

## Redis rate limit (T-036) — OFF default

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-R1 | `GET /api/health` → `rate_limit_backend` | `memory` (not redis) |
| P5-R2 | POST BFF 200 | No 429 under normal smoke |
| P5-R3 | `.env.example` | `REDIS_URL` / `REDIS_TOKEN` empty |

---

## Waitlist API (T-044 / T-051)

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-W1 | `GET /api/waitlist` | `{ ok: true, backend: "postgres" }` when activated |
| P5-W2 | `POST /api/waitlist` valid email | 200 `{ ok: true, message: "registered" }`; row in DB |
| P5-W3 | `POST` invalid email | 400 `invalid_email` |
| P5-W4 | `/waitlist` form submit | Success UI; no secrets in page source |
| P5-W5 | `GET /api/health` | `waitlist_backend: "postgres"`, `database_configured: true` |

---

## DB / migration (T-034, T-051, ADR-004)

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-D1 | `db:push` applied | Schema in Neon; no secrets in git |
| P5-D2 | `DATABASE_URL` in Vercel | health `database_configured: true` |
| P5-D3 | Docs exist | `phase5-schema-draft.md`, `Human-one-step-database.md`, `adr-004-db-host-phase5.md` |

---

## Auth activation prep (T-056 — docs only, AUTH OFF)

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-A5 | `auth-activation-runbook.md` | Env contract + smoke + rollback documented |
| P5-A6 | `AUTH_ENABLED=false` prod | No redirect; `/api/auth/*` 503 when off |

---

## Regression subset (Phase 3–4)

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-X1 | `GET /`, `/onboarding`, `/waitlist` | 200 |
| P5-X2 | DomainRadar 8 domains | Unchanged thresholds 40/70 |
| P5-X3 | PostHog | OFF default; consent banner only if key set |
| P5-X4 | Disclaimer PMBOK | Present on commentary + waitlist footer |

---

## Sign-off

| Роль | Статус | Дата |
|------|--------|------|
| QA | **PASS** (compile + postgres smoke) | 2026-06-07 |
| PM | T-053 SEO + T-056 groom | 2026-06-07 |

**Blockers for auth activation:** Human `AUTH_ENABLED=true`, `AUTH_SECRET`, M0 Go. DB/waitlist — **DONE**.

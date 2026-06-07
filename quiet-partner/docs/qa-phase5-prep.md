# QA Phase 5 prep checklist (T-046)

**Дата:** 2026-06-07  
**Владелец:** QA  
**Контекст:** Scaffold only — `AUTH_ENABLED=false`, `DATABASE_URL` empty, Redis OFF, waitlist `noop`

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

## Waitlist API (T-044)

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-W1 | `GET /api/waitlist` | `{ ok: true, backend: "noop" }` |
| P5-W2 | `POST /api/waitlist` valid email | 200 `{ ok: true, message: "registered" }` |
| P5-W3 | `POST` invalid email | 400 `invalid_email` |
| P5-W4 | `/waitlist` form submit | Success UI; no secrets in page source |
| P5-W5 | `GET /api/health` | `waitlist_backend: "noop"` |

---

## DB / migration docs (T-034, T-045, ADR-004)

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-D1 | No live migrate | `drizzle-kit` not in CI deploy |
| P5-D2 | `DATABASE_URL` empty local | App boots; health `database_url_configured: false` |
| P5-D3 | Docs exist | `phase5-schema-draft.md`, `localstorage-migrate-phase5.md`, `adr-004-db-host-phase5.md` |

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
| QA | **PASS** (compile + API smoke) | 2026-06-07 |
| PM | Groom T-047+ backlog | 2026-06-07 |

**Blockers for prod activation:** Human `DATABASE_URL`, `AUTH_ENABLED=true`, Redis keys, M0 Go.

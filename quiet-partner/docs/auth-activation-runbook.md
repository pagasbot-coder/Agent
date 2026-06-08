# Auth activation runbook (Phase 5 prep — docs only)

**Задача:** T-056 · **Статус:** prep doc · **Gate:** Human MUST — `AUTH_ENABLED=true` + secrets  
**Связь:** [`adr-003-auth-phase5.md`](../knowledge-base/adr-003-auth-phase5.md) · T-035 scaffold · T-052 migrate API

> **AUTH OFF по умолчанию.** Агенты не включают auth без явного решения Human.

---

## TL;DR

| Шаг | Действие | Кто |
|-----|----------|-----|
| 1 | M0 Go + `DATABASE_URL` live (T-051 ✅) | Human |
| 2 | Сгенерировать `AUTH_SECRET` (`openssl rand -base64 32`) | Human |
| 3 | Vercel env: `AUTH_ENABLED=true`, `AUTH_SECRET`, provider keys | Human |
| 4 | Smoke: `/login` 200, `/api/auth/*` не 503, dashboard policy per ADR-003 | QA |
| 5 | Опционально: `MIGRATE_LOCALSTORAGE_ON_LOGIN=true` → T-052 | Human + Developer |

---

## Env contract (activation)

| Variable | Required when AUTH on | Notes |
|----------|----------------------|-------|
| `AUTH_ENABLED` | `true` | Default `false` — scaffold only |
| `AUTH_SECRET` | Yes | Min 32 chars; Vercel Production + Preview |
| `DATABASE_URL` | Yes | Auth.js adapter (Neon pooled) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | If Google OAuth | Or email magic link provider per ADR-003 |
| `MIGRATE_LOCALSTORAGE_ON_LOGIN` | No | Default `false`; T-045 design |

**Не коммитить:** любые secrets в git.

---

## Smoke checklist (post-activation)

1. `GET /api/health` → `auth_enabled: true`
2. `GET /login` → placeholder/form 200
3. Dashboard `/` — поведение per ADR-003 (public demo vs protected — Human sign-off)
4. `GET /api/auth/session` — JSON без PII в logs
5. BFF rate limit — per-user key when session present (T-036)
6. Regression: onboarding, waitlist, commentary без регрессии

Полный список: [`qa-phase5-prep.md`](./qa-phase5-prep.md) §Auth activation (T-057).

---

## Rollback

1. Vercel: `AUTH_ENABLED=false` → redeploy
2. Middleware stub — dashboard снова public (T-035 default)
3. localStorage persist — unchanged (no server migrate)

---

## Out of scope (до отдельной задачи)

- Billing / Stripe
- Multi-tenant orgs
- Listmonk waitlist sync (отдельный backlog)

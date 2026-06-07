# ADR-004: PostgreSQL host Phase 5 (P5-ADR-2)

**Статус:** **Draft** — 2026-06-07 (IT-Architect; parallel T-045/T-044)  
**Дата:** 2026-06-07  
**Контекст:** Auth.js adapter + Drizzle schema spike (T-034); **no `DATABASE_URL` in repo**

> **Черновик lean:** **Neon serverless Postgres** primary; Supabase acceptable if Human already has account. Self-host Postgres — Phase 5+ optional for VPS path.

---

## Проблема

| Нужно | Ограничение |
|-------|-------------|
| Auth.js sessions + app tables | OSS, EU-friendly, Vercel-compatible |
| Drizzle ORM (T-034 spike) | Connection pooling on serverless |
| Waitlist + projects post-M0 | Human MUST provision keys |

---

## Рекомендация (draft): **Neon**

| Критерий | Neon | Supabase | Self-host PG |
|----------|------|----------|--------------|
| Serverless / pooler | ✅ built-in | ✅ pooler | ⚠️ PgBouncer DIY |
| Auth.js adapter docs | ✅ common path | ✅ | ✅ |
| Free tier MVP | ✅ hobby | ✅ | VPS cost |
| EU region | ✅ | ✅ | ✅ if VPS EU |
| Vendor lock-in | Low (PG wire) | Medium (extras) | Lowest |
| Ops | Low | Low | High (DevOps) |

**Черновик:** Neon project `quiet-partner-staging` → `DATABASE_URL` pooled connection string in Vercel **only** after M0 Go.

---

## Env contract

```bash
DATABASE_URL=postgresql://...@...-pooler.neon.tech/quiet_partner?sslmode=require
# Drizzle (future):
# DRIZZLE_DATABASE_URL=... # direct for migrations only — CI/Human local
```

| Flag | Default | Notes |
|------|---------|-------|
| `DATABASE_URL` | empty | Never commit |
| `AUTH_ENABLED` | `false` | true only with DB + `AUTH_SECRET` |
| `WAITLIST_BACKEND` | `noop` | `postgres` when table migrated |

---

## Schema rollout (Human MUST)

1. Human creates Neon DB + role.
2. Developer runs `drizzle-kit push` **once** from secure env (not in CI until approved).
3. Auth.js adapter tables + app tables per [`phase5-schema-draft.md`](../docs/phase5-schema-draft.md).

---

## Альтернативы

| Вариант | Вердикт |
|---------|---------|
| Supabase | **Accepted alternate** — same Drizzle PG driver; choose if Human prefers dashboard/auth extras |
| SQLite / Turso | Rejected — Auth.js adapter friction |
| PlanetScale | Rejected — MySQL, schema mismatch |

---

## Human decision (one line)

> **Neon / Supabase / defer** — после M0 Go; до ответа `DATABASE_URL` пуст, T-034 schema остаётся spike-only.

---

## Трассировка

- T-034 [`lib/db/schema.ts`](../lib/db/schema.ts)
- ADR-003 Auth.js + same DB
- [`roadmap-phase5.md`](../docs/roadmap-phase5.md) P5-ADR-2

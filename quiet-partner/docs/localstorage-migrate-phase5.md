# localStorage → server migration (Phase 5 spike)

**Версия:** 1.0  
**Дата:** 2026-06-07  
**Задача:** T-045  
**Статус:** Design doc — **no live DB** until Human scopes `DATABASE_URL`

> Spike flag: `MIGRATE_LOCALSTORAGE_ON_LOGIN=false` (default). Auth off (`AUTH_ENABLED=false`) — migration path dormant.

---

## TL;DR

| Сейчас | Phase 5 (после login) |
|--------|------------------------|
| Zustand persist `quiet-partner-v1` | `projects` + `domain_scores` в PostgreSQL |
| `commentaryFeedback` в LS | `commentary_feedback` table |
| Anonymous waitlist noop/file | `waitlist_signups` + optional Listmonk |

---

## Триггер миграции

1. User completes Auth.js magic link (`AUTH_ENABLED=true`).
2. Server session has `userId`; client still has LS snapshot.
3. If `MIGRATE_LOCALSTORAGE_ON_LOGIN=true` **and** user has zero server projects → run one-shot import.

**Idempotency:** migration marker `quiet-partner-migrated-at` in LS; skip if set or server project exists.

---

## Payload mapping

| localStorage key | Server target | Notes |
|------------------|---------------|-------|
| `quiet-partner-v1` → `state.domainScores` | `domain_scores` rows | 8 domains per project |
| `quiet-partner-v1` → `state.projectMeta` | `projects.name`, `phase` | single project v1 |
| `quiet-partner-v1` → `state.deliveryApproach` | `projects.delivery_approach` | enum |
| `commentaryFeedback` | `commentary_feedback` | thumbs + action text |

**Out of scope v1:** merge conflicts (last-write-wins server); multi-project LS → pick active project name.

---

## API sketch (post-activation)

```
POST /api/projects/migrate-from-local
Authorization: session cookie
Body: { snapshot: ExportProjectSnapshot JSON }
→ 201 { projectId } | 409 already_migrated
```

Reuse [`lib/exportProjectSnapshot.ts`](../lib/exportProjectSnapshot.ts) shape — already clipboard-safe, no email.

---

## Env contract

| Variable | Default | When |
|----------|---------|------|
| `MIGRATE_LOCALSTORAGE_ON_LOGIN` | `false` | `true` after DB + auth Human sign-off |
| `DATABASE_URL` | empty | Neon/Supabase per ADR-004 |
| `AUTH_ENABLED` | `false` | `true` for migration path |

---

## Rollout phases

1. **Spike (now):** doc + env stub; no route implementation.
2. **T-048+ (BLOCKED):** `POST /api/projects/migrate-from-local` + Drizzle insert.
3. **Beta:** opt-in banner «Сохранить проект в аккаунт» on dashboard after login.

---

## Risks

| ID | Риск | Mitigation |
|----|------|------------|
| R-LS1 | Duplicate projects on re-login | Server check + LS marker |
| R-LS2 | PII in snapshot | Whitelist fields only (no email in export) |
| R-LS3 | Partial migrate | Transaction per project; rollback log in `audit_log` |

---

## Трассировка

- P5-ADR-3 в [`roadmap-phase5.md`](./roadmap-phase5.md)
- Schema: [`phase5-schema-draft.md`](./phase5-schema-draft.md), [`lib/db/schema.ts`](../lib/db/schema.ts)
- Auth: [`adr-003-auth-phase5.md`](../knowledge-base/adr-003-auth-phase5.md)

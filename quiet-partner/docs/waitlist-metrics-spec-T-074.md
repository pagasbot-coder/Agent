# Waitlist metrics spec — T-074

**Задача:** T-074 · **Роли:** PM + Growth  
**Статус:** DONE 2026-06-13  
**Gate:** G-Book-0 (Book-0 GTM + metrics) · **G-Book-P2** review ~2026-06-27  
**Контекст:** [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) · [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) · [`gtm-sprint1-drafts-T-073.md`](./gtm-sprint1-drafts-T-073.md)

---

## TL;DR

Еженедельный снимок waitlist: **uniques → signups → CR** по **source** (UTM). Источник истины signups — Postgres `waitlist_signups` (T-051). Uniques — Plausible/PostHog OPTIONAL (T-075) или ручной счётчик UTM landing views. **Billing OFF** — метрики Acquisition only.

---

## KPI (North Star slice — Acquisition)

| KPI | Определение | Target (14d sprint 1) | Target (90d) | Owner |
|-----|-------------|----------------------|--------------|-------|
| **Waitlist signups** | Уникальные email в `waitlist_signups` за период | **≥18** | **≥50** | PM + Growth |
| **Landing uniques** | Уникальные визиты `/waitlist` (или `/` с CTA) за период | **≥150** | trend | Growth |
| **Conversion rate (CR)** | `signups / uniques × 100%` | **≥12%** (H1) | ≥12% sustained | PM |
| **Source mix** | % signups по `source` / UTM | LinkedIn + community ≥70% sprint 1 | diversified | Growth |
| **Duplicate rate** | `already_registered / total POST` | <10% (quality signal) | monitor | Developer |
| **Kill trigger** | 90d cumulative | — | **Pause** if signups &lt;50 **and** CR &lt;5% organic | PM + Human |

**Out of scope (paused):** paying users, checkout CR, MRR — billing Human-blocked (T-069…T-071).

---

## Источники данных

| Метрика | Primary source | Fallback | Env / route |
|---------|----------------|----------|-------------|
| Signups count | Postgres `waitlist_signups.created_at` | — | `WAITLIST_BACKEND=postgres`, `DATABASE_URL` |
| Signups by source | Postgres `waitlist_signups.source` | UTM → `source` on POST | `POST /api/waitlist` body `{ source }` |
| Signup role (optional) | Client → not in PG schema yet | PostHog `waitlist_submit` | ADR-002; no PII in events |
| Landing uniques | Plausible `/waitlist` | PostHog `landing_view` | T-075 OPTIONAL |
| Uniques by UTM | Plausible UTM breakdown | Manual link clicks + est. | UTM table T-073 |
| Health / backend | `GET /api/health` | — | `checks.waitlist_backend`, `database_configured` |
| BFF availability | Staging smoke T-078 | — | not a waitlist KPI |

**UTM → `source` mapping (рекомендация для формы/API):**

| UTM | `source` value (POST body) |
|-----|------------------------------|
| `utm_source=linkedin&utm_campaign=waitlist_v0` | `linkedin_waitlist_v0` |
| `utm_source=community&utm_campaign=waitlist_v0` | `community_waitlist_v0` |
| organic / direct | `waitlist` (default) |
| `utm_source=seo` | `seo_organic` |

---

## Postgres — поля `waitlist_signups`

Схема: [`lib/db/schema.ts`](../lib/db/schema.ts) · активация T-051.

| Поле | Тип | Nullable | Описание |
|------|-----|----------|----------|
| `id` | `uuid` | PK, default random | Surrogate key |
| `email` | `text` | NOT NULL, UNIQUE | Normalized lowercase (store layer) |
| `user_id` | `uuid` | FK → `users.id`, ON DELETE SET NULL | Заполняется после AUTH (Phase 5) |
| `source` | `text` | default `'waitlist'` | Канал: UTM-mapped string, max 64 chars |
| `created_at` | `timestamptz` | NOT NULL, default now() | Timestamp signup |

**Запросы (еженедельный snapshot):**

```sql
-- Signups за неделю
SELECT COUNT(*) AS signups
FROM waitlist_signups
WHERE created_at >= :week_start AND created_at < :week_end;

-- По source
SELECT source, COUNT(*) AS cnt
FROM waitlist_signups
WHERE created_at >= :week_start AND created_at < :week_end
GROUP BY source
ORDER BY cnt DESC;

-- Cumulative (90d kill check)
SELECT COUNT(*) FROM waitlist_signups
WHERE created_at >= NOW() - INTERVAL '90 days';
```

**Примечание:** поле `role` из one-pager пока **не** в PG — только client/analytics; при T-074 impl рассмотреть миграцию `role text` (BACKLOG, не блокирует spec).

---

## Формат weekly snapshot (шаблон)

**Файл:** копировать секцию ниже в `docs/waitlist-weekly/` или Notion — **один файл на неделю**.  
**Ритм:** каждый понедельник; владелец **Growth**, review **PM**.

### Шапка

| Поле | Значение |
|------|----------|
| **Week** | ISO week (e.g. 2026-W24) |
| **Period** | YYYY-MM-DD (Mon) — YYYY-MM-DD (Sun) |
| **Author** | Growth / PM |
| **Staging** | https://quiet-partner.vercel.app/waitlist |
| **Hypotheses** | H1 CR ≥12% · H2 uniques ≥150 · H3 signups ≥18 |

### Таблица метрик

| Metric | This week | Prev week | Δ | Target (14d) | Status |
|--------|-----------|-----------|---|--------------|--------|
| Landing uniques | | | | ≥150 (cumulative) | ⬜ |
| Waitlist signups | | | | ≥18 (cumulative) | ⬜ |
| CR (signups/uniques) | | | | ≥12% | ⬜ |
| Duplicates (API) | | | | &lt;10% | ⬜ |

### Signups by source

| source | Signups | % of total | Notes |
|--------|---------|------------|-------|
| `linkedin_waitlist_v0` | | | |
| `community_waitlist_v0` | | | |
| `waitlist` (default) | | | |
| `seo_organic` | | | |
| **Total** | | 100% | |

### Channel activity (qualitative)

| Channel | Posts / intros | Link used | Engagement notes |
|---------|----------------|-----------|------------------|
| LinkedIn | | | |
| Community | | | |

### Decisions / next week

- [ ] Continue hook / pivot copy (CR &lt;5%)
- [ ] Add second community (uniques &lt;80)
- [ ] Escalate Human: G-Book-P2 waive vs wait
- [ ] Blockers: DB / analytics / staging

---

## Snapshot #1 — 2026-W24 (2026-06-09 — 2026-06-15)

> **Первый снимок:** sprint 1 старт 2026-06-13; данные **пустые** (каналы ещё не live). Baseline зафиксирован для Δ на W25.

| Metric | This week | Prev week | Δ | Target (14d) | Status |
|--------|-----------|-----------|---|--------------|--------|
| Landing uniques | **0** | — | — | ≥150 (cumulative) | ⬜ baseline |
| Waitlist signups | **0** | — | — | ≥18 (cumulative) | ⬜ baseline |
| CR (signups/uniques) | **—** | — | — | ≥12% | ⬜ n/a |
| Duplicates (API) | **0** | — | — | &lt;10% | ⬜ n/a |

| source | Signups | % of total | Notes |
|--------|---------|------------|-------|
| `linkedin_waitlist_v0` | 0 | — | T-073 drafts ready; Human post pending |
| `community_waitlist_v0` | 0 | — | intro draft ready |
| `waitlist` | 0 | — | direct / demo traffic only |
| **Total** | **0** | — | Postgres active (`waitlist_backend: postgres`) |

**Infra check (2026-06-13):** `GET /api/health` → `database_configured: true`, `waitlist_backend: postgres`, `auth_enabled: false`, billing not in scope.

**Next week (W25):** Human publishes T-073 drafts; Growth fills uniques from Plausible or manual UTM log. **Шаблон:** [`waitlist-snapshot-W25-template.md`](./waitlist-snapshot-W25-template.md).

---

## Snapshot #2 — 2026-W25 (2026-06-16 — 2026-06-22)

> **Шаблон готов** 2026-06-13 — заполнить после GTM posts. См. [`waitlist-snapshot-W25-template.md`](./waitlist-snapshot-W25-template.md).

| Metric | This week | Prev week (W24) | Δ | Target (14d) | Status |
|--------|-----------|-----------------|---|--------------|--------|
| Landing uniques | | 0 | | ≥150 (cumulative) | ⬜ pending posts |
| Waitlist signups | | 0 | | ≥18 (cumulative) | ⬜ pending posts |
| CR | | — | | ≥12% | ⬜ n/a |

---

## Snapshot automation (weekly #1+)

**Цель:** Growth/PM получает цифры **без ручного COUNT** — один скрипт или Neon SQL editor раз в понедельник.

### Предусловия

| Check | Команда / источник |
|-------|-------------------|
| Postgres live | `GET /api/health` → `waitlist_backend: postgres`, `database_configured: true` |
| Schema | [`lib/db/schema.ts`](../lib/db/schema.ts) → `waitlist_signups` |
| Env | `DATABASE_URL` (Neon) — **не** коммитить; Human уже активировал T-051 |

### Параметры недели (ISO)

```sql
-- Пример: W25 = 2026-06-16 (Mon) — 2026-06-22 (Sun) UTC
-- Подставить :week_start / :week_end при запуске

-- week_start: '2026-06-16 00:00:00+00'
-- week_end:   '2026-06-23 00:00:00+00'  (exclusive upper bound)
```

### Query pack — snapshot #N (copy-paste)

```sql
-- 1) Signups за неделю (total)
SELECT COUNT(*) AS signups
FROM waitlist_signups
WHERE created_at >= TIMESTAMPTZ '2026-06-16 00:00:00+00'
  AND created_at <  TIMESTAMPTZ '2026-06-23 00:00:00+00';

-- 2) Signups по source
SELECT COALESCE(source, 'waitlist') AS source, COUNT(*) AS cnt
FROM waitlist_signups
WHERE created_at >= TIMESTAMPTZ '2026-06-16 00:00:00+00'
  AND created_at <  TIMESTAMPTZ '2026-06-23 00:00:00+00'
GROUP BY source
ORDER BY cnt DESC;

-- 3) Cumulative 14d (G-Book-P2 gate)
SELECT COUNT(*) AS signups_14d
FROM waitlist_signups
WHERE created_at >= NOW() - INTERVAL '14 days';

-- 4) Cumulative 90d (kill trigger)
SELECT COUNT(*) AS signups_90d
FROM waitlist_signups
WHERE created_at >= NOW() - INTERVAL '90 days';

-- 5) First signup ever (ping Human trigger)
SELECT email, source, created_at
FROM waitlist_signups
ORDER BY created_at ASC
LIMIT 1;

-- 6) Duplicate signal proxy (same week re-POSTs — app returns already_registered)
-- Requires app logs or PostHog; PG has UNIQUE(email) — use API metrics if added later
```

### CR calculation (manual until T-075)

```
CR_week = signups_week / uniques_week × 100%
CR_14d_cumulative = signups_14d / uniques_14d × 100%   -- gate G-Book-P2
```

**Uniques:** Plausible `/waitlist` (T-075) **или** ручной лог UTM кликов из T-073. Без analytics — CR **n/a**, gate смотрит на signups + qualitative.

### Optional: one-liner via psql (Human local)

```bash
# Не запускать в CI — только Human с DATABASE_URL
psql "$DATABASE_URL" -c "
SELECT source, COUNT(*) FROM waitlist_signups
WHERE created_at >= date_trunc('week', NOW())
GROUP BY source;"
```

### Optional: npm script (BACKLOG — не impl в этом спринте)

PM предлагает Developer task post-GTM: `npm run waitlist:snapshot` → stdout JSON для вставки в weekly template. **Не блокирует** snapshot #1 manual.

### Ping Human triggers (waitlist)

| Event | Действие |
|-------|----------|
| First row in `waitlist_signups` | PM ping: «первый signup после постов» |
| CR ≥12% at 14d | PM ping: G-Book-P2 review |
| 90d signups &lt;50 AND CR &lt;5% | PM ping: G-Book-Stop discussion |

---

## Связь с gates

| Gate | Условие | Этот документ |
|------|---------|---------------|
| **G-Book-0** | T-074 spec + snapshot #1 | ✅ DONE |
| **G-Book-P2** | CR ≥12% (14d organic) **or** Human waive | Review cumulative rows W24–W25 (~2026-06-27) |
| **G-Book-Stop** | 90d signups &lt;50 **and** CR &lt;5% | Cumulative SQL + snapshot history |

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | PM + Growth | v1.1 — §Snapshot automation: SQL pack, psql one-liner, CR notes, ping triggers |
| 2026-06-13 | Growth + PM (agent) | v1.2 — W25 empty template + cross-link [`waitlist-snapshot-W25-template.md`](./waitlist-snapshot-W25-template.md) |

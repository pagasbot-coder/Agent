# Waitlist snapshot W25 — template (post-GTM)

**Week:** 2026-W25 · **Period:** 2026-06-16 (Mon) — 2026-06-22 (Sun)  
**Author:** Growth / PM  
**Staging:** https://quiet-partner.vercel.app/waitlist  
**Hypotheses:** H1 CR ≥12% · H2 uniques ≥150 (cumulative) · H3 signups ≥18 (cumulative)  
**Канон:** [`waitlist-metrics-spec-T-074.md`](./waitlist-metrics-spec-T-074.md)

> **Заполнить после** Human публикует T-073 drafts (LinkedIn #1 + community intro). До постов — оставить пустым или «0».

---

## Metrics

| Metric | This week (W25) | Prev week (W24) | Δ | Target (14d cumulative) | Status |
|--------|-----------------|-----------------|---|-------------------------|--------|
| Landing uniques | | 0 | | ≥150 | ⬜ |
| Waitlist signups | | 0 | | ≥18 | ⬜ |
| CR (signups/uniques) | | — | | ≥12% | ⬜ |
| Duplicates (API) | | 0 | | <10% | ⬜ |

---

## Signups by source

| source | Signups | % of total | Notes |
|--------|---------|------------|-------|
| `linkedin_waitlist_v0` | | | UTM from T-073 post #1 |
| `community_waitlist_v0` | | | Community intro |
| `waitlist` (default) | | | Direct / demo |
| `seo_organic` | | | |
| **Total** | | 100% | |

---

## Channel activity (qualitative)

| Channel | Posts / intros | Link used | Engagement notes |
|---------|----------------|-----------|------------------|
| LinkedIn | | `?utm_source=linkedin&utm_campaign=waitlist_v0` | |
| Community | | `?utm_source=community&utm_campaign=waitlist_v0` | |

---

## Infra check (optional)

```bash
curl -sS https://quiet-partner.vercel.app/api/health | jq '.checks.waitlist_backend, .checks.database_configured'
```

Expected: `postgres`, `true`.

---

## Decisions / next week (W26)

- [ ] Continue hook / pivot copy (CR <5%)
- [ ] Add second community (uniques <80)
- [ ] Escalate Human: G-Book-P2 waive vs wait (review ~2026-06-27)
- [ ] Blockers: DB / analytics / staging

---

## SQL pack (Neon — Human with DATABASE_URL)

```sql
-- W25 signups total
SELECT COUNT(*) AS signups
FROM waitlist_signups
WHERE created_at >= TIMESTAMPTZ '2026-06-16 00:00:00+00'
  AND created_at <  TIMESTAMPTZ '2026-06-23 00:00:00+00';

-- By source
SELECT COALESCE(source, 'waitlist') AS source, COUNT(*) AS cnt
FROM waitlist_signups
WHERE created_at >= TIMESTAMPTZ '2026-06-16 00:00:00+00'
  AND created_at <  TIMESTAMPTZ '2026-06-23 00:00:00+00'
GROUP BY source
ORDER BY cnt DESC;

-- 14d cumulative (G-Book-P2)
SELECT COUNT(*) AS signups_14d
FROM waitlist_signups
WHERE created_at >= NOW() - INTERVAL '14 days';
```

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | Growth + PM (agent) | Empty W25 template ready for post-GTM fill |

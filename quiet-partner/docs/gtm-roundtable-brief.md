# GTM roundtable brief — Тихий напарник

**Задача:** T-061 · **Роль:** Growth + SME (Block 2) · **Статус:** восстановлен PM 2026-06-13 (оригинал M0 roundtable 2026-06-07)  
**Gate:** post-M0 **GTM + validation** — execution → **T-073**  
**Контекст:** [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) · [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) · [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)

> **Примечание:** артефакты `cpo-report-m0.md` и `m0-roundtable-minutes.md` отсутствуют в репозитории; ключевые решения M0 зафиксированы в [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) и журнале [`orchestration-queue.md`](../orchestration-queue.md).

---

## TL;DR

**Human Go** 2026-06-08 («пошли дальше»); **billing paused** («пока не подключай»). Следующие 90 дней — **organic Acquisition** на waitlist, без paid ads и без checkout CTA. Два приоритетных канала: **LinkedIn (Human)** + **1–2 PM-чата/комьюнити**. Успех sprint 1: ≥18 waitlist signups при ≥150 uniques за 14 дней (CR ≥12%).

---

## Решения M0 roundtable (2026-06-07, async)

| Тема | Решение |
|------|---------|
| **Gate G2→3** | **Waived** — dogfood 4/5, 2 useful; Go не blocked |
| **Monetization (гипотеза)** | Freemium Pro ~**990 ₽/мес** (RU); YooKassa ADR-005 — scaffold DONE, **activation paused** |
| **Positioning** | «Второй пилот РП» — co-pilot, не exam prep / не Jira-клон |
| **PMF** | **Не доказан** — 0 внешних интервью, 0 paying; validation через waitlist + dogfood optional |
| **Kill criteria (90d)** | Waitlist &lt;50 **и** CR &lt;5% organic → **Pause** и pivot copy/ICP (см. landing H0) |

---

## Каналы (рекомендация Growth — approve Human #5)

| # | Канал | Owner | Effort | UTM | Зачем |
|---|-------|-------|--------|-----|-------|
| **1** | **LinkedIn** (посты Human, RU) | Human + Growth | 2 поста/нед × 2 нед | `utm_source=linkedin&utm_campaign=waitlist_v0` | ICP PM агентств; wedge «8 доменов + вопросы AI» |
| **2** | **PM-чаты / комьюнити** (Telegram, Slack, проф. группы) | Growth draft → Human post | 1–2 площадки | `utm_source=community&utm_campaign=waitlist_v0` | Триггер «не понимаю, что горит» |
| 3 | SEO `/waitlist` | Passive | DONE T-053 | organic | Долгий хвост; не sprint 1 primary |
| — | Paid ads | **Не сейчас** | — | — | Только после CR ≥12% organic + M0 traction |

**Anti-persona filter:** не таргетировать exam prep, enterprise PMO, «PMBOK certification tool».

---

## AARRR — 90-дневный фокус (post-M0)

| Этап | Фокус | Метрика | Target (8 нед) | Instrumentation |
|------|-------|---------|----------------|-----------------|
| **Acquisition** | `/waitlist` + UTM | Signups, uniques, CR | ≥50 waitlist; CR ≥12% | Postgres waitlist (T-051); T-074 weekly snapshot |
| **Activation** | Demo → onboarding | `onboarding_complete` | ≥70% invite → onboarding *(post-invite)* | PostHog OPTIONAL (T-075) |
| **Retention** | Weekly return | WAU week-2 | ≥40% *(dogfood baseline)* | Post-M0 |
| **Referral** | Backlog | — | — | Phase 5 |
| **Revenue** | **Paused** | Paying users | 0 до Human «можно подключать» | T-069…T-071 BACKLOG |

---

## Гипотезы sprint 1 (14 дней) — для T-073

| ID | Гипотеза | Метрика | Success | Fail → action |
|----|----------|---------|---------|---------------|
| **H1** | Hero «8 доменов + вопросы AI» конвертирует лучше generic PM-tool | visit → submit CR | **≥12%** | CR &lt;5% → смена hook (landing §CTA) |
| **H2** | LinkedIn + 1 community дают ≥150 uniques за 14d | uniques | **≥150** | &lt;80 → второй канал или частота постов |
| **H3** | Waitlist signups ≥18 при H1+H2 | signups | **≥18** | &lt;10 → PM review ICP/copy |

Источник copy-тестов: [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) §CTA, §AARRR.

---

## Messaging guardrails

| Делаем | Не делаем |
|--------|-----------|
| Co-pilot, «куда смотреть сегодня» | PMP / exam prep |
| DomainRadar + questions-first AI | Jira replacement |
| RU plain language | Enterprise PMO suite |
| Disclaimer PMI на каждом touchpoint | Official PMI claims |

---

## Handoff T-073 (Growth)

1. Выбрать **2 канала** (таблица выше) — или получить approve Human #5.
2. Подготовить **2 LinkedIn-поста** + **1 community intro** (RU, с UTM).
3. Завести **weekly metrics template** (совместно с T-074): uniques, signups, CR, source.
4. **Не** добавлять checkout / Pro pricing CTA в постах — billing paused.

---

## References

- [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) — hero, bullets, waitlist H1
- [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) — wedge vs Notion/Jira/exam
- [`knowledge-base/product-brief.md`](../knowledge-base/product-brief.md) — ICP, metrics
- [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) — Human Go, waiver, billing pause
- [`orchestration-queue.md`](../orchestration-queue.md) — T-073…T-078 post-M0 sprint

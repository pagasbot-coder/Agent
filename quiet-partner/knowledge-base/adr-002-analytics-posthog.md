# ADR-002: Аналитика (PostHog OSS)

**Статус:** Принято (MVP Phase 4)  
**Дата:** 2026-05-30 · **T-017**

## Контекст

Нужны метрики North Star без проприетарной аналитики: activation, retention, 👍 rate.

## Решение

**PostHog self-host** (или cloud EU) для MVP Phase 4; **Plausible** — только landing, не in-app events.

## События (без PII)

| Event | Когда |
|-------|--------|
| `onboarding_complete` | Финиш wizard |
| `commentary_refresh` | Клик «Обновить» |
| `feedback_positive` / `feedback_negative` | 👍/👎 |
| `action_logged` | «Отметить действие» |

**Запрещено:** email, имя проекта в payload — только `delivery_approach`, `domain_count_red`.

## Next.js 16

- Client: `posthog-js` только после consent banner (Phase 4)
- Server: optional capture в route handlers (без user id)

## Последствия

- DevOps: compose PostHog в Phase 4 — **DONE (T-031):** [`docs/posthog-self-host.md`](../docs/posthog-self-host.md), [`docker/posthog/docker-compose.yml`](../docker/posthog/docker-compose.yml)  
- Growth: дашборд activation в PostHog (после Human VPS + Vercel keys)  
- Отклонено: GA4 (privacy), full Segment (cost)

## Phase 5

Auth + per-user analytics budgets — [`docs/roadmap-phase5.md`](../docs/roadmap-phase5.md) (**BLOCKED** до M0).

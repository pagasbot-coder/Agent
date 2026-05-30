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

- DevOps: compose PostHog в Phase 4  
- Growth: дашборд activation в PostHog  
- Отклонено: GA4 (privacy), full Segment (cost)

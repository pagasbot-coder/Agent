# Архитектура — Тихий напарник

**Версия:** 0.2 (Phase 4 prep)  
**ADR:** [`adr-001-llm-bff.md`](./adr-001-llm-bff.md) · [`adr-002-analytics-posthog.md`](./adr-002-analytics-posthog.md) · [`adr-002-analytics-posthog.md`](./adr-002-analytics-posthog.md)

---

## Компоненты

```
[Browser]
  DomainRadar ──┐
  HealthCommentary ──┼── Zustand (client)
  Onboarding (Phase 3) ──┘
        │ POST JSON
        ▼
[Next.js Server]
  /api/advisor/health-commentary
        │ getSystemPrompt + domain context
        ▼
  DeepSeek API (optional)
```

---

## Threat model (кратко)

| Угроза | Митигация |
|--------|-----------|
| Утечка API key | BFF-only, ADR-001 |
| Prompt injection | System prompt + ограничение user payload size |
| PII в логах | Не логировать projectMeta.name в production logs (MVP: dev only) |
| Cost abuse | In-memory rate limit (20/15min/IP) by default; Upstash when `REDIS_URL`+`REDIS_TOKEN` (`redisRateLimit.ts` + `costGuardrails.ts`) |

---

## Persistence

| Фаза | Хранение |
|------|----------|
| 2 spike | Zustand + optional `localStorage` |
| 5+ | PostgreSQL (TBD ADR) |

---

## Analytics (Phase 4 — ADR-002)

```
[Browser — posthog-js]
  onboarding_complete, commentary_refresh,
  feedback_positive | feedback_negative, action_logged
        │ HTTPS (EU self-host)
        ▼
[PostHog OSS — EU VPS]
  funnels, dashboards, 90d retention
        ▲
[Next.js Server — optional posthog-node]
  commentary_request (status, source, latency — no PII)
```

| Фаза | Поведение |
|------|-----------|
| 3 dogfood | localStorage counters + dogfood log (T-014); PostHog **выключен** |
| 4 beta | PostHog self-host; env `NEXT_PUBLIC_POSTHOG_*`; consent banner на landing |

**Privacy:** no PII in events; `$process_person_profile: false`; EU hosting — см. ADR-002.

---

## Deploy

**Staging:** Vercel https://quiet-partner.vercel.app ([`docs/deploy-staging.md`](../docs/deploy-staging.md)). VPS prod — Phase 5+. PostHog self-host — [`docs/posthog-self-host.md`](../docs/posthog-self-host.md) (T-031; EU VPS OPTIONAL, Human credentials).

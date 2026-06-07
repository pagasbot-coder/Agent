# Redis / Upstash rate limit — T-036 scaffold

**Статус:** scaffold DONE (2026-06-07)  
**Activation:** Human MUST — no prod keys in repo

---

## TL;DR

| Режим | Условие | Поведение |
|-------|---------|-----------|
| **Default (Phase 4)** | `REDIS_URL` пуст | In-memory per IP на serverless instance (`costGuardrails.ts`) |
| **Phase 5** | `REDIS_URL` + `REDIS_TOKEN` в Vercel | Sliding window через Upstash; ключ `ip:` или `user:` |

ADR-001 лимиты сохраняются: `ADVISOR_RATE_LIMIT_MAX` (20), `ADVISOR_RATE_LIMIT_WINDOW_MS` (900000).

---

## Env contract

| Переменная | Default | Примечание |
|------------|---------|------------|
| `REDIS_URL` | *(empty)* | Upstash REST URL — **не** `redis://` для serverless |
| `REDIS_TOKEN` | *(empty)* | Upstash REST token; оба поля нужны для включения |
| `ADVISOR_RATE_LIMIT_MAX` | `20` | Shared with in-memory path |
| `ADVISOR_RATE_LIMIT_WINDOW_MS` | `900000` | 15 min sliding window |

**Запрещено:** коммитить prod keys; только `.env.local` / Vercel dashboard.

---

## Код

| Файл | Роль |
|------|------|
| `lib/advisor/redisRateLimit.ts` | Upstash `Ratelimit`; lazy client; `isRedisRateLimitEnabled()` |
| `lib/advisor/costGuardrails.ts` | `checkRateLimitAsync()` — Redis first, in-memory fallback |
| `app/api/advisor/health-commentary/route.ts` | BFF entry; 429 + `Retry-After` |

### Per-user (после AUTH)

When `AUTH_ENABLED=true` and session exists, pass `userId` to `checkRateLimitAsync(ip, userId)` — Redis key becomes `user:{id}` instead of `ip:{addr}`.

---

## Upstash setup (Human)

1. [console.upstash.com](https://console.upstash.com) → Create Redis database (Regional, EU if GDPR)
2. Copy **REST URL** → Vercel `REDIS_URL`
3. Copy **REST Token** → Vercel `REDIS_TOKEN`
4. Redeploy production
5. Smoke: `GET /api/health` → `checks.cost_guardrails.redis_rate_limit_enabled: true`

Local docker Redis (`docker/posthog/docker-compose.yml`) uses `redis://` — **не** совместим с `@upstash/redis` REST client; для local dev оставьте `REDIS_URL` пустым.

---

## Health snapshot

`GET /api/health` → `checks.cost_guardrails`:

```json
{
  "rate_limit_max": 20,
  "rate_limit_window_ms": 900000,
  "redis_rate_limit_enabled": false,
  "redis_url_configured": false,
  "redis_token_configured": false,
  "rate_limit_backend": "memory"
}
```

---

## Связи

- [`adr-001-llm-bff.md`](../knowledge-base/adr-001-llm-bff.md) — MVP 20/15min/IP
- [`adr-003-auth-phase5.md`](../knowledge-base/adr-003-auth-phase5.md) — per-user budget
- [`deploy-staging.md`](./deploy-staging.md) — Vercel env table
- [`roadmap-phase5.md`](./roadmap-phase5.md) — P5-ADR-4

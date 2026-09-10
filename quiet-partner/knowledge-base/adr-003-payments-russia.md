# ADR-005 (P5-ADR-5): Платежи Россия (Phase 5)

> Файл: `adr-003-payments-russia.md` · нумерация ADR-005 (ADR-003 занят auth).

**Статус:** **Accepted** — 2026-06-08 (Developer + Architect; Human Go «пошли дальше»)  
**Дата:** 2026-06-08  
**Контекст:** Solo SaaS на Vercel; ICP — PM в РФ; monetization option A (freemium Pro) из [`cpo-report-m0.md`](../docs/cpo-report-m0.md) §6

> **Решение:** **YooKassa** — primary acquirer для RU-карт. Billing scaffold **BILLING_ENABLED=false** по умолчанию. Merchant account — Human MUST.

---

## Проблема

| Сейчас | Нужно (Phase 5) |
|--------|-----------------|
| Waitlist demo, 0 revenue | Freemium + Pro tier (~990–1490 ₽/мес) |
| AUTH OFF | `userId` для subscription binding |
| Stripe в CPO как US-якорь | **RU merchant** — карты МИР/Visa/MC РФ, 54-ФЗ по необходимости |

---

## Сравнение провайдеров (solo SaaS, Vercel BFF)

| Критерий | **YooKassa** | CloudPayments | Robokassa | Tinkoff Acquiring |
|----------|--------------|---------------|-----------|-------------------|
| RU карты (МИР, локальные MC/Visa) | ✅ | ✅ | ✅ | ✅ |
| ИП / самозанятый / ООО | ✅ ИП/ООО; СМЗ — уточнять | ✅ | ✅ | ✅ (часто ИП/ООО) |
| Подписки / recurring | ✅ автоплатежи, сохранение метода | ✅ рекуррент | ⚠️ через договор / костыли | ✅ рекуррент API |
| Webhook + idempotency | ✅ IP allowlist + подпись | ✅ HMAC | ✅ Signature | ✅ Token + notification URL |
| 54-ФЗ онлайн-касса | ✅ опционально (своя или YooKassa) | ✅ CloudKassir | ✅ партнёры | ✅ через банк |
| Документация / DX для Node | ✅ REST, примеры | ✅ хорошая | ⚠️ legacy API | ⚠️ банковский onboarding |
| Комиссия (ориентир) | ~2,8–3,5% | ~2,7–3,5% | ~3–5% | договорная |
| Vercel serverless | ✅ webhook route | ✅ | ✅ | ✅ |
| Test / sandbox | ✅ | ✅ | ✅ | ✅ (тест-терминал) |

### Рекомендация: **YooKassa (primary)**

**Почему YooKassa:**

1. **Solo-friendly onboarding** — ИП/ООО без enterprise sales; понятный личный кабинет.
2. **Recurring** — автоплатежи и сохранение способа оплаты для Pro monthly (CPO option A).
3. **Webhook security** — проверка IP YooKassa + HTTP Basic (shopId:secretKey) на notification; idempotent update по `payment.id`.
4. **54-ФЗ** — чеки можно подключить позже (не блокер MVP billing); для digital SaaS часто достаточно на этапе первых paying users.
5. **Node/Vercel** — простой REST из Route Handler без тяжёлого SDK.

**Fallback (если YooKassa откажет по MCC/категории):** **CloudPayments** — сопоставимый DX, сильные рекурренты, HMAC webhook.

**Отклонено как primary:**

| Провайдер | Причина |
|-----------|---------|
| **Robokassa** | Старее UX/API; recurring менее прозрачен для subscription SaaS |
| **Tinkoff Acquiring** | Дольше onboarding; банковский контур избыточен для solo на старте |
| **Stripe (primary)** | См. ниже |

---

## Почему не Stripe как primary для RU merchant

| Фактор | Деталь |
|--------|--------|
| **Sanctions / geography** | Stripe не обслуживает регистрацию merchant из РФ; RU legal entity не onboarding |
| **RU cards** | Карты, выпущенные в РФ, часто не проходят через Stripe EU/US |
| **Валюта / UX** | RUB settlement и привычный флоу оплаты для ICP — у локальных эквайеров |
| **54-ФЗ** | Локальные провайдеры интегрируют кассу в привычном контуре |
| **Роль Stripe** | Опционально **позже** для non-RU segment (EU PM) — отдельный ADR, не Phase 5 RU path |

---

## Архитектура (BFF webhook pattern)

```
Browser → POST /api/billing/create-payment (session required when AUTH on)
       → lib/billing/yookassa.ts → YooKassa API (redirect confirmation_url)
       → User pays on YooKassa hosted page
       → POST /api/billing/webhook ← YooKassa (server-to-server)
       → Verify IP/signature → upsert payments + subscriptions (Drizzle)
       → Unlock Pro tier (feature flags / token budget)
```

**Принципы:**

- Секреты **только** server env (`YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY`) — never `NEXT_PUBLIC_*`
- Webhook route **без** session cookie — только provider auth
- Idempotency: `provider + provider_payment_id` unique в `payments`
- Default **OFF**: `BILLING_ENABLED=false` → routes return `503 billing_disabled`

---

## Env contract

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `BILLING_ENABLED` | да | `false` default — staging unchanged |
| `BILLING_PROVIDER` | нет | `yookassa` (default) \| `cloudpayments` (future) |
| `YOOKASSA_SHOP_ID` | при enable | Shop ID из ЛК |
| `YOOKASSA_SECRET_KEY` | при enable | Secret key (live/test) |
| `YOOKASSA_WEBHOOK_SECRET` | опц. | Доп. проверка (если включена в ЛК) |
| `BILLING_PRO_PRICE_RUB` | нет | Default `990` — Pro monthly (гипотеза CPO) |
| `BILLING_RETURN_URL` | нет | Return после оплаты; default `AUTH_URL` + `/billing/success` |

См. [`.env.example`](../.env.example) и [`docs/billing-russia-runbook.md`](../docs/billing-russia-runbook.md).

---

## Freemium + Pro integration points

| Tier | Продукт | Billing hook |
|------|---------|--------------|
| **Free** | DomainRadar + capped AI (3–5 commentary/wk) | `subscriptions.tier=free`; cost guardrails per user (Phase 5 + AUTH) |
| **Pro** | Higher AI cap, export, history | `subscriptions.status=active` + `current_period_end` > now |
| **Checkout** | CTA «Перейти на Pro» (post-auth) | `POST /api/billing/create-payment` |
| **Webhook** | `payment.succeeded` | Upsert `payments`; set `subscriptions` active |
| **Downgrade** | `payment.canceled` / period end | Cron or webhook → `past_due` / `free` |

Связь: [`adr-003-auth-phase5.md`](./adr-003-auth-phase5.md) (`userId`), ADR-004 Neon (`subscriptions`, `payments` tables), T-029 cost guardrails.

---

## Альтернативы (отложены)

| Вариант | Вердикт |
|---------|---------|
| CloudPayments primary | Fallback #1 — переключение `BILLING_PROVIDER` |
| Crypto / foreign entity Stripe | Out of scope RU ICP |
| Manual invoice (счёт на ИП) | Только B2B agency tier later |

---

## Human MUST (до prod billing)

1. Зарегистрировать merchant (ИП/ООО) в YooKassa — см. runbook.
2. Test mode: ключи в Vercel Preview + smoke webhook (ngrok или Vercel URL).
3. Prod: live keys + чеки 54-ФЗ при первых paying users (юрист/бухгалтер).
4. `AUTH_ENABLED=true` перед привязкой подписки к user.

---

## Трассировка

- [`docs/roadmap-phase5.md`](../docs/roadmap-phase5.md) — P5-ADR-5
- [`lib/billing/`](../lib/billing/) — provider interface + YooKassa stub
- [`lib/db/schema.ts`](../lib/db/schema.ts) — `subscriptions`, `payments`
- T-064…T-068 в [`orchestration-queue.md`](../orchestration-queue.md)

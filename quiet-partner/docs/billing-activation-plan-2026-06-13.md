# План активации биллинга YooKassa

**Дата:** 2026-06-13  
**Владелец:** PM + IT-Architect  
**Триггер:** Human (Pavel) — «попробовать подключить оплату» + изучить unit cost  
**Статус:** **PLAN ONLY** — код не включаем до явного **«можно подключать»** после прочтения этого плана  
**Связи:** ADR-005 (канон: [`adr-003-payments-russia.md`](../knowledge-base/adr-003-payments-russia.md)) · T-064…T-071 · [`human-requirements-tz.md`](./human-requirements-tz.md) §D.5 · [`auth-activation-runbook.md`](./auth-activation-runbook.md)

> **Примечание репозитория (13.06.2026):** в очереди T-064…T-068 помечены DONE, но файлы `lib/billing/`, `app/api/billing/`, `billing-russia-runbook.md`, `adr-003-payments-russia.md` **отсутствуют в рабочей копии** (как `financial-model-m0.md`). План опирается на env-контракт из `human-requirements-tz` и журнал очереди; перед T-069 Developer должен **верифицировать или восстановить** scaffold.

---

## TL;DR

| Фаза | Кто | Результат |
|------|-----|-----------|
| **0. Решение Human** | Pavel | Merchant YooKassa + «можно подключать» |
| **1. T-069** | Developer | Webhook + persist + IP verify |
| **2. T-070** | Developer | AUTH on + checkout UI |
| **3. T-071** | Developer | Recurring Pro (post-MVP) |

**Gate:** `BILLING_ENABLED=true` **только** после фаз 0–1 и smoke QA.

---

## 1. Что Human MUST сделать (merchant)

### 1.1 Регистрация YooKassa

| Шаг | Действие | Где |
|-----|----------|-----|
| 1 | Зарегистрировать **магазин** (ИП/ООО или самозанятость — по вашей юр. форме) | [yookassa.ru](https://yookassa.ru) |
| 2 | Пройти **модерацию** и подключить приём платежей (карты, СБП — по тарифу) |
| 3 | Создать **тестовый** и **боевой** shop; начать с **test** | ЛК YooKassa |
| 4 | Скопировать **`shopId`** и **секретный ключ** | Настройки → API keys |
| 5 | Настроить **webhook URL** (после T-069 deploy): `https://quiet-partner.vercel.app/api/billing/webhook` | ЛК → HTTP-уведомления |
| 6 | Зафиксировать **IP-адреса** YooKassa для verify (T-069) | Документация YooKassa |
| 7 | Добавить env в **Vercel Production** (не в git, не в чат Cursor) | См. §3 |

### 1.2 Связанные решения Human

| Решение | Варианты | Рекомендация PM |
|---------|----------|-----------------|
| **Когда включать prod billing** | Сейчас / после waitlist KPI / после dogfood | **После** подписания плана + test smoke; prod — когда готовы принимать деньги |
| **AUTH до checkout** | Обязателен для привязки подписки к user | **Да** — T-070 требует T-035 + `AUTH_ENABLED=true` |
| **Цена Pro** | 990 ₽/мес (гипотеза T-068) | Оставить гипотезу; API cost не блокер (см. [`user-unit-economics-active-user.md`](./user-unit-economics-active-user.md)) |
| **DeepSeek top-up** | Отдельно от YooKassa | T-086 **DEFERRED** — billing не зависит от live LLM |

### 1.3 Шаблон сообщения Human (когда готовы)

```text
Billing: можно подключать. Merchant YooKassa создан (test/prod). Redeploy после env.
Scope: test-only / prod-ready: ___
```

После этого PM переводит **T-069 → READY**.

---

## 2. Задачи Developer — порядок выполнения

### T-069 — Webhook persist + IP verify (P0)

**Зависимости:** T-065 scaffold, `DATABASE_URL` + `db:push`, Human merchant test keys  
**Статус очереди:** BACKLOG → **READY только после approve плана Human**

| # | AC | Проверка |
|---|-----|----------|
| 1 | `POST /api/billing/webhook` принимает события YooKassa | test notification из ЛК |
| 2 | **IP verify** входящих запросов | reject с неверного IP |
| 3 | **Persist** payment/subscription state в Postgres | Drizzle schema billing tables |
| 4 | Идемпотентность (повтор webhook не дублирует) | QA replay |
| 5 | `BILLING_ENABLED=false` → route 503/disabled | regression |
| 6 | Логи без PII и без секретов | ADR-001 pattern |

**Файлы (ожидаемые):** `app/api/billing/webhook/route.ts`, `lib/billing/*`, миграция schema.

### T-070 — AUTH activation + checkout UI (P1)

**Зависимости:** T-035 (auth scaffold), **T-069 DONE**, Human `AUTH_ENABLED=true`

| # | AC | Проверка |
|---|-----|----------|
| 1 | `/login` — magic link или OAuth per ADR-003 | smoke |
| 2 | CTA «Pro» / checkout на dashboard или `/waitlist` | UI без обещания PMI cert |
| 3 | `POST /api/billing/checkout` создаёт платёж YooKassa | test payment |
| 4 | Redirect return URL обрабатывается | success/cancel |
| 5 | Disclaimer: co-pilot, не cert tool | на checkout |
| 6 | Regression: commentary fallback, onboarding, waitlist | QA subset |

Runbook: [`auth-activation-runbook.md`](./auth-activation-runbook.md).

### T-071 — Recurring Pro subscription (P2, post-MVP)

**Зависимости:** T-070, ADR-005 автоплатежи

| # | AC |
|---|-----|
| 1 | Сохранение payment method / rebill по API YooKassa |
| 2 | Grace period при failed charge |
| 3 | Entitlement flag `pro` на user (feature gate — отдельная groom) |

**Не в scope первой активации** — можно запустить **разовый месячный платёж** в T-070, recurring — итерация 2.

---

## 3. Checklist `BILLING_ENABLED=true`

Выполнять **сверху вниз**; не пропускать шаги.

### Human / DevOps

- [ ] Merchant YooKassa **test** создан; ключи в Vercel (**не в git**)
- [ ] Human написал **«можно подключать»** в чат / queue journal
- [ ] `DATABASE_URL` live (T-051 ✅)
- [ ] Vercel env добавлены:

```env
BILLING_ENABLED=true
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
YOOKASSA_WEBHOOK_SECRET=
```

- [ ] Webhook URL зарегистрирован в ЛК YooKassa
- [ ] `AUTH_ENABLED=true` + `AUTH_SECRET` (для T-070 checkout)
- [ ] Redeploy Production

### Developer

- [ ] T-069 webhook + schema **DONE**
- [ ] `npm run db:push` — billing tables
- [ ] Test payment **1 ₽** (или test card YooKassa) — success path
- [ ] Test webhook replay — idempotent

### QA

- [ ] `GET /api/health` — billing flag (если exposed)
- [ ] `BILLING_ENABLED=false` на Preview — checkout disabled
- [ ] Нет `NEXT_PUBLIC_YOOKASSA_*`
- [ ] Disclaimer на pay flow

### PM

- [ ] T-069…T-071 статусы обновлены
- [ ] `pm-status` — billing ACTIVE note
- [ ] GTM copy: **не** обещать Pro в постах до Human approve pricing CTA

---

## 4. Риски и митигация

| Риск | Вероятность | Митигация |
|------|-------------|-----------|
| Scaffold billing **отсутствует** в repo | Средняя | T-069 начать с audit; восстановить из git history / re-scaffold по ADR-005 |
| Включить prod без test smoke | Средняя | Gate: test shop + 1 ₽ платёж |
| Checkout без AUTH — orphan payments | Высокая | T-070 после AUTH on |
| Webhook spoofing | Низкая | IP verify + secret (T-069) |
| Юр. / оферта не готова | Средняя | Human: оферта + политика возврата до prod |
| GTM с ценой до готовности pay | Низкая | Human **отложил LinkedIn post** 13.06 — сохранять |
| Live LLM $0 — Pro продаёт «пустой» AI | Средняя | Disclosure: offline co-pilot или unblock T-086 до marketing Pro |

---

## 5. Дисклеймеры (обязательны в продукте)

- Тихий напарник — **co-pilot для мышления**, не инструмент сертификации PMI/PMBOK.
- AI-комментарий может работать в **офлайн-режиме** при нулевом балансе DeepSeek или исчерпании лимитов.
- Цена **990 ₽/мес** — **гипотеза**; финальная цена — решение Human после validation.
- Возвраты и подписка — по оферте (юрист / Human).

---

## 6. Что НЕ делаем в этом плане

- ❌ Не ставим `BILLING_ENABLED=true` на prod без «можно подключать»
- ❌ Не коммитим ключи YooKassa
- ❌ Не публикуем GTM с checkout (Human: post deferred 13.06)
- ❌ Не включаем recurring (T-071) в первой итерации без отдельного sign-off

---

## 7. Следующий шаг для Pavel

1. Прочитать этот план + [`user-unit-economics-active-user.md`](./user-unit-economics-active-user.md).
2. Решить: **test merchant сейчас** или отложить.
3. Ответить одной строкой (§1.3) → PM ставит **T-069 READY**.

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | PM | Первый план; Human billing exploration; T-069 остаётся BACKLOG до approve |

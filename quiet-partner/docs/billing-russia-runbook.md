# Billing Russia — runbook (YooKassa)

**Версия:** 1.0 · **Дата:** 2026-06-08  
**ADR:** [`knowledge-base/adr-003-payments-russia.md`](../knowledge-base/adr-003-payments-russia.md)

Одностраничная инструкция для Human (Pavel): merchant, env, test mode. **Не требует** настройки прямо сейчас — код на staging с `BILLING_ENABLED=false`.

---

## TL;DR

1. Зарегистрировать **ИП или ООО** в [YooKassa](https://yookassa.ru/) (тестовый магазин — сразу после регистрации).
2. Скопировать **Shop ID** и **Secret Key** (тест) в Vercel → Environment Variables.
3. Webhook URL: `https://quiet-partner.vercel.app/api/billing/webhook`
4. Локально: `.env.local` + `BILLING_ENABLED=true` только для smoke.
5. `npm run db:push` — таблицы `subscriptions`, `payments` (после `DATABASE_URL`).

---

## 1. Регистрация merchant

| Шаг | Действие |
|-----|----------|
| 1 | Личный кабинет YooKassa → подключить магазин (SaaS / услуги / digital) |
| 2 | Указать юрлицо (ИП/ООО), расчётный счёт |
| 3 | Включить **тестовый режим** — отдельные test keys |
| 4 | (Позже) Онлайн-касса 54-ФЗ — при первых live-платежах |

**Альтернатива:** [CloudPayments](https://cloudpayments.ru/) — если YooKassa отклонит категорию; сменить `BILLING_PROVIDER=cloudpayments` (адаптер — follow-up task).

---

## 2. Переменные окружения

Скопировать из [`.env.example`](../.env.example):

```env
BILLING_ENABLED=true
BILLING_PROVIDER=yookassa
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_xxxxxxxx
BILLING_PRO_PRICE_RUB=990
BILLING_RETURN_URL=https://quiet-partner.vercel.app/billing/success
```

| Переменная | Где взять |
|------------|-----------|
| `YOOKASSA_SHOP_ID` | ЛК → Настройки → shopId |
| `YOOKASSA_SECRET_KEY` | ЛК → Интеграция → Секретный ключ |
| `BILLING_PRO_PRICE_RUB` | Цена Pro в рублях (целое число) |

**Vercel:** Project → Settings → Environment Variables. **Preview** — test keys; **Production** — live keys только после юр. готовности.

---

## 3. Webhook в YooKassa

| Поле | Значение |
|------|----------|
| URL | `https://<your-domain>/api/billing/webhook` |
| События | `payment.succeeded`, `payment.canceled` (минимум) |
| Метод | POST, JSON |

Проверки в коде (prod hardening — T-069):

- IP из allowlist YooKassa
- Idempotency по `payment.id`

Smoke без оплаты:

```bash
curl -s https://quiet-partner.vercel.app/api/billing/webhook
# → billing_enabled: false (пока OFF)
```

---

## 4. Test mode smoke

1. `BILLING_ENABLED=true` + test keys в Preview deploy.
2. `curl -s https://<preview>/api/billing/create-payment` → `billing_disabled` или `billing_not_configured` до ключей.
3. POST create-payment (после AUTH — с `userId`):

```bash
curl -X POST https://<preview>/api/billing/create-payment \
  -H "Content-Type: application/json" \
  -d '{"tier":"pro"}'
```

4. Открыть `confirmation_url` → тестовая карта YooKassa.
5. Проверить webhook в логах Vercel.

Тестовые карты: [документация YooKassa](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing).

---

## 5. Rollback

| Действие | Эффект |
|----------|--------|
| `BILLING_ENABLED=false` | Checkout 503; staging как сейчас |
| Удалить `YOOKASSA_*` из Vercel | `billing_not_configured` |
| Отключить webhook в ЛК | Платежи без активации Pro в БД |

---

## 6. Связанные задачи

| ID | Задача |
|----|--------|
| T-064 | ADR payments RU — **DONE** |
| T-065 | Billing scaffold + schema — **DONE** |
| T-069 | Webhook → Drizzle persist + IP verify — **READY** |
| T-070 | AUTH activation + checkout UI — **BACKLOG** |
| T-071 | Recurring / автоплатёж Pro — **BACKLOG** |

См. [`orchestration-queue.md`](../orchestration-queue.md).

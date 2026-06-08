# ТЗ для Human (Pavel) — Quiet Partner

**Версия:** 1.0  
**Дата:** 2026-06-07  
**Владелец:** PM (Senior PM / muster-pm)  
**Аудитория:** Human Architect — только действия, которые **не может** выполнить агент  
**Связанные документы:** [`pm-governance.md`](./pm-governance.md) · [`pm-status.md`](./pm-status.md) · [`team-assignments.md`](./team-assignments.md) · [`orchestration-queue.md`](../orchestration-queue.md)

> Это единый канон «что нужно от Human». Агенты читают этот файл после вашего «готово» и продолжают без повторных вопросов в чате.

---

## 1. TL;DR — MUST vs OPTIONAL vs never

| Категория | Что входит | Блокирует агентов? |
|-----------|------------|-------------------|
| **MUST (env)** | `DATABASE_URL` в Vercel (+ опц. локально) → redeploy → smoke `/api/health` | **T-051 activation** (waitlist в Postgres) |
| **MUST (gate)** | M0 **Go / Pause / Pivot** — подпись в memo | Phase 5 impl, T-053 SEO impl, G4→5 |
| **MUST (gate, одно из двух)** | Dogfood **#5** с 👍 **или** письменный **waiver G2→3** | Закрытие **G2→3** и **M0 Go** (рекомендация PM: Go заблокирован без этого) |
| **OPTIONAL** | Сессия dogfood **#5** — если выбран **waiver** | Нет |
| **OPTIONAL** | `DEEPSEEK_API_KEY` в Vercel (уже может быть) | Live LLM на staging; без ключа — fallback RU |
| **OPTIONAL** | `AUTH_ENABLED`, `AUTH_SECRET`, Redis (Upstash), PostHog VPS | Phase 5 activation beyond waitlist DB |
| **OPTIONAL (when ready)** | YooKassa merchant + `BILLING_ENABLED=true` + webhook keys | Live billing RU — **не сейчас**; Human «пока не подключать» (2026-06-08) |
| **OPTIONAL** | Neon vs Supabase — финальный выбор хоста БД | Только если отклоняетесь от ADR-004 lean (Neon) |
| **NEVER** | Код, git, PR, интервью, productmap.io login, paste секретов в чат | — |

**Порядок приоритета PM (рекомендуемый):**

1. **Блок A** — `DATABASE_URL` (разблокирует T-051, ~15–20 мин)  
2. **Блок B + C** — dogfood/waiver + M0 sign-off (можно параллельно с A)  
3. **Блок D** — Phase 5 activation (после M0 Go и A)  
4. **Блок E** — гигиена секретов (всегда)

---

## 2. Блок A: DATABASE_URL — пошагово

**Задача:** T-051 code **DONE**; activation **BLOCKED (env)**. Без вашего шага waitlist остаётся в режиме `noop`.

**Краткая шпаргалка:** [`Human-one-step-database.md`](./Human-one-step-database.md)  
**Детали схемы:** [`drizzle/README.md`](../drizzle/README.md) · ADR [`adr-004-db-host-phase5.md`](../knowledge-base/adr-004-db-host-phase5.md)

### A.1 Neon — создать проект и connection string

| Шаг | Действие Human | Проверка |
|-----|----------------|----------|
| A.1.1 | Открыть [console.neon.tech](https://console.neon.tech) → **New Project** (рекомендация ADR-004: EU region, имя напр. `quiet-partner-staging`) | Проект создан |
| A.1.2 | Dashboard → **Connection details** → режим **Pooled connection** | Строка содержит `-pooler` и `?sslmode=require` |
| A.1.3 | Скопировать строку вида `postgresql://user:pass@ep-xxx-pooler.neon.tech/quiet_partner?sslmode=require` | **Не** вставлять в чат Cursor / git |

> **Важно:** используйте **pooled** URL (serverless/Vercel). Direct connection — только для локальной отладки.

### A.2 Vercel — добавить переменные

| Шаг | Действие Human | Проверка |
|-----|----------------|----------|
| A.2.1 | [vercel.com](https://vercel.com) → проект **`quiet-partner`** → **Settings** → **Environment Variables** | Проект = team `erp-db-spb-s-projects` |
| A.2.2 | Добавить `DATABASE_URL` = pooled Neon string | Environments: **Production** ✓ и **Preview** ✓ |
| A.2.3 | **Пока НЕ** менять `WAITLIST_BACKEND` (остаётся `noop` или пусто) | Сначала schema push (A.3) |

### A.3 Локально (опционально, но рекомендуется) — `db:push`

Выполняется **один раз** с машины Human. Секрет только в shell, не в файлах репо.

```powershell
Set-Location D:\curorproject\quiet-partner
$env:DATABASE_URL = "<ваша pooled neon url>"   # только в терминале
npm run db:push
```

| Результат | Что делать |
|-----------|------------|
| **SUCCESS** | Таблицы созданы (Auth.js + `waitlist_signups` + app schema) → A.4 |
| **FAIL auth / timeout** | Проверить pooled URL, `sslmode=require`, firewall; не эскалировать секрет в чат — скрин ошибки без URL |

Опционально: та же строка в `quiet-partner/.env.local` (файл в `.gitignore`) для локальной разработки — **не коммитить**.

### A.4 Vercel — включить Postgres waitlist + redeploy

| Шаг | Действие Human | Проверка |
|-----|----------------|----------|
| A.4.1 | Vercel Env: `WAITLIST_BACKEND` = `postgres` (Production + Preview) | После успешного A.3 |
| A.4.2 | **Deployments** → последний deploy → **Redeploy** (или CLI: `vercel --prod --yes` из каталога `quiet-partner/`) | Build green |

### A.5 Verify health — smoke (Human или попросить QA)

```text
GET https://quiet-partner.vercel.app/api/health
```

Ожидаемый фрагмент JSON:

```json
{
  "ok": true,
  "checks": {
    "database_configured": true,
    "waitlist_backend": "postgres"
  }
}
```

Дополнительно (ручной smoke):

1. Открыть https://quiet-partner.vercel.app/waitlist  
2. Отправить тестовый email → ответ API / UI без ошибки  
3. `POST /api/waitlist` → в health или response: `backend: "postgres"`

### A.6 Что написать агентам после «готово»

**Шаблон (скопировать в чат, без секретов):**

```text
DATABASE_URL: настроен в Vercel (Production + Preview).
db:push: выполнен / не выполнял (агент может попросить QA smoke).
WAITLIST_BACKEND=postgres, redeploy сделан.
/api/health: database_configured=true, waitlist_backend=postgres.
```

### A.7 Что делают агенты после вашего «готово»

| Роль | Действие |
|------|----------|
| **Developer** | Закрывает T-051 activation; обновляет queue + deploy-staging |
| **QA** | Smoke waitlist postgres в `qa-report-phase3.md` / `qa-phase5-prep.md` |
| **PM** | Снимает BLOCKED в `pm-status.md`; разблокирует T-052 (BACKLOG, нужен ещё AUTH) |
| **DevOps** | Фиксирует дату deploy в `deploy-staging.md` |

**Без DATABASE_URL агенты продолжают:** T-053 SEO spec, docs, static tasks — приложение на staging **работает** (noop waitlist, AUTH off).

---

## 3. Блок B: Dogfood — статус, waiver, optional #5

### Текущий статус (2026-06-07)

| Метрика | Значение |
|---------|----------|
| Сессий проведено | **4 / 5** (2026-05-31) |
| Useful (👍 + одно действие) | **2** |
| Порог G2→3 | **≥3 useful** |
| Gate G2→3 | **🔶 BLOCKED** |
| M0 Go (PM memo) | **Заблокирован** до +1 useful **или** waiver |

Источники: [`dogfood-log-template.md`](./dogfood-log-template.md) · journal `orchestration-queue.md` · [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)

### Два пути закрытия G2→3 (выберите один)

#### Путь 1 — Waiver G2→3 (сессия #5 **не обязательна**)

Осознанное решение Human закрыть gate **без** третьего useful. По [`pm-governance.md`](./pm-governance.md) §Human MUST #5.

**Шаблон для чата / journal:**

```text
Decision: Waiver G2→3 — dogfood 4/5, 2 useful; порог ≥3 не достигнут.
PM recommendation: принимаю риск R8 (dogfood bias) для продолжения M0 Go.
Human: Pavel, дата YYYY-MM-DD.
```

PM заносит строку в **Журнал** `orchestration-queue.md`. После этого **сессия #5 OPTIONAL** — можно не проводить.

#### Путь 2 — Dogfood сессия #5 (+1 useful)

| Шаг | Действие | Время |
|-----|----------|-------|
| B.2.1 | Реальный проект (вы РП); staging https://quiet-partner.vercel.app | — |
| B.2.2 | Протокол: onboarding → radar → commentary → 👍 → **одно действие на сегодня** | 35–45 мин |
| B.2.3 | Гайды: [`dogfood-session-guides.md`](./dogfood-session-guides.md) (сессии #1–#3 — тот же flow) | — |
| B.2.4 | Заполнить строку #5 в [`dogfood-log-template.md`](./dogfood-log-template.md): **Полезно? = Y** | — |
| B.2.5 | Сообщить PM: «Dogfood #5 done, useful Y» | — |

**Критерий useful:** 👍 на commentary **и** записанное конкретное действие (North Star).

### Статус waiver

| | |
|---|---|
| Waiver в journal | ⬜ **Ещё не зафиксирован** — нужна ваша явная фраза (Путь 1) |
| Сессия #5 | **OPTIONAL**, если выбран waiver; **обязательна** для Go без waiver |

---

## 4. Блок C: M0 sign-off — Go / Pause / Pivot

**Дедлайн плана:** **13.06.2026** (неделя 2 Phase 0)  
**Документ:** [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)  
**Evidence (уже заполнено PM/QA):** build/lint PASS, staging PASS, competitive scan T-054, Phase 3–4 impl DONE.

### Где подписать

Открыть [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) → секция **`[Human: sign-off]`** (footer):

```markdown
- [ ] **Go** — продолжаем Phase 3–4
- [ ] **Pause** — архив, lessons learned
- [ ] **Pivot** — новый wedge: _______________

**Подпись:** _______________ **Дата:** _______________
```

### Критерии решений

| Решение | Когда выбирать | Что разблокирует |
|---------|----------------|------------------|
| **Go** | ≥3 useful **или** waiver G2→3; evidence прочитан | T-053 impl, Phase 5 activation (Блок D), G4→5 prep |
| **Pause** | Недостаточно signal; нужна пауза discovery | Агенты STOP post-M0 impl; archive memo |
| **Pivot** | ICP не резонирует; продукт = «игрушка радара» | PM пересмотр brief; новый wedge в memo |

**PM recommendation (черновик memo):** **Go заблокирован** при 2/4 useful — сначала Блок B (waiver или #5), затем Go.

### Что написать после sign-off

```text
M0: Go / Pause / Pivot — [выбор]. Memo footer обновлён, дата YYYY-MM-DD.
Competitive scan: прочитан (да/нет).
Staging demo: видел quiet-partner.vercel.app (да/нет).
```

PM обновляет journal + `pm-status.md` + `team-assignments.md`.

---

## 5. Блок D: Phase 5 activation — после DATABASE_URL и M0 Go

**Roadmap:** [`roadmap-phase5.md`](./roadmap-phase5.md)  
**Scaffold:** T-033…T-036, T-051 **code DONE** — всё **OFF by default** до ваших env.

### D.1 Когда активировать

| Условие | Статус |
|---------|--------|
| M0 **Go** подписан | ⬜ Human |
| `DATABASE_URL` + `db:push` + `WAITLIST_BACKEND=postgres` | ⬜ Human (Блок A) |
| Scope Phase 5 подтверждён (одна строка в чат) | ⬜ Human |

### D.2 Обязательный минимум (после A + M0 Go)

Уже покрыто **Блоком A**: Postgres + waitlist postgres. Дополнительных env для минимального Phase 5 **не требуется**.

### D.3 OPTIONAL — Auth (T-035 activation)

| Переменная | Значение | Environments |
|------------|----------|--------------|
| `AUTH_ENABLED` | `true` | Production (+ Preview при тесте) |
| `AUTH_SECRET` | `openssl rand -base64 32` (новый) | Production + Preview |
| `AUTH_URL` | `https://quiet-partner.vercel.app` | Production |
| `AUTH_RESEND_KEY` | ключ Resend (magic link) | Production |
| `AUTH_EMAIL_FROM` | verified sender | Production |

После включения: redeploy → smoke `/login`, session, `GET /api/health` (auth checks).  
Разблокирует T-052 migrate-from-local (BACKLOG).

### D.4 OPTIONAL — Redis / Upstash (T-036)

| Переменная | Назначение |
|------------|------------|
| `REDIS_URL` | Upstash REST URL |
| `REDIS_TOKEN` | Upstash REST token |

Оба обязательны для Redis backend rate limit. Без них — in-memory (как сейчас на staging).  
Док: [`redis-rate-limit-T-036.md`](./redis-rate-limit-T-036.md)

### D.5 OPTIONAL — Billing RU (YooKassa) — **when ready, not now**

**Статус (2026-06-08):** Human directive «пока оплату не подключай». Scaffold (`lib/billing/`, `/api/billing/*`, schema, ADR-005, [`billing-russia-runbook.md`](./billing-russia-runbook.md)) **готов** — merchant и `BILLING_ENABLED=true` **не требуются** до явного «можно подключать».

| Переменная | Когда | Назначение |
|------------|-------|------------|
| `BILLING_ENABLED` | после «готово» от Human | `false` default — **не менять** без решения |
| `YOOKASSA_SHOP_ID` / `YOOKASSA_SECRET_KEY` | when ready | Merchant test/prod keys |
| `YOOKASSA_WEBHOOK_SECRET` | when ready | Webhook IP verify (T-069) |

**Шаблон когда будете готовы:**

```text
Billing: можно подключать. Merchant YooKassa создан (test/prod). Redeploy после env.
```

PM → T-069 **BACKLOG → READY**; Developer — webhook persist + smoke.

### D.6 OPTIONAL — Neon ADR choice

| Вариант | Когда |
|---------|-------|
| **Neon (lean, ADR-004 draft)** | Default — достаточно Блока A |
| **Supabase** | Если Human явно предпочитает — одна строка в чат + PM → Architect обновит ADR-004 |
| **Self-host Postgres** | Budget/prod decision — эскалация Architect + Human |

**Шаблон scope confirmation:**

```text
Phase 5 scope: Auth + PostgreSQL + waitlist backend — да/нет/отложить.
DB host: Neon (default) / Supabase / другое: ___.
```

---

## 6. Блок E: Secrets hygiene

### NEVER

| Запрет | Почему |
|--------|--------|
| Paste `DATABASE_URL`, API keys, `AUTH_SECRET` в **чат Cursor** | Логи, индексация, утечка |
| Commit `.env.local`, `.vercel/`, credentials JSON | Git history |
| `NEXT_PUBLIC_*` для LLM keys | ADR-001 — только server-side |
| Force-push секретов «исправить» | Использовать rotate в провайдере |

### ALWAYS

| Правило | Как |
|---------|-----|
| Секреты только Vercel Dashboard / локальный `.env.local` | `.gitignore` |
| Сообщать агентам **статус** («настроено»), не значения | Шаблоны в Блоках A, C |
| Rotate при подозрении на утечку | Neon reset password; Vercel re-save env |

### Таблица имён Vercel env (канон)

| Переменная | Human MUST? | Назначение | Server-only |
|------------|:-----------:|------------|:-----------:|
| `DATABASE_URL` | **MUST** (T-051) | Neon/Supabase pooled Postgres | ✓ |
| `WAITLIST_BACKEND` | после db:push | `noop` → `postgres` | ✓ |
| `DEEPSEEK_API_KEY` | OPTIONAL | Live LLM BFF | ✓ |
| `GEMINI_API_KEY` | OPTIONAL | Fallback LLM | ✓ |
| `AUTH_ENABLED` | OPTIONAL Phase 5 | `false` default | ✓ |
| `AUTH_SECRET` | if AUTH on | Session signing | ✓ |
| `AUTH_URL` | if AUTH on | Callback base URL | ✓ |
| `AUTH_RESEND_KEY` | if magic link | Email provider | ✓ |
| `AUTH_EMAIL_FROM` | if magic link | Sender | ✓ |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | OPTIONAL | OAuth | ✓ |
| `REDIS_URL` / `REDIS_TOKEN` | OPTIONAL | Upstash rate limit | ✓ |
| `MIGRATE_LOCALSTORAGE_ON_LOGIN` | OPTIONAL | `false` default | ✓ |
| `POSTHOG_DISABLED` | OPTIONAL | `true` default | ✓ |
| `NEXT_PUBLIC_POSTHOG_KEY` | OPTIONAL | Analytics (consent) | ✗ public |
| `NEXT_PUBLIC_POSTHOG_HOST` | OPTIONAL | PostHog host | ✗ public |
| `BILLING_ENABLED` | OPTIONAL (when ready) | `false` default — **не включать** без Human | ✓ |
| `YOOKASSA_*` | OPTIONAL (when ready) | Merchant + webhook — см. D.5 | ✓ |

Полный контракт: [`.env.example`](../.env.example) · [`deploy-staging.md`](./deploy-staging.md) §3.

---

## 7. Checklist — copy-paste для Human

### Блок A — DATABASE_URL

```
[ ] Neon project создан (EU, pooled connection string скопирован — НЕ в чат)
[ ] Vercel: DATABASE_URL → Production + Preview
[ ] npm run db:push выполнен (SUCCESS)
[ ] Vercel: WAITLIST_BACKEND=postgres
[ ] Redeploy production
[ ] GET /api/health → database_configured=true, waitlist_backend=postgres
[ ] Сообщил агентам «готово» (шаблон A.6, без секретов)
```

### Блок B — Dogfood / waiver

```
[ ] Выбрал путь:  ( ) Waiver G2→3   ( ) Dogfood #5 useful Y
[ ] Waiver: текст в чат / journal (если waiver)
[ ] #5: dogfood-log-template строка #5 заполнена (если сессия)
[ ] PM подтвердил G2→3 закрыт
```

### Блок C — M0

```
[ ] Прочитал m0-go-no-go-memo.md + competitive-scan-1pager.md
[ ] Открыл staging https://quiet-partner.vercel.app
[ ] Footer memo: Go / Pause / Pivot + подпись + дата
[ ] Сообщил PM решение (шаблон C)
```

### Блок D — Phase 5 (после Go + A)

```
[ ] Scope Phase 5: да/нет/отложить — одна строка PM
[ ] (OPTIONAL) AUTH_ENABLED + AUTH_SECRET + Resend
[ ] (OPTIONAL) REDIS_URL + REDIS_TOKEN
[ ] (OPTIONAL) DB host ≠ Neon — эскалация Architect
[ ] Redeploy после каждого изменения env
```

### Блок E — Hygiene

```
[ ] Ни одного секрета в чате / git
[ ] .env.local не в commit
[ ] При утечке — rotate в Neon/Vercel
```

---

## 8. Что НЕ требуется от Human

| Не делать | Кто делает |
|-----------|------------|
| Писать или ревьюить код приложения | Developer |
| `git commit`, `git push`, PR, merge | Developer / по вашей отдельной просьбе |
| Интервью с пользователями (Phase 0 без интервью) | — |
| Логин в productmap.io | UI/UX использует публичный сайт |
| QA smoke, lint, build | QA |
| Черновики ADR, competitive scan, memo body | PM / Architect |
| Настройка CI/CD с нуля | DevOps (runbook готов) |
| Выравнивание порогов 40/70, static prompt regression | Senior PM + QA (**DONE**) |
| PostHog VPS | OPTIONAL T-048; DevOps по запросу |
| Live LLM regression 4 сценария | OPTIONAL T-049; static **PASS** |
| Stripe / live billing activation | Scaffold готов; **live оплата paused** Human (2026-06-08) |
| Параллельный Banya-Digital pilot | Отдельный приоритет — **не блокирует** QP агентов |

---

## Связь с очередью (snapshot)

| ID | Human action | Статус |
|----|--------------|--------|
| T-051 activation | Блок A | BLOCKED (env) |
| T-050 | Блок B | BACKLOG |
| T-015 / T-055 | Блок C | sign-off ⬜ |
| T-052, AUTH, Redis | Блок D | BACKLOG после Go |
| T-053 SEO impl | Growth + Dev | READY после M0 Go |

**Staging:** https://quiet-partner.vercel.app  
**Следующий PM review:** 2026-06-13

---

## История

| Дата | Событие |
|------|---------|
| 2026-06-07 | v1.0 — единое ТЗ Human; PM Senior; агрегация pm-governance, pm-status, team-assignments, queue, Human-one-step-database, M0 memo, roadmap-phase5 |
| 2026-06-07 | Block A agent run: `DATABASE_URL` отсутствует в Vercel (production/preview) и в `.env.local` — activation BLOCKED |
| 2026-06-08 | Human «пока оплату не подключай» — YooKassa merchant + `BILLING_ENABLED` → OPTIONAL (D.5); T-069 BACKLOG |

---

## Agent execution footer

> **agents cannot inject Vercel secrets without dashboard or `.env.local` on disk** — агенты не могут добавить `DATABASE_URL` в Vercel без значения в Dashboard Human или строки `DATABASE_URL=` в `quiet-partner/.env.local` (файл в `.gitignore`). После добавления Human: повторить Block A agent run или сообщить «готово» по шаблону A.6.

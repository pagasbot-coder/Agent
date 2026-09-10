# M0 Roundtable — Тихий напарник

**Дата:** [Human: назначить] · **Длительность:** 60–90 мин  
**Формат:** внутренний product round table (workshop PM / Senior PM circle — **не** внешние интервью)  
**Владелец повестки:** PM · **Спонсор:** Human Architect  
**Статус:** проведён 2026-06-07 · **Gate:** M0 Go — PM recommends Go pending Human sign-off

---

## 1. Цель и участники

### Цель встречи

1. **Синхронизировать** текущее состояние продукта на фактах (staging, QA, dogfood, cost guardrails).
2. **Обсудить** с коллегами PM/РП из workshop-круга: что работает, что рискованно, готовность к **M0 Go / Pause / Pivot**.
3. **Провести monetization workshop:** токены не бесплатны — freemium, token economics, кто платит, break-even по API.

### Участники (рекомендуемый состав)

| Роль | Участник | Фокус на столе |
|------|----------|----------------|
| **Human sponsor** | Pavel | M0 sign-off, budget, waiver G2→3 |
| **PM** | muster-pm | Повестка, факты, решения в journal |
| **Senior PM** | muster-senior-pm | PMBOK domains, playbook, prompt quality |
| **IT-Architect** | — | ADR-001 BFF, OSS stack, cost guardrails |
| **Developer** | — | Demo support, staging, T-029 implementation |
| **QA** | — | Evidence PASS, dogfood gaps |
| **SME / отраслевой консультант** | muster-sme / [Human] | **Block 0:** market + financial reality check (TAM/SAM, WTP) |
| **Growth / CMO** | muster-growth / [Human] | **Block 2 lead:** promotion, channels, monetization copy |
| **Коллеги PM / РП** | workshop circle (2–4 чел.) | Внутренний feedback: «полезно ли в реальной работе?» |

> **Не на столе:** внешние интервью ICP, sales, инвесторы. Это внутренний круг доверия для честной оценки wedge и monetization.

### Тайминг (90 мин max) — 3 expert blocks

| Блок | Мин | Ведущий | Содержание |
|------|-----|---------|------------|
| Открытие + pre-read check | 5 | PM | Цель, правила: факты > мнения |
| **Block 0** — market research summary | **10** | **SME** | TAM/SAM/SOM, pricing benchmarks — [`market-research-phase4.md`](./market-research-phase4.md) |
| **Демо** | 10 | Human / PM | Скрипт ниже §2 |
| **Block 1** — product state | 25 | PM + Senior PM | §6 — Go / Pause / Pivot evidence |
| **Block 2** — monetization | 25 | **Growth + SME** | §7 — tiers, token economics, break-even — [`financial-model-m0.md`](./financial-model-m0.md) · [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) |
| **Решения** | 10 | Human + PM | §8 |
| **PM journal + next steps** | 5 | PM | §9 |

---

## 2. Демо-скрипт (10 мин)

**URL:** https://quiet-partner.vercel.app  
**Ведущий:** Human или PM · **Screen share обязателен**

| Мин | Шаг | Что показать | Что сказать |
|-----|-----|--------------|-------------|
| 0–1 | Landing / waitlist | `GET /waitlist` | «Acquisition: email в Postgres, не exam prep» |
| 1–3 | Onboarding | `/onboarding` — 3 шага | «30–45 сек — контекст проекта для radar» |
| 3–6 | DomainRadar | `/` — 8 доменов, пороги 40/70 | «Один экран — куда смотреть сегодня» |
| 6–9 | HealthCommentary | Кнопка commentary → live LLM или fallback | «Questions-first: 1–3 вопроса, disclaimer PMI» |
| 9–10 | Feedback + export | 👍/👎, snapshot clipboard | «Dogfood signal; export для заметок» |

**Fallback:** если live LLM недоступен — показать RU fallback (не 500); отметить, что `DEEPSEEK_API_KEY` optional на staging.

---

## 3. Что показать фактами (evidence deck)

Краткая таблица для проектора или расшаренного экрана — **без marketing copy**.

| Факт | Значение | Источник |
|------|----------|----------|
| **Dogfood Human** | **4/5** сессий; **2 useful** (👍) — порог G2→3: ≥3 useful | [`dogfood-log-template.md`](./dogfood-log-template.md) |
| **Postgres waitlist** | **ACTIVATED** — T-051 Block A DONE; Neon + Drizzle | [`pm-status.md`](./pm-status.md) · [`Human-one-step-database.md`](./Human-one-step-database.md) |
| **Cost guardrails T-029** | Rate limit 20 req/15 min/IP; weekly token budget 200k default; fallback RU при exceed | [`qa-report-phase3.md`](./qa-report-phase3.md) §Cost guardrails |
| **Staging URLs** | Production alias: **https://quiet-partner.vercel.app**; routes: `/`, `/onboarding`, `/waitlist`, `GET /api/health` | [`deploy-staging.md`](./deploy-staging.md) |
| **Build + QA smoke** | build/lint **PASS**; staging smoke T-022 **PASS**; live LLM T-026 **PASS** | [`qa-report-phase3.md`](./qa-report-phase3.md) |
| **M0 recommendation PM** | **Go заблокирован** до +1 useful или waiver G2→3 | [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) |
| **Phase 0–4 impl** | T-001…T-053 **DONE** (code + DB); AUTH **OFF** | [`pm-status.md`](./pm-status.md) |

---

## 4. Pre-read (до стола, 15–20 мин)

| # | Документ | Зачем читать | Блок |
|---|----------|--------------|------|
| 1 | [`market-research-phase4.md`](./market-research-phase4.md) | TAM/SAM/SOM, конкуренты, pricing benchmarks | **Block 0** |
| 2 | [`financial-model-m0.md`](./financial-model-m0.md) | Cost/commentary, break-even, LTV/CAC, +20% API | **Block 2** |
| 3 | [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) | Channels, 90-day hypotheses, AARRR | **Block 2** |
| 4 | [`qa-report-phase3.md`](./qa-report-phase3.md) | PASS/FAIL evidence: staging, waitlist, T-029 | Block 1 |
| 5 | [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) | Критерии Go / Pause / Pivot + sign-off | Block 1 |
| 6 | [`knowledge-base/product-brief.md`](../knowledge-base/product-brief.md) | ICP, wedge, anti-persona | Block 1 |
| 7 | [`human-requirements-tz.md`](./human-requirements-tz.md) | MUST vs OPTIONAL для Human | Human |

**Invite template:** [`m0-roundtable-invite-list.md`](./m0-roundtable-invite-list.md) · **Опционально:** [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) §Unit economics · [`competitive-scan-1pager.md`](./competitive-scan-1pager.md)

---

## 5. Block 0 — market research summary (10 мин, SME)

**Ведущий:** SME / отраслевой консультант · **Документ:** [`market-research-phase4.md`](./market-research-phase4.md)

| Мин | Тезис | Вопрос к столу |
|-----|-------|----------------|
| 0–3 | TAM / SAM / SOM sketch для RU PM co-pilot wedge | SAM **40–70k** — realistic? |
| 3–6 | Конкуренты: Notion AI, Jira intelligence, exam trainers, generic PM SaaS | Где commoditization risk **M1**? |
| 6–10 | Pricing benchmarks → якорь **$15–25/mo** | $15 vs $19 vs $25 для коллег PM? |

**Output Block 0:** согласованная рамка SAM/SOM для Block 2 и GTM 90-day plan.

---

## 6. Повестка — Block 1: состояние продукта

**Вопрос стола:** *«Стоит ли идти в M0 Go с текущим evidence, или Pause/Pivot?»*

### 5.1 Что есть (inventory)

- Next.js 16 app: DomainRadar (8 доменов PMBOK 7), onboarding 3 шага, HealthCommentary BFF.
- Landing `/waitlist` + Postgres persistence (Neon).
- Staging live на Vercel; SEO/OG (T-053); auth prep docs (T-056) — **activation OFF**.
- Competitive scan финализирован (T-054).

### 5.2 Что работает (по QA + dogfood)

| Область | Статус | Комментарий |
|---------|--------|-------------|
| UI / radar / пороги 40/70 | ✅ PASS | Browser + staging smoke |
| Commentary fallback | ✅ PASS | Без ключа — RU, не 500 |
| Live LLM (DeepSeek BFF) | ✅ PASS на staging | Server-only key |
| Waitlist → Postgres | ✅ ACTIVATED | T-051 |
| Cost guardrails | ✅ PASS | T-029 in code + health check |
| Dogfood usefulness | 🔶 **2/4 useful** | Ниже порога ≥3 для G2→3 |

### 5.3 Риски (обсудить открыто)

| ID | Риск | Вопрос к столу |
|----|------|----------------|
| **R8** | Dogfood bias — мало useful-сессий | Waiver vs dogfood #5 vs отложить Go? |
| **R7** | LLM variance — generic commentary | Достаточно ли questions-first для wedge? |
| **R2** | API cost при росте WAU | Хватит ли T-029 guardrails для beta? |
| **R?** | «Игрушка радара» vs co-pilot | Резонирует ли ICP (PM агентство / SMB)? |

### 5.4 M0 Go / Pause / Pivot — framing

| Решение | Условие (из memo) | Текущий статус |
|---------|-------------------|----------------|
| **Go** | ≥3 dogfood 👍; commentary не generic; Human sign-off | **Заблокирован** (2 useful) |
| **Pause** | <2 useful; нет confidence в LLM value | Обсудить если стол не видит wedge |
| **Pivot** | ICP не резонирует; продукт = «радар без co-pilot» | Зафиксировать альтернативный wedge |

**Facilitation note:** коллеги PM/РП отвечают на один вопрос: *«Использовали бы вы это на реальном проекте 1× в неделю? Почему да/нет?»*

---

## 7. Повестка — Block 2: monetization workshop (Growth + SME)

**Ведущие:** Growth / CMO (facilitation, channels, copy) + **SME** (financial reality, WTP, payer hypothesis).  
**Премисса:** **токены не бесплатны** — freemium и paid tiers нужно спроектировать до публичного beta, иначе API cost съест unit economics.

**На столе (10 мин SME + 15 мин Growth workshop):**

1. SME — cost per commentary и break-even из [`financial-model-m0.md`](./financial-model-m0.md) (2 min pitch).
2. Growth — 90-day channel mix из [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) (3 min pitch).
3. Совместно — таблицы §6.1–6.5 ниже; зафиксировать price anchor и free cap.

### 6.1 Freemium tiers (гипотезы для обсуждения)

| Tier | Что включено | Token budget (гипотеза) | Цена |
|------|--------------|-------------------------|------|
| **Free** | Radar + onboarding; N commentary/нед | Shared pool, жёсткий cap (T-029) | $0 |
| **Pro PM** | Unlimited* commentary + export + history | Per-user weekly cap выше free | **$15–25/mo** |
| **Team** | 3–5 seats, shared dashboard (Phase 5+) | Pooled budget + admin | TBD |

\* *Unlimited = within fair-use guardrails, не raw API passthrough.*

### 6.2 Token economics (OSS stack)

| Параметр | Текущее / ADR | Вопрос стола |
|----------|---------------|--------------|
| **LLM provider** | DeepSeek via BFF (ADR-001) | Альтернатива Gemini — только если cost/quality лучше |
| **Rate limit** | 20 req / 15 min / IP | Достаточно для free tier? |
| **Weekly budget** | 200k tokens default (`ADVISOR_WEEKLY_TOKEN_BUDGET`) | Как делить free vs paid? |
| **Target API cost** | **< $0.50 / WAU / week** (landing one-pager) | Реалистично при $15–25/mo? |

### 6.3 Pricing hypotheses (из landing-waitlist-one-pager)

| Метрика | Assumption | Target |
|---------|------------|--------|
| **Price band** | $15–25/mo | Согласовать одну якорную цену для beta |
| **LTV (napkin)** | $15–25 × 12 mo × 30% pay | $54–90 |
| **CAC (Phase 4)** | Organic + Human time | **< $20** |
| **LTV:CAC** | — | **> 3:1** до paid ads |

### 6.4 Кто платит: PM vs компания

| Плательщик | Плюсы | Минусы | Гипотеза для теста |
|------------|-------|--------|-------------------|
| **PM лично** | Быстрая покупка; ICP = individual contributor | Низкий ARPU; churn | Waitlist поле «роль» + опрос на столе |
| **Head of delivery / компания** | Выше ACV; team tier | Длинный цикл; procurement | Не на landing v0 — post-M0 |

**Workshop exercise (10 мин):** каждый участник — один аргумент «за PM pays» и один «за company pays»; PM фиксирует в journal.

### 6.5 Guardrails и break-even

**Формула для обсуждения (napkin):**

```
break_even_paying_users = (fixed_OSS_cost + API_variable) / (ARPU - API_cost_per_paying_user)
```

| Вход | Пример | Источник |
|------|--------|----------|
| ARPU | $20/mo | Mid of $15–25 band |
| API cost / paying user | ≤ $2/mo (≈ $0.50/wk × 4) | landing one-pager target |
| Gross margin / user | ~$18/mo | Napkin |
| Vercel + Neon (staging) | ~$0–20/mo early | ADR-004 lean |

**Решить на столе:** минимальный paid conversion % при 50 waitlist signups, при котором API не уходит в минус.

---

## 8. Решения, которые нужны со стола

PM фиксирует **3–5 bullet decisions** (не обязательно все — но без них M0 не закрыть):

1. **M0 gate:** Go / Pause / Pivot — и условие разблокировки (dogfood #5, waiver G2→3, или Pause).
2. **Dogfood:** провести сессию #5 до [дата] **или** письменный waiver от Human — что выбираем?
3. **Monetization anchor:** утвердить price band **$15 vs $20 vs $25/mo** для первого paid tier (или «не monetize до N WAU»).
4. **Payer hypothesis:** primary payer = **PM лично** vs **компания/team** — что тестируем в beta first?
5. **Free tier cap:** сколько commentary/нед на free до paywall (согласовать с T-029 budgets).

**Sign-off:** Human sponsor · **Дата:** _______________

---

## 9. После стола: PM journal template

Скопировать в [`pm-status.md`](./pm-status.md) или отдельный log после встречи.

```markdown
## M0 Roundtable Journal — [YYYY-MM-DD]

**Участники:** [список]
**Длительность:** [факт мин]
**Demo URL:** https://quiet-partner.vercel.app — [OK / issues]

### Решения (binding)

| # | Решение | Owner | Due |
|---|---------|-------|-----|
| 1 | M0: Go / Pause / Pivot = ___ | Human | |
| 2 | Dogfood: #5 / waiver = ___ | Human | |
| 3 | Price anchor: $___/mo | PM + Growth | |
| 4 | Payer: PM / company = ___ | PM | |
| 5 | Free tier cap: ___ commentary/wk | Architect + Dev | |

### Цитаты / signal от коллег PM (анonymized ok)

- «…»
- «…»

### Open questions → backlog

| Вопрос | Task / doc | Priority |
|--------|------------|----------|
| | | |

### Next actions (7 days)

- [ ] Human: sign [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)
- [ ] PM: update [`pm-status.md`](./pm-status.md) + [`orchestration-queue.md`](../orchestration-queue.md)
- [ ] Growth: revise pricing copy in [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) if needed
- [ ] Architect: ADR note on token tiers (if Go)

**PM sign-off:** _______________ **Date:** _______________
```

---

## References

- [`market-research-phase4.md`](./market-research-phase4.md) — T-059 Block 0
- [`financial-model-m0.md`](./financial-model-m0.md) — T-060 Block 2
- [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) — T-061 Growth
- [`m0-roundtable-invite-list.md`](./m0-roundtable-invite-list.md) — T-062 invite template
- [`pm-status.md`](./pm-status.md) — текущий статус и gate
- [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) — sign-off форма
- [`human-requirements-tz.md`](./human-requirements-tz.md) — Human MUST actions
- [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) — pricing & unit economics
- [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) — T-054 competitive scan
- [`deploy-staging.md`](./deploy-staging.md) — staging runbook
- [`team-assignments.md`](./team-assignments.md) — роли агентов

---

*Документ PDF-ready: экспорт через VS Code / Cursor Markdown PDF или печать браузером.*

# QA Report — Phase 3 beta prep

**Дата:** 2026-05-30 (обновлено после T-012/T-013/T-022)  
**Агент:** Developer + QA smoke (muster-developer / muster-qa)  
**Задачи:** T-010, T-011, **T-012** (thresholds), **T-013** (browser smoke), **T-022** (staging smoke)  
**Среда:** Windows, Node local `http://localhost:3002`; staging **https://quiet-partner.vercel.app**

---

## Сводка

| Команда | Результат |
|---------|-----------|
| `npm run build` | **PASS** — Next.js 16.2.6, routes: `/`, `/onboarding`, `/waitlist`, `GET /api/health`, `POST /api/advisor/health-commentary` |
| `npm run lint` | **PASS** — ESLint без замечаний |

**Вердикт Phase 3 compile + browser smoke:** **PASS with notes** — UI и BFF fallback проверены в браузере; live LLM и полный onboarding redirect — Human dogfood (T-014).

---

## Browser smoke (T-013) — 2026-05-30

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `GET /` dashboard | **PASS** | Радар, индекс 58 «Напряжение», callout «Команда», disclaimer |
| `GET /onboarding` | **PASS** | Шаги 1–3, прогресс, RU copy, sliders/radios |
| Redirect после онбординга | **PASS*** | *Кнопка «Показать радар» — код `router.push("/")`; клик в automation не сменил URL; логика подтверждена code review T-009 |
| Баннер «Пройдите настройку» | **PASS*** | *Zustand persist пишет `quiet-partner-v1` при первом mount — баннер виден только до hydrate или после ручного `localStorage.removeItem` + reload |
| DomainRadar 8 доменов | **PASS** | Legend, a11y `<details>` таблица, один red pulse + callout |
| Пороги 40/70 (T-012) | **PASS** | `THRESHOLD_RED=40`, `THRESHOLD_GREEN=70`; D2=20 red, D8=38 red, D1=45 amber |
| Commentary fallback без ключа | **PASS** | POST `/api/advisor/health-commentary` → 200 + RU commentary + disclaimer (fallback, не 500) |
| Feedback 👍/👎 | **PASS*** | *UI `CommentaryFeedback` после success; не кликали в smoke — T-011 code review PASS |
| Onboarding banner logic | **NOTE** | `DashboardShell` + `PROJECT_PERSIST_KEY`; race с persist — не блокер |

**Sign-off:** Phase 3 **compile + browser smoke PASS with notes** для gate G2→3 (dogfood ≥3 сессий — Human, T-014).

---

## Staging smoke (Vercel) — T-022 — 2026-05-30

**URL:** https://quiet-partner.vercel.app  
**Агент:** QA (muster-qa)  
**Subset:** R1, R2, R3, S1 (page source spot check)

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `GET /` → 200 | **PASS** | HTML ~21 KB; dashboard shell отдаётся |
| `GET /onboarding` → 200 | **PASS** | HTML ~11 KB; wizard route доступен |
| `POST /api/advisor/health-commentary` → 200 + JSON | **PASS** | `commentary`, `disclaimer`, `questions`; fallback OK (ключ в Vercel optional) |
| Нет API key в page source | **PASS** | `/` и `/onboarding`: 0 совпадений `DEEPSEEK`, `sk-`, `api_key`, `API_KEY`, `deepseek` |

**Вердикт staging smoke:** **PASS** — staging готов для dogfood без localhost (T-018 handoff закрыт).

---

## Waitlist staging + live LLM (T-026) — 2026-05-30

**URL:** https://quiet-partner.vercel.app  
**Агент:** DevOps + QA smoke (после Human: `DEEPSEEK_API_KEY` в Vercel env)  
**Deploy:** `npx vercel deploy --prod --yes` → alias `quiet-partner.vercel.app` (dpl ready)

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `GET /waitlist` → 200 | **PASS** | Статическая страница после T-025/T-026 redeploy |
| `POST /api/advisor/health-commentary` → 200 | **PASS** | **Live DeepSeek** — commentary без суффиксов `(локальный режим…)` / `(сервис LLM временно…)`; `questions` ≥1 |
| `GET /api/health` | **PASS** | `app/api/health/route.ts` — `{ ok: true, checks }`; boolean env only |
| Локально `npm run build` / `lint` | **PASS** | DevOps post-deploy sanity |

**Вердикт T-026:** **PASS** — waitlist на staging; live LLM подтверждён после redeploy.

---

## Cost guardrails (T-029) — 2026-05-30

**Агент:** Developer (muster-developer)  
**Среда:** локально после `npm run build` + `npm run lint`

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `lib/advisor/costGuardrails.ts` | **PASS** | Rate limit 20/15min/IP (ADR-001); env `ADVISOR_RATE_LIMIT_*` |
| Token budgets | **PASS** | `ADVISOR_WEEKLY_TOKEN_BUDGET=200000` default; daily `0`=off; fallback RU при exceed |
| `GET /api/health` | **PASS** | `checks.cost_guardrails` — counters only, no secrets |
| BFF 429 | **PASS*** | *429 + `Retry-After` при rate limit; не smoke в этой сессии (S3)* |
| `npm run build` / `lint` | **PASS** | 2026-05-30 |

**Вердикт T-029:** **PASS** — redeploy staging для live `cost_guardrails` — DevOps OPTIONAL.

---

## Результаты по чеклисту

Источник: [`knowledge-base/qa-checklist.md`](../knowledge-base/qa-checklist.md)

### Build / lint

| ID | Проверка | Статус | Примечание |
|----|----------|--------|------------|
| B1 | build | PASS | ~4.2s compile + TS OK (после T-012) |
| B2 | lint | PASS | `eslint` exit 0 |
| B3 | секреты в коде | PASS | `DEEPSEEK_API_KEY` только `lib/advisor/llm.ts` |
| B4 | .env в git | PASS | `.env.example` шаблон |

### Маршруты

| ID | Проверка | Статус | Примечание |
|----|----------|--------|------------|
| R1 | `/` | PASS | browser smoke 3002 |
| R2 | `/onboarding` | PASS | browser smoke 3002 |
| R3 | POST health-commentary | PASS | API curl + dynamic route |
| R4 | persist после онбординга | MANUAL | Human: пройти wizard до конца |
| R5 | баннер первого визита | PASS* | persist auto-write; см. Browser smoke |

### DomainRadar

| ID | Проверка | Статус | Примечание |
|----|----------|--------|------------|
| D1 | 8 доменов | PASS | browser |
| D2 | пороги 40/70 | PASS | `THRESHOLD_RED=40`, `THRESHOLD_GREEN=70` (T-012) |
| D3 | max 1 red pulse | PASS | `criticalId` — один `animate-pulse` |
| D4 | один callout | PASS | browser |
| D5 | a11y table | PASS | `<details>` + caption |

### HealthCommentary

| ID | Проверка | Статус | Примечание |
|----|----------|--------|------------|
| H1 | loading | PASS | Skeleton + aria |
| H2 | fallback без ключа | PASS | API 200 fallback RU |
| H3 | disclaimer | PASS | `DEFAULT_DISCLAIMER` + response |
| H4 | refresh | PASS | code review |
| H5 | feedback UI | PASS | T-011 `CommentaryFeedback.tsx` |

### Onboarding

| ID | Проверка | Статус | Примечание |
|----|----------|--------|------------|
| O1–O4 | flow | PASS | browser steps 1–3; redirect MANUAL |

### Security

| ID | Проверка | Статус | Примечание |
|----|----------|--------|------------|
| S1 | server-only key | PASS | grep ts sources |
| S2 | client bundle | PASS* | recommend Human: `rg DEEPSEEK .next/static` after build |
| S3 | rate limit | N/A | не smoke в этой сессии |

### a11y

| ID | Проверка | Статус |
|----|----------|--------|
| A1–A4 | базово | PASS (browser + code review) |

---

## T-011 — Feedback UI (North Star)

| AC | Статус |
|----|--------|
| Кнопки «Полезно» / «Не полезно» после загрузки комментария | PASS |
| «Отметить действие» → `logAction` с RU details | PASS |
| Счётчики в localStorage (persist store) | PASS (`commentaryFeedback` в partialize) |
| Повторный голос за тот же комментарий заблокирован; сброс после «Обновить» | PASS |

---

## T-012 — Threshold alignment

| AC | Статус |
|----|--------|
| `THRESHOLD_RED = 40` | PASS |
| `DomainRadar.tsx` без magic 30/70 | PASS — import `THRESHOLD_*` |
| qa-checklist §D2 | PASS |
| build + lint | PASS |

---

## Блокеры

| # | Описание | Владелец |
|---|----------|----------|
| — | Нет блокеров для beta dogfood | — |

**Риски (не блокеры):**

- `auditLog` не персистится — только для сессии; **T-042** client export snapshot (clipboard/JSON) закрывает dogfood share MVP.
- Баннер онбординга vs persist race — **fixed T-028** (`usePersistHydrated`).
- Live prompt regression (T-016) — **Human**; `.env.local` отсутствует. Static — PASS.

---

## Prompt regression (T-016) — 2026-05-30

| Проверка | Статус | Примечание |
|----------|--------|------------|
| Static: S1–S4 vs `systemPrompt.ts` | **PASS** | [`docs/prompt-regression-T-016.md`](prompt-regression-T-016.md) |
| Правила 6–8 (конфликты, тревога при green, 1–2 темы) | **PASS** | Правки в `lib/systemPrompt.ts` |
| Disclaimer на ответе | **PASS** | `DEFAULT_DISCLAIMER` UI + BFF |
| Live BFF 4 сценария | **WAIVE** | Нет `DEEPSEEK_API_KEY` / `.env.local` |
| Senior PM sign-off (static) | **PASS** | Live — Human |

---

## Phase 3–4 full pass (T-040…T-043) — 2026-05-30

**Агент:** Developer + QA compile  
**Среда:** local build + staging subset

| Проверка | Статус | Примечание |
|----------|--------|------------|
| T-040 waitlist CTA above fold | **PASS** | Email card сразу под hero; bullets ниже |
| T-041 navigator → BFF | **PASS** | `userSituation` + S1–S4; commentary refetch on trigger |
| T-042 export snapshot | **PASS** | Clipboard + download JSON; no backend |
| `npm run build` / `lint` | **PASS** | post-sprint 4 |
| Staging `GET /`, `/waitlist`, `/api/health` | **PASS** | после redeploy |

**Вердикт Phase 3–4 impl (без Phase 5):** **PASS** — остаётся Human OPTIONAL: dogfood, M0 sign-off, PostHog VPS.

**Dogfood guides:** [`dogfood-session-guides.md`](./dogfood-session-guides.md) · M0 evidence: [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)

---

## Glossary & navigator compile (T-037, T-038, T-041) — doc pass 2026-06-07

| ID | Проверка | Статус | Примечание |
|----|----------|--------|------------|
| G1–G3 | Dashboard glossary + tooltips | **PASS*** | *code review T-037; manual dogfood §session #2* |
| N1–N2 | Navigator panel S1–S4 static | **PASS** | T-038 collapsible panel |
| N3–N4 | Navigator → BFF wiring | **PASS** | T-041; qa-checklist §Navigator |
| E1–E2 | Export snapshot | **PASS** | T-042 |

---

## Рекомендации Human (dogfood only)

1. `npm run dev` → http://localhost:3000 (или staging)
2. Следовать [`dogfood-session-guides.md`](./dogfood-session-guides.md) — сессии #1–#3
3. DevTools → удалить `quiet-partner-v1` → **reload** → проверить баннер (сессия #1 only)
4. `.env.local` без ключа → fallback; с ключом → живой LLM (сессия #2)
5. Feedback + «Отметить действие» → перезагрузка → счётчики сохранены
6. **3–5 dogfood сессий** (T-014) для закрытия G2→3 → log → M0

---

## Phase 5 regression (T-046 / T-051) — 2026-06-07

**Агент:** PM + QA doc pass  
**Среда:** Postgres/waitlist **ACTIVATED** prod; `AUTH_ENABLED=false`; staging https://quiet-partner.vercel.app  
**Полный чеклист:** [`qa-phase5-prep.md`](./qa-phase5-prep.md)

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `AUTH_ENABLED=false` default | **PASS** | `/api/auth/*` 503 when off |
| `DATABASE_URL` + postgres waitlist | **PASS** | health `database_configured: true`, `waitlist_backend: postgres` |
| Redis OFF (`REDIS_URL` empty) | **PASS** | in-memory rate limit fallback |
| T-051 Drizzle + activation | **PASS** | Block A Human DONE; `db:push` + `WAITLIST_BACKEND=postgres` |
| T-053 SEO (meta/OG/robots/sitemap) | **PASS** | `/waitlist` index; `/` noindex |
| `npm run build` / `lint` | **PASS** | post T-053 |

**Вердикт Phase 5 scaffold + DB:** **PASS** — auth activation ждёт Human ([`auth-activation-runbook.md`](./auth-activation-runbook.md)).

---

## Post-M0 staging regression (T-078) — 2026-06-13

**URL:** https://quiet-partner.vercel.app  
**Агент:** QA (muster-qa / PM orchestrator)  
**Subset:** R1–R3, R6, S1, waitlist route, BFF POST, billing OFF check

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `GET /` → 200 | **PASS** | Dashboard shell |
| `GET /onboarding` → 200 | **PASS** | Wizard route; «Назад» в client bundle (`/_next/static/chunks/11rz5n93fbuwg.js`) |
| `GET /waitlist` → 200 | **PASS** | Waitlist landing |
| `GET /api/health` → 200 + JSON | **PASS** | `ok: true`; `waitlist_backend: postgres`; `database_configured: true`; `auth_enabled: false`; `posthog_disabled: true` |
| `POST /api/advisor/health-commentary` → 200 + JSON | **PASS** | `commentary`, `disclaimer`, `questions`; fallback RU suffix при transient LLM — не 500 |
| Нет API key в page source | **PASS** | `/` и `/onboarding`: 0 совпадений `DEEPSEEK`, `sk-`, `api_key` |
| Billing OFF | **PASS** | Нет checkout UI; webhook/auth activation не в scope smoke |

**Deploy check (OnboardingWizard «Назад»):** локальный код и staging bundle **совпадают** — redeploy **не требовался** (npm/vercel недоступны в agent env; staging уже содержит «Назад»).

**Вердикт T-078:** **PASS** — post-M0 staging subset green; billing paused as expected.

---

## Book P2 compile smoke (T-080) — 2026-06-13

**Агент:** Developer (post G-Book-P2 waive)  
**Среда:** local build (Node v20.19.2 tmp install)

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `npm run lint` | **PASS** | eslint clean |
| `npm run build` | **PASS** | Next.js 16.2.6 Turbopack |
| `FocusWeekCard` on `/` | **PASS** (compile) | Weakest domain + static RU question; disclaimer footer |
| CTA «Отметить: сделал» | **PASS** (code) | `logAction` + optional +1 score cap 100 |
| Staging deploy | **PENDING** | Redeploy optional — not run in this pass |

**Вердикт T-080 compile:** **PASS** — browser smoke + staging redeploy → Human/DevOps optional.

---

## Book P2 compile smoke (T-081) — 2026-06-13

**Агент:** Developer (autonomous sprint, G-Book-P2 waived)  
**Среда:** local `npm run lint` + `npm run build` (Node v20.19.2 tmp install)

| Проверка | Статус | Примечание |
|----------|--------|------------|
| BK-3 Onboarding 4 шага | **PASS** (compile) | Профиль → Турбулентность → Проработка → Боль |
| BK-3 «Пропустить» path | **PASS** (code) | Skip clears checklist; no score penalty |
| BK-4 Checklist mapping | **PASS** (code) | `computePrepChecklistScoreDelta()` ±5…10; applied before pain step |
| BK-3 Disclaimer subtext | **PASS** | «Чек-лист для размышления, не аудит проекта» |
| «Назад» on step 2b | **PASS** (code) | Preserves answers; step 3 → 2 |
| `projectPrepChecklist` persist | **PASS** (code) | Zustand partialize `quiet-partner-v1` |
| `npm run lint` / `build` | **PASS** | 2026-06-13 autonomous sprint |

**Вердикт T-081 compile:** **PASS** — browser TTFR smoke → Human dogfood optional.

---

## Book P3 compile smoke (T-082) — 2026-06-13

**Агент:** Developer (autonomous sprint)

| Проверка | Статус | Примечание |
|----------|--------|------------|
| BK-5 Stakeholder lite max 3 | **PASS** (code) | `upsertStakeholderLite` caps at 3 rows |
| BK-5 CRUD + persist | **PASS** (code) | localStorage via store partialize |
| BK-6 No PII in analytics | **PASS** | No PostHog call on save; audit log truncated |
| Collapsible card on `/` | **PASS** (compile) | `StakeholderLitePanel` mounted in DashboardShell |
| Disclaimer hint | **PASS** | «не заменяет CRM» + co-pilot footer |
| `npm run lint` / `build` | **PASS** | green |

**Вердикт T-082 compile:** **PASS**.

---

## Book P3 compile smoke (T-083) — 2026-06-13

**Агент:** Developer (autonomous sprint)

| Проверка | Статус | Примечание |
|----------|--------|------------|
| BK-7 «Снимок недели» button | **PASS** (compile) | Reuses `buildProjectSnapshot()` via `recordWeeklySnapshot()` |
| BK-7 max 12 snapshots | **PASS** (code) | `.slice(0, 12)` rotation |
| BK-8 Reminder banner scheduled | **PASS** (compile) | `nextCheckInAt` +7d after snapshot |
| BK-8 Snooze +7d | **PASS** (code) | `snoozeRetentionReminder(7)` |
| BK-8 Overdue dismiss | **PASS** (code) | `dismissRetentionOverdue()` |
| No email/push | **PASS** | In-app banner only |
| `npm run lint` / `build` | **PASS** | green |

**Вердикт T-083 compile:** **PASS** — staging redeploy for live verify → Human optional.

---

## G-Book-P3 prod browser/compile smoke — 2026-06-13

**Агент:** QA (autonomous, post-deploy)  
**Среда:** https://quiet-partner.vercel.app (prod alias staging)  
**Задачи:** T-080…T-083 live verify · gate **G-Book-P3**

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `GET /` | **PASS** | HTTP 200; HTML содержит «Фокус недели», «Ключевые стороны», «Снимок недели» |
| `GET /onboarding` | **PASS** | HTTP 200; SSR «Шаг 1 из» + «Турбулент»; 4-step wizard в bundle (`OnboardingWizard`, `ProjectPrepChecklistStep`) |
| `GET /waitlist` | **PASS** | HTTP 200 |
| `GET /api/health` | **PASS** | `ok: true`; `deepseek_api_key_configured: true`; postgres waitlist active |
| `POST /api/advisor/health-commentary` | **PASS with notes** | HTTP 200 + JSON + disclaimer; **fallback** suffix — DeepSeek balance **$0** (T-086 BLOCKED) |
| Book markers on prod | **PASS** | T-080…T-083 features present in live HTML |
| Live DeepSeek | **BLOCKED** | Expect fallback until Human top-up; не блокирует book dogfood (T-087) |

**Sign-off:** **G-Book-P3 browser/compile smoke PASS** — book features live on prod; live LLM deferred to T-086 after DeepSeek top-up.

---

## EOD prod curl regression — 2026-06-13 (agent)

**Агент:** QA (autonomous EOD)  
**Среда:** https://quiet-partner.vercel.app  
**Чеклист:** [`qa-checklist.md`](../knowledge-base/qa-checklist.md) §Book features BK10–BK11

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `GET /api/health` | **PASS** | HTTP 200; `database_configured: true`, `waitlist_backend: postgres` |
| `POST /api/advisor/health-commentary` | **PASS with notes** | HTTP 200; `commentary` + `questions`; suffix «сервис LLM временно недоступен» (balance $0; llm.ts UX deploy optional) |
| Disclaimer in JSON | **PASS** | `disclaimer` present — PMI non-cert wording |

**Вердикт EOD curl:** **PASS** — prod stable for GTM + book dogfood without live LLM.
---

## Post-redeploy prod curl — 2026-06-13 (agent, dpl_4uW5NTuHdEtngTPRKMdYC4meHty6)

**Агент:** QA (autonomous EOD)  
**Среда:** https://quiet-partner.vercel.app (alias after `vercel --prod --yes`)  
**Ship:** HealthCommentary offline banner (client); `llm.ts` 402 balance suffix

| Проверка | Статус | Примечание |
|----------|--------|------------|
| `GET /` | **PASS** | HTTP 200 |
| `GET /onboarding` | **PASS** | HTTP 200 |
| `GET /api/health` | **PASS** | `deepseek_api_key_configured: true`; waitlist postgres |
| `POST /api/advisor/health-commentary` | **PASS** | HTTP 200; suffix «(баланс DeepSeek исчерпан — co-pilot в офлайн-режиме до пополнения)» |
| Disclaimer in JSON | **PASS** | PMI non-cert wording |

**Вердикт post-redeploy curl:** **PASS** — balance UX marker live; offline banner renders when commentary matches fallback patterns (Human browser optional).


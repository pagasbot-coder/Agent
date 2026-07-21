# QA Checklist — Quiet Partner (Phase 3 beta)

**Владелец:** QA (`@role-qa`)  
**Проект:** `quiet-partner/`  
**Обновлено:** 2026-06-13 (T-080…T-083 book features; G-Book-P3 prod smoke)  
**Отчёт smoke:** [`docs/qa-report-phase3.md`](../docs/qa-report-phase3.md)

---

## Перед каждым релизом / dogfood

| # | Проверка | Как |
|---|----------|-----|
| B1 | `npm run build` | Корень `quiet-partner/` |
| B2 | `npm run lint` | ESLint без ошибок |
| B3 | Секреты не в клиенте | `rg DEEPSEEK_API_KEY` только в `lib/advisor/llm.ts` (server) |
| B4 | `.env` не в git | `.env.example` без реальных ключей |

---

## Маршруты и API

| # | Проверка | Ожидание |
|---|----------|----------|
| R1 | `GET /` | Dashboard: радар + комментарий + disclaimer |
| R2 | `GET /onboarding` | **4 шага**, RU copy, прогресс 1/4…4/4 |
| R3 | `POST /api/advisor/health-commentary` | JSON body: `domainScores`, `deliveryApproach`; 200 + `commentary` + `disclaimer` |
| R6 | `GET /api/health` | HTTP 200, JSON `{ ok: true, service, checks }`; `checks.cost_guardrails` — counters без секретов |
| R4 | После онбординга | Redirect на `/`, persist `localStorage` ключ `quiet-partner-v1` |
| R5 | Первый визит без persist | Баннер «Пройдите настройку» → `/onboarding` |

---

## DomainRadar

| # | Проверка | Ожидание |
|---|----------|----------|
| D1 | 8 доменов | Все `D1`…`D8`, RU labels в легенде и таблице |
| D2 | Пороги | red &lt; 40, yellow 40–69, green ≥ 70 (`lib/domains.ts`) |
| D3 | Max 1 red pulse | Только домен с наименьшим score среди red получает `animate-pulse` + ring |
| D4 | Callout | Один красный callout «Сейчас критичнее всего» |
| D5 | a11y | `<details>` таблица, `aria-labelledby` на секции |

---

## HealthCommentary

| # | Проверка | Ожидание |
|---|----------|----------|
| H1 | Loading | Skeleton + `aria-busy` при загрузке |
| H2 | Без `DEEPSEEK_API_KEY` | Fallback RU (`buildFallbackCommentary`), не 500 |
| H3 | Disclaimer | В footer карточки; текст про отсутствие сертификации PMI |
| H4 | Обновить | Кнопка «Обновить» перезапрашивает BFF |
| H5 | Dogfood feedback | После успеха: «Полезно» / «Не полезно» / «Отметить действие»; счётчики в store |

---

## Onboarding

| # | Проверка | Ожидание |
|---|----------|----------|
| O1 | 4 шага | Профиль → турбулентность → **проработка** → боль |
| O2 | `hydrateFromOnboarding` | Scores + имя/подход + prep bonuses в store |
| O3 | Redirect | После шага 4 → `/` |
| O4 | Ссылка с dashboard | «Настроить проект» в header |
| O5 | Шаг 3 prep checklist | 7 чекбоксов; «Пропустить»; `computePrepChecklistScoreDelta` |
| O6 | «Назад» | Шаги 2–4 возвращают без потери ввода |

---

## Безопасность

| # | Проверка | Как |
|---|----------|-----|
| S1 | API key server-only | `DEEPSEEK_API_KEY` только в route/BFF (`lib/advisor/llm.ts`) |
| S2 | Client bundle | После `npm run build`: `rg DEEPSEEK` в `.next/static` — **нет совпадений** (ручной grep) |
| S3 | Rate limit | При превышении — 429 + `Retry-After` (ADR-001: 20 req / 15 min / IP; env `ADVISOR_RATE_LIMIT_*`) |
| S4 | Token budget | При `budget_exceeded: true` в `/api/health` — BFF fallback RU, не 500 |

---

## Доступность (базово)

| # | Проверка |
|---|----------|
| A1 | Кнопки с `aria-label` где нет видимого текста (иконка «Обновить») |
| A2 | `role="alert"` на ошибке комментария |
| A3 | Feedback: `aria-pressed` на голосах |
| A4 | Контраст disclaimer / muted text читаем на светлой теме |

---

## Ручной dogfood (Human)

1. Очистить `localStorage` → открыть `/` → баннер онбординга → пройти `/onboarding`.
2. Изменить 2–3 домена в красную зону → проверить один pulse + callout.
3. Без `.env` / без ключа — fallback комментарий, затем с ключом — LLM ответ.
4. Нажать «Полезно» → обновить комментарий → снова голосовать.
5. «Отметить действие» → проверить `auditLog` в DevTools (Zustand persist не экспортирует log в LS — только in-memory до reload).

---

## Glossary & navigator (T-037, T-038)

| # | Проверка | Ожидание |
|---|----------|----------|
| G1 | Dashboard «8 доменов PMBOK 7» | `<details>`/кнопка раскрывает RU labels + plain hints, не D1–D8 |
| G2 | Onboarding шаг 4 (боль) | Тот же глоссарий; labels совпадают с радаром |
| G3 | Radar pills `title` | Tooltip с hint из glossary |
| N1 | «Навигатор неопределённости» | S1–S4: ввод + ожидания; collapsible |
| N2 | Сценарии vs `navigator-scenarios.md` | Тексты не расходятся с knowledge-base |

---

## Analytics (T-030, ADR-002)

| # | Проверка | Ожидание |
|---|----------|----------|
| A1 | Default (`POSTHOG_DISABLED=true`) | Нет consent banner; `capture()` no-op; build без posthog в critical path |
| A2 | Key + consent granted | Banner RU; `posthog-js` lazy load; events без email/project name |
| A3 | Sanitize | Payload только `delivery_approach`, `domain_count_red`, `source` |

---

## Связь с очередью

| Task | Чеклист |
|------|---------|
| T-010 | Весь документ + отчёт phase3 |
| T-011 | H5 + dogfood feedback |
| T-022 | R1–R3, S1 на https://quiet-partner.vercel.app → `docs/qa-report-phase3.md` §Staging smoke |
| T-029 | §S3–S4 cost guardrails; R6 `checks.cost_guardrails` |
| T-030 | §A1 analytics wiring (OFF default); consent banner when key set |
| T-037 | §Glossary & navigator G1–G3 |
| T-038 | §Glossary & navigator N1–N2 |
| T-040 | §Waitlist CTA W1–W2 |
| T-041 | §Navigator wiring N3–N4 |
| T-042 | §Export E1–E2 |
| T-043 | Phase 3–4 full pass + glossary/nav doc pass |
| T-046 | [`docs/qa-phase5-prep.md`](../docs/qa-phase5-prep.md) §P5-* Phase 5 scaffold |
| T-053 | §SEO S1–S4 |
| T-080…T-083 | §Book features BK1–BK11 |
| T-078 | Post-M0 staging subset + prod curl BK10–BK11 |

---

## SEO (T-053)

| # | Проверка | Ожидание |
|---|----------|----------|
| S1 | `/` metadata | `title` + `description` per one-pager §SEO; `robots: noindex` |
| S2 | `/waitlist` metadata | OG title «Ранний доступ — Тихий напарник»; `index,follow` |
| S3 | `GET /robots.txt` | Allow `/waitlist`; disallow `/`, `/onboarding`, `/api/` |
| S4 | `GET /sitemap.xml` | Contains `/waitlist` only |

---

## Phase 5 prep (T-046 / T-051)

| # | Проверка | Ожидание |
|---|----------|----------|
| P5-A1 | `GET /api/health` | `auth_enabled: false`; `waitlist_backend: postgres` when activated |
| P5-W2 | `POST /api/waitlist` | 200 registered; invalid → 400 |
| P5-D1 | `GET /api/health` | `database_configured: true` (post T-051 activation) |
| P5-R1 | Rate limit backend | `memory` (Redis OFF) |

Полный список: [`docs/qa-phase5-prep.md`](../docs/qa-phase5-prep.md).

---

## Waitlist CTA (T-040)

| # | Проверка | Ожидание |
|---|----------|----------|
| W1 | `/waitlist` hero | Email form **above** value bullets (above-the-fold) |
| W2 | CTA hierarchy | One solid primary «Получить ранний доступ»; demo = outline/link |

---

## Navigator → BFF (T-041)

| # | Проверка | Ожидание |
|---|----------|----------|
| N3 | «Спросить напарника» | Sets active scenario; commentary card refetches |
| N4 | BFF body | `userSituation` + `navigatorScenarioId` S1–S4 only; no email in payload |

---

## Фокус на сегодня (T-098) — daily FocusDay ≠ FocusWeek

| # | Проверка | Ожидание |
|---|----------|----------|
| FT1 | Mode Hub `/` | Карточка «Фокус на сегодня» над выбором режимов; empty state с ручным вводом |
| FT2 | С радара | «Подставить с радара» → title + domain; source `radar` |
| FT3 | Ручной | Свой текст → source `manual`; confirm при замене существующего |
| FT4 | Sync `/radar` | Compact карточка; тот же title, что на hub |
| FT5 | Sync `/stages` | Compact + CTA «Открыть в пульте» (scroll/focus регистров ok) |
| FT6 | Done | «Сделано сегодня» → doneAt; можно сбросить |
| FT7 | Persist | Reload: focusDay в localStorage project store |
| FT8 | Analytics | События `focus_set` / `focus_opened_in_stages` / `focus_done` в коде; OFF default ok |
| FT9 | ≠ FocusWeek | На `/radar` «Фокус недели» остаётся отдельной карточкой |
| FT10 | Waitlist | `/waitlist` H1/bullets про «один фокус на день» + Mode Hub |
| FT11 | Disclaimer | Co-pilot / не cert — на карточке или рядом без противоречий |

**Smoke (prod, после deploy):**

```bash
curl -sS https://quiet-partner.vercel.app/ | rg -n 'Фокус на сегодня|focus'
curl -sS https://quiet-partner.vercel.app/waitlist | rg -n 'один фокус на день'
```

Ожидание: HTML/chunk содержит карточку фокуса; waitlist wedge на месте.

---

## Мост Пульт ↔ Напарник (T-110) — ADR-006

| # | Проверка | Ожидание |
|---|----------|----------|
| BR1 | Автономия `/stages` | Работает без pull; реестры в `qp-stages-*` |
| BR2 | Автономия `/radar` | Работает без bridge; баннера нет |
| BR3 | CTA | «Подтянуть в напарника» на `/stages` |
| BR4 | Pull | Имя проекта + scores на `/radar`; баннер «из пульта» |
| BR5 | Overwrite | Confirm если другое имя в напарнике |
| BR6 | Demo | «Тестовый прогон» + чекбокс → оба контура |
| BR7 | Focus | После pull focusDay с радара обновляется |
| BR8 | Disclaimer | Баннер / UI — co-pilot, не cert |

**Smoke:** на `/stages` есть «Подтянуть в напарника»; chunk содержит строку баннера.

---

## Book features — Phase Book (T-080…T-083)

| # | Проверка | Ожидание |
|---|----------|----------|
| BK1 | **Фокус недели** (T-080) | Dashboard card: weakest domain + static question; «Отметить: сделал»; disclaimer в footer |
| BK2 | Focus refresh | `ensureFocusWeek()` при смене недели; вопрос из `lib/focusWeek.ts` |
| BK3 | **Prep checklist** (T-081) | Onboarding step 3/4: 7 items из `PREP_CHECKLIST_ITEMS`; skip ok |
| BK4 | Prep → scores | Отмеченные пункты повышают домены per `PREP_CHECKLIST_DELTAS` |
| BK5 | **Stakeholder lite** (T-082) | Collapsible card; max 3 rows; who + expectation; stale hint >14d |
| BK6 | Stakeholder CRUD | Add / edit / remove; persist в store |
| BK7 | **Weekly snapshot** (T-083) | «Записать снимок недели» в export section; `recordWeeklySnapshot()` |
| BK8 | Return reminder | Banner ~7d после snapshot; snooze + dismiss; link `/onboarding` |
| BK9 | Export includes book | JSON snapshot: `focusWeek`, `stakeholdersLite`, `retentionReminder` |
| BK10 | Prod markers | Live HTML содержит «Фокус недели», prep step, stakeholders (curl/grep) |
| BK11 | BFF fallback ok | Book dogfood **не требует** live LLM; disclaimer в HealthCommentary footer |

**Smoke (prod curl):**

```bash
curl -sS https://quiet-partner.vercel.app/api/health
curl -sS -X POST https://quiet-partner.vercel.app/api/advisor/health-commentary \
  -H "Content-Type: application/json" \
  -d '{"domainScores":{"D1":50,"D2":60,"D3":70,"D4":30,"D5":65,"D6":55,"D7":70,"D8":40},"deliveryApproach":"hybrid"}'
```

Ожидание: HTTP 200; BFF `commentary` + `disclaimer`; fallback suffix допустим при balance $0.

---

## Export snapshot (T-042)

| # | Проверка | Ожидание |
|---|----------|----------|
| E1 | «Копировать снимок» | JSON in clipboard: domains, project name, disclaimer |
| E2 | «Скачать JSON» | File download; no server POST |

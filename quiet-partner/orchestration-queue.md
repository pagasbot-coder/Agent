# Orchestration Queue (Muster) — Quiet Partner

> **Источник истины для задач.** PM / Senior PM добавляют задачи; роли берут `READY` → `IN_PROGRESS` → `DONE`.  
> Перед любой работой агент **читает этот файл**; после завершения — **обновляет статус и краткий итог**.

**Проект:** Тихий напарник / Quiet Partner (PMBOK 7 co-pilot)  
**Архитектор (Human):** Pavel  
**Последнее обновление:** 2026-06-07 (T-044…T-046 **DONE** — waitlist API stub, LS migrate doc, QA Phase 5 prep)

> **PM rhythm:** PM обновляет [`docs/pm-status.md`](docs/pm-status.md) **еженедельно** и на каждом phase gate (G0→1 … G4→5). Journal фиксирует каждый review.

---

## Как пользоваться (Cursor 3)

| Роль | Subagent | Чат | Правило |
|------|----------|-----|---------|
| PM | `muster-pm` | «Role: PM» | `@role-pm` |
| **Senior PM** | — | «Role: Senior PM» / «Роль: Старший PM» | `@role-senior-pm` |
| IT-Architect | `muster-it-architect` | «Role: IT-Architect» | `@role-it-architect` |
| Developer | `muster-developer` | «Role: Developer» | `@role-developer` |
| UI/UX | `muster-ui-ux` | «Role: UI/UX» | `@role-ui-ux` |
| QA | `muster-qa` | «Role: QA» | `@role-qa` |
| Growth | `muster-growth-marketer` | «Role: Growth» | `@role-growth-marketer` |

Контекст: `@knowledge-base/product-brief.md`, `@knowledge-base/pmbok-domain-playbook.md`, `@docs/implementation-plan.md`, `@docs/technical-specification.md`.

---

## Статусы

| Статус | Значение |
|--------|----------|
| `BACKLOG` | Идея, ещё не готова |
| `READY` | Можно взять в работу |
| `IN_PROGRESS` | В работе (роль + агент) |
| `BLOCKED` | Ждёт Architect / Human |
| `DONE` | Выполнено |
| `CANCELLED` | Отменено |

---

## Активная очередь (Phase 3–4)

| ID | Задача | Роль | Статус | Приоритет | Зависимости | Контекст (@files) | Итог / PR |
|----|--------|------|--------|-----------|-------------|-------------------|-----------|
| T-001 | Bootstrap Next.js 16 + Tailwind + shadcn + Muster skeleton | Developer | DONE | P0 | — | `@docs/tech-stack.md` | `quiet-partner/` scaffold; home placeholder; rules; `.env.example`; `lib/systemPrompt.ts` stub |
| T-002 | Phase 0 discovery: ICP, JTBD, metrics, stop criteria | PM | DONE | P0 | T-001 | `@knowledge-base/product-brief.md` `product-decisions.md` | ICP v1; brief v1; desk/dogfood AC; без интервью |
| T-003 | PMBOK domain playbook v0 (8 domains, health signals RU) | Senior PM | DONE | P0 | T-001 | `@knowledge-base/pmbok-domain-playbook.md` `navigator-scenarios.md` | v1 playbook; пороги 70/40; регрессия AI |
| T-004 | ADR: LLM BFF (DeepSeek/Gemini), secrets, rate limits | IT-Architect | DONE | P0 | T-001 | `adr-001-llm-bff.md` `architecture.md` | ADR-001 + threat model stub |
| T-005 | Spike: DomainRadar UI (8 wedges, mock scores) | Developer | DONE | P1 | T-003 | `@docs/technical-specification.md` §3.2, §7.1 | `components/DomainRadar.tsx` — Recharts 8 wedges, RU labels, legend, a11y table |
| T-006 | Zustand store: domain scores + project context | Developer | DONE | P1 | T-005 | `@docs/technical-specification.md` §3.3, §5, §7.2 | `lib/store/useProjectStore.ts` + `lib/domains.ts`; persist localStorage |
| T-007 | API `/api/advisor/health-commentary` BFF + HealthCommentary UI | Developer | DONE | P1 | T-004, T-006 | `@lib/systemPrompt.ts` `@docs/technical-specification.md` §3.4–3.5, §6, §7.3–7.4 | BFF route + `HealthCommentary.tsx`; DeepSeek + fallback |
| T-008 | Onboarding flow spec (questions → initial radar) | PM / UI/UX | DONE | P1 | T-002, T-003 | `@docs/onboarding-spec.md` | 3 шага + глоссарий 8 доменов; UI T-009 BACKLOG |
| T-009 | Onboarding UI: 3-step wizard → hydrate store | Developer | DONE | P1 | T-008, T-006 | `@docs/onboarding-spec.md` | `/onboarding` wizard; `lib/onboarding.ts`; header link «Настроить проект» |
| T-010 | QA: prod/smoke checklist + phase3 report | QA | DONE | P0 | T-009 | `@knowledge-base/qa-checklist.md` `@docs/qa-report-phase3.md` | build/lint PASS; checklist RU; compile smoke |
| T-011 | Dogfood: feedback UI (👍/👎 + «Отметить действие») | Developer / QA | DONE | P0 | T-007, T-010 | `CommentaryFeedback.tsx` | UI + persist; Human 3–5 сессий → T-014 |
| T-012 | Align health thresholds 40/70 (code + playbook + QA) | Senior PM + Developer | DONE | P0 | T-010 | `@lib/domains.ts` `@components/DomainRadar.tsx` `@knowledge-base/pmbok-domain-playbook.md` `@docs/technical-specification.md` §3.2 | `THRESHOLD_RED=40`; DomainRadar import; qa-checklist §D2; build/lint PASS |
| T-013 | Browser smoke + Phase 3 sign-off (extend qa-report) | QA | DONE | P0 | T-012 | `@knowledge-base/qa-checklist.md` `@docs/qa-report-phase3.md` | Browser smoke 3002 PASS with notes; qa-report §Browser smoke; compile+smoke sign-off |
| T-014 | Dogfood sessions 1–5: протокол + log template | PM | DONE | P0 | T-011 | `@docs/dogfood-log-template.md` `@knowledge-base/dogfood-protocol.md` | Protocol + log + brief links; сессии 1–5 = **Human OPTIONAL** |
| T-015 | M0 go/no-go memo + competitive scan 1-pager | PM | DONE | P0 | T-014 | `@docs/m0-go-no-go-memo.md` `@docs/competitive-scan-1pager.md` | PM-черновики готовы; sign-off + evidence = Human |
| T-016 | Navigator prompt regression (4 scenarios) | Senior PM + QA | DONE | P1 | T-012 | `@docs/prompt-regression-T-016.md` | Static PASS; live LLM — Human + API key |
| T-017 | ADR analytics (PostHog OSS) Phase 4 | IT-Architect | DONE | P1 | T-004 | `@knowledge-base/architecture.md` `@docs/implementation-plan.md` Phase 4 | `adr-002-analytics-posthog.md`; PostHog impl — backlog после G3→4 |
| T-018 | Deploy staging (Vercel) + env runbook | Developer + DevOps | DONE | P1 | T-013 | `@docs/deploy-staging.md` `@knowledge-base/adr-001-llm-bff.md` | `docs/deploy-staging.md`; alias https://quiet-partner.vercel.app; build PASS; DevOps smoke S1–S3; QA full subset + `DEEPSEEK_API_KEY` in Vercel → Human OPTIONAL |
| T-019 | Landing / waitlist one-pager | Growth | DONE | P2 | T-015, T-017 | `@knowledge-base/product-brief.md` `@docs/implementation-plan.md` Phase 4 | `docs/landing-waitlist-one-pager.md` — hero, bullets, waitlist H1, AARRR Phase 4; route — после M0 Go |
| T-020 | UX reference notes (productmap.io, no login) | UI/UX | DONE | P1 | T-013 | `@docs/ux-reference-productmap.md` `@docs/onboarding-spec.md` | `docs/ux-reference-productmap.md` (RU, 6 секций); adopt/reject; handoff §6 → T-021 |
| T-021 | Design tokens refresh from T-020 | Developer | DONE | P1 | T-020 | `@knowledge-base/design-tokens.md` (stub) `@docs/ux-reference-productmap.md` §6 | §6 tweaks: card tier, CTA hierarchy, onboarding labels; `design-tokens.md` v1; build/lint PASS |
| T-022 | Staging smoke (Vercel subset) | QA | DONE | P0 | T-018 | `@knowledge-base/qa-checklist.md` `@docs/qa-report-phase3.md` §Staging smoke | https://quiet-partner.vercel.app — GET `/`, `/onboarding` 200; POST BFF 200 + JSON; no API key in page source — **PASS** |
| T-023 | Static waitlist page `/waitlist` | Developer | DONE | P1 | T-019, T-021, T-022 | `@docs/landing-waitlist-one-pager.md` `@knowledge-base/design-tokens.md` | `app/waitlist/page.tsx` — RU hero, 3 bullets, email CTA (demo ack), demo link, footer disclaimer; build/lint PASS |
| T-024 | PostHog client stub OFF by default (ADR-002) | Developer | DONE | P2 | T-017, T-023 | `@knowledge-base/adr-002-analytics-posthog.md` `.env.example` | `lib/analytics/posthog.ts` no-op; `AnalyticsProvider` passthrough; `.env.example` POSTHOG_DISABLED; build/lint PASS |
| T-025 | Redeploy staging (Vercel) — `/waitlist` live | Developer + DevOps | DONE | P0 | T-023 | `@docs/deploy-staging.md` | `vercel --prod --yes` → quiet-partner.vercel.app; build `/waitlist`; GET `/waitlist` 200 |
| T-026 | QA waitlist verify on staging | QA + DevOps | DONE | P0 | T-025 | `@docs/landing-waitlist-one-pager.md` `@knowledge-base/qa-checklist.md` `@docs/qa-report-phase3.md` | Redeploy `vercel --prod` после `DEEPSEEK_API_KEY` в Vercel; GET `/waitlist` 200; POST BFF 200 **live LLM** (без fallback-сuffix); §Waitlist staging в qa-report |
| T-027 | `GET /api/health` liveness endpoint | Developer | DONE | P1 | T-018 | `@docs/deploy-staging.md` `@knowledge-base/qa-checklist.md` | `app/api/health/route.ts`; boolean env checks; qa-checklist R6; deploy S6; build/lint PASS |
| T-028 | Dashboard ↔ waitlist nav + onboarding banner hydration | Developer | DONE | P2 | T-023, T-009 | `@components/DashboardShell.tsx` `@docs/qa-report-phase3.md` | «Ранний доступ» → `/waitlist`; `usePersistHydrated` — no banner flash; build/lint PASS |
| T-029 | API cost guardrails (Phase 4) | Developer | DONE | P1 | T-027, T-004 | `@knowledge-base/adr-001-llm-bff.md` `@lib/advisor/costGuardrails.ts` | `costGuardrails.ts`; ADR-001 15min rate limit; token budgets; health snapshot; build/lint PASS |
| T-030 | PostHog event wiring + consent (ADR-002) | Developer | DONE | P1 | T-024, T-029 | `@knowledge-base/adr-002-analytics-posthog.md` `@lib/analytics/` | call sites wired; consent banner; dynamic posthog-js; OFF default; build/lint PASS |
| T-031 | PostHog self-host compose + runbook (ADR-002) | Developer + DevOps | DONE | P1 | T-030 | `@docs/posthog-self-host.md` `docker/posthog/docker-compose.yml` | runbook RU; hobby script + local compose; no secrets in git; Human VPS OPTIONAL |
| T-032 | Phase 5 roadmap doc (auth/DB/billing BLOCKED) | PM + Developer | DONE | P1 | T-015 | `@docs/roadmap-phase5.md` | scope draft BLOCKED until M0; P5-ADR placeholders; no Phase 5 app code |
| T-037 | Dashboard domain glossary (RU labels + tooltips) | Developer | DONE | P2 | T-009, T-021 | `@components/DomainGlossary.tsx` | RU labels; radar tooltips; onboarding reuse |
| T-038 | Navigator scenarios reference panel (static S1–S4) | Developer | DONE | P2 | T-016 | `@components/NavigatorScenariosPanel.tsx` | Dashboard collapsible S1–S4 |
| T-039 | T-014 dogfood protocol + brief links | Developer | DONE | P1 | T-011 | `@knowledge-base/dogfood-protocol.md` | 5-step protocol; brief + log cross-links |
| T-040 | Waitlist hero CTA above-the-fold polish | Developer | DONE | P2 | T-023, T-021 | `@docs/landing-waitlist-one-pager.md` | hero email card above bullets; CTA hierarchy; build/lint PASS |
| T-041 | Navigator scenario → BFF userSituation wiring | Developer | DONE | P2 | T-038, T-007 | `@lib/navigatorScenarios.ts` | «Спросить напарника» → BFF userSituation; refetch |
| T-042 | Export project snapshot (clipboard JSON) | Developer | DONE | P2 | T-006 | `@lib/exportProjectSnapshot.ts` | clipboard + JSON download; no backend |
| T-043 | QA Phase 3–4 full checklist pass doc | QA | DONE | P0 | T-040…T-042 | `@docs/qa-report-phase3.md` | §Phase 3–4 full pass PASS; checklist T-040…T-042 |
| T-033 | ADR auth + env contract (ADR-003 Accepted) | IT-Architect | DONE | P0 | T-032 | `@knowledge-base/adr-003-auth-phase5.md` | Auth.js v5 + PostgreSQL adapter; OSS choice signed |
| T-034 | PostgreSQL schema spike (Drizzle draft) | Developer | DONE | P0 | T-033 | `@lib/db/schema.ts` `@docs/phase5-schema-draft.md` | No live DB; no migrations |
| T-035 | Auth scaffold (middleware + routes; AUTH off) | Developer | DONE | P1 | T-033 | `auth.ts` `middleware.ts` `.env.example` | `AUTH_ENABLED=false` default; `/login` placeholder |
| T-036 | BFF rate limit → Redis/Upstash | Developer + DevOps | DONE | P1 | T-034 | `@lib/advisor/redisRateLimit.ts` `@docs/redis-rate-limit-T-036.md` | Redis OFF default; in-memory fallback; no prod keys |

---

## Backlog (post-M0 — activation Human MUST)

> PM groom 2026-06-07 sprint 3. **T-044…T-046 DONE** (safe OFF-by-default). Live DB / AUTH / Redis / Listmonk — Human MUST. Dogfood G2→3 open (4/5, 2 useful).

| ID | Задача | Роль | Статус | Приоритет | Зависимости | Контекст | Notes |
|----|--------|------|--------|-----------|-------------|----------|-------|
| T-044 | Waitlist API stub (`POST /api/waitlist`, noop/file) | Developer | DONE | P1 | T-023 | `@lib/waitlist/store.ts` `@app/api/waitlist/route.ts` | Form wired; no Listmonk; build/lint PASS |
| T-045 | localStorage → server migrate design + env flag | PM + Developer | DONE | P1 | T-034 | `@docs/localstorage-migrate-phase5.md` | `MIGRATE_LOCALSTORAGE_ON_LOGIN=false` |
| T-046 | QA Phase 5 prep checklist | QA | DONE | P0 | T-035, T-036, T-044 | `@docs/qa-phase5-prep.md` | AUTH/Redis/DB OFF smoke |
| T-047 | ADR-004 DB host draft (P5-ADR-2 Neon lean) | IT-Architect | DONE | P1 | T-034 | `@knowledge-base/adr-004-db-host-phase5.md` | Draft; Human picks Neon/Supabase |
| T-048 | PostHog VPS deploy + Vercel keys | DevOps | BACKLOG | P2 | M0 Go | `@docs/posthog-self-host.md` | Human OPTIONAL |
| T-049 | Live LLM prompt regression (4 scenarios) | Senior PM + QA | BACKLOG | P1 | staging key | `@docs/prompt-regression-T-016.md` | Static PASS done |
| T-050 | Dogfood session **#5** (+1 useful) **или** waiver G2→3 | Human + PM | BACKLOG | P0 | T-014 | `@docs/dogfood-session-guides.md` | 4/5 done, 2 useful — Human only |
| T-051 | Drizzle migrate + waitlist `postgres` backend | Developer | DONE | P1 | T-047 | `@lib/db/` `drizzle/` | Drizzle client; waitlist_signups postgres; db:push runbook; noop default; build/lint PASS |
| T-052 | `POST /api/projects/migrate-from-local` | Developer | BACKLOG | P2 | T-045, AUTH on | `@docs/localstorage-migrate-phase5.md` | BLOCKED |

---

## Детали задач

### T-001 — Foundation scaffold

**Acceptance criteria:**
- [x] `quiet-partner/` с Next.js 16 App Router + TypeScript + Tailwind v4
- [x] Placeholder home «Тихий напарник / Quiet Partner»
- [x] `.cursor/rules/` — muster-orchestration + role-senior-pm
- [x] `orchestration-queue.md`, `knowledge-base/`, `docs/implementation-plan.md`
- [x] `.env.example` с `DEEPSEEK_API_KEY`; `lib/systemPrompt.ts`

**Notes:** Полный DomainRadar и LLM — T-005…T-007. Stack **не Vite** (исправление DeepSeek диалога).

---

### T-002 — Phase 0 discovery

**Acceptance criteria:**
- [x] ICP (1 primary persona) + anti-persona → `product-decisions.md`
- [x] JTBD + problem statement в `product-brief.md`
- [x] 3 success metrics с baseline/target
- [x] MVP In/Out для Phase 1 spike
- [x] Stop criteria если нет traction за 4 нед discovery
- [x] Desk research + competitive scan (шаблон в brief; 1-pager — Human по мере dogfood)
- [x] Dogfood notes: шаблон в brief
- [x] Протокол воркшопа PM + Senior PM (tailoring в playbook)

**Product Map phase:** Strategy + Generation + Analysis

**Validation:** desk research + dogfood + воркшопы — **без внешних интервью**.

**TZ:** [`technical-specification.md` §1, §8](../docs/technical-specification.md#1-назначение-и-область)

---

### T-003 — PMBOK domain playbook v0

**Acceptance criteria:**
- [x] 8 доменов с RU labels и plain-language описанием
- [x] Green/Amber/Red сигналы; пороги 70/40 согласованы с ТЗ
- [x] Tailoring notes: predictive / adaptive / hybrid
- [x] Review `getSystemPrompt()` — questions-first, no compliance claims
- [x] `navigator-scenarios.md` — 4 эталонных кейса

**TZ:** [`technical-specification.md` §3.2, §3.5](../docs/technical-specification.md#32-фаза-2-domainradar)

---

### T-004 — LLM ADR

**Acceptance criteria:**
- [x] ADR в `knowledge-base/adr-001-llm-bff.md`
- [x] Server-only keys; env contract с `.env.example`
- [x] Provider fallback (DeepSeek primary; fallback RU в `lib/advisor.ts`)
- [x] Rate limit + logging policy (no PII in logs)

**TZ:** [`technical-specification.md` §2, §4.1, §6](../docs/technical-specification.md#2-архитектура-и-стек)

---

### T-005 — DomainRadar spike

**Acceptance criteria:**
- [ ] Компонент radar/chart (Recharts или SVG) — 8 доменов
- [ ] Mock data из store или constants
- [ ] Accessible labels RU; mobile ≥375px
- [ ] Пороги green/amber/red; max 1 red callout

**TZ:** [`technical-specification.md` §3.2, §7.1](../docs/technical-specification.md#32-фаза-2-domainradar)

---

### T-006 — Zustand store

**Acceptance criteria:**
- [ ] Store: `domainScores`, `projectMeta`, `deliveryApproach`
- [ ] Actions: setScore, hydrate from onboarding (stub)
- [ ] TypeScript types exported

**TZ:** [`technical-specification.md` §3.3, §5, §7.2](../docs/technical-specification.md#33-фаза-2-zustand-store)

---

### T-007 — HealthCommentary spike

**Acceptance criteria:**
- [ ] `POST /api/advisor/health-commentary` — validates input, calls LLM server-side
- [ ] UI card: loading / error / commentary text
- [ ] Uses `getSystemPrompt()` + domain context from store
- [ ] Disclaimer: «не сертификация PMBOK»

**TZ:** [`technical-specification.md` §3.4–3.5, §6, §7.3–7.4](../docs/technical-specification.md#34-фаза-2-bff-apiadvisor)

---

### T-008 — Onboarding spec

**Acceptance criteria:**
- [x] 5–8 вопросов (plain language) → initial domain scores
- [x] Flow step list в `docs/onboarding-spec.md`
- [x] AC for future UI task T-009 (not in this pass)
- [x] Глоссарий 8 доменов (hover copy)

**TZ:** [`technical-specification.md` §3.6, §7.6](../docs/technical-specification.md#36-фаза-3-onboarding)

---

### T-009 — Onboarding UI

**Acceptance criteria:**
- [x] Route `/onboarding` — 3 шага (профиль, турбулентность, боль)
- [x] RU copy из `docs/onboarding-spec.md`
- [x] Прогресс 1/3, 2/3, 3/3
- [x] `hydrateFromOnboarding()` + redirect `/`
- [x] Ссылка «Настроить проект» в header dashboard
- [x] Zustand persist localStorage

---

### T-010 — QA smoke Phase 3

**Acceptance criteria:**
- [x] `knowledge-base/qa-checklist.md` (RU): build, routes, radar, commentary, onboarding, security, a11y
- [x] `docs/qa-report-phase3.md` с pass/fail после `npm run build` + `npm run lint`
- [x] `npm run build` && `npm run lint` green (2026-05-30)
- [ ] Manual: BFF без ключа → fallback (Human dogfood)
- [ ] Senior PM sign-off prompt regression (`navigator-scenarios.md`)

**Product Map phase:** Delivery (4) — Quality gate

**Notes:** G2→3 partial — browser smoke + PM sign-off остаются на Human.

---

### T-011 — Dogfood feedback UI (North Star)

**Acceptance criteria:**
- [x] После загрузки комментария: «Полезно» / «Не полезно»
- [x] «Отметить действие» → `logAction()` с RU текстом
- [x] Счётчики feedback в localStorage (`commentaryFeedback` persist)
- [x] Баннер «Пройдите настройку» при отсутствии `quiet-partner-v1` в LS
- [ ] 3–5 сессий dogfood Human (см. roadmap; не блокирует UI DONE)

**Product Map phase:** People + Delivery (4)

**Notes:** Сессии Human + `DEEPSEEK_API_KEY` — после `npm run dev`. Исполнение сессий → **T-014**.

---

### T-012 — Align health thresholds 40/70

**Acceptance criteria:**
- [ ] `lib/domains.ts`: `THRESHOLD_RED = 40` (было 30); `THRESHOLD_GREEN = 70` без изменений
- [ ] `components/DomainRadar.tsx`: убрать hardcode `30` — использовать константы из `lib/domains.ts`
- [ ] `knowledge-base/qa-checklist.md` §D2 и `docs/qa-report-phase3.md` — red &lt;40, amber 40–69, green ≥70
- [ ] Playbook v1 (`pmbok-domain-playbook.md`) и ТЗ §3.2 — без расхождений с кодом
- [ ] `npm run build` && `npm run lint` green после правок
- [ ] Senior PM: подтвердить, что сценарии `navigator-scenarios.md` не ломаются визуально (amber band шире)

**Product Map phase:** Delivery (4) — Quality / consistency

**Notes (Developer):** тривиальный diff (~5 строк). Файлы: `lib/domains.ts`, `DomainRadar.tsx` (строки ~73–74), опционально комментарий в `domains.ts`. Не менять onboarding baseline `NEUTRAL_BASELINE = 70` без PM.

**Owner split:** Developer — код + QA checklist sync; Senior PM — sign-off playbook wording.

---

### T-013 — Browser smoke + Phase 3 sign-off

**Acceptance criteria:**
- [ ] `npm run dev` → ручной проход `knowledge-base/qa-checklist.md` §1–§7 в браузере (Chrome/Edge)
- [ ] Маршруты: `/`, `/onboarding`; redirect после onboarding; баннер «Пройдите настройку» без LS
- [ ] DomainRadar: 8 доменов, legend, a11y table; пороги после T-012
- [ ] HealthCommentary: loading → текст; fallback без `DEEPSEEK_API_KEY`; 👍/👎 persist
- [ ] Обновить `docs/qa-report-phase3.md`: секция «Browser smoke» с pass/fail + дата
- [ ] Вердикт QA: **PASS** / **PASS with notes** / **FAIL** (blockers → Developer)
- [ ] Sign-off строка: «Phase 3 compile + browser smoke» для gate G2→3

**Product Map phase:** Delivery (4) — Quality gate

**Depends:** T-012 (пороги должны совпадать с чеклистом до финального smoke)

---

### T-014 — Dogfood sessions 1–5 (протокол + log)

**Acceptance criteria:**
- [ ] `knowledge-base/dogfood-protocol.md`: цель, длительность 30–45 мин, 5 шагов (onboarding → radar → commentary → 👍 → 1 решение) — *опционально; чеклист в `docs/dogfood-log-template.md`*
- [x] `docs/dogfood-log-template.md`: таблица сессий #1–5 (дата, проект, useful Y/N, действие, заметки; R8 bias note)
- [ ] Ссылка из `product-brief.md` и `docs/team-assignments.md`
- [x] Human: **4 из 5** сессий проведено (2026-05-31); **2 useful** — G2→3 **blocked** (нужно ≥3 useful или waiver)
- [x] PM: journal queue — dogfood sync 2026-06-07 (4/5, 2 useful)

**Product Map phase:** People + Delivery (4)

**Notes:** Human Architect исполняет; PM владеет шаблонами. `DEEPSEEK_API_KEY` локально (D2 в pm-status). **IN_PROGRESS** = шаблоны; сессии не блокируют T-022/T-023.

---

### T-015 — M0 go/no-go + competitive scan

**Acceptance criteria:**
- [x] `docs/m0-go-no-go-memo.md` (≤2 стр.): **Go / Pause / Pivot**; критерии gates; evidence placeholders; **[Human: sign-off]**
- [x] `docs/competitive-scan-1pager.md`: Notion AI, Jira/Atlassian intelligence, MS Project, exam trainers, Linear — таблица «мы / они / gap»
- [x] Обновить `docs/pm-status.md` (черновики; gate M0 — pending Human)
- [ ] Human sign-off (Pavel) в memo footer + финальное решение Go/Pause/Pivot
- [ ] Journal queue: решение M0 после sign-off

**Product Map phase:** Strategy (1) + Analysis (3)

**Depends:** T-014 partial (≥2 сессии для черновика; ≥3 для финального Go на G2→3)

**Deadline:** нед 2 плана (13.06.2026)

---

### T-016 — Navigator prompt regression

**Acceptance criteria:**
- [ ] Прогон 4 сценариев из `knowledge-base/navigator-scenarios.md` с live BFF (`DEEPSEEK_API_KEY`) — **WAIVE:** `.env.local` нет; Human
- [x] Таблица: scenario ID | pass/fail | notes — `docs/prompt-regression-T-016.md` (static S1–S4 **PASS**)
- [x] Senior PM sign-off: **prompt regression PASS (static)**; правки rules 6–8 в `systemPrompt.ts`
- [x] QA cross-check: disclaimer «не сертификация PMBOK» — `DEFAULT_DISCLAIMER` UI+BFF **PASS**
- [x] Результат в `docs/qa-report-phase3.md` §Prompt regression

**Product Map phase:** Delivery (4) — LLM quality (R7)

**Depends:** T-012 (контекст порогов в prompt)

---

### T-017 — ADR analytics (PostHog OSS)

**Acceptance criteria:**
- [ ] `knowledge-base/adr-002-analytics-posthog.md`: self-host vs cloud; events MVP (onboarding_complete, commentary_loaded, feedback_thumb)
- [ ] Privacy: no PII in events; cookie/consent note для RU
- [ ] Env contract: `NEXT_PUBLIC_POSTHOG_KEY`, host URL — в `.env.example` stub
- [ ] Связь с North Star metrics в `product-brief.md`
- [ ] Architect sign-off; PM review scope Phase 4

**Product Map phase:** Strategy (1) + Delivery (4) instrumentation

**Notes:** Pre-work; PostHog **instrumentation** — отдельная Developer task после G3→4 (не T-020 UX).

---

### T-018 — Deploy staging (Vercel) + env runbook

**Acceptance criteria:**
- [x] `docs/deploy-staging.md`: Vercel project, env vars (`DEEPSEEK_API_KEY` server-only), preview URL
- [x] Staging URL доступен для dogfood (Human OPTIONAL) без localhost — https://quiet-partner.vercel.app
- [x] DevOps: secrets не в git; home + onboarding 200; BFF fallback 200
- [x] QA smoke на staging (subset checklist) — **→ T-022** (URL https://quiet-partner.vercel.app)

**Product Map phase:** Delivery (4) — Product Ops

**Gate:** **READY** — PM: staging **параллельно** dogfood; **закрытие G2→3** по-прежнему требует ≥3 useful dogfood + M0 Human sign-off (`docs/pm-governance.md`).

**Notes:** Не эскалировать Human для старта; prod URL / budget — Human MUST.

---

### T-019 — Landing / waitlist one-pager

**Acceptance criteria:**
- [x] `docs/landing-waitlist-one-pager.md`: hero, ICP hook, waitlist CTA
- [x] AARRR: Acquisition slice only; analytics events из ADR-002 (reference only)
- [ ] PM review: не exam-prep positioning; anti-persona respected *(Growth draft ready)*
- [x] **Не** implement landing route (→ Developer task после M0 Go + PM READY)

**Product Map phase:** Generation (2) + Growth

**Gate:** **READY** — черновик copy без Human; T-015 memo sign-off не блокирует draft.

---

### T-020 — UX reference (productmap.io, no login)

**Acceptance criteria:**
- [x] `docs/ux-reference-productmap.md`: структура IA, паттерны карточек/радара/типографики
- [x] Источники: **публичный** сайт [productmap.io](https://www.productmap.io/) + [app.productmap.io](https://app.productmap.io/) landing — **без** логина
- [x] Маппинг на Quiet Partner: DomainRadar, HealthCommentary card, onboarding steps
- [x] RU summary: что берём / что не берём (exam-prep, enterprise PMO)
- [x] Ссылка на `knowledge-base/product-brief.md` anti-persona
- [x] Handoff Developer: 5 Tailwind/shadcn tweaks (§6 → T-021)

**Product Map phase:** Generation (2) — UX patterns

**Notes:** UI/UX **не** просит credentials. Figma/PDF от Human — опционально, вне AC.

---

### T-021 — Design tokens refresh (post T-020)

**Acceptance criteria:**
- [ ] Обновить `knowledge-base/design-tokens.md` (или создать v1): colors, spacing, radius, card, typography
- [ ] Согласовать с `docs/ux-reference-productmap.md` и ТЗ §3.1
- [ ] Не ломать существующие компоненты без smoke: `npm run build` && `npm run lint` green
- [ ] PM sign-off в journal (визуальная согласованность с brief)

**Product Map phase:** Generation (2) + Delivery (4)

**Depends:** T-020 DONE

**Notes:** Минимальный diff в `app/globals.css` / tailwind theme — только по AC tokens.

---

### T-022 — QA staging smoke (Vercel)

**Acceptance criteria:**
- [x] Base URL: **https://quiet-partner.vercel.app** (production alias staging)
- [x] Subset `knowledge-base/qa-checklist.md`: **R1–R3**, **S1** (page source spot check; R4–R5, H1–H3, D1–D2 — localhost T-013 / Human dogfood)
- [x] `GET /onboarding` 200; persist после онбординга — **MANUAL** (не в subset smoke; redirect проверен localhost T-013)
- [x] `POST /api/advisor/health-commentary` 200 + disclaimer (fallback RU; ключ в Vercel optional)
- [x] Секция **«Staging smoke»** в `docs/qa-report-phase3.md`: pass/fail, дата, blockers → Developer
- [x] Вердикт: **PASS**

**Product Map phase:** Delivery (4) — Quality gate

**Depends:** T-018 DONE

**Notes:** Не эскалировать Human для ключа; live LLM на staging — OPTIONAL. Блокирует публичный demo CTA в T-023 только при **FAIL** с blockers.

---

### T-023 — `/waitlist` static page (marketing stub)

**Acceptance criteria:**
- [x] Route `app/waitlist/page.tsx` (или `/waitlist`) — **статическая** RU страница
- [x] Copy из `docs/landing-waitlist-one-pager.md`: hero, 3 bullets, primary CTA label, anti-persona footer disclaimer
- [x] Secondary CTA «Посмотреть demo» → https://quiet-partner.vercel.app
- [x] Стили по `knowledge-base/design-tokens.md` + существующие shadcn/tailwind паттерны
- [x] `npm run build` && `npm run lint` green
- [x] **Без** Listmonk/API/form backend (email capture — inline «Спасибо, записали в очередь (демо)»)
- [x] Не exam-prep positioning; disclaimer PMI в footer

**Product Map phase:** Generation (2) + Growth (Acquisition)

**Depends:** T-019 DONE

**Gate:** PM **waives** M0 Go для **marketing stub only** (не multi-tenant, не billing). Полный waitlist backend — после M0 Human sign-off.

**Notes:** Параллельно T-022; не ждать dogfood.

---

### T-024 — PostHog stub OFF by default (ADR-002)

**Acceptance criteria:**
- [x] `lib/analytics/posthog.ts` (или эквивалент): init **no-op** когда `NEXT_PUBLIC_POSTHOG_KEY` пуст или `POSTHOG_DISABLED=true`
- [x] `.env.example`: `NEXT_PUBLIC_POSTHOG_KEY=`, `NEXT_PUBLIC_POSTHOG_HOST=`, `POSTHOG_DISABLED=true` (default off)
- [x] События ADR-002 (`onboarding_complete`, `feedback_*`, …) — заглушки export, без send до Phase 4 consent
- [x] Документировать в комментарии: self-host Phase 4 per `adr-002-analytics-posthog.md`
- [x] `npm run build` && `npm run lint` green; нет posthog в client bundle при disabled

**Product Map phase:** Delivery (4) — instrumentation prep

**Depends:** T-017 DONE; **рекомендуется** после T-022 PASS

**Notes:** BACKLOG до T-022 PASS → **READY** после T-023 DONE. Параллельно T-025.

---

### T-025 — Redeploy staging (Vercel) after `/waitlist`

**Acceptance criteria:**
- [x] Deploy на https://quiet-partner.vercel.app включает route `/waitlist` (T-023)
- [x] `GET https://quiet-partner.vercel.app/waitlist` → **200**
- [x] Секреты не в git; `.vercel/` в `.gitignore`
- [x] Обновить дату deploy в `docs/deploy-staging.md` TL;DR (опционально)

**Product Map phase:** Delivery (4) — Product Ops

**Depends:** T-023 DONE

**Notes:** `vercel --yes` из каталога `quiet-partner/` или push в connected branch. Не ждать M0 / dogfood. Live LLM key — Human OPTIONAL.

---

### T-026 — QA waitlist verify on staging

**Acceptance criteria:**
- [ ] Base URL: **https://quiet-partner.vercel.app/waitlist** (после T-025 deploy)
- [ ] Copy vs `docs/landing-waitlist-one-pager.md`: hero, 3 bullets, primary CTA label, anti-persona footer disclaimer
- [ ] Secondary CTA «Посмотреть demo» → корректный URL (vercel.app `/` или onboarding)
- [ ] Email submit → inline demo ack (без backend); no secrets in page source
- [ ] Секция **«Waitlist staging smoke»** в `docs/qa-report-phase3.md`: pass/fail, дата
- [ ] Вердикт: **PASS** / **PASS with notes** / **FAIL** (blockers → Developer)

**Product Map phase:** Delivery (4) — Quality gate

**Depends:** T-025 DONE (deploy с `/waitlist`)

**Notes:** Subset checklist; не блокирует T-024. FAIL только при 404/blocker deploy.

---

### T-027 — `GET /api/health` liveness

**Acceptance criteria:**
- [x] Route `app/api/health/route.ts` — JSON `{ ok: true, service, version, timestamp, checks }`
- [x] Boolean env checks only (`deepseek_api_key_configured`, `posthog_disabled`); no secret values
- [x] `knowledge-base/qa-checklist.md` §R6; `docs/deploy-staging.md` §S6
- [x] `npm run build` && `npm run lint` green

**Product Map phase:** Delivery (4) — Product Ops

---

### T-028 — Nav polish + onboarding banner hydration

**Acceptance criteria:**
- [x] Dashboard header link «Ранний доступ» → `/waitlist`
- [x] Onboarding banner waits for Zustand persist hydration (`usePersistHydrated`) — no flash on return visit
- [x] `docs/qa-report-phase3.md` risk note updated
- [x] `npm run build` && `npm run lint` green

**Product Map phase:** Generation (2) + Delivery (4)

---

### T-029 — API cost guardrails (Phase 4)

**Acceptance criteria:**
- [x] `lib/advisor/costGuardrails.ts` — rate limit per IP (ADR-001: 20 / 15 min, env-configurable)
- [x] Optional daily/weekly token budgets; fallback RU when exceeded (not 500)
- [x] `recordTokenUsage()` after LLM response; no PII in logs
- [x] `GET /api/health` → `checks.cost_guardrails` snapshot (counters only)
- [x] `.env.example` + `deploy-staging.md` env contract
- [x] `qa-checklist.md` §S3–S4; `architecture.md` cost abuse row
- [x] `npm run build` && `npm run lint` green

**Product Map phase:** Delivery (4) — Measurement / R2 mitigation

**Notes:** In-memory per serverless instance; Redis/Postgres — Phase 5. Per-user budget after auth.

---

### T-036 — BFF rate limit → Redis/Upstash

**Acceptance criteria:**
- [x] `lib/advisor/redisRateLimit.ts` — Upstash sliding window; `REDIS_URL`+`REDIS_TOKEN` OFF by default
- [x] `costGuardrails.ts` — `checkRateLimitAsync()` Redis first, in-memory fallback; per-user key when `userId` passed
- [x] BFF route async rate limit; 429 + `Retry-After` unchanged (ADR-001)
- [x] `GET /api/health` → `redis_rate_limit_*` + `rate_limit_backend` snapshot
- [x] `.env.example` + `docs/redis-rate-limit-T-036.md` + `deploy-staging.md` env row
- [x] No prod Redis keys in repo; Human activation documented
- [x] `npm run build` && `npm run lint` green; `vercel --prod`

**Product Map phase:** Phase 5 prep — R2 mitigation (shared rate limit)

**Notes:** Token budgets remain in-memory until Phase 5 activation. PostHog docker Redis is not Upstash REST.

---

### T-030 — PostHog event wiring + consent (ADR-002)

**Acceptance criteria:**
- [x] Call sites: onboarding, commentary refresh, feedback 👍/👎, action_logged, waitlist view/submit
- [x] `sanitizeAnalyticsProperties` — whitelist `delivery_approach`, `domain_count_red`, `source` only
- [x] `AnalyticsConsent` RU banner; init only after consent + key + `POSTHOG_DISABLED !== true`
- [x] Dynamic `posthog-js` import — no bundle impact when disabled (default)
- [x] `npm run build` && `npm run lint` green

**Product Map phase:** Delivery (4) — instrumentation

**Depends:** T-024 DONE

**Notes:** Self-host PostHog deploy — DevOps Phase 4; events no-op until key + consent.

---

### T-031 — PostHog self-host compose + runbook

**Acceptance criteria:**
- [x] `docs/posthog-self-host.md`: VPS hobby script, local compose, Vercel env contract, events table
- [x] `docker/posthog/docker-compose.yml` — reference stack; no committed secrets
- [x] Link from `deploy-staging.md` and ADR-002
- [x] Optional — не требует Human credentials для merge

**Product Map phase:** Delivery (4) — Product Ops

---

### T-032 — Phase 5 roadmap (BLOCKED scope)

**Acceptance criteria:**
- [x] `docs/roadmap-phase5.md`: auth, PostgreSQL, billing, waitlist backend — **BLOCKED until M0**
- [x] G4→5 gate criteria; P5-ADR placeholders; draft T-033+ без READY
- [x] `docs/roadmap.md` cross-link; **no** auth/Postgres implementation
- [x] pm-governance Human MUST #2 referenced

**Product Map phase:** Planning — Phase 5 prep

---

## Журнал (лог решений)

| Дата | Кто | Событие |
|------|-----|---------|
| 2026-05-30 | Developer | T-001 DONE: bootstrap `quiet-partner/`; stack Next.js 16 (не Vite); Muster + implementation-plan |
| 2026-05-30 | PM (plan) | Phase 0–4 roadmap в `docs/implementation-plan.md`; T-002…T-008 заведены |
| 2026-05-30 | PM | v1.1: `technical-specification.md` (ТЗ); plan RU; Phase 0 без интервью; Banya refs удалены; T-002 AC обновлены |
| 2026-05-30 | Developer | T-005…T-007 DONE: Phase 2 spike — DomainRadar, Zustand, BFF, HealthCommentary, home layout |
| 2026-05-30 | Developer | T-009 DONE: `/onboarding` 3-step wizard, score mapping, dashboard link |
| 2026-05-30 | PM | **PM: контроль проекта** — `docs/pm-status.md` v1.0; T-010 IN_PROGRESS (QA); T-011 READY (dogfood); gate G2→3; weekly pm-status на phase gates |
| 2026-05-30 | QA | T-010 DONE: `qa-checklist.md`, `qa-report-phase3.md`; build/lint PASS |
| 2026-05-30 | QA | T-011 DONE: `CommentaryFeedback`, store feedback, onboarding banner |
| 2026-05-30 | PM | **Grooming T-012…T-019:** gate G2→3; раздача ролям; drift 30/70→40/70 → T-012; `docs/team-assignments.md` |
| 2026-05-30 | Developer | T-012 DONE: пороги 40/70 в `domains.ts` + `DomainRadar`; qa-checklist sync |
| 2026-05-30 | Developer/QA | T-013 DONE: build/lint PASS; browser smoke localhost:3002; qa-report §Browser smoke |
| 2026-05-30 | IT-Architect | T-017 DONE: ADR-002 PostHog self-host vs Plausible vs none; events MVP; privacy EU; Next.js 16 sketch; architecture.md v0.2 |
| 2026-05-30 | Senior PM + QA | T-016 DONE: static prompt regression PASS; `docs/prompt-regression-T-016.md`; `systemPrompt` rules 6–8; live BFF → Human (no `.env.local`) |
| 2026-05-30 | PM | T-015 DONE (PM deliverables): `docs/competitive-scan-1pager.md`, `docs/m0-go-no-go-memo.md` (черновики, [Human: sign-off]) |
| 2026-05-30 | PM | T-014: `docs/dogfood-log-template.md` — шаблон готов; сессии 1–5 = Human |
| 2026-05-30 | PM | **PM-led governance** (`docs/pm-governance.md`): Human MUST vs OPTIONAL; T-018 READY (staging ∥ dogfood); T-019/T-020 READY; T-021 BACKLOG; WBS 2 нед в `team-assignments.md` |
| 2026-05-30 | UI/UX | T-020 DONE: `docs/ux-reference-productmap.md`; onboarding-spec cross-link; T-021 READY (§6 handoff) |
| 2026-05-30 | Developer | T-021 DONE: design tokens v1 (`knowledge-base/design-tokens.md`); §6 card/CTA/onboarding polish; build/lint PASS |
| 2026-05-30 | Growth | T-019 DONE: `docs/landing-waitlist-one-pager.md` — RU hero, 3 bullets, waitlist H1 (≥12% CR), AARRR Acquisition hook; landing route → Dev после M0 Go |
| 2026-05-30 | DevOps | T-018 DONE: `docs/deploy-staging.md`; `vercel --yes` → https://quiet-partner.vercel.app; build PASS; QA staging subset pending; `DEEPSEEK_API_KEY` в Vercel → Human OPTIONAL |
| 2026-05-30 | QA | T-022 DONE: staging smoke https://quiet-partner.vercel.app — GET `/`, `/onboarding` 200; POST BFF 200 + JSON; no API key in page source; `qa-report-phase3.md` §Staging smoke **PASS** |
| 2026-05-30 | PM | **Sprint week 2 groom:** T-014 OPTIONAL (не блокирует спринт); **T-023 READY** (M0 waive stub); **T-024 BACKLOG** (PostHog off); `pm-status` v1.4 + `team-assignments` WBS; root T-019 mirror |
| 2026-05-30 | Developer | T-023 DONE: `/waitlist` static landing; copy from one-pager; inline demo submit; link `/`; build/lint PASS |
| 2026-05-30 | Developer | T-024 DONE: PostHog stub OFF (`lib/analytics/posthog.ts`, `AnalyticsProvider`); `.env.example` POSTHOG_DISABLED; build/lint PASS |
| 2026-05-30 | DevOps | T-025 DONE: `vercel --prod --yes`; GET `/waitlist` 200 на quiet-partner.vercel.app; deploy-staging.md updated |
| 2026-05-30 | PM | **Human «идите дальше»:** sprint без блокеров; **T-025 READY** (redeploy `/waitlist`); **T-026 READY** (QA waitlist staging); **T-024 → READY**; `pm-status` v1.5 «Вопросы к Human» — только OPTIONAL (API key Vercel, M0 sign-off) |
| 2026-05-30 | DevOps | T-026 DONE: `vercel deploy --prod` после `DEEPSEEK_API_KEY` в Vercel; GET `/waitlist` 200; POST BFF live LLM; qa-report §Waitlist staging |
| 2026-05-30 | Developer | T-027 DONE: `GET /api/health` liveness; qa-checklist R6; deploy-staging S6; build/lint PASS |
| 2026-05-30 | Developer | T-028 DONE: dashboard «Ранний доступ» → `/waitlist`; `usePersistHydrated` fixes onboarding banner race |
| 2026-05-30 | Developer | T-029 DONE: `lib/advisor/costGuardrails.ts`; ADR-001 15min rate limit; token budgets; health snapshot; build/lint PASS |
| 2026-05-30 | Developer | T-030 DONE: PostHog wiring + consent; call sites; sanitize; dynamic posthog-js; OFF default; build/lint PASS; redeploy staging |
| 2026-05-30 | Developer + DevOps | T-031 DONE: `docs/posthog-self-host.md` + `docker/posthog/docker-compose.yml`; ADR-002 OSS optional |
| 2026-05-30 | PM + Developer | T-032 DONE: `docs/roadmap-phase5.md` — Phase 5 BLOCKED until M0 + Human scope sign-off |
| 2026-05-30 | Developer | Sprint 3: T-037 glossary + tooltips; T-038 navigator panel; T-039 dogfood-protocol; T-014 templates DONE |
| 2026-05-30 | PM + Developer | Sprint 4: T-040 waitlist CTA; T-041 navigator→BFF; T-042 export snapshot; T-043 QA full pass |
| 2026-06-07 | Developer (prep) | M0 evidence из qa-report; `dogfood-session-guides.md` #1–#3; post-M0 BACKLOG T-033…T-047; root T-019 mirror sync |
| 2026-05-31 | Human (Pavel) | Dogfood **#1** — Проект 1; сессия завершена |
| 2026-05-31 | Human (Pavel) | Dogfood **#2** — Проект 2; сессия завершена |
| 2026-05-31 | Human (Pavel) | Dogfood **#3** — Проект 3; сессия завершена |
| 2026-05-31 | Human (Pavel) | Dogfood **#4** — Проект 4; сессия завершена |
| 2026-06-07 | PM (dogfood sync) | Human report **4/2** → **4/5 сессий, 2 useful** (👍); G2→3 **blocked** (нужно ≥3 useful); M0 Go blocked до +1 useful или waiver |
| 2026-06-07 | PM | Human «погнали дальше» — Phase 5 prep sprint без dogfood gate; **T-033 READY** → Architect |
| 2026-06-07 | IT-Architect | T-033 **DONE**: ADR-003 **Accepted** — Auth.js v5 + PG adapter |
| 2026-06-07 | Developer | T-034 **DONE**: `lib/db/schema.ts` Drizzle draft; `phase5-schema-draft.md` v0.2 |
| 2026-06-07 | Developer | T-035 **DONE**: auth scaffold (`AUTH_ENABLED=false`); middleware stub; `/api/auth/*` 503 when off |
| 2026-06-07 | PM | **T-036 READY** (Redis/Upstash); activation (`DATABASE_URL`, AUTH on) — Human MUST |
| 2026-06-07 | Developer + DevOps | T-036 **DONE**: `redisRateLimit.ts`; `checkRateLimitAsync`; Redis OFF default; `redis-rate-limit-T-036.md`; build/lint PASS; vercel --prod |
| 2026-06-07 | PM | Sprint 3 groom: **T-044…T-046 READY** → safe OFF-by-default; T-048+ renumber post-M0 |
| 2026-06-07 | Developer | T-044 **DONE**: `POST /api/waitlist` noop; form wired; health `waitlist_backend` |
| 2026-06-07 | PM + Developer | T-045 **DONE**: `localstorage-migrate-phase5.md`; env `MIGRATE_LOCALSTORAGE_ON_LOGIN` |
| 2026-06-07 | QA | T-046 **DONE**: `qa-phase5-prep.md`; qa-checklist §Phase 5 prep |
| 2026-06-07 | IT-Architect | T-047 **DONE**: ADR-004 DB host draft (Neon lean) |
| 2026-06-07 | Developer | T-051 **DONE**: `lib/db/index.ts` Neon HTTP; waitlist postgres; `drizzle/` + `db:push`; health `database_configured`; noop default |

---

## Правила для всех агентов

1. **Старт:** прочитать этот файл → одна задача `READY` своей роли → `IN_PROGRESS`.
2. **ТЗ:** технические AC — в `@docs/technical-specification.md`; план — `@docs/implementation-plan.md`.
3. **Финиш:** `DONE` + «Итог / PR» + обновить `docs/roadmap.md` при смене scope.

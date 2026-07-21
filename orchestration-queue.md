# Orchestration Queue (Muster)

> **Источник истины для задач.** PM добавляет задачи; роли берут `READY` → `IN_PROGRESS` → `DONE`.  
> Перед любой работой агент **читает этот файл**; после завершения — **обновляет статус и краткий итог**.

**Проект:** Muster monorepo + Banya-Digital ERP  
**Архитектор (Human):** Pavel  
**Последнее обновление:** 2026-07-21 (assistants placement: User Rules / product-copilot / Agent)

> **Очередь приложения (канон):** [`banya-digital/orchestration-queue.md`](banya-digital/orchestration-queue.md) — Phase 3 задачи **T-009…T-014** (auth, CRM CRUD, finance input, inventory, checklists, pilot reglement).

---

## Как пользоваться (Cursor 3)

| Роль | Subagent | Чат в Agents Window | Правило |
|------|----------|---------------------|---------|
| PM | `muster-pm` | «Role: PM» | `@role-pm` |
| IT-Architect | `muster-it-architect` | «Role: IT-Architect» / «Role: Architect» / «Роль: Главный ИТ-Архитектор» | `@role-it-architect` |
| Developer | `muster-developer` | «Role: Developer» | `@role-developer` |
| UI/UX | `muster-ui-ux` | «Role: UI/UX» | `@role-ui-ux` |
| QA | `muster-qa` | «Role: QA» | `@role-qa` |
| Growth / CMO | `muster-growth-marketer` | «Role: CMO» / «Role: Growth» / «Роль: Директор по маркетингу» / «Growth Marketer» | `@role-growth-marketer` |
| DevOps / SRE | `muster-devops` | «Role: DevOps» / «Role: DevOps Engineer» / «Роль: Senior DevOps Engineer» / «Role: SRE» | `@role-devops` |
| SME | `muster-sme` | «Role: SME» / «Role: Business Consultant» / «Роль: Прожжённый отраслевой бизнес-консультант» / «Role: Industry Expert» | `@role-sme` |

Контекст из `knowledge-base/` подключайте через **@** (например `@knowledge-base/product-brief.md`).

**Work 3:** параллельные роли — в отдельных агентах/ветках; перед merge сверить очередь и `knowledge-base/`.

---

## Статусы

| Статус | Значение |
|--------|----------|
| `BACKLOG` | Идея, ещё не готова к работе |
| `READY` | Можно взять в работу |
| `IN_PROGRESS` | В работе (указать роль и агента) |
| `BLOCKED` | Ждёт решения архитектора |
| `DONE` | Выполнено |
| `CANCELLED` | Отменено |

---

## Активная очередь

| ID | Задача | Роль | Статус | Приоритет | Зависимости | Контекст (@files) | Итог / PR |
|----|--------|------|--------|-----------|-------------|-------------------|-----------|
| T-001 | Инициализировать Next.js + Tailwind + shadcn | Developer | DONE | P0 | — | `@docs/tech-stack.md` | Next.js 16 + Tailwind v4 + shadcn; `npm run build`/`lint` OK |
| T-002 | Заполнить product-brief и acceptance criteria | PM | BACKLOG | P0 | — | `@knowledge-base/product-brief.md` | |
| T-003 | Базовая дизайн-система (цвета, типографика, layout) | UI/UX | READY | P1 | T-001 | `@knowledge-base/design-tokens.md` | |
| T-007 | Dashboard KPI по залам/выручке/марже + RU + d1a брендинг | UI/UX | DONE | P0 | T-001 | `@knowledge-base/design-tokens.md` | Cardo+Inter, hall/revenue/margin UI, seed week/month |
| T-004 | Чеклист QA для scaffold | QA | READY | P2 | T-001 | `@knowledge-base/qa-checklist.md` | |
| T-009 | Finance: unit economics по залам за сегодня | Developer | DONE | P0 | T-006 | `modules/finance/` | `/finance` из Prisma: revenue, COGS, margin; RU + Table |
| T-010 | CRM: гости + брони на сегодня | Developer | DONE | P0 | T-006 | `modules/crm/` | `/crm` guests + today bookings |
| T-011 | Operations: тайминги spa + kitchen SLA | Developer | DONE | P0 | T-006 | `modules/operations/` | `/operations` timings, kitchen status, link to dashboard checklists |
| T-012 | Docs: management + technical overview | Developer | DONE | P1 | T-009…011 | `docs/*.md` | Обновлены overview + roadmap + GITHUB-DEPLOY |
| T-013 | GitHub push + Vercel deploy | Developer | BLOCKED | P0 | T-012 | `docs/GITHUB-DEPLOY.md` | commit ba47cdc; build OK; блокер: `gh auth login` + `vercel login` (репо на GitHub не создан) |
| T-017 | iGaming BiJi Phase 2: product-brief Ops Scan + problem interviews | PM | DONE | P0 | — | `iGaming BiJi/knowledge-base/product-brief.md` `iGaming BiJi/knowledge-base/problem-interviews-script.md` | Variant A primary, C fallback; см. `iGaming BiJi/orchestration-queue.md` |
| T-018 | iGaming BiJi Phase 2: ADR-001 data ingestion + internet research | IT-Architect | DONE | P0 | T-017 | `iGaming BiJi/knowledge-base/adr-001-data-ingestion.md` `iGaming BiJi/knowledge-base/phase2-internet-research.md` | CSV-first + Affilka Reports API v0; T-003 research pack ready |
| T-019 | **Quiet Partner** — PM-led; G2→3 open | PM | DONE | P1 | — | [`quiet-partner/orchestration-queue.md`](quiet-partner/orchestration-queue.md) | **DONE:** T-001…T-051 code; staging PASS; dogfood 4/5 (2 useful); T-051 activation BLOCKED (env); T-053…T-055 groom; Human: `Human-one-step-database.md` |

---

## Шаблон новой задачи (копировать в таблицу)

```markdown
| T-XXX | Краткое название | PM/Developer/UI/UX/QA | READY | P1 | T-YYY | `@knowledge-base/...` | |
```

---

## Детали задач

### T-009 — Finance module

**Acceptance criteria:**
- [x] `/finance` — реальные данные за сегодня по залам
- [x] Выручка, COGS, маржа %; итоговая строка
- [x] RU UI, Card + Table, d1a стиль

### T-010 — CRM module

**Acceptance criteria:**
- [x] Список гостей из БД
- [x] Брони на сегодня с временем, залом, статусом RU

### T-011 — Operations module

**Acceptance criteria:**
- [x] ProgramTiming + KitchenSlot на сегодня
- [x] Статус CONFICT/SLA виден
- [x] Ссылка на чеклисты (сводка)

### T-012 — Docs polish

**Acceptance criteria:**
- [x] `management-overview.md` — что построено
- [x] `technical-overview.md` — модули finance/crm/operations
- [x] `roadmap.md` Phase 2–3 частично закрыты

### T-013 — Deploy (BLOCKED)

**Notes:** Установить `gh`, `vercel` CLI; `git remote add` + push; Vercel `DATABASE_URL`. См. `docs/GITHUB-DEPLOY.md`.

---

## Журнал (лог решений)

| Дата | Кто | Событие |
|------|-----|---------|
| 2026-05-23 | System | Создана структура Muster |
| 2026-05-23 | Developer | T-001 DONE: Next.js 16 + Tailwind v4 + shadcn/ui scaffold |
| 2026-05-25 | UI/UX | T-007 DONE: dashboard KPI |
| 2026-05-25 | Developer | T-009…T-012 DONE: finance/crm/operations modules + docs; T-013 BLOCKED (CLI) |
| 2026-05-25 | Developer | Hotfix: BUSINESS_TIMEZONE=Europe/Moscow; db:seed на Neon; push master |
| 2026-05-26 | PM | Усилен `@role-pm` + `muster-pm`; Phase 3 T-009…T-014 в `banya-digital/orchestration-queue.md` |
| 2026-05-26 | SME | Добавлен `@role-sme` + `muster-sme`; discovery pipeline SME → CMO/Architect → PM |
| 2026-05-26 | DevOps | Добавлен `@role-devops` + `muster-devops`; runbook template; deploy handoff Architect → DevOps → Developer → QA |
| 2026-05-27 | PM | T-017 DONE: iGaming BiJi Phase 2 — `product-brief.md`, `problem-interviews-script.md`; локальная очередь `iGaming BiJi/orchestration-queue.md` |
| 2026-05-27 | IT-Architect | T-018 DONE (локально T-002): ADR-001, phase2-internet-research, Affilka appendix; T-003 READY + research pack; T-006 CSV parser READY |
| 2026-05-30 | Developer | T-019: bootstrap `quiet-partner/` — Тихий напарник; implementation-plan 14w; local queue T-001 DONE |
| 2026-05-30 | PM | T-019 docs: plan v1.1 RU + `technical-specification.md`; Phase 0 без интервью |
| 2026-05-30 | PM | T-019 PM control: `quiet-partner/docs/pm-status.md`; T-010 QA IN_PROGRESS; gate G2→3 |
| 2026-05-30 | PM | T-019 grooming: T-012…T-019 в `quiet-partner/`; team-assignments; G2→3 раздача |
| 2026-05-30 | Developer | **Banya-Digital PROJECT HOLD:** T-028 paused; code review + hold docs; prod unchanged |
| 2026-05-30 | PM | Quiet Partner: T-022 staging PASS; T-023 READY (M0 waive stub); T-024 BACKLOG; см. `quiet-partner/` journal |
| 2026-06-07 | Developer | Quiet Partner prep: M0 evidence; `dogfood-session-guides.md`; post-M0 BACKLOG; root T-019 → DONE (Human dogfood/M0 pending) |

---

## Phase 4 — Quiet Partner (зеркало)

См. **`quiet-partner/orchestration-queue.md`**, **`quiet-partner/docs/implementation-plan.md`**, **`quiet-partner/docs/pm-status.md`**.

**Статус 2026-06-07:** Phase 3–4 impl **DONE** (T-001…T-043). **Human gate:** dogfood 0/5, M0 unsigned. Phase 5 **BLOCKED**.

| ID | Задача | Роль | Статус |
|----|--------|------|--------|
| T-001…T-043 | Phase 0–4 impl | Dev / PM / QA / … | **DONE** |
| T-014 | Dogfood sessions 1–5 | Human + PM | **OPTIONAL** (0/5) — guides: `docs/dogfood-session-guides.md` |
| T-015 | M0 memo + competitive scan | PM | DONE (drafts; evidence filled; **Human sign-off** ⬜) |
| T-033…T-047 | Post-M0 (auth, DB, waitlist backend) | Architect / Dev | **BACKLOG** — blocked until M0 Go |

---

## Phase 2 — iGaming BiJi (зеркало)

См. **`iGaming BiJi/orchestration-queue.md`**.

| ID | Задача | Роль | Статус |
|----|--------|------|--------|
| T-001 | Product brief + interview script | PM | DONE |
| T-002 | ADR ingest / PII / Affilka | IT-Architect | DONE → `adr-001-data-ingestion.md` |
| T-003 | 5 problem interviews | PM | READY · research pack ready |
| T-006 | CSV parser spec | Developer | READY |

---

## Phase 3 — Banya-Digital (зеркало статусов)

> **PROJECT HOLD (2026-05-30):** разработка и пилот приостановлены. Канон: [`banya-digital/orchestration-queue.md`](banya-digital/orchestration-queue.md) · resume: [`banya-digital/docs/hold-status.md`](banya-digital/docs/hold-status.md)

| ID | Задача | Роль | Статус |
|----|--------|------|--------|
| T-009…T-027 | MVP modules + prod smoke | Dev / QA | DONE |
| T-028 | Pilot Week 1 | Human / Ops | **ON HOLD** (Day 1 ✅; Days 2–7 не завершены) |
| T-024 | YCLIENTS import | Developer | BLOCKED |
| T-015 | Product Map Phase 2 | PM | BACKLOG |

---

## Правила для всех агентов

1. **Старт:** прочитать `orchestration-queue.md` → взять одну задачу `READY` своей роли → поставить `IN_PROGRESS`.
2. **Работа:** использовать `@knowledge-base/*` и правила роли; не брать чужие `IN_PROGRESS`.
3. **Финиш:** статус → `DONE`, заполнить колонку «Итог / PR», при необходимости обновить `knowledge-base/` и `docs/roadmap.md`.
4. **Блокер:** статус → `BLOCKED`, описать причину в «Notes» задачи.

---

## Журнал

| Дата | Событие |
|------|---------|
| 2026-07-21 | Политика ассистентов: User Rules / `product-copilot` / `Agent`. KB `assistants-placement.md`, скрипт `scripts/migrate-local-cursor-assistants.sh`. Фактический copy с Mac — Human (Cloud Agent не видит `~/.cursor` и private `product-copilot`). |
| 2026-07-21 | Мост didactic-doodle ↔ Muster: `skills-muster-bridge.md`, bridge skills в `.agents/skills/{prd-writer,competitor-*}`, `import-didactic-skills.sh`. PM/Growth agents обновлены. Полный import `.productmap` — Human на Mac. |
| 2026-07-21 | Quiet Partner эпик «Фокус на сегодня» T-090…T-100 в `quiet-partner/orchestration-queue.md`. Copywriter: отчёты Human — русский, грамотные предложения (`role-copywriter` / `muster-copywriter`). |

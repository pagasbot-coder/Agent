# Orchestration Queue (Muster)

> **Источник истины для задач.** PM добавляет задачи; роли берут `READY` → `IN_PROGRESS` → `DONE`.  
> Перед любой работой агент **читает этот файл**; после завершения — **обновляет статус и краткий итог**.

**Проект:** Muster monorepo + Banya-Digital ERP  
**Архитектор (Human):** Pavel  
**Последнее обновление:** 2026-05-26 (PM: усилен role-pm; app backlog в `banya-digital/`)

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

---

## Phase 3 — Banya-Digital (зеркало статусов)

См. детали и AC в **`banya-digital/orchestration-queue.md`**.

| ID | Задача | Роль | Статус |
|----|--------|------|--------|
| T-009 | Auth | Developer | BACKLOG |
| T-010 | CRM CRUD | Developer | READY |
| T-011 | Finance input | Developer | READY |
| T-012 | Inventory FIFO UI | Developer | READY |
| T-013 | Operations checklists | Developer | READY |
| T-014 | Pilot reglement | PM | READY |

---

## Правила для всех агентов

1. **Старт:** прочитать `orchestration-queue.md` → взять одну задачу `READY` своей роли → поставить `IN_PROGRESS`.
2. **Работа:** использовать `@knowledge-base/*` и правила роли; не брать чужие `IN_PROGRESS`.
3. **Финиш:** статус → `DONE`, заполнить колонку «Итог / PR», при необходимости обновить `knowledge-base/` и `docs/roadmap.md`.
4. **Блокер:** статус → `BLOCKED`, описать причину в «Notes» задачи.

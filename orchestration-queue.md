# Orchestration Queue (Muster)

> **Источник истины для задач.** PM добавляет задачи; роли берут `READY` → `IN_PROGRESS` → `DONE`.  
> Перед любой работой агент **читает этот файл**; после завершения — **обновляет статус и краткий итог**.

**Проект:** _my-product_  
**Архитектор (Human):** _ваше имя_  
**Последнее обновление:** 2026-05-25 (T-007 DONE)

---

## Как пользоваться (Cursor 3)

| Роль | Subagent | Чат в Agents Window | Правило |
|------|----------|---------------------|---------|
| PM | `muster-pm` | «Role: PM» | `@role-pm` |
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
| T-007 | Dashboard KPI по залам/выручке/марже + RU + d1a брендинг | UI/UX | DONE | P0 | T-001 | `@knowledge-base/design-tokens.md` | Cardo+Inter, hall/revenue/margin UI, seed week/month, `feat(ui): Russian dashboard…` |
| T-004 | Чеклист QA для scaffold | QA | READY | P2 | T-001 | `@knowledge-base/qa-checklist.md` | |

---

## Шаблон новой задачи (копировать в таблицу)

```markdown
| T-XXX | Краткое название | PM/Developer/UI/UX/QA | READY | P1 | T-YYY | `@knowledge-base/...` | |
```

**Поля для PM при постановке:**
- **Acceptance criteria** (ниже в секции задачи или в `knowledge-base/`)
- **Out of scope** — что не делать
- **Definition of Done**

---

## Детали задач

### T-001 — Scaffold Next.js

**Acceptance criteria:**
- [x] `npm run dev` поднимает приложение
- [x] Tailwind + shadcn/ui подключены
- [x] Структура `app/`, `components/`, `lib/` создана

**Notes:** `components.json`, `components/ui/button.tsx`, `lib/utils.ts`; home page uses shadcn Button. Verified: `npm run build`, `npm run lint`.

---

### T-002 — Product brief

**Acceptance criteria:**
- [ ] Заполнены: проблема, аудитория, MVP-фичи, метрики успеха

---

## Журнал (лог решений)

| Дата | Кто | Событие |
|------|-----|---------|
| 2026-05-23 | System | Создана структура Muster |
| 2026-05-23 | Developer | T-001 DONE: Next.js 16 + Tailwind v4 + shadcn/ui scaffold |
| 2026-05-25 | UI/UX | T-007 DONE: dashboard KPI по залам/периодам/марже, RU UI, d1a Cardo+Inter |

---

## Правила для всех агентов

1. **Старт:** прочитать `orchestration-queue.md` → взять одну задачу `READY` своей роли → поставить `IN_PROGRESS`.
2. **Работа:** использовать `@knowledge-base/*` и правила роли; не брать чужие `IN_PROGRESS`.
3. **Финиш:** статус → `DONE`, заполнить колонку «Итог / PR», при необходимости обновить `knowledge-base/` и `docs/roadmap.md`.
4. **Блокер:** статус → `BLOCKED`, описать причину в «Notes» задачи.

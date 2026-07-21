# UX — карточка «Фокус на сегодня»

**Версия:** 1.0 · **Дата:** 2026-07-22 · **Роль:** UI/UX · **Задача:** T-091  
**Язык UI:** RU · **PRD:** [`prd-focus-today.md`](./prd-focus-today.md)  
**Tokens:** [`knowledge-base/design-tokens.md`](../knowledge-base/design-tokens.md)

> **Не путать с `FocusWeekCard`.**  
> «Фокус недели» = weekly (`focusWeek`) на радаре.  
> Эта карточка = **daily** (`focusDay`), одна на hub / radar / stages.

---

## TL;DR

Одна compact-карточка «что делать сегодня»: над плитками режимов на `/`, рядом с недельным фокусом на `/radar`, под полосой имени проекта на `/stages`. Четыре состояния, один solid primary CTA на карточку.

---

## 1. Placement

### Mode Hub `/` (обязательно)

```
┌─────────────────────────────────────────┐
│ Brand · H1 · subtitle                   │
├─────────────────────────────────────────┤
│ ┌─ Фокус на сегодня ─────────────────┐  │  ← FocusTodayCard
│ └────────────────────────────────────┘  │
├──────────────────┬──────────────────────┤
│ Пульт этапов     │ Радар                │
└──────────────────┴──────────────────────┘
│ footer disclaimer                       │
└─────────────────────────────────────────┘
```

- Контейнер: `max-w-3xl`, между `<header>` бренда и grid двух mode tiles (`ModeHub.tsx`).
- На mobile — full width; не схлопывать бренд.

### Radar `/radar`

```
Desktop                          Mobile
┌─ header ─────────────┐         ┌─ header ──┐
├─ onboarding banner? ─┤         ├─ FocusToday ┤  ← сразу под header
├─ DomainRadar │ Health┤         ├─ Radar ───┤
├─ FocusToday ─────────┤  ←      ├─ FocusWeek ┤
│   (над FocusWeek)    │  предпочтительно    │
├─ FocusWeek ──────────┤         ├─ Health ──┤
└──────────────────────┘         └───────────┘
```

- **Предпочтительно:** сразу под header (после onboarding banner), **выше** `FocusWeekCard` — daily важнее weekly в первом экране.
- Альтернатива OK: соседний блок над/рядом с `FocusWeek` (одна колонка, не две competing cards side-by-side на mobile).
- Визуально отличить: заголовок «Фокус **на сегодня**» vs «Фокус **недели**»; без одинаковых badge-цветов подряд без разделителя `gap-4+`.

### Stages `/stages`

```
┌─ header: nav · «Пульт этапов» · описание ─┐
│ [Проект ________] [Тестовый прогон] …     │  ← project name bar
├───────────────────────────────────────────┤
│ ┌─ Фокус на сегодня ───────────────────┐  │  ← сразу под header, до сетки этапов
│ └──────────────────────────────────────┘  │
│ [этапы 0–6]                                │
│ реестры…                                   │
└───────────────────────────────────────────┘
```

- Вставка: начало `<main>` в `StagesShell`, **до** nav этапов.
- Не внутри header и не внутри реестровой карточки.

---

## 2. Card anatomy

```
┌─ Фокус на сегодня ──────────────── [?] ─┐
│ [бейдж источника]  ·  опц. домен         │
│                                          │
│ Title (1–2 строки, semibold)             │
│ Meta: linked stage / «без привязки»      │
│                                          │
│ [ ★ Primary CTA ]   secondary · tertiary │
│                                          │
│ ℹ Co-pilot; не сертификация PMBOK        │
└──────────────────────────────────────────┘
```

| Элемент | Spec |
|---------|------|
| Shell | shadcn `Card`: `rounded-xl border border-border/80 bg-card shadow-sm` |
| Title | `text-base font-semibold` (card title tokens) |
| Focus text | `text-lg` max 2 строки; truncate + title tooltip |
| Badge source | `radar` / `manual` / `stages` — muted outline badge |
| Domain | optional RU label из `lib/domains` (plain language, не «D3») |
| [?] | Tooltip: «Одно действие на сегодня. Не путать с фокусом недели.» |
| Disclaimer | micro footer как у book-cards |

**Компонент (Dev):** `components/FocusTodayCard.tsx` — один shared; mount в ModeHub, DashboardShell, StagesShell.

---

## 3. States

| State | Условие store | UI | Primary CTA |
|-------|---------------|----|-------------|
| **empty** | `focusDay == null` | Placeholder + короткий hint | «Поставить фокус» / «Взять с радара» |
| **from radar** | `source === "radar"` | Badge «С радара» + domain + title | «Открыть в пульте» |
| **manual** | `source === "manual"` \| `"stages"` | Badge «Вручную» / «Из пульта» + title | «Открыть в пульте» (если есть link) **или** «Сделано сегодня» |
| **done today** | `doneAt` = сегодня (local day) | Check + muted title; CTA disabled | «Сделано ✓» (pressed) |

### Переходы (UX)

- Empty → radar: «Взять с радара» (слабый домен / текущий focusWeek-вопрос **не** копировать 1:1 — daily title короче; см. T-092).
- Empty → manual: inline input / sheet «Один фокус» → save.
- Active → done: «Сделано сегодня» → state done; сброс на следующий календарный день (логика store T-092).
- «Обновить с радара» при **manual**: secondary + confirm («Заменить ручной фокус?») — не silent overwrite (AC T-094).

---

## 4. CTA hierarchy (один primary)

На **карточке** в любой момент ровно **один** solid `Button` default:

| Контекст | Primary | Secondary (`outline` / `ghost` sm) |
|----------|---------|-------------------------------------|
| empty | Поставить / Взять с радара | другое действие — ghost |
| active + есть stage link | **Открыть в пульте** | Сделано сегодня · Обновить с радара · Изменить |
| active без link | **Сделано сегодня** | Изменить · Взять с радара |
| done | disabled «Сделано ✓» | Изменить на завтра / Сбросить — ghost |

На Mode Hub mode-tiles остаются своими CTA («Открыть пульт/радар») — они **вне** карточки; карточка не перебивает бренд H1 solid-кнопкой второго уровня на весь экран.

Deep-link «Открыть в пульте»: `/stages` + `linkedStageId` / register query если есть (T-094).

---

## 5. Mobile

- Одна колонка; max content width как у родителя (`max-w-3xl` hub, `max-w-6xl` modes).
- Не добавлять stat strips, dual-card row, icon clusters.
- Primary CTA full-width на &lt;640px; secondary в ряд `flex-wrap gap-2`.
- Hub: карточка не выше ~180px в empty; не раздувать hero.

---

## 6. a11y

- `aria-labelledby` на заголовок карточки.
- Done: primary `aria-pressed="true"`.
- Confirm overwrite — dialog с focus trap (или `window.confirm` MVP ok).
- Focus order: title → body → primary → secondary.

---

## 7. Handoff

### Developer — T-093 / T-094

1. Shared `FocusTodayCard` + props из `focusDay` (T-092).
2. **T-093:** mount в `ModeHub` над mode grid; empty + manual set.
3. **T-094:** тот же компонент в `DashboardShell` (near FocusWeek, не вместо) и `StagesShell` (под project name bar); CTA «Открыть в пульте» + confirm на radar refresh.
4. Не трогать `FocusWeekCard` API; разные store keys.
5. Copy — **не хардкодить финальные строки**: ключи/плейсхолдеры до T-096, затем подставить из [`docs/focus-today-microcopy.md`](./focus-today-microcopy.md) (файл может появиться параллельно).
6. Tokens: card tier + CTA hierarchy из `design-tokens.md`; без новых цветов.

### Copywriter — T-096

Нужны RU-строки (режим «Для UI»):

| Key | Назначение |
|-----|------------|
| `title` | Заголовок карточки |
| `empty.hint` | Пустое состояние |
| `cta.set` / `cta.fromRadar` / `cta.openStages` / `cta.done` / `cta.refreshRadar` / `cta.edit` | Кнопки |
| `badge.radar` / `badge.manual` / `badge.stages` | Бейджи |
| `done.label` | После отметки |
| `confirm.replaceManual` | Подтверждение замены |
| `tooltip.help` | [?] |
| `disclaimer` | Footer (можно reuse `DEFAULT_DISCLAIMER`) |

Согласование: структура этой спеки; тон — calm co-pilot, без Jira/exam. Артефакт: `docs/focus-today-microcopy.md`.

---

## 8. Out of scope (UX)

Мультипроектный серверный фокус, push, второй primary на карточке, замена FocusWeek, dashboard-каша из 3+ book cards в первом viewport hub.

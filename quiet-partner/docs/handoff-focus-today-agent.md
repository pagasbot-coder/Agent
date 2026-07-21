# Handoff: весь продуктовый Quiet Partner → агент продукта / деплоя

**Кому:** Cloud Agent / Developer на **деплое и коде Quiet Partner**  
**От кого:** Agent Ops (Muster / skills)  
**Дата:** 2026-07-21 (v2 — полный scope)  
**Язык отчётов Human:** русский, грамотные предложения (`@role-copywriter`)

---

## TL;DR

1. Тебе принадлежит **весь код и деплой Quiet Partner**, не только «фокус».
2. На `main` уже есть Mode Hub, `/stages`, `/radar`, `FocusWeekCard`, book-доки — **сверь с T-090…T-100**, не пиши с нуля.
3. Эпик **T-090…T-100** («Фокус на сегодня») + **T-101** (UX реестров пульта) + **T-102** (сверка WIP / book-доков с очередью).
4. `didactic-doodle` и Muster/skills — **не твой** scope.

---

## A. Эпик «Фокус на сегодня» (в git)

Канон: [`prd-focus-today.md`](./prd-focus-today.md) · очередь [`../orchestration-queue.md`](../orchestration-queue.md)

| ID | Роль | Статус | Суть |
|----|------|--------|------|
| T-090 | PM | READY | DoR по PRD |
| T-091 | UI/UX | READY | Схема карточки фокуса |
| T-092 | Developer | READY | `focusDay` в store — **сверить с `lib/focusWeek.ts` / FocusWeekCard** |
| T-093 | Developer | BACKLOG | UI на Mode Hub — **ModeHub.tsx уже в main** |
| T-094 | Developer | BACKLOG | Синхрон radar/stages + CTA |
| T-095 | Developer | BACKLOG | PostHog events |
| T-096 | Copywriter | READY | RU-микрокопия |
| T-097 | Growth | READY | Waitlist + competitive scan |
| T-098 | QA | BACKLOG | Smoke |
| T-099 | PM + Human | BACKLOG | Dogfood ×3 |
| T-100 | Copywriter | READY | Вычитка PRD |

Live: https://quiet-partner.vercel.app/ · deploy: `docs/deploy-staging.md`

---

## B. Уже в main (продуктовый агент уже пушил) — не дублировать

| Что | Путь |
|-----|------|
| Mode Hub | `components/ModeHub.tsx`, `app/page.tsx` |
| Пульт этапов | `app/stages/`, `components/stages/`, `lib/stages/` |
| Радар-роут | `app/radar/` |
| Focus week UI | `components/FocusWeekCard.tsx`, `lib/focusWeek.ts` |
| Weekly snapshot | `components/WeeklySnapshotReminder.tsx` |
| ProjectM content | `content/projectm/` |
| Book / GTM docs | `docs/book-p2-dev-handoff-T-080-T-081.md`, `ux-book-features-…`, `gtm-sprint1-drafts-T-073.md`, `waitlist-metrics-spec-T-074.md`, `git-hygiene-T-088.md`, … |
| Lifecycle playbook | `knowledge-base/project-lifecycle-playbook.md` |

---

## C. Задачи вне фокуса (тоже твои)

| ID | Суть | Статус |
|----|------|--------|
| **T-101** | UX реестров пульта: длинный текст читаем (мобильные карточки) | READY · продукт уже начал |
| **T-102** | Сверка book/FocusWeek/stages с очередью: что DONE, что отложить, что завести T-0xx | READY |
| T-069…T-071 | Billing YooKassa | BACKLOG — **не трогать** без Human «можно» |

Book/ProjectM (T-073…T-088 в доках) — **не все ID были в эпике фокуса**. T-102 как раз про это.

---

## D. Порядок работы

1. **T-102** — сверка: FocusWeek vs T-090…T-094; book-доки → очередь или «отложено».  
2. **T-101** — добить UX реестров (уже в работе у продукта).  
3. T-090 / T-096 / T-097 / T-100 (docs).  
4. T-092–T-094 **на базе существующего** FocusWeek/ModeHub.  
5. Деплой Vercel + **T-098**.  
6. T-099 dogfood.

---

## E. Стартовый промпт (v2)

```text
Role: Developer + PM.
Проект quiet-partner. Читай:
@quiet-partner/docs/handoff-focus-today-agent.md
@quiet-partner/docs/prd-focus-today.md
@quiet-partner/orchestration-queue.md

Важно: ModeHub, stages, radar, FocusWeekCard УЖЕ в main — не пиши с нуля.
1) T-102 — сверка FocusWeek/book-доков с T-090…T-100 и статусами.
2) T-101 — UX реестров пульта (мобильные карточки).
3) Эпик фокуса T-090…T-100 — довести поверх существующего кода.
4) Деплой Vercel после UI. Billing T-069…T-071 не трогать без Human.
5) Не трогай didactic-doodle и Muster/skills.
6) Отчёты Human — на русском, ясными предложениями.
7) Обновляй quiet-partner/orchestration-queue.md.
```

---

## F. Разделение агентов

| Поток | Кто | Scope |
|-------|-----|--------|
| **Продукт QP + Vercel** | **Ты** | `quiet-partner/` · T-090…T-102 · book после T-102 |
| **Muster / skills / роли** | Agent Ops | `.cursor/`, `.agents/skills`, import `.productmap` |

Не дублируй `IN_PROGRESS` на одном ID в двух чатах.

---

## G. Definition of Done (минимум)

- [ ] T-102 отчёт: что уже в коде vs очередь  
- [ ] T-101 UX реестров — прогресс или DONE  
- [ ] Фокус T-090…T-098: на staging или явно отложено  
- [ ] Очередь обновлена; отчёт Human на русском  

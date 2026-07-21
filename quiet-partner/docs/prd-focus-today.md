# PRD — Единый «фокус на сегодня»

**Статус:** DoR закрыт (T-090) · Delivery (карточка в коде, T-098 QA)  
**Продукт:** Тихий напарник ([quiet-partner.vercel.app](https://quiet-partner.vercel.app/))  
**Автор прогона:** PM + `/prd-writer` · 2026-07-21  
**DoR:** 2026-07-22 · Редактура (T-100): 2026-07-22  
**Фаза Product Map:** Generation (2) → Delivery (4)

---

## TL;DR

- На проде есть **Mode Hub**: пульт (`/stages`) и радар (`/radar`). Не хватало общего артефакта «что делать сегодня» — это карточка **фокуса дня**.
- Waitlist обещает Ане из агентства: «всё жёлтое → **один фокус на день**».
- Карточка общая для hub / radar / stages, хранится в браузере, события PostHog, без нового backend.
- **Не путать** с «Фокус недели» (`FocusWeekCard` / `focusWeek`) — недельный вопрос по слабому домену на `/radar`.

**DoR (T-090):** закрыт 2026-07-22. Очередь T-091…T-101 согласована.

---

## 1. Problem Statement

**Сейчас:** главная предлагает выбрать режим, но после входа в `/stages` или `/radar` нет общего «одного фокуса дня». Радар даёт вопросы, пульт — реестры; PM снова сам склеивает картину.

**Боль:** при 2–8 проектах и «всё жёлтое» нет приоритета на день.

**Бизнес-эффект:** слабее sticky Mode Hub и расхождение с promise waitlist.

---

## 2. Proposed Solution

Карточка **«Фокус на сегодня»**:

- сигнал с радара (слабый домен / AI) или ручной выбор;
- одно действие в пульте (веха / риск / сторона / чеклист этапа);
- persist в project store (localStorage);
- экспорт в Markdown вместе с пультом (по возможности переиспользовать текущий export).

### User stories

1. Как PM, после радара я вижу один рекомендованный фокус и кнопку «Открыть в пульте».
2. Как PM, в пульте я вижу тот же фокус и могу отметить «сделано сегодня».
3. Как PM, я могу сменить фокус вручную без пересчёта всего радара.

### Success metrics

- ≥40% сессий с открытием обоих режимов ставят или видят фокус (PostHog).
- Dogfood: «понял, что делать сегодня» без отдельного объяснения.

---

## 3. Requirements

### Functional

- Модель: `{ domain?, title, source: radar|manual|stages, linkedStageId?, doneAt? }`
- UI: карточка на hub + синхрон в `/radar` и `/stages`
- CTA: «Открыть в пульте» / «Обновить с радара» / «Сделано сегодня»
- Persist в существующем project store

### Technical

- Zustand + localStorage; без нового backend в MVP
- PostHog: `focus_set`, `focus_opened_in_stages`, `focus_done`
- Не ломать disclaimer и waitlist

### Design / copy

- Одна карточка, без dashboard-каши; RU; mobile-readable hub
- Микрокопия — Chief Editor (T-096)

### Out of scope

- Мультипроектный фокус на сервере, push/email, Jira sync, auth-gate

---

## 4. Risks

| Риск | Митигация |
|------|-----------|
| AI-фокус «мимо» | Ручная смена + questions-first |
| Два источника правды | Один объект в store |
| Размытие messaging | Growth держит wedge «не Jira» (T-097) |

---

## 5. Очередь (Muster)

См. `orchestration-queue.md` — **T-090…T-101**.

| Срез | Статус |
|------|--------|
| T-090…T-097 | DONE (store, UI, analytics, waitlist) |
| T-098 | QA smoke после prod deploy |
| T-099 | Dogfood Human (3 сессии) |
| T-100 | Редактура этого PRD — DONE |
| T-101 | Мобильные карточки реестров пульта |

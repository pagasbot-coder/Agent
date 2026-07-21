# Handoff: эпик «Фокус на сегодня» → агент продукта / деплоя

**Кому:** Cloud Agent / Developer, который сейчас занимается **деплоем Quiet Partner**  
**От кого:** агент оркестрации (Muster / skills / роли) · ветка `cursor/assistants-placement-aaf3`  
**Дата:** 2026-07-21  
**Язык отчётов Human:** русский (см. `@role-copywriter`)

---

## TL;DR

1. Продуктовая работа по фиче **«Фокус на сегодня»** продолжается **у тебя** (не в чате оркестрации агентов).
2. Канон: [`prd-focus-today.md`](./prd-focus-today.md) + очередь **T-090…T-100** в [`../orchestration-queue.md`](../orchestration-queue.md).
3. Live: https://quiet-partner.vercel.app/ (Mode Hub: `/stages` + `/radar` + `/waitlist`).
4. Репозиторий `didactic-doodle` **не трогать** — только читать при необходимости; skills уже импортированы в monorepo `Agent`.

---

## Контекст

На проде есть два режима без общего «фокуса дня». Waitlist обещает Ане «один фокус на день».  
PRD и разбивка по ролям уже в git. Нужна реализация + деплой + QA.

---

## Твой scope (продукт)

| ID | Роль | Что сделать | Статус старта |
|----|------|-------------|---------------|
| T-090 | PM | Закрыть DoR по PRD (файл уже есть) | READY |
| T-091 | UI/UX | Схема карточки hub/radar/stages | READY |
| T-092 | Developer | `focusDay` в Zustand persist | READY |
| T-093 | Developer | UI на Mode Hub | BACKLOG ← 091, 092, 096 |
| T-094 | Developer | Синхрон `/radar` + `/stages` + CTA | BACKLOG |
| T-095 | Developer | PostHog events | BACKLOG |
| T-096 | Copywriter | RU-микрокопия UI | READY |
| T-097 | Growth | Waitlist + competitive scan | READY |
| T-098 | QA | Smoke фокуса | BACKLOG |
| T-099 | PM + Human | Dogfood ×3 | BACKLOG |
| T-100 | Copywriter | Вычитка PRD по-русски | READY |

**Параллельный старт:** T-090, T-091, T-092, T-096, T-097, T-100.  
После деплоя UI — T-098, затем T-099.

### Технические якоря

- Store: `lib/store/useProjectStore.ts`
- Hub: `components/ModeHub.tsx` (или актуальный entry `/`)
- Radar / stages: `app/radar/`, `app/stages/`
- Analytics: `lib/analytics/posthog.ts` (OFF by default ok)
- Staging: https://quiet-partner.vercel.app · runbook `docs/deploy-staging.md`

### Не в scope этого handoff

- Биллинг YooKassa (T-069…T-071 — Human pause)
- Правки Muster-ролей, skills, `.productmap` import — **другой агент**
- Запись в `didactic-doodle`

---

## Стартовый промпт (скопировать в своего агента)

```text
Role: Developer (и по очереди PM/UI/Copywriter/Growth/QA).
Проект: quiet-partner. Читай @quiet-partner/orchestration-queue.md эпик «Фокус на сегодня»
и @quiet-partner/docs/prd-focus-today.md @quiet-partner/docs/handoff-focus-today-agent.md

1) Возьми READY: T-092 (store), параллельно зафиксируй T-090 DoR.
2) Не трогай didactic-doodle и не занимайся Muster/skills.
3) После UI (T-093–T-094) — деплой на Vercel staging и отдай QA T-098.
4) Отчёты Human — на русском, ясными предложениями.
5) Обновляй статусы в quiet-partner/orchestration-queue.md.
```

---

## Разделение агентов

| Поток | Кто | Очередь / docs |
|-------|-----|----------------|
| **Продукт QP + деплой** | **Ты** | `quiet-partner/orchestration-queue.md` T-090… |
| **Muster-роли, skills, импорт, оркестрация** | Агент assistants-placement | `knowledge-base/agent-ops-stream.md`, root queue |

Не дублируй `IN_PROGRESS` на одном `T-0xx` в двух чатах.

---

## Definition of Done эпика (продукт)

- [ ] Фокус ставится, виден на hub / radar / stages, переживает reload
- [ ] CTA в пульт работает
- [ ] PostHog-события заведены (могут быть OFF)
- [ ] Staging smoke PASS
- [ ] Очередь обновлена; краткий итог по-русски для Human

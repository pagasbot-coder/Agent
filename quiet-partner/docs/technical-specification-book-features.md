# Техническое задание — Book track (Alferov features)

**Версия:** 1.0  
**Владелец:** PM + Senior PM  
**Аудитория:** Developer, UI/UX, QA, Senior PM  
**Дата:** 2026-06-13  
**Статус:** Draft (gated — impl после G-Book-P2/P3)

> **Master ТЗ (Phase 0–4):** [`technical-specification.md`](./technical-specification.md)  
> **План book track:** [`implementation-plan-phase-book.md`](./implementation-plan-phase-book.md)  
> **Онбординг (база):** [`onboarding-spec.md`](./onboarding-spec.md)  
> **Roundtable:** [`manager-roundtable-report-2026-06-13.md`](./manager-roundtable-report-2026-06-13.md)

---

## 1. Назначение и область {#1-назначение-и-область}

### 1.1 Назначение

Дополнить MVP **3–5 практичными элементами** из книги П. Алферова (проектный ромб, «проработать проект», стейкхолдеры) — без превращения продукта в методологический тренажёр или PMO-систему. Book track усиливает связь **radar → действие → возврат**.

### 1.2 Scope IN (book track)

| # | Feature | Task | Приоритет | Gate |
|---|---------|------|-----------|------|
| — | GTM sprint + waitlist metrics | T-073, T-074 | P1 | — (Phase 4 cont.) |
| 1 | «Фокус недели» — один вопрос из слабейшего домена | T-080 | P2 | G-Book-P2 |
| 2 | Чек-лист «проработать проект» в онбординге (5–7 пунктов) | T-081 | P2 | G-Book-P2 |
| 3 | Карта стейкхолдеров lite (3 поля) | T-082 | P3 | G-Book-P3 |
| 4 | Еженедельный снимок + напоминание «вернуться через 7 дней» | T-083 | P3 | G-Book-P3 |

**Gate G-Book-P2:** organic waitlist CR **≥12%** за 14 дней **или** explicit waive Human (запись в queue journal).

### 1.3 Scope OUT (anti-scope)

| Вне scope | Причина |
|-----------|---------|
| PMP / exam prep, «галочка PMBOK» | Anti-persona; см. `product-brief.md` |
| Замена Jira, Notion, MS Project | Wedge — co-pilot, не tracker |
| Enterprise PMO (портфели, матрицы, 50+ stakeholders) | MVP discipline |
| Полная методология Алферова (РИМ-III, пентабазис) | Cognitive overload |
| Загрузка файлов, импорт Jira, Telegram-бот | Integrations post-PMF |
| Billing, checkout, Pro CTA в book UI | **Billing paused** Human 2026-06-08 |
| Multi-tenant auth, server persistence book data | Phase 5 — localStorage only |
| Paid ads до organic CR ≥12% | GTM brief H1 |

### 1.4 Роли и трассировка

| Роль | Ответственность |
|------|-----------------|
| PM | AC, gate, queue T-079…T-083 |
| Senior PM | Prompt slice T-080; playbook ↔ domain mapping |
| Developer | Store, UI, BFF extension (если нужен) |
| UI/UX | Card layout, onboarding step, stakeholder form |
| QA | §6 checklist extensions |

---

## 2. User stories и AC {#2-user-stories-и-ac}

### 2.0 GTM sprint (T-073 / T-074) — Phase 4 continuation

**Не book UI**, но **блокирует** P2+. AC — в [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) и T-074 queue entry.

| AC | Критерий |
|----|----------|
| GTM-1 | ≥2 канала с UTM live 14 дней |
| GTM-2 | Weekly snapshot: uniques, signups, CR по source |
| GTM-3 | **Нет** checkout / Pro pricing CTA в постах |

---

### 2.1 F-B1 — «Фокус недели» (T-080)

**User story:**  
*Как PM, я хочу видеть один конкретный вопрос на неделю из самого слабого домена радара, чтобы radar не был «красивой картинкой».*

**Источник:** проектный ромб Алферова — этап «думать о проекте»; PMBOK domain с min score.

| ID | AC |
|----|-----|
| B1.1 | На dashboard карточка **«Фокус недели»** под DomainRadar (или в правой колонке HealthCommentary) |
| B1.2 | Слабейший домен = **min score** among D1…D8; tie-break: priority order D6→D1→D8→… (document in code comment) |
| B1.3 | Один **plain-language RU вопрос** — из playbook indicators слабого домена **или** BFF slice `focusQuestion` (Senior PM approved prompt) |
| B1.4 | Вопрос **стабилен 7 календарных дней** per project (persist `focusWeek` blob — §3) |
| B1.5 | CTA «Отметить: сделал» → `logAction()` + optional score bump +1 на домен (cap 100) |
| B1.6 | Disclaimer visible: co-pilot, не сертификация |
| B1.7 | **Нет** оплаты, upsell, exam jargon |
| B1.8 | Mobile ≥375px; a11y: heading + focusable CTA |

**Out of AC:** multi-question wizard; AI regeneration on every visit (max 1 refresh/week button OPTIONAL — BACKLOG).

---

### 2.2 F-B2 — Чек-лист «проработать проект» (T-081)

**User story:**  
*Как PM на старте, я хочу быстро проверить «правильные вещи» (цель, границы, ключевые стороны), чтобы первый радар опирался на осмысленный контекст.*

**Источник:** Алферов — «проработать проект» (первая грань ромба).

| ID | AC |
|----|-----|
| B2.1 | Новый **шаг 2b** или расширение шага 1 onboarding: **5–7 чекбоксов** (не все обязательны) |
| B2.2 | Пункты (RU, plain language): **цель проекта** · **границы (что не входит)** · **ключевые стороны названы** · **критерий успеха на 4 недели** · **главный риск записан** · **есть ли спонсор/заказчик** · **понятна ли ценность для бизнеса** |
| B2.3 | ≥3 отмеченных пункта **или** explicit «Пропустить» — чтобы не блокировать &lt;3 min TTFR |
| B2.4 | Mapping: каждый пункт влияет на 1–2 domain scores (±5…10) — таблица в `lib/onboarding.ts` |
| B2.5 | Persist в store `projectPrepChecklist: Record<string, boolean>` |
| B2.6 | Прогресс onboarding обновлён (label «4 шага» или sub-step indicator) |
| B2.7 | Disclaimer; no exam prep copy |

**Out of AC:** document upload; RIM-III forms; approval workflows.

---

### 2.3 F-B3 — Карта стейкхолдеров lite (T-082)

**User story:**  
*Как PM, я хочу записать 1–3 ключевых стейкхолдеров в трёх полях, чтобы помнить ожидания без CRM.*

| ID | AC |
|----|-----|
| B3.1 | Секция dashboard **«Ключевые стороны»** (collapsible card) |
| B3.2 | До **3 записей**; поля: **Кто влияет** (text) · **Что ждут** (text, 120 char hint) · **Последний контакт** (date или «&gt;2 нед назад» toggle) |
| B3.3 | CRUD: add / edit / remove; localStorage persist |
| B3.4 | Optional: если «&gt;2 нед» на записи #1 — soft nudge в HealthCommentary context (string inject, no new BFF required for MVP) |
| B3.5 | **Не** power/interest matrix; **не** org chart |
| B3.6 | PII: user-entered names — **не** в analytics events (ADR-002) |

---

### 2.4 F-B4 — Еженедельный снимок + напоминание (T-083)

**User story:**  
*Как PM, я хочу сохранить снимок проекта и получить мягкое напоминание вернуться через неделю, чтобы проверить retention-гипотезу.*

| ID | AC |
|----|-----|
| B4.1 | Кнопка **«Снимок недели»** — reuse `buildProjectSnapshot()` (T-042) + timestamp `weeklySnapshots[]` (max 12 in LS) |
| B4.2 | После снимка — banner **«Вернитесь через ~7 дней»**; persist `nextCheckInAt` ISO |
| B4.3 | При `Date.now() > nextCheckInAt` — dismissible banner «Пора обновить радар» (no push/email in MVP) |
| B4.4 | Snooze 7d — one button |
| B4.5 | Export JSON/clipboard unchanged behavior; snapshot list view **read-only** (optional modal) |
| B4.6 | **Нет** email reminders, **нет** Telegram |

---

## 3. Модель данных (Zustand) {#3-модель-данных}

Расширение `useProjectStore` — persist key **`quiet-partner-v1`** (migrate-friendly partials).

### 3.1 Новые типы (draft)

```typescript
/** T-080 — one question per calendar week */
type FocusWeekState = {
  weekKey: string;           // ISO week, e.g. "2026-W28"
  domainId: DomainId;
  questionRu: string;
  markedDoneAt?: string;     // ISO
};

/** T-081 — Alferov "проработать проект" checklist */
type ProjectPrepItemId =
  | "goal"
  | "boundaries"
  | "stakeholders_named"
  | "success_4w"
  | "top_risk"
  | "sponsor_clear"
  | "business_value";

type ProjectPrepChecklist = Partial<Record<ProjectPrepItemId, boolean>>;

/** T-082 — max 3 stakeholders */
type StakeholderLite = {
  id: string;
  who: string;
  expectation: string;
  lastContactAt?: string;    // ISO date
  contactStale?: boolean;    // derived: >14d
};

/** T-083 — weekly snapshots + reminder */
type WeeklySnapshotRef = {
  exportedAt: string;
  overallHealth: number;
  weakestDomainId: DomainId;
};

type RetentionReminder = {
  nextCheckInAt?: string;
  lastSnapshotAt?: string;
  snoozedUntil?: string;
};
```

### 3.2 Store fields (additive)

| Field | Task | Persist |
|-------|------|---------|
| `focusWeek: FocusWeekState \| null` | T-080 | yes |
| `projectPrepChecklist: ProjectPrepChecklist` | T-081 | yes |
| `stakeholdersLite: StakeholderLite[]` | T-082 | yes (max 3) |
| `weeklySnapshots: WeeklySnapshotRef[]` | T-083 | yes (max 12) |
| `retentionReminder: RetentionReminder` | T-083 | yes |

### 3.3 Actions (draft)

| Action | Task |
|--------|------|
| `ensureFocusWeek()` | compute weekKey; pick weakest; set question |
| `markFocusDone()` | B1.5 |
| `setPrepChecklistItem(id, checked)` | T-081 |
| `upsertStakeholderLite` / `removeStakeholderLite` | T-082 |
| `recordWeeklySnapshot()` | T-083; calls existing export builder |
| `snoozeRetentionReminder(days)` | T-083 |

**Migration:** missing fields → defaults `{}` / `[]` / `null`; no breaking change to existing LS blobs.

---

## 4. UI wireframes (текст) {#4-ui-wireframes}

### 4.1 Dashboard — «Фокус недели» (T-080)

```
┌─────────────────────────────────────────────────────────┐
│ [Header: Тихий напарник · Настроить · Ранний доступ]    │
├──────────────────────────┬──────────────────────────────┤
│ DomainRadar (8 wedges)   │ HealthCommentary card        │
│                          │                              │
├──────────────────────────┴──────────────────────────────┤
│ ┌─ Фокус недели ──────────────────────────────────────┐ │
│ │ Домен: «Поставка» (красная зона)                     │ │
│ │ Вопрос: «Что можно показать заказчику на этой       │ │
│ │         неделе — даже черновик?»                     │ │
│ │ [Отметить: сделал]              обновится 21.06     │ │
│ │ ℹ Co-pilot, не сертификация PMBOK                   │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Onboarding — шаг «Проработать проект» (T-081)

```
Шаг 2 из 4 — Проработать проект
────────────────────────────────
Отметьте, что уже ясно (можно не всё):

☐ Цель проекта сформулирована одной фразой
☐ Понятно, что НЕ входит в проект
☐ Ключевые стороны названы
☐ Критерий успеха на 4 недели есть
☐ Главный риск записан
☐ Есть понятный спонсор/заказчик
☐ Ценность для бизнеса понятна команде

[Назад]  [Пропустить]  [Далее →]
```

### 4.3 Dashboard — «Ключевые стороны» lite (T-082)

```
┌─ Ключевые стороны (3 max) ─────────────── [▼] ─┐
│ 1. Иван Петров · Директор                      │
│    Ждёт: demo к пятнице                        │
│    Контакт: 05.06.2026                         │
│    [Изменить] [Удалить]                        │
│ + Добавить сторону                             │
└────────────────────────────────────────────────┘
```

### 4.4 Dashboard — снимок + reminder (T-083)

```
[Toolbar: Экспорт JSON · Снимок недели]

┌─ Напоминание ──────────────────────────────────┐
│ Вы сохранили снимок 06.06. Вернитесь ~13.06     │
│ чтобы обновить радар.  [Обновить сейчас] [+7д] │
└────────────────────────────────────────────────┘
```

---

## 5. Analytics events (ADR-002) {#5-analytics-events}

Согласование с [`knowledge-base/adr-002-analytics-posthog.md`](../knowledge-base/adr-002-analytics-posthog.md). **Без PII** — whitelist properties only.

| Event | Когда | Properties (whitelist) |
|-------|-------|------------------------|
| `focus_week_view` | Карточка T-080 mount | `domain_id` (D1…D8), `delivery_approach` |
| `focus_week_done` | «Отметить: сделал» | `domain_id` |
| `prep_checklist_complete` | Finish onboarding step T-081 | `items_checked_count`, `delivery_approach` |
| `stakeholder_lite_save` | Save stakeholder row | `stakeholder_count` (1–3) |
| `weekly_snapshot_saved` | T-083 snapshot | `domain_count_red`, `overall_health_bucket` |
| `retention_reminder_shown` | Banner display | `days_since_last_visit_bucket` |
| `retention_reminder_snooze` | Snooze click | — |

**Запрещено:** имена проектов, stakeholder names, free-text expectations в PostHog.

**Default:** `POSTHOG_DISABLED=true` — events no-op until T-075 OPTIONAL.

---

## 6. QA checklist pointers {#6-qa-checklist}

Расширить [`knowledge-base/qa-checklist.md`](../knowledge-base/qa-checklist.md) секцией **§Book** (после impl):

| ID | Проверка |
|----|----------|
| BK-1 | Фокус недели: weakest domain корректен; вопрос RU; disclaimer |
| BK-2 | Focus stable 7d; mark done → audit log entry |
| BK-3 | Onboarding checklist: skip path; TTFR &lt;3 min smoke |
| BK-4 | Checklist mapping shifts radar vs control |
| BK-5 | Stakeholder lite: max 3; persist after reload |
| BK-6 | No stakeholder PII in network analytics payload |
| BK-7 | Weekly snapshot: JSON valid; max 12 rotation |
| BK-8 | Reminder banner: show/snooze/dismiss |
| BK-9 | `npm run build` && `npm run lint` green |
| BK-10 | No billing/checkout UI introduced |

Regression: subset staging smoke T-078 после каждого book release.

---

## 7. Disclaimer requirements {#7-disclaimer-requirements}

| Touchpoint | Требование |
|------------|------------|
| «Фокус недели» card | Footer micro-copy: «Вопрос co-pilot; не оценка соответствия PMBOK/PMI» |
| Onboarding checklist | Subtext: «Чек-лист для размышления, не аудит проекта» |
| Stakeholder lite | Hint: «Вы сами вводите данные; продукт не заменяет CRM» |
| Weekly snapshot JSON | `disclaimer` field из `DEFAULT_DISCLAIMER` (existing) |
| BFF (if extended) | `getSystemPrompt()` rules 6–8 unchanged; no compliance claims |

Канон disclaimer: см. `lib/domains.ts` / `DEFAULT_DISCLAIMER` — **не** дублировать exam-prep wording.

---

## 8. Зависимости и ограничения {#8-зависимости}

| ID | Ограничение |
|----|-------------|
| DEP-BF-1 | Impl T-080…T-083 **после** gate — см. plan |
| DEP-BF-2 | Billing **paused** — AC запрещают payment UI |
| DEP-BF-3 | localStorage only — no server schema change |
| DEP-BF-4 | Senior PM sign-off prompt T-080 before merge |
| DEP-BF-5 | Stack Next.js 16 — не Vite |

---

## 9. Трассировка {#9-трассировка}

| Feature | Plan phase | Queue | TZ § |
|---------|------------|-------|------|
| GTM | Book-0 | T-073, T-074 | §2.0 |
| Фокус недели | Book-1 | T-080 | §2.1, §4.1 |
| Onboarding checklist | Book-1 | T-081 | §2.2, §4.2 |
| Stakeholder lite | Book-2 | T-082 | §2.3, §4.3 |
| Weekly snapshot | Book-2 | T-083 | §2.4, §4.4 |

---

## История документа

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | PM | v1.0 — book track TZ; 4 features + GTM ref; gates |

# UX wireframes — Book features (T-080…T-083)

**Версия:** 1.0  
**Дата:** 2026-06-13  
**Роль:** UI/UX  
**Задача:** T-085 (prep spike)  
**Язык UI:** RU  
**Gate:** impl после G-Book-P2 (T-080/T-081) и G-Book-P3 (T-082/T-083)

> **Dev handoff:** [`book-p2-dev-handoff-T-080-T-081.md`](./book-p2-dev-handoff-T-080-T-081.md)  
> **ТЗ:** [`technical-specification-book-features.md`](./technical-specification-book-features.md) §4  
> **Tokens:** [`knowledge-base/design-tokens.md`](../knowledge-base/design-tokens.md)

---

## Принципы (общие)

- **Card tier** — как HealthCommentary: `Card` shadcn, radius из tokens, без новых цветов.
- **Plain language** — без «домен D1», «PMBOK», exam prep.
- **Disclaimer** — micro-copy footer на каждой book-карточке (см. TZ §7).
- **Mobile first** — одна колонка &lt;768px; dashboard 2-col ≥768px.
- **Не добавлять** billing upsell, Pro badge, pricing.

---

## T-080 — «Фокус недели» (dashboard)

### Placement

```
Desktop (≥768px)
┌────────────────────────────────────────────────────────────┐
│ Header                                                     │
├─────────────────────────┬──────────────────────────────────┤
│ DomainRadar             │ HealthCommentary                 │
│                         │                                  │
├─────────────────────────┴──────────────────────────────────┤
│ ┌─ Фокус недели ─────────────────────────────────────────┐ │
│ │  [full width card — primary book CTA this sprint]      │ │
│ └────────────────────────────────────────────────────────┘ │
│ NavigatorScenariosPanel (existing)                         │
└────────────────────────────────────────────────────────────┘

Mobile (375px)
┌──────────────────────┐
│ DomainRadar          │
│ FocusWeekCard        │  ← сразу под радаром
│ HealthCommentary     │
│ Navigator…           │
└──────────────────────┘
```

### Card anatomy (RU)

```
┌─ Фокус недели ──────────────────────────────── [?] ─┐
│ Бейдж: «Поставка» · красная зона                    │
│                                                     │
│ Вопрос (H3 weight):                                 │
│ «Что можно показать заказчику на этой неделе —      │
│  даже черновик?»                                    │
│                                                     │
│ [ ✓ Отметить: сделал ]     обновится 21.06.2026    │
│                                                     │
│ ℹ Co-pilot; не оценка соответствия PMBOK/PMI       │
└─────────────────────────────────────────────────────┘
```

| Элемент | Spec |
|---------|------|
| Бейдж домена | `Badge` variant по status: red/amber/green из `deriveDomainStatus` |
| Вопрос | `text-lg`, max 3 строки; truncate + tooltip если длиннее |
| CTA primary | `Button` default; после click → disabled + «Отмечено ✓» |
| Дата обновления | `text-muted-foreground text-sm` — следующий ISO week start |
| [?] | Tooltip: «Один вопрос в неделю из самой слабой зоны радара» |

### States

| State | UI |
|-------|-----|
| Loading | Skeleton 2 lines + badge placeholder |
| Active (not done) | CTA enabled |
| Done this week | CTA disabled, green check, optional +1 domain hint toast |
| New week | Auto-refresh question on mount (`ensureFocusWeek`) |

### a11y

- `aria-labelledby` на card title
- CTA — `aria-pressed` после done
- Focus order: title → question → CTA

---

## T-081 — Чек-лист «проработать проект» (onboarding)

### Flow position

```
[●]──[●]──[◐]──[○]     ← 4 шага (было 3)
 1    2   2b   3
Профиль → Турбулентность → Проработать → Боль
```

### Screen wireframe

```
┌─────────────────────────────────────────────┐
│  Шаг 3 из 4 — Проработать проект            │
│  ─────────────────────────────────────────  │
│  Отметьте, что уже ясно (можно не всё):     │
│                                             │
│  ☐ Цель проекта сформулирована одной фразой │
│  ☐ Понятно, что НЕ входит в проект          │
│  ☐ Ключевые стороны названы                 │
│  ☐ Критерий успеха на 4 недели есть         │
│  ☐ Главный риск записан                     │
│  ☐ Есть понятный спонсор/заказчик           │
│  ☐ Ценность для бизнеса понятна команде     │
│                                             │
│  Чек-лист для размышления, не аудит проекта │
│                                             │
│  [ ← Назад ]  [ Пропустить ]  [ Далее → ]   │
└─────────────────────────────────────────────┘
```

| Элемент | Spec |
|---------|------|
| Checkboxes | shadcn `Checkbox` + label clickable |
| Пропустить | `Button` ghost — без penalty scores |
| Далее | enabled always (≥0 checked); subtle hint if 0: «Можно вернуться позже» |
| Progress | Step indicator top — reuse onboarding pattern T-009 |

### Validation UX

- **Не блокировать** при 0 checked — «Пропустить» = valid path (B2.3).
- Counter optional: «Отмечено: 3 из 7» — muted text.

---

## T-082 — «Ключевые стороны» lite (dashboard)

**Gate:** G-Book-P3 · после T-080 or T-081 shipped.

```
┌─ Ключевые стороны (1/3) ─────────────── [▼ collapse] ─┐
│                                                        │
│  ┌─ Сторона 1 ─────────────────────────────────────┐  │
│  │ Кто влияет *                                     │  │
│  │ [ Иван Петров · директор IT          ]           │  │
│  │ Что ждут (до 120 символов)                       │  │
│  │ [ Demo к пятнице, без слайдов        ]  42/120   │  │
│  │ Последний контакт                                │  │
│  │ [ 05.06.2026 ]  ☐ Давно (>2 нед)                │  │
│  │                        [ Сохранить ] [ Удалить ] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  [ + Добавить сторону ]  (disabled if 3 rows)         │
│                                                        │
│  Данные локально; продукт не заменяет CRM              │
└────────────────────────────────────────────────────────┘
```

| Rule | UX |
|------|-----|
| Max 3 rows | «+ Добавить» hidden at 3 |
| Stale toggle | Amber dot on row if `>14d` or toggle |
| Collapsed default | **Open** if any stale; else collapsed on mobile |
| PII | No names in analytics — ADR-002 |

---

## T-083 — Снимок недели + напоминание

**Gate:** G-Book-P3 · reuse `ProjectExportButton`.

```
Toolbar (existing export area):
[ Экспорт JSON ]  [ 📸 Снимок недели ]

После снимка — banner (dismissible):
┌─ Напоминание ──────────────────────────────────────────┐
│ Снимок сохранён 13.06.2026. Вернитесь ~20.06, чтобы    │
│ обновить радар.                                        │
│ [ Обновить радар сейчас ]  [ Напомнить через 7 дней ]  │
└────────────────────────────────────────────────────────┘

Overdue state (Date > nextCheckInAt):
┌─ Пора обновить радар ─────────────────────── [ ✕ ] ─┐
│ Прошла неделя с последнего снимка. Обновите оценки. │
│ [ Перейти к радару ]  [ +7 дней ]                   │
└─────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Снимок недели | Same JSON as T-042 + push to `weeklySnapshots[]` (max 12) |
| Banner | `Alert` variant default; not modal |
| Snooze | Sets `snoozedUntil` +7d |
| No email/push | Copy only in-app |

---

## Component map (all book features)

| Component | Task | Priority |
|-----------|------|----------|
| `FocusWeekCard.tsx` | T-080 | P2 |
| `ProjectPrepChecklistStep.tsx` | T-081 | P2 |
| `StakeholderLitePanel.tsx` | T-082 | P3 |
| `WeeklySnapshotReminder.tsx` | T-083 | P3 |
| `OnboardingWizard.tsx` | T-081 touch | P2 |
| `DashboardShell.tsx` | layout slots | P2/P3 |

---

## Analytics touchpoints (OFF default)

См. TZ §5 — только whitelist props; **без** free-text / имён.

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | UI/UX (PM orchestrator) | v1.0 — text wireframes RU T-080…T-083 (T-085) |

# Book P2 — Dev handoff (T-080 / T-081)

**Версия:** 1.0  
**Дата:** 2026-06-13  
**Статус:** T-080 impl **DONE** 2026-06-13 (G-Book-P2 **WAIVED** Human Pavel); T-081 **READY**  
**Аудитория:** Developer, UI/UX, Senior PM, QA  
**Gate:** ~2026-06-27 review · billing **paused** · **no app code** до waive

> **Канон AC:** [`technical-specification-book-features.md`](./technical-specification-book-features.md) §2.1–2.2  
> **План:** [`implementation-plan-phase-book.md`](./implementation-plan-phase-book.md) Book-1  
> **UX wireframes:** [`ux-book-features-wireframes-T-080-T-083.md`](./ux-book-features-wireframes-T-080-T-083.md)

---

## TL;DR

Когда Human откроет gate — **два параллельных PR** (или один feature branch):

1. **T-080** — карточка «Фокус недели» на dashboard + store `focusWeek` + static questions из playbook (BFF optional v1).
2. **T-081** — новый шаг onboarding «Проработать проект» + mapping scores + persist `projectPrepChecklist`.

Оба — **localStorage only**, без PG schema change. Senior PM sign-off prompt T-080 **до merge**.

---

## Gate checklist (PM → READY)

| # | Условие | Кто |
|---|---------|-----|
| G1 | G-Book-P2 PASS (CR ≥12%) **или** journal waive | PM + Human |
| G2 | Этот handoff + UX wireframes прочитаны | Developer |
| G3 | `npm run build && npm run lint` green на main | QA baseline |
| G4 | Billing still paused — **нет** checkout UI | PM |

---

## T-080 — «Фокус недели»

### Consolidated AC

| ID | Критерий | Verify |
|----|----------|--------|
| B1.1 | Карточка под DomainRadar или в колонке HealthCommentary | Visual + mobile ≥375px |
| B1.2 | Weakest = min(D1…D8); tie-break: **D6 → D1 → D8 → D2 → D4 → D5 → D7 → D3** | Unit test / comment in code |
| B1.3 | Один RU plain-language вопрос из playbook co-pilot строки (§Prompt table) | Senior PM review |
| B1.4 | Стабилен 7 календарных дней (`weekKey` ISO) | Reload test |
| B1.5 | CTA «Отметить: сделал» → `logAction()` + optional +1 score cap 100 | Store + audit log |
| B1.6 | Disclaimer footer (co-pilot, не PMBOK cert) | qa-checklist BK-1 |
| B1.7 | Нет billing / exam jargon | QA BK-10 |
| B1.8 | a11y: heading, focusable CTA | Manual |

### Component list (new / touch)

| Файл | Действие |
|------|----------|
| `components/FocusWeekCard.tsx` | **NEW** — card UI |
| `lib/focusWeek.ts` | **NEW** — `getWeekKey()`, `pickWeakestDomain()`, `getFocusQuestion(domainId)` |
| `lib/store/useProjectStore.ts` | **EXTEND** — `focusWeek`, `ensureFocusWeek()`, `markFocusDone()` |
| `app/page.tsx` или dashboard layout | **TOUCH** — mount `FocusWeekCard` |
| `lib/analytics/posthog.ts` | **TOUCH** — `focus_week_view`, `focus_week_done` (no-op default) |
| `knowledge-base/qa-checklist.md` | **EXTEND** §Book BK-1, BK-2 |

**Reuse:** `DOMAIN_LABELS_RU`, `deriveDomainStatus`, `DEFAULT_DISCLAIMER`, `logAction` pattern from `CommentaryFeedback`.

### Prompt notes (Senior PM)

**v1 (рекомендация):** **без нового BFF** — статическая таблица вопросов из [`pmbok-domain-playbook.md`](../knowledge-base/pmbok-domain-playbook.md) co-pilot строк:

| Domain | RU focus question (v1 static) |
|--------|-------------------------------|
| D1 | Кто последний раз менял ожидания — и зафиксировали ли вы это письменно? |
| D2 | Что команда сейчас делает сверх плана — и кто это видит? |
| D3 | Если завтра убрать один ritual — какой не заметят? |
| D4 | Какое одно решение вы отложили из-за нехватки данных в плане? |
| D5 | Какой блокер старше 3 дней — и кто его owner? |
| D6 | Что можно показать stakeholder на этой неделе — даже черновик? |
| D7 | Какая одна метрика, если ухудшится, заставит вас менять план? |
| D8 | Какой риск вы не записали, потому что «и так понятно»? |

**v2 (BACKLOG):** optional BFF field `focusQuestion` — только после T-076 live **PASS**; extend `generateHealthCommentary` или отдельный lightweight endpoint.

**Prompt rules:** не менять `getSystemPrompt()` rules 6–8 без Senior PM review.

### Store shape (draft)

```typescript
type FocusWeekState = {
  weekKey: string;       // "2026-W28"
  domainId: DomainId;
  questionRu: string;
  markedDoneAt?: string;
};
```

`ensureFocusWeek()`: if `focusWeek?.weekKey !== currentWeekKey` → recompute weakest + question.

---

## T-081 — Чек-лист «проработать проект»

### Consolidated AC

| ID | Критерий | Verify |
|----|----------|--------|
| B2.1 | Шаг **2b** после профиля (или sub-step): 5–7 чекбоксов | Onboarding flow |
| B2.2 | Пункты RU — см. §Checklist items | Copy review |
| B2.3 | ≥3 checked **или** «Пропустить» — TTFR &lt;3 min | Timer smoke |
| B2.4 | Mapping ±5…10 на domain scores — таблица в `lib/onboarding.ts` | Radar delta test |
| B2.5 | Persist `projectPrepChecklist` | LS reload |
| B2.6 | Label «4 шага» / progress indicator | UI |
| B2.7 | Subtext disclaimer «чек-лист для размышления» | QA BK-3 |

### Component list (new / touch)

| Файл | Действие |
|------|----------|
| `components/OnboardingWizard.tsx` | **EXTEND** — step 2b UI |
| `components/ProjectPrepChecklistStep.tsx` | **NEW** (optional extract) |
| `lib/onboarding.ts` | **EXTEND** — `PREP_CHECKLIST_ITEMS`, `computePrepChecklistScoreDelta()` |
| `lib/store/useProjectStore.ts` | **EXTEND** — `projectPrepChecklist`, hydrate merge |
| `docs/onboarding-spec.md` | **EXTEND** — step 2b spec (PM sign-off) |

### Checklist items + score mapping (draft for Developer)

| ID | Label RU | Domains | Delta if checked |
|----|----------|---------|------------------|
| `goal` | Цель проекта сформулирована одной фразой | D4, D6 | +8 each |
| `boundaries` | Понятно, что НЕ входит в проект | D4, D8 | +6, +5 |
| `stakeholders_named` | Ключевые стороны названы | D1 | +10 |
| `success_4w` | Критерий успеха на 4 недели есть | D6, D7 | +7, +5 |
| `top_risk` | Главный риск записан | D8 | +10 |
| `sponsor_clear` | Есть понятный спонсор/заказчик | D1 | +8 |
| `business_value` | Ценность для бизнеса понятна команде | D1, D6 | +5, +5 |

**Logic:** apply deltas to baseline from turbulence step **before** pain step; clamp 0–100. Unchecked = no bonus (not penalty).

### Onboarding flow (after impl)

```
1. Профиль (name + approach)
2. Турбулентность (sliders)
2b. Проработать проект (NEW — T-081)
3. Главная боль → hydrate → /
```

---

## QA smoke (post-impl subset)

| ID | Check |
|----|-------|
| BK-1…BK-4 | Book TZ §6 |
| R1–R3 | Staging routes unchanged |
| Build/lint | green |
| T-078 regression | re-run after deploy |

---

## Out of scope (напоминание)

- Billing / Pro CTA / checkout
- Server persist book data (Phase 5)
- T-082 stakeholder lite, T-083 snapshot — **G-Book-P3**
- LLM focus question regeneration every visit

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | PM orchestrator | v1.0 — consolidated AC, components, prompt table, mapping draft (T-084) |

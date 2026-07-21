# T-102 — Инвентаризация WIP / сверка с очередью

**Дата:** 2026-07-22 · **Роль:** Developer + PM  
**Канон статусов:** [`orchestration-queue.md`](../orchestration-queue.md)  
**Handoff:** [`handoff-focus-today-agent.md`](./handoff-focus-today-agent.md) §B–C

---

## TL;DR

Эпик **фокуса дня** (T-090…T-098, T-100…T-102) в `main` и на проде. **Open:** T-099 dogfood (Human). Book/ProjectM (T-073…T-088) **не заводить заново**.

---

## 1. Git / working tree (quiet-partner)

| Проверка | Результат |
|----------|-----------|
| Ветка | `main` = `origin/main` (`dba378a`) |
| Uncommitted в `quiet-partner/` | **нет** |
| Игнор monorepo | `village-vpn/`, `product-copilot/`, `.cursor/*` — не QP |
| Stash | `stash@{0}` «wip quiet-partner before main pull» — старый WIP book/onboarding; **не применять** без Human (уже перекрыт shipped main) |

Коммиты на main (релевантные): Mode Hub / stages · focus card hub/radar/stages · waitlist wedge · мобильные карточки реестров · QA FT checklist.

---

## 2. Уже в main / на проде (не дублировать)

Live: [quiet-partner.vercel.app](https://quiet-partner.vercel.app/)

| Артефакт | Путь | vs эпик |
|----------|------|---------|
| Mode Hub | `components/ModeHub.tsx`, `app/page.tsx` | база T-093 |
| Пульт / радар | `app/stages/`, `app/radar/`, `components/stages/` | T-094, T-101 |
| **Фокус дня** | `lib/focusDay.ts`, `FocusDayCard.tsx` | T-092…T-095 |
| **Фокус недели** | `lib/focusWeek.ts`, `FocusWeekCard.tsx` | book T-080 — **отдельная** сущность |
| Book UI | prep checklist, stakeholders, weekly snapshot | T-081…T-083 |
| ProjectM content | `content/projectm/` | контент, не новый scope |
| Waitlist wedge | `app/waitlist/page.tsx` | T-097 |

**Деплой:** focus card + waitlist уже ушли в prod. Очередь деплоя пуста; остаётся QA smoke.

---

## 3. Эпик focus-today vs очередь

| ID | Статус (queue) | Комментарий |
|----|----------------|-------------|
| T-090…T-097 | DONE | PRD, UX, store, UI, analytics, copy, Growth |
| T-098 | DONE | FT1–FT11 + prod smoke |
| T-099 | IN_PROGRESS | 3 dogfood — **Human**; гайд `dogfood-focus-today-guide.md` |
| T-100 | DONE | редактура PRD |
| T-101 | DONE | мобильные карточки реестров |
| T-102 | DONE | этот отчёт |

FocusWeek ≠ FocusDay: неделя = слабый домен на `/radar`; день = общий артефакт на hub/radar/stages.

---

## 4. Book / ProjectM (T-073…T-088) — рекомендация

ID **нет** в таблице `orchestration-queue` (эпик фокуса), но артефакты и статусы живут в docs/`pm-status`. **Новый product scope не изобретать.**

| Блок | Рекомендация |
|------|----------------|
| T-073 GTM drafts | Docs DONE; **постинг DEFERRED** Human — не READY |
| T-074 metrics spec | DONE (docs); snapshot после постов |
| T-075 PostHog VPS | OPTIONAL / BACKLOG |
| T-076 / T-086 live LLM | DEFERRED (DeepSeek) |
| T-078 staging smoke | исторически PASS (book era) |
| T-080…T-083 book UI | **shipped** на prod — не переоткрывать |
| T-087 book dogfood | BACKLOG Human (guide готов) — **после** T-099 или параллельно по желанию |
| T-088 git hygiene | OPTIONAL |
| ProjectM `content/` | оставить как есть; без новых T-0xx |

**Итог:** держать book-хвосты как Human/OPTIONAL BACKLOG вне эпика focus-today; в очередь эпика **не** добавлять T-073…T-088 заново.

---

## 5. Следующее действие Human

1. Дождаться / подтвердить **T-098** QA smoke на prod.  
2. **T-099** dogfood ×3: «понял фокус дня?» → [`dogfood-log-template.md`](./dogfood-log-template.md).  
3. Billing T-069…T-071 и didactic-doodle — **не трогать**.

---

*Отчёт закрывает AC T-102. Статусы эпика всегда сверять с orchestration-queue.*

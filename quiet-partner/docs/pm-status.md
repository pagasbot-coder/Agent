# PM Status — Тихий напарник (Quiet Partner)

**Дата:** 2026-07-22 (v6.0 — контроль эпика «Фокус на сегодня»)  
**Владелец:** PM (muster-pm)  
**Очередь:** [`orchestration-queue.md`](../orchestration-queue.md) — эпик T-090…T-102; **open: T-099**  
**PRD:** [`prd-focus-today.md`](./prd-focus-today.md)  
**Dogfood T-099:** [`dogfood-focus-today-guide.md`](./dogfood-focus-today-guide.md)  
**Инвентарь:** [`t-102-wip-inventory.md`](./t-102-wip-inventory.md)

> **Ритм:** еженедельно + phase gate. **Следующий review:** после T-099 (3 dogfood) или 2026-07-29.  
> **Параллельный трек Human:** Banya-Digital — не блокировать QP dogfood.

---

## Контроль эпика «Фокус на сегодня» (PM · 2026-07-22)

### Вердикт порядка

Порядок **соблюдён**. Критический путь DoR → store/UX/copy → hub → sync → analytics → QA → dogfood пройден без дыр. Параллельные T-097/T-100/T-101/T-102 не ломали зависимости.

| Срез | Статус | Комментарий PM |
|------|--------|----------------|
| T-090…T-097 | DONE | Карточка + waitlist wedge на prod |
| T-098 | DONE | Smoke + FT1–FT11 |
| T-099 | **IN_PROGRESS** | Ждёт Human ×3 · гайд готов |
| T-100…T-102 | DONE | PRD, мобильные реестры, inventory |

### Единственный P0 сейчас

**T-099 dogfood** — Pavel, 3× ~10 мин по [`dogfood-focus-today-guide.md`](./dogfood-focus-today-guide.md).  
Без этого эпик формально не закрыт (success metric PRD: «понял, что делать сегодня»).

### Не брать в работу (пауза Human)

| Тема | Статус | Почему |
|------|--------|--------|
| T-069…T-071 billing | BACKLOG | «пока не подключать» |
| GTM LinkedIn post | DEFERRED | Human 2026-06-13 |
| Book T-073…T-088 re-open | нет | T-102: не плодить дубли |
| FocusWeek vs FocusDay | разделены | не смешивать в copy/QA |

### Риски контроля

1. Путаница FocusDay / FocusWeek на dogfood → гайд явно разделяет.  
2. Stale `pm-status` v5.4 (июнь) — этот файл обновлён; billing-вопросы ниже остаются OPTIONAL.  
3. Агент оркестрации ролей **не** пишет код эпика — только PM/очередь.

---

## Режим PM-led (2026-07-22)

**Режим: закрытие эпика фокуса** — delivery на prod; остался Human dogfood. Billing/GTM **не** приоритет до вердикта T-099.

**Prod:** https://quiet-partner.vercel.app — Mode Hub + «Фокус на сегодня» + waitlist wedge.  
**M0:** Go 2026-06-07. **Billing:** `BILLING_ENABLED=false`.

---

## Show & tell triggers (когда ping Human)

| # | Trigger | Артефакт / условие | Ping? | Статус |
|---|---------|-------------------|-------|--------|
| 1 | **GTM drafts ready** | [`gtm-sprint1-drafts-T-073.md`](./gtm-sprint1-drafts-T-073.md) | ✅ DONE | **Posting DEFERRED** Human 2026-06-13 |
| 2 | **Unit economics doc** | [`user-unit-economics-active-user.md`](./user-unit-economics-active-user.md) | ✅ DONE | **Show Pavel** — ~0,3–2 ₽/мес API |
| 3 | **Billing activation plan** | [`billing-activation-plan-2026-06-13.md`](./billing-activation-plan-2026-06-13.md) | ✅ DONE | **Approve → T-069 READY** |
| 4 | **T-081…T-083 shipped** | Book features prod | ✅ DONE | Show Pavel locally |
| 5 | **T-076 live PASS** | [`prompt-regression-T-016.md`](./prompt-regression-T-016.md) §T-076 | ⬜ DEFERRED | T-086 Deferred |
| 6 | **Book dogfood guide** | [`dogfood-book-features-guide.md`](./dogfood-book-features-guide.md) | ✅ DONE | Human 15-min walkthrough |
| 7 | **First waitlist signup** | Postgres row #1 | ⬜ waiting | Ping when live |
| 8 | **G-Book-P3 prod smoke** | qa-report §G-Book-P3 | ✅ PASS | — |
| 9 | **Focus-today dogfood** | [`dogfood-focus-today-guide.md`](./dogfood-focus-today-guide.md) | ⬜ **P0 NOW** | T-099 · 3 сессии |

---

## TL;DR

Эпик **«Фокус на сегодня»** доставлен и прогнан QA. **Сейчас только ты:** 3 коротких dogfood по гайду T-099. Billing/GTM не трогаем, пока не закроешь вердикт «понял фокус дня».

---

## Текущий gate

| Gate | Критерии (plan) | Статус |
|------|-----------------|--------|
| **G0→1** | ICP + desk research + competitive scan + playbook v0 | **✅ PASS** |
| **G1→2** | ADR-001 approved; secrets pattern | **✅ PASS** |
| **G2→3** | Spike reviewed; commentary useful ≥3/5 **или waiver** | **🔶 WAIVED** |
| **G3→4** | QA PASS; 👍 ≥50% | **Не достигнут** |
| **G4→5** | Unit economics; Phase 5 scope | **🔶 Partial** — T-089 unit cost DONE |
| **Post-M0** | GTM traction; waitlist KPI | **🟡 IN PROGRESS** — posting **deferred** |
| **G-Book-P3** | T-081 QA + T-082/T-083 + prod smoke | **✅ PASS** |
| **Focus-today** | T-090…T-098 + T-099×3 | **🟡** delivery+QA DONE; dogfood open |

---

## Вопросы к Human (Pavel)

| # | Вопрос | Статус | Блокирует? |
|---|--------|--------|------------|
| **0** | **T-099: 3 dogfood «понял фокус дня?»** | ⬜ **P0 NOW** | Закрытие эпика |
| 1 | **Approve billing plan** → «можно подключать» test YooKassa? | ⬜ пауза | T-069 READY |
| 2 | **GTM posting LinkedIn #1** | **Deferred** 2026-06-13 | Нет |
| 3 | Auth activation | ⬜ Deferred | T-070 |
| 4 | **DeepSeek top-up** (T-086) | **Deferred** | Нет — fallback ok |
| 5 | Dogfood T-087 book 15 min | ⬜ после T-099 | Нет |
| 6 | PostHog VPS (T-075) | ⬜ OPTIONAL | Нет |
| 7 | Цена Pro 990 ₽ — подтвердить для checkout | ⬜ гипотеза | T-070 copy |

---

## Phase post-book: next 2 weeks (исторический план 2026-06-13)

> Снимок июня. **Актуальный P0:** T-099 focus dogfood. Billing/GTM без смены Human-директивы не поднимаем.

### Приоритеты (Human vs team) — **переопределено 2026-07-22**

| P | Кто | Задача | Gate / outcome |
|---|-----|--------|----------------|
| **P0** | **Human** | T-099 ×3 «понял фокус дня?» | Закрытие эпика focus-today |
| **P1** | **Human** | (после T-099) billing plan approve — если ещё актуально | T-069 → READY |
| **P2** | **Human** | T-087 book dogfood | optional |
| **DEFERRED** | **Human** | GTM LinkedIn post #1 | Traction позже |
| **DEFERRED** | **Human** | T-086 DeepSeek top-up | Live S1–S4 |
| **DONE** | Team | T-090…T-098, T-100…T-102 | prod + QA |

### Gates

| Gate | Критерий | Дата review |
|------|----------|-------------|
| **Focus-today dogfood** | 3 сессии + вердикт | **сейчас** |
| **Billing plan** | Human approve → T-069 READY | пауза до после T-099 |
| **G-Book-0 cont.** | ≥2 GTM канала live | **deferred** |

---

## WBS — сейчас

| Роль | Задача | Статус |
|------|--------|--------|
| **PM** | Контроль порядка эпика + `pm-status` v6.0 | **✅** |
| **Human** | T-099 dogfood ×3 | ⬜ **P0** |
| **Developer / QA / Growth** | Новых READY по эпику нет | — |
| **Human** | Billing / GTM | **пауза** |

---

## Что дальше

1. **Human** — [`dogfood-focus-today-guide.md`](./dogfood-focus-today-guide.md) ×3 → скажи PM вердикт.
2. **PM** — T-099 → DONE; journal; при «понял» — эпик closed.
3. **Billing / GTM** — только после явного «можно».

---

## READY / open tasks

| ID | Задача | Кто | Notes |
|----|--------|-----|-------|
| **T-099** | Focus dogfood ×3 | Human + PM | [`dogfood-focus-today-guide.md`](./dogfood-focus-today-guide.md) |
| **T-087** | Book dogfood 15 min | Human | после T-099 |
| **T-069** | YooKassa webhook | Developer | **BACKLOG** — Human pause |
| **T-075** | PostHog VPS | DevOps | OPTIONAL |

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-07-22 | PM | **v6.0** — контроль эпика focus-today; порядок OK; P0 = T-099 |
| 2026-06-13 | PM | **v5.4** — Human: no GTM post; billing exploration; T-089 + billing plan |
| 2026-06-13 | PM + Dev + QA (agent EOD) | **v5.2** — T-088 prep; onboarding-spec v1.1; W25 template |
| 2026-06-13 | Human (Pavel) | **v5.1** — T-086 DEFERRED; fallback co-pilot ok |
| 2026-06-13 | PM + QA | **v5.0** — G-Book-P3 PASS; T-086 root cause $0 balance |

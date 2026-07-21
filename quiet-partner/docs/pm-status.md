# PM Status — Тихий напарник (Quiet Partner)

**Дата:** 2026-06-13 (v5.4 — Human shift: billing + unit cost; GTM post deferred)  
**Владелец:** PM (muster-pm)  
**План:** [`implementation-plan.md`](./implementation-plan.md) v1.1 + [`implementation-plan-phase-book.md`](./implementation-plan-phase-book.md) (Alferov track)  
**ТЗ book:** [`technical-specification-book-features.md`](./technical-specification-book-features.md)  
**Очередь:** [`orchestration-queue.md`](../orchestration-queue.md) — **T-080…T-083 DONE** · **T-089 DONE**  
**Раздача:** [`team-assignments.md`](./team-assignments.md)  
**Governance:** [`pm-governance.md`](./pm-governance.md)  
**ТЗ для Human (канон):** [`human-requirements-tz.md`](./human-requirements-tz.md)  
**Unit cost:** [`user-unit-economics-active-user.md`](./user-unit-economics-active-user.md)  
**Billing plan:** [`billing-activation-plan-2026-06-13.md`](./billing-activation-plan-2026-06-13.md)  
**Daily log:** [`pm-daily-log-2026-06-13.md`](./pm-daily-log-2026-06-13.md)

> **Ритм контроля:** PM обновляет этот документ **еженедельно** и на каждом phase gate (G0→1 … G4→5). **Следующий review:** 2026-06-20 (еженедельный).  
> **Human directive 2026-06-13 (вечер):** **GTM LinkedIn post — NOT now**; **попробовать подключить YooKassa** (plan first); **понять cost активного пользователя** → T-089 + billing activation plan.

---

## Режим PM-led (2026-06-13)

**Режим: billing exploration + unit economics** — book features **live** на prod; G-Book-P3 **PASS**. **DeepSeek** balance $0 → fallback RU (T-086 **DEFERRED**). **GTM posting deferred** by Human. **Billing:** plan готов; код **не включаем** до «можно подключать» после прочтения плана.

**Prod:** https://quiet-partner.vercel.app (book features + offline co-pilot UX).  
**Postgres/waitlist:** **ACTIVATED** (T-051 DONE).  
**M0 roundtable:** **DONE** 2026-06-07 — Go + waiver G2→3.  
**Billing:** **exploration** — Human 2026-06-13; `BILLING_ENABLED=false`.

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

---

## TL;DR

**Human P0 сдвинулся:** не GTM post, а **billing plan + unit cost**. API **~0,3–2 ₽/мес** на активного WAU — маржа Pro **990 ₽** по LLM не под угрозой. YooKassa: план активации готов; **T-069 BACKLOG** до approve. GTM drafts лежат готовыми. Book track live; DeepSeek $0 → fallback ok.

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

---

## Вопросы к Human (Pavel)

| # | Вопрос | Статус | Блокирует? |
|---|--------|--------|------------|
| 1 | **Approve billing plan** → «можно подключать» test YooKassa? | ⬜ **NEW P0** | T-069 READY |
| 2 | **GTM posting LinkedIn #1** | **Deferred** 2026-06-13 | Нет |
| 3 | Auth activation | ⬜ Deferred | T-070 |
| 4 | **DeepSeek top-up** (T-086) | **Deferred** | Нет — fallback ok |
| 5 | Dogfood T-087 15 min | ⬜ guide ready | Нет |
| 6 | PostHog VPS (T-075) | ⬜ OPTIONAL | Нет |
| 7 | Цена Pro 990 ₽ — подтвердить для checkout | ⬜ гипотеза | T-070 copy |

---

## Phase post-book: next 2 weeks (2026-06-13 → 2026-06-27)

### Приоритеты (Human vs team) — **обновлено 2026-06-13**

| P | Кто | Задача | Gate / outcome |
|---|-----|--------|----------------|
| **P0** | **Human** | Прочитать billing plan + unit economics; решить test merchant | T-069 → READY |
| **P1** | **Human** | YooKassa test shop + env keys (не в чат) | Webhook smoke |
| **P2** | **Human** | T-087 15-min book dogfood | 1 useful + log row |
| **DEFERRED** | **Human** | GTM LinkedIn post #1 | Traction позже |
| **DEFERRED** | **Human** | T-086 DeepSeek top-up | Live S1–S4 |
| **P3** | DevOps | T-075 PostHog VPS | OPTIONAL |
| **DONE** | PM | T-089 unit economics | [`user-unit-economics-active-user.md`](./user-unit-economics-active-user.md) |

### Gates (2 нед)

| Gate | Критерий | Дата review |
|------|----------|-------------|
| **Billing plan** | Human approve → T-069 READY | **2026-06-20** |
| **G-Book-0 cont.** | ≥2 GTM канала live | **deferred** — post not now |
| **G-Book-Stop check** | CR &lt;5% **и** signups &lt;3 | 2026-06-27 |

---

## WBS — 2 недели (сдвиг приоритетов)

| Роль | Задача | Статус |
|------|--------|--------|
| **PM** | T-089 unit economics | **✅ DONE** |
| **PM** | Billing activation plan | **✅ DONE** |
| **Human** | Approve billing plan + merchant test | ⬜ **P0** |
| **Developer** | T-069 webhook (после READY) | ⬜ BACKLOG |
| **Human** | GTM post (T-073) | **DEFERRED** |
| **Human** | T-087 book dogfood | ⬜ guide ready |
| **Growth** | W25 waitlist snapshot | ⬜ после постов (deferred) |
| **QA** | G-Book-P3 prod smoke | **✅ PASS** |

---

## Что агенты делают дальше

1. **Human** — approve [`billing-activation-plan-2026-06-13.md`](./billing-activation-plan-2026-06-13.md); при готовности — test merchant YooKassa.
2. **PM** — после approve: T-069 **READY** в очереди.
3. **Developer** — T-069 только после READY + scaffold audit/recover.
4. **GTM posting** — **не сейчас** (Human 2026-06-13).
5. **T-086** — DEFERRED until Human «решаем DeepSeek».

---

## READY tasks

| ID | Задача | Кто | Notes |
|----|--------|-----|-------|
| **T-087** | Book dogfood 15 min | Human | [`dogfood-book-features-guide.md`](./dogfood-book-features-guide.md) |
| **T-075** | PostHog VPS | DevOps | OPTIONAL |
| **T-069** | YooKassa webhook | Developer | **BACKLOG** — plan gate |

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | PM | **v5.4** — Human: no GTM post; billing exploration; T-089 + billing plan |
| 2026-06-13 | PM + Dev + QA (agent EOD) | **v5.2** — T-088 prep; onboarding-spec v1.1; W25 template |
| 2026-06-13 | Human (Pavel) | **v5.1** — T-086 DEFERRED; fallback co-pilot ok |
| 2026-06-13 | PM + QA | **v5.0** — G-Book-P3 PASS; T-086 root cause $0 balance |

# PM Status — Тихий напарник (Quiet Partner)

**Дата:** 2026-06-08 (v4.2 — **Phase 5 started**; Human Go «пошли дальше»; **billing activation deferred**)  
**Владелец:** PM (muster-pm)  
**План:** [`implementation-plan.md`](./implementation-plan.md) v1.1 + Phase 4→5 transition  
**Очередь:** [`orchestration-queue.md`](../orchestration-queue.md) — Phase 5 billing RU (T-064…T-071)  
**Раздача:** [`team-assignments.md`](./team-assignments.md)  
**Governance:** [`pm-governance.md`](./pm-governance.md)  
**ТЗ для Human (канон):** [`human-requirements-tz.md`](./human-requirements-tz.md)

> **Ритм контроля:** PM обновляет этот документ **еженедельно** и на каждом phase gate (G0→1 … G4→5). **Следующий review:** при старте Phase 5 (вне текущей очереди).

---

## Режим PM-led (2026-05-30)

Операционный контроль у PM ([`pm-governance.md`](./pm-governance.md)). Human — M0 sign-off, auth activation, budget/prod.  
**Staging:** https://quiet-partner.vercel.app (T-018 DONE; T-022 staging smoke **PASS**).  
**Postgres/waitlist:** **ACTIVATED** (T-051 Block A DONE).  
**M0 roundtable:** **DONE** 2026-06-07 — [`m0-roundtable-minutes.md`](./m0-roundtable-minutes.md) (internal Muster).  
**CPO report (канон):** [`cpo-report-m0.md`](./cpo-report-m0.md) — executive summary для решения Go/Pause/Pivot.

---

## TL;DR

**Human Go** (2026-06-08, «пошли дальше»). **Phase 5 стартовал:** YooKassa ADR + billing scaffold (`lib/billing/`, `/api/billing/*`, schema) — **OFF** (`BILLING_ENABLED=false`). **Human directive 2026-06-08:** «пока оплату не подключай» — merchant YooKassa и `BILLING_ENABLED=true` **не делаем**; scaffold и runbook остаются для будущего включения. Phase 0–4 закрыты; MVP live. PMF не доказан (2/4 useful, waiver). **T-069…T-071** — BACKLOG до явного решения Human. Runbook: [`billing-russia-runbook.md`](./billing-russia-runbook.md).

---

## Закрытие очереди — 2026-06-08

| ID | Было | Стало | Причина |
|----|------|-------|---------|
| T-048 | BACKLOG | **CANCELLED** | PostHog VPS — deferred post-M0; runbook T-031 готов |
| T-049 | BACKLOG | **CANCELLED** | Live LLM regression — deferred; static PASS (T-016) |
| T-050 | BACKLOG | **CANCELLED** | Dogfood #5 — waived на roundtable; G2→3 не blocked |
| T-052 | BACKLOG | **CANCELLED** | migrate-from-local API — deferred Phase 5; design T-045 готов |
| T-057 | BACKLOG | **CANCELLED** | Auth QA extension — deferred до AUTH activation |
| T-058 | BACKLOG | **CANCELLED** | Redis runbook — superseded `redis-rate-limit-T-036.md` |
| T-063 | BACKLOG | **CANCELLED** | Monetization — deferred post-M0; auth/billing не shipped |

**Итого:** 7 задач закрыты административно. **0** BACKLOG / READY / IN_PROGRESS / BLOCKED в [`orchestration-queue.md`](../orchestration-queue.md).

---

## M0 Roundtable Journal — 2026-06-07

**Участники:** Pavel (Human), muster-pm, muster-senior-pm, muster-sme, muster-growth-marketer, muster-qa · коллеги PM/РП TBD  
**Длительность:** 90 мин (async Muster)  
**Demo URL:** https://quiet-partner.vercel.app — **OK**

### Решения (binding)

| # | Решение | Owner | Статус |
|---|---------|-------|--------|
| 1 | M0: **Go** + waiver G2→3 | Human (sign-off) | Roundtable DONE; memo checkbox ⬜ |
| 2 | Monetization: options (не pre-decision $19) | Growth + PM | **Deferred** — T-063 CANCELLED |
| 3 | Free tier: radar + capped AI | Architect + Dev | **Deferred** Phase 5 |
| 4 | Auth + billing groom | PM | **Deferred** — вне очереди |
| 5 | Owner monetization: Growth + PM | Growth + PM | On hold post-M0 |

**CPO report (канон):** [`cpo-report-m0.md`](./cpo-report-m0.md) · **Internal minutes:** [`m0-roundtable-minutes.md`](./m0-roundtable-minutes.md)

---

## План vs факт (фазы 0–4)

| Фаза | План (календарь) | План % | Факт % | Факт / комментарий |
|------|------------------|--------|--------|---------------------|
| **0** Discovery | 02.06–13.06.2026 (2 нед) | 0% на 30.05 | **100%** | T-002, playbook, scan/memo; M0 roundtable DONE; очередь закрыта |
| **1** Foundation | 16.06–27.06.2026 (2 нед) | 0% | **~95%** | T-001, T-004, design tokens v1 (T-021) |
| **2** Spike | 30.06–18.07.2026 (3 нед) | 0% | **~95%** | T-005…T-007, T-012, T-016 static DONE |
| **3** Onboarding + beta | 21.07–08.08.2026 (3 нед) | 0% | **~80%** | T-008…T-013, T-018, T-022 DONE; dogfood 4/5 (2 useful, waived) |
| **4** Growth | 11.08–05.09.2026 (4 нед) | 0% | **~99%** | T-017…T-053 DONE; waitlist postgres live; SEO live |

---

## Текущий gate

| Gate | Критерии (plan) | Статус |
|------|-----------------|--------|
| **G0→1** | ICP + desk research + competitive scan + playbook v0 **или** waive | **~99%** — M0 roundtable DONE; **Human Go sign-off** ⬜ (не блокирует закрытие очереди) |
| **G1→2** | ADR-001 approved; secrets pattern | **✅ PASS** |
| **G2→3** | Spike reviewed; commentary useful **≥3/5** dogfood **или waiver** | **🔶 WAIVED** — roundtable 2026-06-07; dogfood 4/5, 2 useful |
| G3→4 | QA PASS; 👍 ≥50% | Не достигнут |
| G4→5 | Unit economics; Phase 5 scope | **Deferred** — Phase 5 вне очереди |

---

## Вопросы к Human (не блокируют агентов)

| # | Вопрос | Артефакт | Статус |
|---|--------|----------|--------|
| 1 | M0 **Go / Pause / Pivot** sign-off | [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) | ⬜ Checkbox; admin closure 2026-06-08 |
| 2 | Auth activation (когда готов) | [`auth-activation-runbook.md`](./auth-activation-runbook.md) | Deferred Phase 5 |
| 3 | Коллеги PM/РП (workshop circle) | [`m0-roundtable-invite-list.md`](./m0-roundtable-invite-list.md) | Optional |

---

## Риски (top 3 активных)

| ID | Риск | Статус | Комментарий PM |
|----|------|--------|----------------|
| **R8** | Dogfood bias | **Mitigated** | Waiver G2→3; T-050 CANCELLED (waived) |
| **R7** | LLM variance | **Active / Medium** | T-049 CANCELLED deferred; static PASS |
| **R2** | API cost | **Mitigated / Medium** | T-029 guardrails; per-user budget — Phase 5 |

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-07 | PM + Muster | **v3.0** — **T-062 DONE**; M0 roundtable minutes; Go + waiver; T-063 BACKLOG |
| 2026-06-08 | PM | **v4.0** — Human «закрывай все задачи»; T-048…T-063 CANCELLED; очередь **0 open** |
| 2026-06-08 | PM | **v4.2** — Human «пока оплату не подключай»; billing activation deferred; T-069 → BACKLOG; `BILLING_ENABLED=false` |

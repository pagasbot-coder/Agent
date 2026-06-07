# PM Status — Тихий напарник (Quiet Partner)

**Дата:** 2026-06-07 (v2.4 — T-051 **DONE**; Drizzle + waitlist postgres OFF-by-default)  
**Владелец:** PM (muster-pm)  
**План:** [`implementation-plan.md`](./implementation-plan.md) v1.1 + Phase 4→5 transition  
**Очередь:** [`orchestration-queue.md`](../orchestration-queue.md)  
**Раздача:** [`team-assignments.md`](./team-assignments.md)  
**Governance:** [`pm-governance.md`](./pm-governance.md)

> **Ритм контроля:** PM обновляет этот документ **еженедельно** и на каждом phase gate (G0→1 … G4→5). Следующий review: **2026-06-13** (M0 deadline).

---

## Режим PM-led (2026-05-30)

Операционный контроль у PM ([`pm-governance.md`](./pm-governance.md)). Human — только M0, Phase 5+, budget/prod, внешние блокеры, waiver G2→3.  
**Staging:** https://quiet-partner.vercel.app (T-018 DONE; T-022 staging smoke **PASS**).  
**OPTIONAL Human (gate):** dogfood **4/5** (**2 useful**; нужно ≥3), API key в Vercel — для **закрытия** G2→3, не для агентов.

---

## TL;DR

Календарь плана (старт 02.06) **не нарушен**; факт **опережает график**. **G1→2 закрыт.** T-001…T-047 + **T-051 DONE** (Drizzle client, `waitlist_signups` postgres path, `db:push` runbook). Prod/staging **noop** до Human Neon. Dogfood: **4/5, 2 useful**. **Next owner:** Human — Neon `DATABASE_URL` → `npm run db:push` → Vercel `WAITLIST_BACKEND=postgres` → redeploy.

---

## План vs факт (фазы 0–4)

| Фаза | План (календарь) | План % | Факт % | Факт / комментарий |
|------|------------------|--------|--------|---------------------|
| **0** Discovery | 02.06–13.06.2026 (2 нед) | 0% на 30.05 | **~98%** | T-002, playbook, scan/memo; dogfood **4/5** (2 useful). **Ждёт Human:** +1 useful или waiver, M0 sign-off |
| **1** Foundation | 16.06–27.06.2026 (2 нед) | 0% | **~95%** | T-001, T-004, design tokens v1 (T-021) |
| **2** Spike | 30.06–18.07.2026 (3 нед) | 0% | **~95%** | T-005…T-007, T-012, T-016 static DONE |
| **3** Onboarding + beta | 21.07–08.08.2026 (3 нед) | 0% | **~80%** | T-008…T-013, T-018, T-022 DONE; dogfood **4/5** (2 useful) |
| **4** Growth | 11.08–05.09.2026 (4 нед) | 0% | **~98%** | T-017…T-043 DONE; T-044 waitlist API; Phase 5 prep docs |

---

## Текущий gate

| Gate | Критерии (plan) | Статус |
|------|-----------------|--------|
| **G0→1** | ICP + desk research + competitive scan + playbook v0 **или** waive | **~95%** — scan/memo черновики; **M0 Human sign-off** ⬜ |
| **G1→2** | ADR-001 approved; secrets pattern | **✅ PASS** |
| **G2→3** | Spike reviewed; commentary useful **≥3/5** dogfood | **🔶 BLOCKED** — dogfood **4/5, 2 useful** (нужно +1 useful или waiver) |
| G3→4 | QA PASS; 👍 ≥50% | Не достигнут |
| G4→5 | Unit economics; Phase 5 scope | Prep docs ready; activation Human |

---

## Спринт 3: что закрыто **без Human**

| Task | Роль | Статус | Итог |
|------|------|--------|------|
| T-044 | Developer | **DONE** | `POST /api/waitlist` noop; form wired |
| T-045 | PM + Developer | **DONE** | `localstorage-migrate-phase5.md` |
| T-046 | QA | **DONE** | `qa-phase5-prep.md` |
| T-047 | IT-Architect | **DONE** | ADR-004 Neon lean draft |

---

## Вопросы к Human

**Блокеров для агентов нет.** По желанию:

| # | Вопрос | Зачем |
|---|--------|-------|
| 1 | Dogfood **#5** или waiver G2→3 | ≥3 useful для gate без waiver |
| 2 | M0 **Go / Pause / Pivot** | T-051+ разблокировка |
| 3 | Neon vs Supabase (ADR-004 one-liner) | `DATABASE_URL` в Vercel |

---

## Риски (top 3 активных)

| ID | Риск | Статус | Комментарий PM |
|----|------|--------|----------------|
| **R8** | Dogfood bias | **Active / High** | 4/5, 2 useful — порог G2→3 не достигнут |
| **R7** | LLM variance | **Active / Medium** | Staging BFF live LLM (T-026) |
| **R2** | API cost | **Mitigated / Medium** | T-029 + T-036 scaffold |

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-07 | PM + team | **v2.3** — T-044…T-047 DONE; sprint 3 close; next Human T-050/M0 |

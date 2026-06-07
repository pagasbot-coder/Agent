# PM Status — Тихий напарник (Quiet Partner)

**Дата:** 2026-06-07 (v2.2 — T-036 **DONE**; Redis scaffold; activation Human MUST)  
**Владелец:** PM (muster-pm)  
**План:** [`implementation-plan.md`](./implementation-plan.md) v1.1  
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

Календарь плана (старт 02.06) **не нарушен**; факт **опережает график**. **G1→2 закрыт.** T-001…T-043 + **T-033…T-036 DONE** (Phase 5 prep scaffold). **ADR-003 Accepted** (Auth.js v5). Live DB / `AUTH_ENABLED=true` / Upstash keys — **Human MUST**. Dogfood: **4/5, 2 useful** — G2→3 открыт (нужно ≥3 useful или waiver). **Next:** post-M0 backlog (T-044+).

---

## План vs факт (фазы 0–4)

| Фаза | План (календарь) | План % | Факт % | Факт / комментарий |
|------|------------------|--------|--------|---------------------|
| **0** Discovery | 02.06–13.06.2026 (2 нед) | 0% на 30.05 | **~98%** | T-002, playbook, scan/memo; dogfood **4/5** (2 useful). **Ждёт Human:** +1 useful или waiver, M0 sign-off |
| **1** Foundation | 16.06–27.06.2026 (2 нед) | 0% | **~95%** | T-001, T-004, design tokens v1 (T-021) |
| **2** Spike | 30.06–18.07.2026 (3 нед) | 0% | **~95%** | T-005…T-007, T-012, T-016 static DONE |
| **3** Onboarding + beta | 21.07–08.08.2026 (3 нед) | 0% | **~80%** | T-008…T-013, T-018, T-022 DONE; dogfood **4/5** (2 useful) |
| **4** Growth | 11.08–05.09.2026 (4 нед) | 0% | **~95%** | T-017…T-043 DONE; Phase 5 doc BLOCKED impl; live PostHog VPS — Human OPTIONAL |

---

## Текущий gate

| Gate | Критерии (plan) | Статус |
|------|-----------------|--------|
| **G0→1** | ICP + desk research + competitive scan + playbook v0 **или** waive | **~95%** — scan/memo черновики; **M0 Human sign-off** ⬜ |
| **G1→2** | ADR-001 approved; secrets pattern | **✅ PASS** |
| **G2→3** | Spike reviewed; commentary useful **≥3/5** dogfood | **🔶 BLOCKED** — T-013 + **T-022 staging PASS**; dogfood **4/5, 2 useful** (нужно +1 useful или waiver) |
| G3→4 | QA PASS; 👍 ≥50% | Не достигнут |
| G4→5 | Unit economics; Phase 5 scope | Не достигнут |

---

## Спринт: что идёт **без Human**

| Task | Роль | Статус | Действие |
|------|------|--------|----------|
| T-023…T-029 | Developer | **DONE** | waitlist, health, nav, cost guardrails |
| T-030 | Developer | **DONE** | PostHog wiring + consent; OFF default |
| T-031 | DevOps + Developer | **DONE** | `posthog-self-host.md` + compose reference |
| T-032 | PM + Developer | **DONE** | `roadmap-phase5.md` — BLOCKED until M0 |
| T-014 | PM | **DONE** | Protocol + log + links; сессии **OPTIONAL** |
| T-037…T-043 | Developer + QA | **DONE** | Sprint 3–4 polish; navigator BFF; export; QA full pass |
| T-033 ADR-003 | IT-Architect | **DONE** | Auth.js v5 Accepted |
| T-034 Drizzle schema | Developer | **DONE** | `lib/db/schema.ts`; no migrate |
| T-035 Auth scaffold | Developer | **DONE** | `AUTH_ENABLED=false`; staging unchanged |
| T-036 Redis limits | Developer + DevOps | **DONE** | Scaffold; `REDIS_URL` OFF; Human keys for prod |
| Dogfood guides #1–#3 | PM | **DONE** | [`dogfood-session-guides.md`](./dogfood-session-guides.md) |
| M0 evidence (QA PASS) | PM | **DONE** | [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) §Evidence |
| Post-M0 BACKLOG groom | PM | **DONE** | T-033…T-047 в queue |
| Weekly pm-status | PM | Ongoing | След. review **13.06** (M0) |

## Вопросы к Human

**Блокеров для текущего спринта нет.** По желанию, когда удобно:

| # | Вопрос | Зачем |
|---|--------|-------|
| 1 | `DEEPSEEK_API_KEY` в Vercel (Settings → Env) | Live LLM на staging вместо fallback RU |
| 2 | M0 **Go / Pause / Pivot** + sign-off в memo | **Go заблокирован** (2/4 useful); +1 useful **или** waiver G2→3 **или** Pause |
| 3 | Dogfood **#5** или повтор с фокусом на useful | Нужно ≥3 useful для G2→3 без waiver |

Dogfood **#1–#4 завершены** (2026-05-31); **2 useful** из 4. #5 — если не waiver. Лог: [`dogfood-log-template.md`](./dogfood-log-template.md).

---

## Риски (top 3 активных)

| ID | Риск | Статус | Комментарий PM |
|----|------|--------|----------------|
| **R8** | Dogfood bias | **Active / High** | 4/5 сессий, 2 useful — порог G2→3 не достигнут |
| **R7** | LLM variance | **Active / Medium** | Staging BFF live LLM (T-026) |
| **R2** | API cost | **Mitigated / Medium** | T-029 guardrails; weekly budget default 200k tokens |

---

## North Star / metrics (baseline)

| Метрика | Baseline (30.05) | Target | Источник |
|---------|------------------|--------|----------|
| Dogfood sessions | **4/5** (2 useful) | ≥3 useful для G2→3 | `dogfood-log-template.md` |
| Staging smoke | **PASS** (T-022) | PASS before public CTA | `qa-report-phase3.md` |
| M0 decision | **не принято** | Go + sign-off | `m0-go-no-go-memo.md` |

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-05-30 | PM | v1.0 — первый PM status |
| 2026-05-30 | PM | v1.5 — Human «идите дальше»; T-023…T-026 |
| 2026-05-30 | PM | **v1.6** — T-027…T-030 DONE; Phase 4 ~75%; next: PostHog self-host / Phase 5 doc |
| 2026-05-30 | Developer | **v1.7** — T-031…T-032 DONE; Phase 4 ~85%; Phase 5 app **BLOCKED** |
| 2026-05-30 | Developer | **v1.8** — T-037…T-039; T-014 templates DONE; Phase 3 UX ~80% |
| 2026-06-07 | Developer (prep) | **v1.9** — M0 evidence; dogfood guides; BACKLOG T-033…T-047; impl queue empty → Human dogfood/M0 |
| 2026-06-07 | PM (dogfood sync) | **v2.0** — Human dogfood **4/5, 2 useful** (4/2 report); G2→3 blocked; M0 Go blocked до +1 useful или waiver |
| 2026-06-07 | PM + Architect + Developer | **v2.1** — Phase 5 prep sprint: ADR-003 Accepted; T-033…T-035 DONE; T-036 READY |
| 2026-06-07 | Developer + DevOps | **v2.2** — T-036 DONE: Redis/Upstash scaffold; build/lint PASS; vercel --prod |

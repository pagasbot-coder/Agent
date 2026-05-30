# PM Status — Тихий напарник (Quiet Partner)

**Дата:** 2026-05-30 (T-037…T-039 sprint 3 — glossary, navigator, dogfood protocol)  
**Владелец:** PM (muster-pm)  
**План:** [`implementation-plan.md`](./implementation-plan.md) v1.1  
**Очередь:** [`orchestration-queue.md`](../orchestration-queue.md)  
**Раздача:** [`team-assignments.md`](./team-assignments.md)  
**Governance:** [`pm-governance.md`](./pm-governance.md)

> **Ритм контроля:** PM обновляет этот документ **еженедельно** и на каждом phase gate (G0→1 … G4→5). Следующий review: **2026-06-06** (конец недели 1 по календарю плана).

---

## Режим PM-led (2026-05-30)

Операционный контроль у PM ([`pm-governance.md`](./pm-governance.md)). Human — только M0, Phase 5+, budget/prod, внешние блокеры, waiver G2→3.  
**Staging:** https://quiet-partner.vercel.app (T-018 DONE; T-022 staging smoke **PASS**).  
**OPTIONAL Human (gate):** dogfood 0/5, API key в Vercel — для **закрытия** G2→3, не для агентов.

---

## TL;DR

Календарь плана (старт 02.06) **не нарушен**; факт **опережает график**. **G1→2 закрыт.** T-023…T-032 **DONE**. Phase 4 ~85%: PostHog runbook + Phase 5 doc (**BLOCKED** app impl). **Ждёт Human:** M0 sign-off; dogfood; Phase 5 scope approval.

---

## План vs факт (фазы 0–4)

| Фаза | План (календарь) | План % | Факт % | Факт / комментарий |
|------|------------------|--------|--------|---------------------|
| **0** Discovery | 02.06–13.06.2026 (2 нед) | 0% на 30.05 | **~95%** | T-002, playbook, scan/memo черновики. **Ждёт Human:** dogfood log, M0 sign-off |
| **1** Foundation | 16.06–27.06.2026 (2 нед) | 0% | **~95%** | T-001, T-004, design tokens v1 (T-021) |
| **2** Spike | 30.06–18.07.2026 (3 нед) | 0% | **~95%** | T-005…T-007, T-012, T-016 static DONE |
| **3** Onboarding + beta | 21.07–08.08.2026 (3 нед) | 0% | **~75%** | T-008…T-013, T-018, T-022 DONE; dogfood **0/5** |
| **4** Growth | 11.08–05.09.2026 (4 нед) | 0% | **~85%** | T-017…T-031 DONE; Phase 5 doc T-032 BLOCKED impl; live PostHog VPS — Human OPTIONAL |

---

## Текущий gate

| Gate | Критерии (plan) | Статус |
|------|-----------------|--------|
| **G0→1** | ICP + desk research + competitive scan + playbook v0 **или** waive | **~95%** — scan/memo черновики; **M0 Human sign-off** ⬜ |
| **G1→2** | ADR-001 approved; secrets pattern | **✅ PASS** |
| **G2→3** | Spike reviewed; commentary useful **3/5** dogfood | **🔶 IN PROGRESS** — T-013 + **T-022 staging PASS**; **0/5 dogfood** |
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
| T-037…T-039 | Developer | **DONE** | Glossary, navigator panel, dogfood protocol |
| Weekly pm-status | PM | Ongoing | След. review **06.06** |

## Вопросы к Human

**Блокеров для текущего спринта нет.** По желанию, когда удобно:

| # | Вопрос | Зачем |
|---|--------|-------|
| 1 | `DEEPSEEK_API_KEY` в Vercel (Settings → Env) | Live LLM на staging вместо fallback RU |
| 2 | M0 **Go / Pause / Pivot** + sign-off в memo | Закрытие gate G2→3; полный waitlist backend — после Go |

Dogfood #1–5 — по [`dogfood-log-template.md`](./dogfood-log-template.md), **OPTIONAL**, не блокирует спринт.

---

## Риски (top 3 активных)

| ID | Риск | Статус | Комментарий PM |
|----|------|--------|----------------|
| **R8** | Dogfood bias | **Active / High** | 0/5 сессий; не блокирует Phase 4 impl |
| **R7** | LLM variance | **Active / Medium** | Staging BFF live LLM (T-026) |
| **R2** | API cost | **Mitigated / Medium** | T-029 guardrails; weekly budget default 200k tokens |

---

## North Star / metrics (baseline)

| Метрика | Baseline (30.05) | Target | Источник |
|---------|------------------|--------|----------|
| Dogfood sessions | **0/5** | ≥3 useful для G2→3 | `dogfood-log-template.md` |
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

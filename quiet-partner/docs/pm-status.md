# PM Status — Тихий напарник (Quiet Partner)

**Дата:** 2026-05-30 (T-027/T-028 DONE — Phase 4 polish)  
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

Календарь плана (старт 02.06) **не нарушен**; факт **опережает график**. **G1→2 закрыт.** T-023…T-026 **DONE** на staging. **T-027** health endpoint + **T-028** nav/banner polish **DONE** локально. **Следующий без Human:** T-029 API cost guardrails (BACKLOG → PM groom) или redeploy staging с `/api/health`.

---

## План vs факт (фазы 0–4)

| Фаза | План (календарь) | План % | Факт % | Факт / комментарий |
|------|------------------|--------|--------|---------------------|
| **0** Discovery | 02.06–13.06.2026 (2 нед) | 0% на 30.05 | **~95%** | T-002, playbook, scan/memo черновики. **Ждёт Human:** dogfood log, M0 sign-off |
| **1** Foundation | 16.06–27.06.2026 (2 нед) | 0% | **~95%** | T-001, T-004, design tokens v1 (T-021) |
| **2** Spike | 30.06–18.07.2026 (3 нед) | 0% | **~95%** | T-005…T-007, T-012, T-016 static DONE |
| **3** Onboarding + beta | 21.07–08.08.2026 (3 нед) | 0% | **~75%** | T-008…T-013, T-018, T-022 DONE; dogfood **0/5** |
| **4** Growth | 11.08–05.09.2026 (4 нед) | 0% | **~55%** | T-017 ADR-002; T-019 copy; **T-023…T-028 DONE**; cost guards BACKLOG |

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
| T-023 | Developer | **DONE** | `/waitlist` static; build/lint PASS |
| T-024 | Developer | **DONE** | PostHog stub OFF |
| T-025 | Developer + DevOps | **DONE** | `/waitlist` live на vercel.app |
| T-026 | QA | **DONE** | Waitlist staging smoke PASS |
| T-027 | Developer | **DONE** | `GET /api/health` — redeploy для staging |
| T-028 | Developer | **DONE** | Nav + banner hydration |
| T-029 | Developer + Architect | **BACKLOG** | API cost guardrails (Phase 4) |
| T-014 | PM | IN_PROGRESS | Шаблон log; сессии **OPTIONAL — не блокирует спринт** |
| Weekly pm-status | PM | Ongoing | След. review **06.06** |

## Вопросы к Human

**Блокеров для текущего спринта нет.** По желанию, когда удобно:

| # | Вопрос | Зачем |
|---|--------|-------|
| 1 | `DEEPSEEK_API_KEY` в Vercel (Settings → Env) | Live LLM на staging вместо fallback RU |
| 2 | M0 **Go / Pause / Pivot** + sign-off в memo | Закрытие gate G2→3; полный waitlist backend — после Go |

Dogfood #1–5 — по [`dogfood-log-template.md`](./dogfood-log-template.md), **OPTIONAL**, не блокирует T-025/T-026/T-024.

---

## Раздача задач — 2026-05-30 (актуально)

| Task | Role | Status | Blocker |
|------|------|--------|---------|
| T-012…T-021 | Dev / QA / UX / Growth | DONE | — |
| T-022 | QA | DONE | — |
| T-023 | Developer | **DONE** | `/waitlist` локально |
| T-025 | Developer + DevOps | **READY** | Redeploy после T-023 |
| T-026 | QA | **READY** | Smoke `/waitlist` (dep T-025) |
| T-024 | Developer | **READY** | PostHog stub OFF |
| T-014 | PM / Human | IN_PROGRESS | Human OPTIONAL (gate) |
| T-015 | PM / Human | DONE (drafts) | Human: sign-off |
| T-018 | Dev + DevOps | DONE | https://quiet-partner.vercel.app |

---

## Риски (top 3 активных)

| ID | Риск | Статус | Комментарий PM |
|----|------|--------|----------------|
| **R8** | Dogfood bias | **Active / High** | 0/5 сессий; не блокирует T-023 |
| **R7** | LLM variance | **Active / Medium** | Staging BFF fallback OK (T-022) |
| **R2** | API cost | **Active / Medium** | Нет baseline 100 calls |

---

## North Star / metrics (baseline)

| Метрика | Baseline (30.05) | Target | Источник |
|---------|------------------|--------|----------|
| Dogfood sessions | **0/5** | ≥3 useful для G2→3 | `dogfood-log-template.md` |
| Staging smoke | **PASS** (T-022) | PASS before public CTA | `qa-report-phase3.md` |
| M0 decision | **не принято** | Go + sign-off | `m0-go-no-go-memo.md` |

---

## Связанные артефакты

- [`competitive-scan-1pager.md`](./competitive-scan-1pager.md)
- [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)
- [`dogfood-log-template.md`](./dogfood-log-template.md)
- [`deploy-staging.md`](./deploy-staging.md)
- [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md)
- [`team-assignments.md`](./team-assignments.md)

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-05-30 | PM | v1.0 — первый PM status |
| 2026-05-30 | PM | v1.1 — T-012…T-019 раздача |
| 2026-05-30 | PM | v1.2 — T-015 PM drafts DONE; T-014 template |
| 2026-05-30 | PM | v1.3 — PM-led governance; T-018/T-019/T-020 READY |
| 2026-05-30 | PM | **v1.4** — T-019…T-021 DONE; T-022 PASS; T-023 READY; T-024 BACKLOG; staging live |
| 2026-05-30 | PM | **v1.5** — Human «идите дальше»; T-023 DONE; T-025 redeploy + T-026 QA waitlist READY; T-024 READY; «Вопросы к Human» — только OPTIONAL |

# Git hygiene — T-088 (prep, no commit)

**Задача:** T-088 · **Роль:** Developer  
**Дата:** 2026-06-13 · **Статус:** prep DONE — **commit не выполнялся** (Human не просил)  
**Контекст:** post-M0 book sprint + GTM docs; working tree dirty после T-080…T-083

---

## TL;DR

**14 modified** + **~20 untracked** файлов. Рекомендуем **5 Conventional Commit групп** (feat → docs → chore). Секретов в diff нет. Перед push: `npm run build && npm run lint`.

---

## Uncommitted inventory (2026-06-13)

### Modified (tracked)

| Path | Δ lines | Назначение |
|------|---------|------------|
| `components/DashboardShell.tsx` | +18 | Book cards: FocusWeek, Stakeholder, Snapshot |
| `components/OnboardingWizard.tsx` | +113 | 4-step wizard + prep checklist step |
| `components/ProjectExportButton.tsx` | +23 | Weekly snapshot in export |
| `lib/advisor/llm.ts` | +20 | Friendlier 402/balance fallback suffix |
| `lib/analytics/posthog.ts` | +10 | Book feature events |
| `lib/onboarding.ts` | +68 | T-081 prep checklist + score deltas |
| `lib/store/useProjectStore.ts` | +190 | focusWeek, stakeholders, retention |
| `orchestration-queue.md` | +67 | T-080…T-083 DONE, journal |
| `docs/pm-status.md` | +197 | v5.0→v5.1 |
| `docs/prompt-regression-T-016.md` | +83 | T-076 live BLOCKED notes |
| `docs/qa-report-phase3.md` | +113 | Book compile + G-Book-P3 |
| `docs/roadmap.md` | +23 | Phase Book shipped |
| `docs/team-assignments.md` | +117 | WBS post-book |
| `docs/deploy-staging.md` | +7 | Deploy notes |

### Untracked (new)

| Path | Группа |
|------|--------|
| `components/FocusWeekCard.tsx` | **feat(book)** |
| `components/ProjectPrepChecklistStep.tsx` | **feat(book)** |
| `components/StakeholderLitePanel.tsx` | **feat(book)** |
| `components/WeeklySnapshotReminder.tsx` | **feat(book)** |
| `lib/focusWeek.ts` | **feat(book)** |
| `scripts/` | **chore** (проверить содержимое перед commit) |
| `docs/implementation-plan-phase-book.md` | **docs(book)** |
| `docs/technical-specification-book-features.md` | **docs(book)** |
| `docs/book-p2-dev-handoff-T-080-T-081.md` | **docs(book)** |
| `docs/ux-book-features-wireframes-T-080-T-083.md` | **docs(book)** |
| `docs/dogfood-book-features-guide.md` | **docs(book)** |
| `docs/gtm-sprint1-drafts-T-073.md` | **docs(gtm)** |
| `docs/gtm-roundtable-brief.md` | **docs(gtm)** |
| `docs/waitlist-metrics-spec-T-074.md` | **docs(gtm)** |
| `docs/manager-roundtable-report-2026-06-13.md` | **docs(pm)** |
| `docs/m0-roundtable-minutes.md` | **docs(pm)** |
| `docs/pm-next-steps-2026-06-13.md` | **docs(pm)** |
| `docs/Human-one-step-vercel-deploy.md` | **docs(ops)** |
| `docs/family-vpn-setup.md` | **exclude** — unrelated; не коммитить без Human |

---

## Security scan (pre-commit)

| Check | Result |
|-------|--------|
| `.env` / `.env.local` in git | ⬜ not in status — OK |
| `DEEPSEEK_API_KEY` in client paths | ⬜ only `lib/advisor/llm.ts` (server) |
| `DATABASE_URL` in docs | ⬜ only placeholders in runbooks |
| `family-vpn-setup.md` | ⚠️ review before any commit — may be personal |

---

## Suggested Conventional Commit groups

> **Порядок:** docs/planning first (optional) → feat → docs sync → chore queue. Human может squash в 1–2 коммита.

### 1. `feat(book): ship T-080…T-083 Alferov track`

```
feat(book): ship focus week, prep checklist, stakeholders, snapshot reminder

- FocusWeekCard + lib/focusWeek.ts (weakest domain question)
- 4-step onboarding with ProjectPrepChecklistStep (T-081)
- StakeholderLitePanel max 3 rows (T-082)
- WeeklySnapshotReminder + recordWeeklySnapshot (T-083)
- Store, analytics events, DashboardShell wiring
```

**Files:** all `components/Focus*`, `ProjectPrep*`, `Stakeholder*`, `Weekly*`, `lib/focusWeek.ts`, `lib/onboarding.ts`, `lib/store/useProjectStore.ts`, `lib/analytics/posthog.ts`, `components/DashboardShell.tsx`, `components/OnboardingWizard.tsx`, `components/ProjectExportButton.tsx`

### 2. `fix(advisor): friendlier DeepSeek balance fallback message`

```
fix(advisor): clarify offline co-pilot when DeepSeek balance is $0

- HTTP 402 + balance text → RU suffix in llm.ts
```

**Files:** `lib/advisor/llm.ts` (+ optional `components/HealthCommentary.tsx` if UX tweak shipped)

### 3. `docs: book track, GTM sprint, waitlist metrics`

```
docs: add Phase Book specs, GTM drafts, waitlist metrics, dogfood guide

- implementation-plan-phase-book, technical-specification-book-features
- gtm-sprint1-drafts, waitlist-metrics-spec, dogfood-book-features-guide
- manager-roundtable-report, pm-next-steps
```

**Files:** untracked `docs/*` except `family-vpn-setup.md`, `Human-one-step-vercel-deploy.md` (→ group 4)

### 4. `docs(ops): vercel deploy one-step for Human`

```
docs(ops): add Human one-step Vercel deploy note
```

**Files:** `docs/Human-one-step-vercel-deploy.md`, `docs/deploy-staging.md`

### 5. `chore: sync orchestration queue and PM journal`

```
chore: update orchestration queue, pm-status, qa-report for book sprint

- T-080…T-083 DONE; T-086 DEFERRED; G-Book-P3 PASS
```

**Files:** `orchestration-queue.md`, `docs/pm-status.md`, `docs/qa-report-phase3.md`, `docs/prompt-regression-T-016.md`, `docs/roadmap.md`, `docs/team-assignments.md`

---

## Pre-commit checklist (when Human asks)

- [ ] `npm run lint` — PASS
- [ ] `npm run build` — PASS
- [ ] `rg DEEPSEEK_API_KEY .next/static` — no matches
- [ ] Exclude `docs/family-vpn-setup.md` unless Human confirms
- [ ] Review `scripts/` contents
- [ ] No force-push to `main`

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | Developer (agent) | T-088 prep — inventory + 5 commit groups; no commit |

# Roadmap — Тихий напарник

**Обновлено:** 2026-06-07  
**План:** [`implementation-plan.md`](./implementation-plan.md) · **ТЗ:** [`technical-specification.md`](./technical-specification.md) · **Phase 5:** [`roadmap-phase5.md`](./roadmap-phase5.md) (**BLOCKED** до M0)

---

## Сделано (Phase 0–2 spike)

- [x] Bootstrap `quiet-partner/` (T-001)
- [x] Discovery: ICP, brief, product-decisions (T-002)
- [x] PMBOK playbook v1 + navigator scenarios (T-003)
- [x] ADR-001 LLM BFF + architecture (T-004)
- [x] DomainRadar + Zustand + BFF + HealthCommentary (T-005…T-007)
- [x] Onboarding spec + глоссарий (T-008)

## Сейчас (Human / gate)

- [x] Dogfood protocol + log template (T-014, T-039) — [`dogfood-protocol.md`](../knowledge-base/dogfood-protocol.md), [`dogfood-log-template.md`](./dogfood-log-template.md)
- [ ] 3–5 dogfood сессий (Human OPTIONAL) — [`dogfood-session-guides.md`](./dogfood-session-guides.md) + log
- [x] Dashboard glossary + navigator panel (T-037, T-038)
- [x] Navigator → BFF wiring + export snapshot (T-041, T-042)
- [x] Waitlist hero CTA polish (T-040)
- [ ] M0 Go / Pause / Pivot sign-off — [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md)
- [x] QA staging smoke — T-022, T-026 **PASS** (https://quiet-partner.vercel.app)
- [x] Senior PM static prompt regression — T-016

## Сделано (Phase 3 beta prep)

- [x] Staging deploy Vercel + runbook (T-018) — [`deploy-staging.md`](./deploy-staging.md)
- [x] QA checklist + smoke report (T-010, T-013)
- [x] Feedback UI 👍/👎 + «Отметить действие» (T-011)
- [x] Баннер первого визита → `/onboarding`

## Сделано (Phase 3–4)

- [x] Design tokens polish (T-021)
- [x] Landing `/waitlist` + staging deploy (T-023…T-026)
- [x] PostHog stub + wiring + consent OFF default (T-024, T-030)
- [x] PostHog self-host runbook (T-031) — [`posthog-self-host.md`](./posthog-self-host.md)
- [x] `GET /api/health` liveness (T-027)
- [x] Dashboard ↔ waitlist nav + onboarding banner fix (T-028)
- [x] API cost guardrails — rate limit ADR-001 + token budgets (T-029)
- [x] Phase 5 roadmap doc — BLOCKED until M0 (T-032)
- [x] Phase 5 prep scaffold AUTH/Redis OFF (T-033…T-036)
- [x] Waitlist API stub + form wire (T-044) — `POST /api/waitlist` noop default
- [x] localStorage migrate design (T-045) — [`localstorage-migrate-phase5.md`](./localstorage-migrate-phase5.md)
- [x] QA Phase 5 prep checklist (T-046) — [`qa-phase5-prep.md`](./qa-phase5-prep.md)
- [x] ADR-004 DB host draft Neon lean (T-047)
- [x] Drizzle client + waitlist postgres backend OFF-by-default (T-051) — [`drizzle/README.md`](../drizzle/README.md)

## Далее (после M0 Go — Human)

- Human: Neon `DATABASE_URL` + `npm run db:push` + `WAITLIST_BACKEND=postgres` — см. [`roadmap-phase5.md`](./roadmap-phase5.md)
- PostHog live on VPS + Vercel keys (Human OPTIONAL)
- Live LLM prompt regression (Human + `.env.local`)

## Не сейчас

- Auth / multi-tenant app code (**BLOCKED** — Phase 5)
- Jira integrations
- PostgreSQL implementation (**BLOCKED** — Phase 5)
- PMI certification positioning

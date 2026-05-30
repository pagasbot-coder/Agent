# Roadmap — Тихий напарник

**Обновлено:** 2026-05-30  
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
- [ ] 3–5 dogfood сессий (Human OPTIONAL) — заполнить log
- [x] Dashboard glossary + navigator panel (T-037, T-038)
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

## Далее (после M0 Go — Human)

- Phase 5: auth, PostgreSQL, waitlist backend — см. [`roadmap-phase5.md`](./roadmap-phase5.md)
- PostHog live on VPS + Vercel keys (Human OPTIONAL)
- Live LLM prompt regression (Human + `.env.local`)

## Не сейчас

- Auth / multi-tenant app code (**BLOCKED** — Phase 5)
- Jira integrations
- PostgreSQL implementation (**BLOCKED** — Phase 5)
- PMI certification positioning

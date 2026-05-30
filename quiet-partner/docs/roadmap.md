# Roadmap — Тихий напарник

**Обновлено:** 2026-05-30  
**План:** [`implementation-plan.md`](./implementation-plan.md) · **ТЗ:** [`technical-specification.md`](./technical-specification.md)

---

## Сделано (Phase 0–2 spike)

- [x] Bootstrap `quiet-partner/` (T-001)
- [x] Discovery: ICP, brief, product-decisions (T-002)
- [x] PMBOK playbook v1 + navigator scenarios (T-003)
- [x] ADR-001 LLM BFF + architecture (T-004)
- [x] DomainRadar + Zustand + BFF + HealthCommentary (T-005…T-007)
- [x] Onboarding spec + глоссарий (T-008)

## Сейчас

- [ ] 3–5 dogfood сессий (Human) — чеклист `knowledge-base/qa-checklist.md` (staging: https://quiet-partner.vercel.app)
- [ ] Senior PM sign-off prompt regression
- [ ] QA subset smoke на staging (после T-018 URL)

## Сделано (Phase 3 beta prep)

- [x] Staging deploy Vercel + runbook (T-018) — [`deploy-staging.md`](./deploy-staging.md)
- [x] QA checklist + smoke report (T-010)
- [x] Feedback UI 👍/👎 + «Отметить действие» (T-011)
- [x] Баннер первого визита → `/onboarding`

## Сделано (Phase 3–4)

- [x] Design tokens polish (T-021)
- [x] Landing `/waitlist` + staging deploy (T-023…T-026)
- [x] PostHog stub OFF (T-024)
- [x] `GET /api/health` liveness (T-027)
- [x] Dashboard ↔ waitlist nav + onboarding banner fix (T-028)

## Далее (Phase 4)

- API cost guardrails (Dev + Architect)
- PostHog instrumentation after G3→4 consent
- Phase 5 roadmap (auth, persistence) — PM doc, Human sign-off

## Не сейчас

- Auth / multi-tenant
- Jira integrations
- PostgreSQL (Phase 5)
- PMI certification positioning

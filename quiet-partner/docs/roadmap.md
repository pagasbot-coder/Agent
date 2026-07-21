# Roadmap — Тихий напарник

**Обновлено:** 2026-06-13  
**План:** [`implementation-plan.md`](./implementation-plan.md) · **Book track:** [`implementation-plan-phase-book.md`](./implementation-plan-phase-book.md) · **ТЗ:** [`technical-specification.md`](./technical-specification.md) · [`technical-specification-book-features.md`](./technical-specification-book-features.md) · **Phase 5:** [`roadmap-phase5.md`](./roadmap-phase5.md)

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

## Сейчас (post-M0 — GTM + validation)

- [ ] **T-073** GTM sprint 1 — 2 канала, UTM, copy tests — [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md)
- [ ] **T-074** Waitlist metrics spec + weekly snapshot — **READY**
- [ ] **T-078** Staging smoke regression — **READY**
- [ ] T-075 PostHog VPS (OPTIONAL) · T-076 live prompt regression (OPTIONAL)

## Phase Book (Alferov) — **DONE** 2026-06-13

**Book track закрыт:** Human **waived G-Book-P2**; autonomous sprint доставил T-080…T-083 на prod; **G-Book-P3 smoke PASS** (qa-report). Фичи: фокус недели, 4-step onboarding + чек-лист проработки, stakeholder lite, weekly snapshot + reminder — см. [`implementation-plan-phase-book.md`](./implementation-plan-phase-book.md), [`technical-specification-book-features.md`](./technical-specification-book-features.md).

- [x] **T-080** «Фокус недели» — dashboard card
- [x] **T-081** Onboarding checklist — step 3 of 4
- [x] **T-082** Stakeholder map lite
- [x] **T-083** Weekly snapshot + reminder

**Post-book phase (сейчас):** traction + validation без live LLM — **Human P0** GTM post (T-073 drafts), **15-min book dogfood** (T-087), Growth **W25 waitlist snapshot** (T-074); DeepSeek top-up **DEFERRED** (fallback co-pilot ok); billing **paused**. Следующий product gate — G-Book-0 cont. (≥2 GTM канала) review **2026-06-20**; stop-check CR/signups **2026-06-27** ([`pm-status.md`](./pm-status.md) v5.3).

## Далее (Human OPTIONAL / Phase 5)

- Human: Neon `DATABASE_URL` + `npm run db:push` + `WAITLIST_BACKEND=postgres` — см. [`roadmap-phase5.md`](./roadmap-phase5.md)
- PostHog live on VPS + Vercel keys (Human OPTIONAL)
- Live LLM prompt regression (Human + `.env.local`)
- Billing activation T-069…T-071 — **paused** until Human «можно подключать»

## Не сейчас

- Auth / multi-tenant app code (**BLOCKED** — Phase 5)
- Jira integrations
- PostgreSQL implementation (**BLOCKED** — Phase 5)
- PMI certification positioning

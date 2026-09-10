# CPO Report — Quiet Partner (M0)

**Продукт:** Тихий напарник / Quiet Partner  
**Дата:** 2026-06-07  
**Аудитория:** CPO, founder, investor-lite  
**Владелец:** PM (факты из QA, dogfood log, desk research)  
**Статус:** **канонический M0-документ для решения Go / Pause / Pivot**

> **О prior roundtable:** [`m0-roundtable-minutes.md`](./m0-roundtable-minutes.md) — внутренняя async-симуляция Muster-агентов, не замена Human sign-off и не evidence для инвестора. **Этот отчёт заменяет minutes для CPO.** Синтетические «цитаты ролей» в minutes не используются как доказательства.

---

## 1. Executive summary

### Что существует (факт)

За Phase 0–4 команда собрала **рабочий staging-продукт** на Next.js 16: DomainRadar (8 доменов PMBOK 7), onboarding (3 шага), HealthCommentary через BFF DeepSeek, waitlist с Postgres-бэкендом, SEO, cost guardrails, health endpoint. Задачи **T-001…T-053** закрыты; build/lint и staging smoke — **PASS** ([`qa-report-phase3.md`](./qa-report-phase3.md)). Staging: **https://quiet-partner.vercel.app**.

### Что подтверждено (verified)

| Область | Evidence | Вердикт |
|---------|----------|---------|
| Техническая готовность MVP | QA smoke, staging T-022/T-026 | **PASS** |
| Live LLM на staging | POST BFF 200, live DeepSeek без fallback-suffix | **PASS** (T-026) |
| Cost guardrails | Rate limit 20/15min/IP; weekly token budget 200k | **PASS** (T-029) |
| Waitlist → Postgres | T-051 activation DONE | **PASS** |
| Static prompt regression | 4 сценария S1–S4 | **PASS** (T-016 static) |
| Competitive positioning (desk) | [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) финализирован | **Draft internal** |

### Что НЕ подтверждено (gaps)

| Область | Факт | Последствие |
|---------|------|-------------|
| **Product-market fit** | 0 paying users; 0 внешних интервью (по плану) | Нет evidence спроса |
| **Dogfood quality** | 4/5 сессий, **2 useful** из 4 (порог ≥3 **не достигнут**) | Слабый signal ценности LLM |
| **Retention** | Не измерялась (PostHog OFF) | Неизвестно, вернутся ли PM |
| **Auth + billing** | AUTH OFF; Stripe не подключён | Нельзя брать деньги |
| **Live prompt regression** | T-049 BACKLOG | Качество LLM на prod-сценариях не верифицировано live |
| **TAM/SAM/SOM, LTV/CAC** | Napkin models | **Гипотезы**, не validated |

### Рекомендация (conditional Go)

**Условный Go** на Phase 5 (auth + billing groom) **при явном waiver G2→3** и осознанном принятии риска «продукт технически готов, ценность для PM — слабо доказана».

**Не Go**, если CPO ожидает подтверждённый PMF или ≥3 useful dogfood **до** монетизации.

**Pause**, если Human не готов использовать продукт weekly и не планирует dogfood #5 или 5–10 внешних beta-users.

**Pivot**, если после 4 нед beta с auth retention &lt;20% week-2 или 0/10 beta-users отмечают commentary useful.

---

## 2. Product snapshot

### Shipped scope (T-001…T-053)

| Блок | Задачи | Что в prod/staging |
|------|--------|-------------------|
| **Foundation** | T-001, T-004 | Next.js 16, Tailwind, shadcn, ADR-001 BFF |
| **Core UX** | T-005…T-007, T-012 | DomainRadar, Zustand store, HealthCommentary BFF |
| **Onboarding** | T-008, T-009 | 3-step wizard → radar hydrate |
| **Playbook** | T-003, T-016, T-038 | PMBOK 8 domains, static regression, navigator panel |
| **QA / dogfood UI** | T-010…T-013, T-011 | Checklist, 👍/👎 feedback, thresholds 40/70 |
| **Deploy** | T-018, T-022, T-025, T-026 | Vercel staging, smoke PASS, live LLM |
| **Growth surface** | T-019, T-023, T-040, T-053 | `/waitlist`, SEO meta/OG, robots, sitemap |
| **Guardrails & analytics stub** | T-027, T-029, T-024, T-030 | `/api/health`, cost limits, PostHog OFF |
| **Phase 5 prep (OFF)** | T-033…T-036, T-044…T-047 | Auth scaffold OFF, Redis OFF, Drizzle draft |
| **Postgres live** | T-051 | Waitlist `postgres` backend ACTIVATED |
| **M0 prep docs** | T-054…T-061 | Competitive scan, market research, financial model, GTM brief |

**Не shipped:** multi-user auth, billing, team workspaces, PostHog prod, Redis prod, email (Listmonk), live prompt regression (T-049).

### Staging URL

| URL | Статус (verified) |
|-----|-------------------|
| https://quiet-partner.vercel.app | **Live** — GET `/`, `/onboarding`, `/waitlist` → 200 (T-022) |
| POST `/api/advisor/health-commentary` | **200 + JSON** — live DeepSeek после redeploy (T-026) |
| GET `/api/health` | **200** — boolean env checks, no secrets |

### Health metrics (verified only)

Источник: [`app/api/health/route.ts`](../app/api/health/route.ts), QA T-026/T-029, activation T-051.

| Check | Значение | Verified how |
|-------|----------|--------------|
| **Postgres / waitlist** | `waitlist_backend: postgres`, `database_configured: true` | T-051 activation; health endpoint |
| **LLM (DeepSeek)** | `deepseek_api_key_configured: true` на staging | T-026 live commentary без fallback suffix |
| **Cost guardrails** | Rate limit 20 req / 15 min / IP; `ADVISOR_WEEKLY_TOKEN_BUDGET=200000` (~83 calls/week instance-wide) | T-029 code + health snapshot |
| **Auth** | `auth_enabled: false` | By design — Phase 5 |
| **PostHog** | `posthog_disabled: true` | ADR-002; analytics OFF |
| **Redis rate limit** | In-memory fallback (Redis OFF) | T-036 default |

**Не verified в этом отчёте:** фактический `/api/health` response на prod **сейчас** (последний smoke — 2026-05-30). Рекомендация CPO: один curl перед sign-off.

---

## 3. Validation evidence

### Dogfood (Human-only)

| Метрика | Факт | Gate G2→3 |
|---------|------|-----------|
| Сессий проведено | **4 / 5** (2026-05-31) | Plan: 3–5 |
| Useful (👍) | **2 / 4** | Plan: **≥3** |
| Per-session Y/N | **Не зафиксированы** в log | Слабый audit trail |
| Исполнитель | Human (Pavel), проекты Human | R8 bias acknowledged |

Источник: [`dogfood-log-template.md`](./dogfood-log-template.md), [`dogfood-protocol.md`](../knowledge-base/dogfood-protocol.md).

**Честная слабость:** aggregate «2 useful из 4» без построчного Y/N — **недостаточно для уверенного заявления о ценности LLM**. Продукт прошёл технический gate; **product value gate — частично провален**, компенсирован только waiver.

### Waiver G2→3

| Элемент | Статус |
|---------|--------|
| Порог ≥3 useful | **Не достигнут** (2/4) |
| Waiver | **Предложен** PM в [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md); зафиксирован в async minutes |
| Human sign-off Go | **⬜ Не подписан** |
| Dogfood #5 | **Optional** (T-050 BACKLOG) — +1 useful без блокировки Go |

### Внешняя валидация

| Метод | Статус |
|-------|--------|
| Problem interviews | **Не проводились** — по [`implementation-plan.md`](./implementation-plan.md) и T-002 AC |
| Beta users (вне Human) | **0** |
| Waitlist signups (quantified) | **Не аудировано** в этом отчёте — нет verified count в QA |
| Workshop PM/РП (live) | **Не проводился** — invite list draft only |

**Вывод:** validation = **1 founder + desk research**. Это сознательный scope Phase 0, не accident — но CPO должен считать PMF **unproven**.

---

## 4. Market & competition

> Все числа ниже — **HYPOTHESIS** (desk research, internal drafts). Не аудированы, не подтверждены интервью или платящими клиентами.

### Positioning (desk, verified as draft)

Wedge: **health radar + questions-first AI co-pilot**, не task tracker, не exam prep.  
Источники: [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) (T-054), [`market-research-phase4.md`](./market-research-phase4.md) (T-059).

| Конкурент / категория | Пересечение | Gap (наш wedge) |
|----------------------|-------------|-----------------|
| Jira + Atlassian AI | AI в тикетах | Нет целостного health по 8 доменам |
| Notion AI | Docs + generic AI | Нет PMBOK-lens radar, RU plain language |
| Linear, YouTrack | Dev delivery | Не PM agency wedge |
| MS Project / Planner | Enterprise planning | Тяжёлый; не «что горит сегодня» |
| PMP exam trainers | PMBOK термины | **Anti-persona** — мы не cert tool |
| ChatGPT Plus | Ad-hoc советы | Нет persisted radar + playbook |

### Market size (HYPOTHESIS)

| Уровень | Оценка | Источник |
|---------|--------|----------|
| TAM (RU PM/РП с digital tools) | **~350–500 тыс.** | [`market-research-phase4.md`](./market-research-phase4.md) — napkin |
| SAM (SMB/agency, 2–8 projects, RU) | **~40–70 тыс.** | HYPOTHESIS — ICP filter |
| SOM year-1 (post-M0) | **300–800 WAU · 30–120 paying** | HYPOTHESIS — 0,1–0,2% SAM awareness |

### Pricing benchmarks (desk, HYPOTHESIS)

| Якорь | Диапазон | Примечание |
|-------|----------|------------|
| Notion + AI | ~$10–20/mo | Шире scope |
| ChatGPT Plus | ~$20/mo | Substitute |
| Niche PM AI (US) | $15–29/mo | Band reference |
| **Quiet Partner (draft)** | $15–25/mo | Не validated WTP |

---

## 5. Unit economics

> **MODEL, не fact.** Источник: [`financial-model-m0.md`](./financial-model-m0.md), [`costGuardrails.ts`](../lib/advisor/costGuardrails.ts), ADR-001.

### DeepSeek cost per commentary (estimate)

| Параметр | Значение |
|----------|----------|
| Tokens per call | ~2 000–2 800 (typical ~2 400) |
| Cost per call | **~$0,001–0,003** |
| Light user (2–3 commentary/wk) | ~$0,01–0,04/mo API |
| Active user (5–8/wk) | ~$0,02–0,10/mo API |
| Target &lt;$0,50/WAU/wk (landing) | **Достижим** при normal usage; риск — abuse, не unit cost |

### Fixed costs (early stage, MODEL)

| Статья | $/mo |
|--------|------|
| Vercel + Neon + optional PostHog | **~$20–40** |
| Break-even infra @ $20 ARPU | **~2 paying users** (napkin) |

### Freemium scenarios (MODEL)

| Scenario | Free | Paid | Когда |
|----------|------|------|-------|
| **A — Conservative** | Radar + 3 commentary/wk | $19/mo, 15/wk | Monetize после retention signal |
| **B — Growth** | 5 commentary/wk | $15/mo fair-use | Больше top-of-funnel |
| **C — Delay monetization** | Full demo cap | No paid until ≥100 WAU | Retention first |

### Break-even sensitivity (MODEL)

| Assumption | Base | Stress (+20% API) |
|------------|------|-------------------|
| Break-even paying @ $20 ARPU, $30 fixed | ~2 users | ~2 users (unchanged at napkin precision) |
| 100 WAU, 15% paid, $20 ARPU | ~+$255/mo net | ~+$252/mo |
| LTV @ 30% pay over 12mo, $19 | ~$68 | **Aggressive** — stress at 15–20% → ~$34–45 |

---

## 6. Monetization options

> **Не pre-decided.** $19/mo из roundtable minutes — **одна из опций**, не решение CPO.

| Option | Модель | Pros | Cons | Evidence needed |
|--------|--------|------|------|-----------------|
| **1. Freemium Pro (solo PM)** | Free: radar + capped AI; Pro $15–19/mo | Низкий барьер входа; API cost controllable | Solo PM WTP часто низкий; нужен auth + Stripe | Waitlist role field; 10 beta conversions |
| **2. Delay monetization** | Free beta до ≥100 WAU или ≥40% wk-2 retention | Фокус на retention, не на price | Burn = time + API; нет revenue signal | PostHog ON; cohort 4 weeks |
| **3. Team / agency tier (later)** | $49–99/mo, 3–5 seats | Выше ARPU; ближе к ICP «agency» | Нужен multi-tenant, billing complexity | Employer vs personal payer test |
| **4. One-time / workshop (non-SaaS)** | ₽15–40k workshop + tool access | Cash upfront | Не recurring; другой бизнес-модель | SME channel test — **не в scope M0** |

**Рекомендация для CPO (не PM):** выбрать **Option 1 или 2** на M0; Option 3 — только после auth + 50+ WAU.

---

## 7. Risks & gaps

| ID | Риск | Severity | Status | Mitigation |
|----|------|----------|--------|------------|
| **R8** | Dogfood bias (1 user, own projects) | **High** | Active | Waiver documented; need external beta |
| **R-PMF** | Retention unknown | **High** | Open | PostHog activation; wk-2 cohort |
| **R-pay** | No paying users | **High** | Open | T-063 auth + billing after Go |
| **R-auth** | Auth/billing not shipped | **Medium** | By design | [`auth-activation-runbook.md`](./auth-activation-runbook.md) |
| **R7** | LLM variance / quality | **Medium** | Active | T-049 live regression BACKLOG |
| **R2** | API cost abuse | **Low–Med** | Mitigated | T-029 guardrails; per-user budget post-auth |
| **M1** | AI commoditization (Notion, Atlassian) | **Medium** | Desk | Moat = 8-domain lens + RU playbook — **unproven** |
| **M3** | Low WTP solo PM | **Medium** | HYPOTHESIS | Payer test on waitlist |

### Known gaps (implementation)

- AUTH_ENABLED=false; no login flow in prod
- No Stripe / billing
- PostHog OFF — no funnel metrics
- Redis OFF — in-memory rate limit only
- Dogfood per-session Y/N not logged
- No external user interviews (by plan)

---

## 8. Recommendation

### Decision matrix

| Decision | Условия | Следующий шаг |
|----------|---------|---------------|
| **Go (conditional)** | CPO принимает waiver G2→3; готов инвестировать 4–8 нед в auth + 10 external beta; API burn &lt;$50/mo acceptable | Human sign-off → T-063 groom → auth activation |
| **Pause** | CPO не видит value без ≥3 useful или external validation | Archive; document learnings; no Phase 5 spend |
| **Pivot** | Radar без LLM ценности; или ICP = exam prep traffic | Новый wedge (e.g. agency dashboard only, no AI) |

### Criteria for Go (measurable, 4 weeks post-auth)

1. **≥10 external beta users** onboarded (not only Human)
2. **≥50% useful** on HealthCommentary (👍 or explicit feedback)
3. **≥30% week-2 retention** (WAU cohort)
4. **≥5 waitlist → activated** without paid ads
5. **Live prompt regression T-049 PASS**

Fail ≥2 criteria → **Pause** or **Pivot** review.

### Что CPO решает за 15 минут

| # | Вопрос | Options |
|---|--------|---------|
| 1 | **Go / Pause / Pivot?** | Checkbox in [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) |
| 2 | **Принять waiver G2→3?** | Yes (2 useful) / No (require dogfood #5 or 3 external sessions) |
| 3 | **Monetization path?** | Option 1 (freemium now) / Option 2 (delay) / Option 3 (defer) |
| 4 | **Price anchor для beta copy?** | $15 / $19 / $25 — **hypothesis test**, not final |
| 5 | **Budget cap API + infra?** | e.g. $50/mo max until 100 WAU |
| 6 | **External beta?** | Who recruits 10 PM (Human network / waitlist / none) |

---

## 9. Appendix — artifacts

| Artifact | Path | Role |
|----------|------|------|
| **This report** | [`cpo-report-m0.md`](./cpo-report-m0.md) | CPO decision pack |
| PM status | [`pm-status.md`](./pm-status.md) | Weekly ops |
| Go/no-go memo | [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) | Human checkbox |
| QA evidence | [`qa-report-phase3.md`](./qa-report-phase3.md) | Verified PASS items |
| Dogfood log | [`dogfood-log-template.md`](./dogfood-log-template.md) | 4/5, 2 useful |
| Competitive scan | [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) | Desk draft |
| Market research | [`market-research-phase4.md`](./market-research-phase4.md) | TAM/SAM/SOM HYPOTHESIS |
| Financial model | [`financial-model-m0.md`](./financial-model-m0.md) | Unit economics MODEL |
| GTM brief | [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) | Channel hypotheses |
| Auth runbook | [`auth-activation-runbook.md`](./auth-activation-runbook.md) | Phase 5 activation |
| Staging runbook | [`deploy-staging.md`](./deploy-staging.md) | Vercel ops |
| Roundtable minutes (superseded for CPO) | [`m0-roundtable-minutes.md`](./m0-roundtable-minutes.md) | Internal simulation |
| Orchestration queue | [`orchestration-queue.md`](../orchestration-queue.md) | T-001…T-063 status |
| Product brief | [`product-brief.md`](../knowledge-base/product-brief.md) | ICP, scope |

---

*Документ подготовлен без синтетических цитат и без roleplay. Факты = QA PASS, dogfood log, activation records. Гипотезы помечены явно.*

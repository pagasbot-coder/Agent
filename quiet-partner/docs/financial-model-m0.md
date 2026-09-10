# Financial model M0 — token economics & break-even

**Задача:** T-060 · **Роль:** SME (financial analysis) + PM review  
**Дата:** 2026-06-07 · **Статус:** napkin model для M0 Block 2  
**Не является:** audited forecast; input для Go/Pause и price anchor

> **Источники:** [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) §Unit economics · [`adr-001-llm-bff.md`](../knowledge-base/adr-001-llm-bff.md) · [`costGuardrails.ts`](../lib/advisor/costGuardrails.ts) · [`market-research-phase4.md`](./market-research-phase4.md)

---

## TL;DR

Один **HealthCommentary** ≈ **2,0–2,8k tokens** (DeepSeek) ≈ **$0,001–0,003** за вызов при текущих list prices. Target **&lt;$0,50/WAU/week** из landing one-pager **достижим** при ≤5–10 commentary/нед на активного user. Break-even **инфраструктуры** при **$20 ARPU** — порядка **2–4 paying users**; устойчивый margin при **50+ WAU** и **15–20% paid conversion**. API **+20%** сдвигает break-even на **~+1 paying user** при тех же assumptions.

---

## Cost per commentary (DeepSeek estimate)

### Token budget per call (из кода)

| Компонент | Tokens (est.) | Источник |
|-----------|---------------|----------|
| System prompt + playbook context | ~1 200–1 800 | `lib/systemPrompt.ts` |
| User message (scores + meta + situation) | ~400–700 | `lib/advisor/llm.ts` |
| Assistant output (cap) | ≤512 | `ADVISOR_MAX_TOKENS=512` |
| **Total per request** | **~2 000–2 800** | Typical ~2 400 |

### Provider pricing (DeepSeek `deepseek-chat`, napkin Q2 2026)

| | $ / 1M tokens | Примечание |
|---|---------------|------------|
| Input | ~$0,27 | cache miss |
| Output | ~$1,10 | max 512 on our side |

**Cost per commentary (mid):**

```
input:  2 000 × $0,27 / 1M = $0,00054
output:   400 × $1,10 / 1M = $0,00044
total ≈ $0,001 per commentary (round $0,001–0,003 with variance)
```

| Usage pattern | Commentary / week | API cost / user / week | API cost / user / month |
|---------------|-------------------|------------------------|-------------------------|
| Light (dogfood) | 2–3 | ~$0,003–0,009 | ~$0,01–0,04 |
| Active beta | 5–8 | ~$0,005–0,024 | ~$0,02–0,10 |
| Heavy (risk) | 15–20 | ~$0,015–0,060 | ~$0,06–0,25 |
| Guardrail stress | 20 req / 15 min cap | rate-limited | T-029 mitigates abuse |

**Target check (landing):** &lt;$0,50/WAU/week → при 5 commentary/нед ≈ **$0,005** — **запас &gt;100×** до cap; узкое место — **abuse / shared IP**, не normal ICP usage.

---

## Free tier vs paid scenarios

| Scenario | Free tier | Paid (Pro PM) | Guardrails |
|----------|-----------|---------------|------------|
| **A — Conservative** | Radar + onboarding; **3 commentary/wk** | $19/mo; **15 commentary/wk** | T-029 weekly pool 200k tokens instance-level |
| **B — Growth** | **5 commentary/wk** | $15/mo; fair-use «unlimited»* | Per-user budget post-auth (Phase 5) |
| **C — Pause monetization** | Full demo cap | No paid until **≥100 WAU** | Minimize API until retention proven |

\* *Fair-use = soft cap + fallback RU, не raw API passthrough.*

### Weekly token pool (current prod defaults)

| Env | Default | Commentary equiv. (~2,4k each) |
|-----|---------|--------------------------------|
| `ADVISOR_WEEKLY_TOKEN_BUDGET` | 200 000 | ~83 calls / week **instance-wide** |
| Rate limit | 20 req / 15 min / IP | Anti-abuse |

**M0 decision needed:** split instance pool between free beta users vs reserve for paid (see Block 2 agenda).

---

## Fixed & variable costs (early stage)

| Статья | $/mo (early) | Notes |
|--------|--------------|-------|
| Vercel (hobby → pro) | $0–20 | Staging + prod alias |
| Neon Postgres | $0–19 | Waitlist + future auth |
| PostHog self-host | $0–15 | OPTIONAL (T-048) |
| Domain / email | $0–10 | Human OPTIONAL |
| **Fixed OSS subtotal** | **~$20–40** | ADR-004 lean path |
| API variable | ~$0,02–0,25 / active user / mo | см. usage table |
| Human time (Phase 4) | not in COGS | CAC = time, not cash |

---

## Break-even (paying users / month)

**Formula:**

```
break_even_paying = fixed_monthly / (ARPU - API_cost_per_paying_user)
```

| ARPU | API / paying user / mo | Gross margin / user | Fixed $30/mo | Break-even paying users |
|------|------------------------|---------------------|--------------|-------------------------|
| **$15** | $0,10 (light) | $14,90 | $30 | **3** |
| **$15** | $0,25 (active) | $14,75 | $30 | **3** |
| **$20** | $0,10 | $19,90 | $30 | **2** |
| **$20** | $0,25 | $19,75 | $30 | **2** |
| **$25** | $0,10 | $24,90 | $30 | **2** |
| **$25** | $0,25 | $24,75 | $30 | **2** |

**With free-tier subsidy (100 WAU, 15% paid = 15 paying):**

| | $20 ARPU, 15 paying |
|---|---------------------|
| Revenue | $300/mo |
| API (100 users × $0,15 avg) | ~$15/mo |
| Fixed | ~$30/mo |
| **Net (napkin)** | **~+$255/mo** |

**Waitlist → paid napkin:** 50 signups × 40% activate × 20% convert ≈ **4 paying** → revenue ~$80, still above infra break-even if API controlled.

---

## LTV / CAC (from landing-waitlist-one-pager)

| Метрика | Assumption | Target | Source |
|---------|------------|--------|--------|
| **Price band** | $15–25/mo | Anchor **$19** for model | landing §Unit economics |
| **Paid conversion** | 30% of subscribers (12 mo horizon) | Conservative for calc | landing napkin |
| **LTV (napkin)** | $19 × 12 × 30% | **~$68** | mid band |
| **CAC (Phase 4)** | Organic + Human time | **&lt;$20** | no paid ads pre-M0 |
| **LTV:CAC** | — | **&gt;3:1** | gate before paid ads |

**SME note:** 30% pay over 12 mo — **агрессивно** для solo PM tool без employer budget; stress-test at **15–20%** → LTV **~$34–45**, still &gt;3:1 if CAC &lt;$15 organic.

---

## Sensitivity: API price +20%

Assume provider raises effective $/token by **20%**:

| Metric | Base | +20% API |
|--------|------|----------|
| Cost / commentary | $0,001 | $0,0012 |
| Active user API / mo (8/wk) | ~$0,10 | ~$0,12 |
| Break-even @ $20 ARPU, fixed $30 | 2 paying | **2 paying** (unchanged at napkin precision) |
| 100 WAU blended API | ~$15/mo | ~$18/mo |
| Margin @ 15 paying × $20 | ~$255/mo | ~$252/mo |

**Conclusion:** +20% API **не ломает** модель при текущих usage caps; риск — **heavy users + weak guardrails**, не list price drift.

---

## Decisions for M0 Block 2

1. **Price anchor:** $15 / $19 / $25 — pick one for beta copy.
2. **Free cap:** 3 vs 5 commentary/week before paywall.
3. **Payer test:** PM personal vs company (waitlist «роль» field).
4. **Monetize timing:** Scenario A/B/C — когда включать Stripe (Phase 5 backlog).

---

## References

- [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md)
- [`m0-roundtable-agenda.md`](./m0-roundtable-agenda.md) §6
- [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md)
- [`market-research-phase4.md`](./market-research-phase4.md)

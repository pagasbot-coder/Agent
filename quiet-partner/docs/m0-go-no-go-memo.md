# M0 — Go / Pause / Pivot

**Дата:** 2026-06-08 · **PM:** T-015 / T-055 · **CPO report (канон):** [`cpo-report-m0.md`](./cpo-report-m0.md) · Minutes (internal): [`m0-roundtable-minutes.md`](./m0-roundtable-minutes.md)

> **Human Go (2026-06-08):** Directive «пошли дальше» — **Go на продукт** (Phase 5). RU billing scaffold (YooKassa ADR + код) — **DONE**, но **подключение оплаты явно приостановлено** Human («пока не подключай», 2026-06-08). `BILLING_ENABLED=false`; merchant — когда Human скажет «готово». См. [`roadmap-phase5.md`](./roadmap-phase5.md).

---

## Рекомендация PM: **Conditional Go** (pending Human sign-off)

**Основание:** spike + onboarding + QA smoke PASS; Phase 0–4 impl (T-001…T-053) закрыт; staging live; waitlist Postgres ACTIVATED. **Dogfood:** 4/5 сессий, **2 useful** — G2→3 waived. **PMF не доказан** (0 внешних интервью, 0 paying). Monetization — **options**, не pre-decision — см. §6 [`cpo-report-m0.md`](./cpo-report-m0.md).

**Разблокировка Phase 5 (вне очереди):** Human checkbox **Go** ниже → новый backlog по [`roadmap-phase5.md`](./roadmap-phase5.md) + kill criteria 90d из CPO report §8.

---

## PM recommends Go — pending Human sign-off

- [x] **PM recommends Conditional Go** — [`cpo-report-m0.md`](./cpo-report-m0.md) §8
- [x] **Waiver G2→3** — dogfood 4/5, 2 useful; порог ≥3 waived
- [x] **Monetization option** — **A (freemium Pro)** для RU; ~990 ₽/мес гипотеза; YooKassa ADR-005
- [x] **Human sign-off Go** — Pavel, directive «пошли дальше» (2026-06-08); продукт Phase 5
- [x] **Billing connection paused** — Human «пока оплату не подключай» (2026-06-08); scaffold остаётся, activation deferred

---

## Критерии

| Решение | Условие |
|---------|---------|
| **Go** | ≥3 dogfood с 👍 **или waiver**; commentary не generic; Human подписывает ниже |
| **Pause** | <2 полезных сессий; нет confidence в LLM value |
| **Pivot** | ICP не резонирует; продукт = «игрушка радара» |

---

## Evidence (QA / PM — без Human sign-off)

> Источник: [`docs/qa-report-phase3.md`](./qa-report-phase3.md) (2026-05-30). Dogfood и spike demo — **Human**.

### Сводка

| Категория | Вердикт | Ссылка |
|-----------|---------|--------|
| Build + lint | **PASS** | qa-report §Сводка |
| Phase 3 compile + browser smoke | **PASS with notes** | qa-report §Browser smoke (T-013) |
| Staging smoke (vercel.app) | **PASS** | qa-report §Staging smoke (T-022) |
| Waitlist + live LLM staging | **PASS** | qa-report §Waitlist staging (T-026) |
| Cost guardrails | **PASS** | qa-report §Cost guardrails (T-029) |
| Prompt regression (static S1–S4) | **PASS** | qa-report §Prompt regression (T-016) |
| Phase 3–4 full pass (T-040…T-042) | **PASS** | qa-report §Phase 3–4 full pass |
| Thresholds 40/70 | **PASS** | qa-report §T-012; `lib/domains.ts` |
| Feedback UI 👍/👎 | **PASS** | qa-report §T-011 |
| Disclaimer «не сертификация PMI» | **PASS** | qa-report §Prompt regression |
| `GET /api/health` | **PASS** | qa-report §Waitlist staging |
| Competitive scan | **Финализирован (T-054)** | [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) |
| T-051 Drizzle + waitlist postgres | **ACTIVATED** | [`Human-one-step-database.md`](./Human-one-step-database.md) |
| M0 roundtable | **DONE (2026-06-07)** | [`m0-roundtable-minutes.md`](./m0-roundtable-minutes.md) |

### Детали PASS (выборка)

| ID | Проверка | Статус |
|----|----------|--------|
| B1–B4 | build, lint, secrets, .env | PASS |
| R1–R3, R6 | routes + health | PASS |
| D1–D5 | DomainRadar 8 доменов, пороги, a11y | PASS |
| H1–H5 | Commentary loading, fallback, disclaimer, feedback | PASS |
| O1–O4 | Onboarding 3 шага | PASS (redirect — MANUAL dogfood) |
| S1 | API key server-only | PASS |
| T-040 | Waitlist CTA above fold | PASS |
| T-041 | Navigator → BFF `userSituation` | PASS |
| T-042 | Export snapshot clipboard/JSON | PASS |

### Dogfood + waiver

| Источник | Статус |
|----------|--------|
| [`docs/dogfood-log-template.md`](./dogfood-log-template.md) | ☑ **4/5** сессий (2026-05-31); **2/4 useful** |
| **Waiver G2→3** | ☑ **Granted** на M0 roundtable 2026-06-07 — Go не blocked |
| [`docs/competitive-scan-1pager.md`](./competitive-scan-1pager.md) | ☐ прочитан Human |
| Spike demo (staging) | ☑ Human видел https://quiet-partner.vercel.app (roundtable demo) |
| Live BFF 4 сценария (T-016) | WAIVE — static PASS; live — Human + key |
| Dogfood guides | [`dogfood-session-guides.md`](./dogfood-session-guides.md) — #1–#4 |

---

## [Human: sign-off]

- [x] **Go** — продолжаем Phase 5 (продукт; billing scaffold готов, **live оплата paused** Human)  
- [ ] **Pause** — архив, lessons learned  
- [ ] **Pivot** — новый wedge: _______________

**Подпись:** Pavel **Дата:** 2026-06-08 (directive: «пошли дальше. оплата нужна для россии»)

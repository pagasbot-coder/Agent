# M0 — Go / Pause / Pivot (черновик)

**Дата:** 2026-05-30 · **PM:** T-015 · **[Human: sign-off до 13.06.2026]**

---

## Рекомендация PM (черновик): **Go заблокирован** — dogfood **2/4 useful**

**Основание:** spike + onboarding + QA smoke PASS; пороги 40/70 синхронизированы; Phase 3–4 impl (T-001…T-043) закрыт; staging live. **Dogfood Human (2026-05-31):** 4 сессии, **2 useful** (👍) — ниже порога ≥3 для G2→3.

**Разблокировка Go:** ≥3 useful (ещё **+1 useful** сессия #5) **или** письменный **waiver G2→3** от Human (`docs/pm-governance.md`). Альтернатива: **M0 Pause**.

---

## Критерии

| Решение | Условие |
|---------|---------|
| **Go** | ≥3 dogfood с 👍; commentary не generic; Human подписывает ниже |
| **Pause** | <2 полезных сессий; нет API key для проверки LLM |
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
| Competitive scan | **Черновик готов** | [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) |

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

### Ожидает Human

| Источник | Статус |
|----------|--------|
| [`docs/dogfood-log-template.md`](./dogfood-log-template.md) | ☑ **4/5** сессий (2026-05-31); **2/4 useful** — **Go blocked** до ≥3 useful или waiver |
| [`docs/competitive-scan-1pager.md`](./competitive-scan-1pager.md) | ☐ прочитан Human |
| Spike demo (staging) | ☐ Human видел https://quiet-partner.vercel.app |
| Live BFF 4 сценария (T-016) | WAIVE — static PASS; live — Human + key |
| Dogfood guides | [`dogfood-session-guides.md`](./dogfood-session-guides.md) — #1–#3 |

---

## [Human: sign-off]

- [ ] **Go** — продолжаем Phase 3–4  
- [ ] **Pause** — архив, lessons learned  
- [ ] **Pivot** — новый wedge: _______________

**Подпись:** _______________ **Дата:** _______________

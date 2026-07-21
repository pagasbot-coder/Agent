# Product Brief — Тихий напарник (Quiet Partner)

**Статус:** v1 (Phase 0 discovery DONE — T-002)  
**Владелец:** PM  
**Senior PM:** domain playbook + prompt review  
**Последнее обновление:** 2026-05-30

---

## TL;DR

**Тихий напарник** — web co-pilot для PM и лидов проектов: визуальный **DomainRadar** по 8 доменам PMBOK 7, короткий **HealthCommentary** от LLM и лёгкий **onboarding**. Продукт помогает *думать* о здоровье проекта, а не выдаёт сертификат или «галочку PMBOK».

**Book track (2026-06-13):** фокус недели, чек-лист проработки в onboarding, stakeholder lite, снимок недели — live на prod ([`technical-specification-book-features.md`](../docs/technical-specification-book-features.md)).

**Справочник жизненного цикла (19 июля 2026, RU v1.1):** [`project-lifecycle-playbook.md`](./project-lifecycle-playbook.md).  
**Личный контур ProjectM (20 июля 2026):** шпаргалки + реестры на рабочем столе — см. [`../docs/kruglyy-stol-projectm-restry.md`](../docs/kruglyy-stol-projectm-restry.md); индекс — [`INDEX.md`](./INDEX.md).

---

## Vision (12 мес)

PM открывает один экран, видит баланс 8 доменов, получает 2–3 plain-language вопроса от AI и решает, куда направить внимание сегодня — без табличного ада или exam jargon.

---

## ICP (утверждено — см. `product-decisions.md`)

| Поле | Решение |
|------|---------|
| **Primary** | PM / руководитель проектов в SMB или агентстве (5–50 чел.), 2–8 параллельных проектов |
| **Geo / lang** | RU-first UI |
| **Trigger** | «Не понимаю, что горит» — стейкхолдеры, сроки, команда |
| **Wedge** | Гибридные проекты + политика стейкхолдеров |
| **Anti-persona** | Enterprise PMO; exam prep |

**Открыто до Phase 4:** кто платит (PM vs компания); частота (weekly vs daily).

---

## Валидация Phase 0 (без внешних интервью)

| Метод | Цель | Владелец |
|-------|------|----------|
| **Desk research** | Рынок PM co-pilot, exam trainers, Notion/Linear PM patterns | PM |
| **Competitive scan** | 1-pager: отличия, gaps, positioning | PM + Growth |
| **Dogfood** | Прогон radar + commentary на 1–2 проектах Human | Human + PM |
| **Воркшопы PM/Senior PM** | Tailoring matrix, anti-persona, prompt tone | PM + Senior PM |

**Не используем:** problem interviews, рекрутинг респондентов, Growth interview scripts в Phase 0.

---

## Problem statement (черновик)

**Для** PM, который ведёт несколько проектов без выделенного PMO,  
**который** теряет целостную картину (stakeholders vs delivery vs uncertainty),  
**продукт** Тихий напарник — co-pilot с DomainRadar и HealthCommentary,  
**в отличие от** чеклистов и exam trainers,  
**мы** даём 1 экран + 1–3 уточняющих вопроса, привязанных к доменам PMBOK 7 (упрощённо).

---

## MVP (Phase 0–2 spike)

**In:**
- DomainRadar (8 domains, mock → store-driven scores)
- Onboarding spec (T-008) → initial scores
- `/api/advisor/health-commentary` BFF + UI card (stage 1)
- RU labels; disclaimer «не сертификация»
- Stack: Next.js 16, Tailwind, shadcn, Zustand, Recharts

**Out (Phase 0–2):**
- Multi-tenant auth, billing, team workspaces
- Integrations (Jira, MS Project, Telegram)
- Full persistence / PostgreSQL (unless ADR in Phase 1)
- Official PMI alignment claims
- Mobile native apps

---

## Success metrics (черновик — refine T-002)

| Метрика | Baseline | Target | Срок | Источник |
|---------|----------|--------|------|----------|
| Weekly active PM (dogfood/beta) | 0 | 3+ sessions | 8 нед | analytics (Phase 3) |
| «Useful commentary» (👍) | — | ≥60% | 4 нед beta | in-app feedback |
| Time to first radar | — | &lt;3 min | spike | onboarding funnel |
| API cost / active user / week | — | &lt;$0.50 | Phase 2 | BFF logs |

---

## Personas (sketch)

| Роль | Цель | Боль | Успех |
|------|------|------|-------|
| **Аня, PM агентства** | Держать 4 клиентских проекта | Всё «жёлтое», нет приоритета | 1 фокус на день |
| **Игорь, tech lead** | Закрыть релиз | Команда vs stakeholders | Видит domain «Команда» red |

---

## Risks (summary — полный реестр в implementation-plan)

- Illusion of PMBOK compliance → mitigated by copy + Senior PM review
- Alert fatigue → amber-only default, max 1 red callout
- No ICP → T-002 desk research + dogfood + anti-persona
- Dogfood bias → явно документировать в brief; competitive scan на M0

---

## Dogfood (Human OPTIONAL)

- Протокол: [`knowledge-base/dogfood-protocol.md`](./dogfood-protocol.md)
- Лог сессий #1–5: [`docs/dogfood-log-template.md`](../docs/dogfood-log-template.md)

---

## References

- `@docs/implementation-plan.md` — master plan
- `@docs/technical-specification.md` — ТЗ для Dev/Architect/UI/QA
- `@knowledge-base/pmbok-domain-playbook.md` — 8 domains
- `@lib/systemPrompt.ts` — AI tone

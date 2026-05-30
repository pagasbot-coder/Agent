# Landing / waitlist one-pager — Тихий напарник

**Задача:** T-019 · **Роль:** Growth / CMO  
**Статус:** черновик copy (RU) · **Gate:** реализация route — после M0 Go + PM READY  
**ICP:** PM / руководитель проектов в **SMB или агентстве** (5–50 чел.), 2–8 параллельных проектов  
**Последнее обновление:** 2026-05-30

> **Не exam prep.** Не enterprise PMO. Co-pilot для «что горит сегодня» — см. `@knowledge-base/product-brief.md`, `@knowledge-base/product-decisions.md`.

---

## TL;DR (для PM / Developer)

| Элемент | Решение |
|---------|---------|
| **Цель страницы** | Acquisition: собрать waitlist ICP до публичного beta |
| **Primary CTA** | «Получить ранний доступ» → email (Listmonk / форма — Phase 4 Dev) |
| **Secondary CTA** | «Посмотреть demo» → https://quiet-partner.vercel.app |
| **Tone** | Plain RU, без PMI jargon; «напарник», не «сертификация» |
| **Anti-persona filter** | Явный disclaimer в footer; не обещать PMP / PMO suite |

---

## Hero (copy v0)

### Headline

**Один экран — здоровье проекта. Без экзамена PMP.**

### Subhead

**Тихий напарник** — co-pilot для PM в агентстве и SMB: **DomainRadar** по 8 доменам PMBOK 7, короткий **HealthCommentary** от AI и 1–3 уточняющих вопроса. Не ещё один Jira и не тренажёр сертификации — инструмент, чтобы понять, **куда направить внимание сегодня**, когда ведёте 2–8 проектов параллельно.

### ICP hook (под hero, 1 строка)

*Для Ани из PM-агентства: «всё жёлтое, нет приоритета» → один фокус на день.*

---

## Три value bullets

| # | Заголовок | Текст |
|---|-----------|-------|
| 1 | **8 доменов — одна картина** | Stakeholders, команда, delivery, неопределённость и ещё четыре домена PMBOK 7 на **DomainRadar**: зелёный / жёлтый / красный без табличного ада. |
| 2 | **AI сначала спрашивает** | HealthCommentary не выдаёт «галочку compliance» — **1–3 plain-language вопроса**, чтобы вы сами нашли, что горит (questions-first, см. playbook). |
| 3 | **Не PMI cert — реальный проект** | Мы **не** тренажёр экзамена и **не** замена PMO. Disclaimer на каждом экране: co-pilot для мышления, не сертификация PMBOK. |

---

## Social proof placeholder (Phase 4)

- «Dogfood: PM ведут 4 клиентских проекта» — после ≥3 useful-сессий Human (T-014).
- Без выдуманных логотипов до M0 sign-off.

---

## CTA и waitlist-гипотеза

### Primary CTA (above the fold)

**Получить ранний доступ**  
Подзаголовок поля: *Оставьте email — пришлём invite в закрытый beta для PM агентств и SMB.*

### Secondary CTA

**Посмотреть demo** → https://quiet-partner.vercel.app

### Гипотеза (14-дневный тест)

| Поле | Значение |
|------|----------|
| **H1** | PM агентства / SMB с триггером «не понимаю, что горит» конвертируются в waitlist **≥12%** (visit → submit), если hero = wedge «8 доменов + вопросы AI», а не «PMBOK tool». |
| **H0** | CR &lt;5% — copy слишком generic или попадает в anti-persona (exam prep). |
| **Traffic (MVP)** | LinkedIn посты Human + 1–2 PM-чата; UTM `?utm_source=linkedin&utm_campaign=waitlist_v0` |
| **Sample size** | ≥150 uniques за 14 дней (или pause и смена hook) |
| **Success metric** | Waitlist signups ≥18 при 150 uniques; cost $0 (organic only) |

### Поля формы (минимум)

| Поле | Обязательное | В analytics |
|------|--------------|-------------|
| Email | Да | **не** в PostHog payload (ADR-002) — только Listmonk |
| Роль | Нет (select: PM / Tech lead / Head of delivery) | `waitlist_role` enum, без PII |
| Проектов параллельно | Нет (2–3 / 4–6 / 7+) | сегментация ICP |

---

## AARRR — Phase 4 hook

> Полный instrumentation — `@knowledge-base/adr-002-analytics-posthog.md`. Landing — **Acquisition**; in-app — Activation → Retention.

| Этап | Phase 4 фокус | Событие / метрика | Target (8 нед beta) |
|------|---------------|-------------------|---------------------|
| **Acquisition** | Landing + waitlist + UTM | `landing_view`, `waitlist_submit` *(добавить в ADR-002)*; Plausible на `/waitlist` | ≥50 waitlist; CAC ≈ $0 organic |
| **Activation** | Onboarding → первый radar | `onboarding_complete`; time to first radar **&lt;3 min** | ≥70% invite → onboarding |
| **Retention** | Weekly return | WAU / cohort week-2 | ≥40% week-2 (dogfood baseline) |
| **Referral** | Backlog Phase 5 | «Пригласить коллегу PM» — не в MVP landing | — |
| **Revenue** | Post-M0 | Плательщик: PM vs head of delivery (гипотеза) | Не на landing v0 |

### Acquisition → Activation bridge

1. Waitlist submit → Listmonk welcome (RU): «Пока ждёте — 3 вопроса, которые задаёт напарник» (teaser из onboarding).
2. Invite email → deep link `/onboarding?utm_campaign=beta_invite`.
3. PostHog funnel: `landing_view` → `waitlist_submit` → `onboarding_complete` → `feedback_positive`.

---

## Positioning guardrails

| Делаем | Не делаем |
|--------|-----------|
| «Второй пилот РП», co-pilot | «Подготовка к PMP» |
| 8 доменов, здоровье проекта | Jira-клон, task tracker |
| RU-first, plain language | Enterprise PMO, MS Project replacement |
| Questions-first AI | Official PMI alignment claims |

**Конкурентный контекст:** `@docs/competitive-scan-1pager.md` — wedge vs Notion AI / Jira intelligence / exam trainers.

---

## Структура landing (wireframe, без кода)

```
[Logo] Тихий напарник

H1 + subhead
[3 bullets]
[CTA: email waitlist]  [Secondary: demo]

--- optional ---
«Как это работает»: 3 шага (настройка → radar → 1 вопрос от AI)
Disclaimer footer: не сертификация PMBOK · не замена PMO

Footer: privacy note (cookie/consent Phase 4, ADR-002)
```

**Route (после M0 Go):** `/waitlist` или `/` split — отдельная Developer task; **не** в scope T-019.

---

## Unit economics (napkin)

| Метрика | Assumption | Target |
|---------|------------|--------|
| LTV (гипотеза) | $15–25/mo × 12 mo × 30% pay | $54–90 |
| CAC (Phase 4) | Organic + Human time | **&lt;$20** |
| LTV:CAC | — | **&gt;3:1** до paid ads |
| API cost / WAU | ADR-001 | **&lt;$0.50/user/week** |

Paid ads — **не** до CR waitlist ≥12% organic и M0 Go.

---

## Handoff

| Кому | Что |
|------|-----|
| **PM** | Review copy vs anti-persona; READY task на `/waitlist` route после M0 Go |
| **IT-Architect** | `waitlist_submit` + Plausible/PostHog landing events в ADR-002 |
| **Developer** | Static landing + form → Listmonk API; consent banner |
| **QA** | AC: disclaimer visible; no PII in analytics; mobile ≥375px |
| **Human** | Approve budget/channel; sign-off на публичный URL |

---

## References

- `@knowledge-base/product-brief.md` — ICP, metrics, personas
- `@knowledge-base/product-decisions.md` — anti-persona
- `@knowledge-base/adr-002-analytics-posthog.md` — events MVP
- `@docs/implementation-plan.md` — Phase 4 Growth pack
- `@docs/m0-go-no-go-memo.md` — gate до публичного launch

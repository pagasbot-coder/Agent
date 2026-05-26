# Growth Playbook

_Заполняет Growth Marketer / CMO (`@role-growth-marketer`). Шаблоны ниже — копировать в новые `growth-*.md` при кампаниях._

## AARRR (шаблон)

| Этап | Метрика | Baseline | Target (90d) | Aha / ключевое действие | Инструмент (OSS) |
|------|---------|----------|--------------|-------------------------|------------------|
| Acquisition | | | | | PostHog / Plausible |
| Activation | | | | _Первое ценностное действие в дашборде_ | PostHog funnel |
| Retention | D7 / D30 | | | | Cohort in PostHog |
| Referral | | | | | — |
| Revenue | MRR / paying accounts | | | | Finance + product events |

**North Star:** _одна метрика, отражающая ценность для клиента_

**Guardrails:** CAC ≤ ___ ; LTV:CAC ≥ 3:1 ; pay conversion ≥ ___%

---

## Воронка (шаблон)

| Шаг | Описание | CR (%) | Volume / period | Узкое место? | Гипотеза улучшения |
|-----|----------|--------|-----------------|--------------|-------------------|
| Visit | | | | | |
| Lead / signup | | | | | |
| Qualified | | | | | |
| Demo / trial | | | | | |
| Paying | | | | | |

---

## Unit economics (napkin)

| Параметр | Значение | Источник / допущение |
|----------|----------|----------------------|
| ARPU (₽/мес) | | |
| Gross margin % | | |
| Avg lifetime (мес) | | |
| **LTV** | ARPU × margin × lifetime | |
| CAC (₽) | | spend / new payers |
| **LTV:CAC** | | target **> 3** |
| ARPPU | | |
| Trial → pay % | | |

---

## Каналы (90 дней)

| Сегмент (ICP) | Канал | CPC/CPA est. | CR est. | Приоритет P0–P2 | Статус |
|---------------|-------|--------------|---------|-----------------|--------|
| | | | | | |

---

## Гипотезы (активные)

| ID | Гипотеза | Метрика | Дедлайн | Результат |
|----|----------|---------|---------|-----------|
| H-001 | Если …, то … | | | |

---

## OSS stack (зафиксировано)

| Слой | Выбор | Deploy |
|------|-------|--------|
| Product analytics | PostHog | Docker self-host |
| Web | Plausible / Umami | |
| Email | Listmonk | SMTP |

_Архитектура интеграции: `@knowledge-base/architecture.md` + ADR от IT-Architect._

---

## Референс: banya-digital

B2B ERP для бань — GTM через demo/pilot, activation = первый операционный дашборд без Excel.  
Не применять B2C viral playbook без пересчёта CAC.

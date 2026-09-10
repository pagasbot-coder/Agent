# Market research — Phase 4 (M0 prep)

**Задача:** T-059 · **Роли:** SME + PM  
**Дата:** 2026-06-07 · **Статус:** черновик для M0 roundtable Block 0  
**Gate:** не меняет MVP scope — input для monetization + GTM

> **Связь:** [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) (T-054 финализирован) · [`product-brief.md`](../knowledge-base/product-brief.md) · [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md)

---

## TL;DR

Рынок PM-tools в RU **переполнен таск-трекерами** и **exam prep**; wedge «Тихий напарник» — **health radar + questions-first AI**, не Jira-клон. TAM широкий, **SAM узкий** (PM агентства / SMB, 2–8 проектов, RU). SOM year-1 реалистичен как **сотни paying users**, не десятки тысяч — organic + PM-комьюнити, не enterprise sales.

---

## TAM / SAM / SOM (sketch)

| Уровень | Определение | Оценка (RU, napkin) | Обоснование |
|---------|-------------|---------------------|-------------|
| **TAM** | Все PM / РП / delivery lead, использующие цифровые инструменты для управления проектами | **~350–500 тыс.** | Рынок труда IT + консалтинг + агентства; доля с формальной ролью PM/РП |
| **SAM** | SMB и PM-агентства (5–50 чел.), **2–8 параллельных проектов**, RU UI, без enterprise PMO | **~40–70 тыс.** | ICP из product-brief; исключаем enterprise PMO и solo-freelance без recurring projects |
| **SOM (12 мес post-M0)** | Достижимый wedge: co-pilot «здоровье проекта», organic + waitlist | **300–800 WAU · 30–120 paying** | 0,1–0,2% SAM на awareness; 10–15% paid conversion среди активных beta — см. financial model |

**Assumptions (зафиксировать на столе):**

- Geo **RU-first**; EN — не в SOM year-1.
- Плательщик year-1: **PM лично** (company/team tier — post-M0).
- Конкуренция за attention с Notion AI / бесплатными шаблонами — не за budget line Jira.

---

## Конкурентный ландшафт

См. детали в [`competitive-scan-1pager.md`](./competitive-scan-1pager.md). Расширение для Block 0:

| Категория | Игроки | Что делают | Пересечение с нами | Gap / наш wedge |
|-----------|--------|------------|--------------------|-----------------|
| **Task / delivery** | Jira + Atlassian Intelligence, Linear, YouTrack | Тикеты, спринты, AI в issue | «Что делать сегодня» в задачах | Нет **целостного health** по 8 доменам |
| **Docs + AI** | Notion AI, Confluence AI | Summarize, generic PM templates | AI-советы по документам | Нет **PMBOK-lens radar** + RU plain language |
| **Plan / enterprise** | MS Project, Planner, OpenProject | Gantt, ресурсы, PMO | Formal planning | Тяжёлый; не co-pilot для «что горит» |
| **Exam prep** | PMP trainers, Simulators, RU курсы PMI | Сертификация, экзамен | PMBOK термины | **Anti-persona** — мы явно не cert tool |
| **Generic PM SaaS** | Monday, ClickUp, Kaiten (RU) | All-in-one workspaces | Dashboards | Нет questions-first **1 экран — 1 фокус** |
| **AI co-pilot (emerging)** | ChatGPT custom GPTs, Copilot in M365 | Ad-hoc prompts | Generic advice | Нет persisted radar + dogfood playbook |

**Вывод SME:** покупают не «ещё один dashboard», а **снижение когнитивной нагрузки** при 2–8 проектах. Цена sensitivity высокая у individual PM ($15–25/mo — потолок без employer reimbursement).

---

## Pricing benchmarks (RU / global, desk)

| Продукт / категория | Tier | Цена (ориентир) | Модель | Релевантность |
|---------------------|------|-----------------|--------|---------------|
| **Notion Plus + AI** | Individual | ~$10–20/mo | Freemium + AI add-on | Якорь «docs + AI»; шире scope |
| **Linear** | Standard | ~$8–16/user/mo | Per seat | Dev teams; не PM agency wedge |
| **Jira Cloud** | Standard | ~$7–15/user/mo | Per seat + AI extra | Enterprise path; не наш ICP day-1 |
| **Monday.com** | Basic | ~$9–12/seat/mo | Work OS | Generic; дорого для solo PM |
| **PMP exam trainers (RU)** | Course | ₽15–40k one-time | Course | Anti-persona; другой JTBD |
| **ChatGPT Plus** | Individual | ~$20/mo | Subscription | Substitute для ad-hoc советов |
| **Niche PM AI (US)** | Pro | $15–29/mo | Solo PM tools | **Band для Quiet Partner Pro** |

**Рекомендация для M0:** якорь **$19/mo** (mid of $15–25) или **₽1 490/mo** при RU billing — согласовать на Block 2 с Growth + financial model.

---

## Рыночные риски (SME)

| ID | Риск | Митигация |
|----|------|-----------|
| **M1** | Commoditization AI (Notion, Atlassian) | Moat: 8-domain lens + RU playbook + dogfood evidence |
| **M2** | «Игрушка радара» без LLM value | G2→3 dogfood; questions-first quality |
| **M3** | Низкая willingness-to-pay у PM лично | Waitlist role field; test employer vs personal payer |
| **M4** | Exam prep confusion | Disclaimer на landing + anti-persona copy |

---

## Вопросы к M0 roundtable (Block 0)

1. Согласны ли с **SAM ~40–70k** как рабочей рамкой для year-1 GTM?
2. **SOM 30–120 paying** — ambitious / realistic / conservative для команды без paid ads?
3. Какой **якорь цены** резонирует с коллегами PM/РП: $15, $19 или $25?

---

## References

- [`competitive-scan-1pager.md`](./competitive-scan-1pager.md) — T-054 finalize
- [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) — ICP, unit economics napkin
- [`financial-model-m0.md`](./financial-model-m0.md) — break-even, sensitivity
- [`m0-roundtable-agenda.md`](./m0-roundtable-agenda.md) — Block 0 facilitation

# Knowledge Base — маршрутизатор для агентов

> **Как пользоваться:** не читайте всё подряд. Выберите секцию по задаче и подключайте через `@knowledge-base/...` или `@<project>/knowledge-base/...`.  
> **Очередь задач:** [`../orchestration-queue.md`](../orchestration-queue.md) · **Подпроекты:** см. [README](./README.md).

---

## Старт

| Документ | Когда подключать |
|----------|------------------|
| [README.md](./README.md) | Нужны пути к KB подпроектов и ссылка на orchestration-queue |
| [INDEX.md](./INDEX.md) | Нужен обзор корневой KB без сканирования каталога |

---

## Context engineering (агенты и оркестрация)

| Документ | Когда подключать |
|----------|------------------|
| [context-engineering-productmap.md](./context-engineering-productmap.md) | Настройка rules/skills/KB, anti-stuffing, repo-first, friction loop — **не UX** |
| [public-ai-orchestration-synthesis.md](./public-ai-orchestration-synthesis.md) | Кросс-синтез ProductMap + Conducting.ai (публичное only): TASK loop, maturity model, org roles, paywall map |

---

## Продукт и архитектура (monorepo)

| Документ | Когда подключать |
|----------|------------------|
| [product-brief.md](./product-brief.md) | MVP, аудитория, scope — перед PM-решениями |
| [architecture.md](./architecture.md) | High-level стек и модули monorepo |
| [architecture-decisions.md](./architecture-decisions.md) | Принятые ADR; ссылаться по `#adr-nnn` |
| [adr-template.md](./adr-template.md) | Architect пишет новый ADR — скопировать блок |

---

## UX / UI reference

| Документ | Когда подключать |
|----------|------------------|
| [productmap-ux-ui-analysis-portable.md](./productmap-ux-ui-analysis-portable.md) | Универсальные UX/UI паттерны B2B SaaS (Product Map synthesis) |
| [design-tokens.md](./design-tokens.md) | Токены и бренд Дегтярные Бани / d1a.ru |

---

## Маркетинг и рост

| Документ | Когда подключать |
|----------|------------------|
| [marketing-brief.md](./marketing-brief.md) | ICP, value prop, каналы — Growth/CMO |
| [growth-playbook.md](./growth-playbook.md) | AARRR, кампании, метрики — шаблоны growth-*.md |

---

## Операции, домен, качество

| Документ | Когда подключать |
|----------|------------------|
| [qa-checklist.md](./qa-checklist.md) | Чеклист перед PR и регрессия MVP |
| [devops-runbook-template.md](./devops-runbook-template.md) | Первый prod-deploy — копировать в devops-runbook.md |
| [industry-brief-template.md](./industry-brief-template.md) | SME описывает отрасль — копировать в industry-brief.md |

---

## Подпроекты (product-specific KB)

Подключайте **только** KB нужного продукта — не тащите чужие spec в контекст.

| Проект | Путь | Содержание (кратко) |
|--------|------|---------------------|
| **Banya-Digital ERP** | [`../banya-digital/knowledge-base/`](../banya-digital/knowledge-base/) | product-brief, architecture, ADR, spa/banya segment, operational-processes, QA |
| **Quiet Partner / Тихий напарник** | [`../quiet-partner/knowledge-base/`](../quiet-partner/knowledge-base/) | product-brief, ADR auth/LLM/analytics, navigator, dogfood, PMBOK playbook |
| **iGaming BiJi** | [`../iGaming BiJi/knowledge-base/`](../iGaming%20BiJi/knowledge-base/) | product-spec, CSV mappings, drift-math, ADR ingestion/deploy, CMO/demo материалы |

---

## Быстрые маршруты по ролям

| Роль | Типичный `@`-набор |
|------|-------------------|
| PM | `product-brief.md` + `orchestration-queue.md` + KB подпроекта |
| IT-Architect | `architecture-decisions.md` + `adr-template.md` + ADR подпроекта |
| Developer | `architecture.md` + KB подпроекта + активная задача из queue |
| QA | `qa-checklist.md` + AC задачи в queue |
| Growth / CMO | `marketing-brief.md` + `growth-playbook.md` |
| SME | `industry-brief-template.md` → industry-brief продукта |
| Agent ops | `context-engineering-productmap.md` + этот INDEX |

# Публичный синтез: ProductMap + Conducting.ai → Muster / Cursor / Quiet Partner

> **Дата:** 7 июня 2026 · **Режим:** «Для команды»  
> **Метод:** WebFetch/curl публичных URL без логина и подписки.  
> **Дедупликация:** базовые принципы context engineering уже в [`context-engineering-productmap.md`](./context-engineering-productmap.md); UX — в [`productmap-ux-ui-analysis-portable.md`](./productmap-ux-ui-analysis-portable.md). Здесь — **только новое** и кросс-источниковые паттерны.

---

## TL;DR

- **Бесплатно и полезно:** страница Product Map [Context Engineering](https://app.productmap.io/topic/context-engineering~9790eb70-f1dd-44f9-9098-7746d7f0cce3), маркетинговая статья [TASK Framework](https://www.productmap.io/task-agentic-product-management), лендинги `productmap.io` / `app.productmap.io`; у Conducting.ai — главная, about, education, ai-native-designs и особенно **SaaS Playbook landing** с детальной оглавлением трансформации.
- **За paywall:** Product Map Plus/Pro ($29–59/мес) — AI agents, growth plans, grades guide, sprint framework; Conducting.ai — $99/мес (~1000 уроков, FigJam canvas, полный Playbook, education 2026).
- **Главный steal для Muster:** TASK как непрерывный цикл + Conducting.ai как **модель зрелости** (Co-Pilot → Brain → Multi-Agent) и **org design** (AI Lead / Department Lead / AI Champion).
- **Quiet Partner:** playbook Conducting Phase 1 «Department Co-Pilots» + Product Map «PM как оркестратор» ≈ navigator + dogfood + role agents без замены Human judgment.

---

## 1. ProductMap — бесплатные инсайты (не в `context-engineering-productmap.md`)

### 1.1 Коммерческий payoff context engineering

Помимо операционной надёжности, Product Map формулирует **бизнес-эффект** shared context:

| Эффект | Смысл для нас |
|--------|----------------|
| Consistent strategy | Все PM/роли из одного канона, не «личная философия» |
| Less drift across tasks | Повторяемая форма артефактов (PRD, brief, AC) |
| Defensible artifacts | Воспроизводимые, reviewable deliverables |
| Lower re-explanation cost | `@knowledge-base/` вместо пересказа в чате |
| Faster onboarding | Clone repo + INDEX → тот же контекст, что у команды |
| Reusable AI systems | Skills/workflows = operating leverage |

**Практика:** в `product-brief` и queue AC явно писать «defensible artifact» — критерий review, не только «сделано».

### 1.2 «Blank folder problem»

Типичный стопор: tool установлен, проект открыт, **нет рабочей структуры памяти** → агент не знает, куда смотреть.

**Минимальный bootstrap** (уже близко к Muster, зафиксировать как onboarding checklist):

```
orchestration-queue.md + knowledge-base/INDEX.md + .cursor/rules/ + product-brief.md
```

### 1.3 Пять вопросов PM-фрейминга

Перед добавлением контекста — ответить:

1. Что модель **должна** знать?
2. Что **игнорировать**?
3. Что **персистить** между сессиями?
4. Что **retrieval on demand**?
5. **Кто обновляет** source of truth при смене продукта?

→ Маппинг на Layer 1–4 из существующего doc + owner в queue (PM / Human Architect).

### 1.4 Product knowledge drift и «AI как consistency checker»

- Drift: pricing, messaging, priorities расходятся → sales/support/roadmap противоречат друг другу.
- **Новая практика:** периодически просить агента **флагать противоречия** между `product-brief`, landing copy, pricing docs, FAQ (не только писать новый текст).
- Prune + archive — иначе «comprehensive docs nobody trusts».

### 1.5 Дополнения к team context (из публичной страницы)

| Паттерн | Деталь | Применение |
|---------|--------|------------|
| Lost in the middle | В длинных workflow **повторять критические факты** | Multi-step Muster tasks: AC и constraints в начале каждого subagent handoff |
| Initiative context pack | Временная папка/ветка на крупную инициативу | `update/kb-m0-*` или `quiet-partner/docs/` pack на dogfood round |
| Symlink skills в repo | `~/.cursor/skills` → versioned в git | Уже в gaps CE-doc; приоритет для team portability |
| Vendor memory = cache | Повтор Product Map; усиление: **cursor_dialog / user rules** не канон | Критичное — только в git rules/KB |

### 1.6 TASK Framework (публичная статья productmap.io)

> Полный разбор TASK как continuous loop — **новое** относительно краткого упоминания в CE-doc.

**Определение:** PM перестаёт быть bottleneck «всё сам» → **оркестратор** системы агентов в доменах.

**Непрерывный цикл:**

```
Topics (домен) → Agents (исполнение) → Skills (human judgment) → Knowledge (артефакт в repo) → снова Topics
```

**Условие применимости агента:** есть **чёткий deliverable** + **повторяемый процесс** + **описуемый контекст** → иначе остаётся human-only.

**5 PM-доменов (таксономия папок KB):**

| Домен | Примеры topic | Стартовые артефакты (имена из PM) |
|-------|---------------|-----------------------------------|
| Strategy | PMF, ICP, roadmaps | `business-model-canvas.md`, `icp.md`, `okr-planning-sheet.md`, `roadmap-now-next-later.md` |
| Generation | Research, GTM, AI specs | `research-synthesis-report.md`, `gtm-strategy.md`, `ai-prd-SPEC.md` |
| Analysis | Metrics, unit econ | `north-star-metric.md`, `unit-economics-model.md`, `funnel-analysis-report.md` |
| Delivery | Backlog, PRD, risk | `prd-template.md`, `rice-scoring-sheet.md`, `risk-registry.md` |
| People | Stakeholders, ops | `stakeholder-map.md`, `RACI-MATRIX.md`, `product-ops-playbook.md` |

**Архитектура агентов (из публичного TASK):**

- У каждого агента: system prompt, memory, scoped knowledge files.
- **Sub-agents** для специализированных шагов.
- **Cross-reference outputs** → pipelines (interview → opportunity → PRD).
- **Разные LLM** под тип задачи: research / drafting / scoring / synthesis.

**5 шагов Getting Started (TASK):**

1. Один активный topic (домен).
2. Knowledge base в plain text (Markdown/CSV).
3. Git + структура папок = таксономия topics.
4. Первый agent: prompt scoped к topic + доступ к файлам.
5. Run loop: task → human validate → save to KB.

**Маппинг на Muster (уточнение):**

| TASK | Muster / Quiet Partner |
|------|------------------------|
| Topics | Queue tasks + `knowledge-base/` domains |
| Agents | Role: PM / Developer / QA + subagents |
| Skills | `role-*.mdc` + `skills-cursor/` |
| Knowledge | Markdown artifacts, ADR, dogfood logs |

### 1.7 Публичный каталог app.productmap.io

- **Sitemap:** 14 публичных topic URL (без логина); `/topics` — заголовок без тела в fetch.
- **Context Engineering** — единственный глубокий agentic topic в выборке; остальные topics (ICP, unit economics, roadmaps…) — отдельные PM-гайды, не дублировать здесь.
- **Pricing (публично):** Free $0 · Plus от $29 · Pro от $59 · Enterprise custom.
- **Roadmap (публично):** Product Mapper (июнь 2026), context engineering agent (июль 2026).

---

## 2. Conducting.ai — бесплатные инсайты

### 2.1 Что реально открыто без $99

| URL | Содержание | Глубина |
|-----|------------|---------|
| [conducting.ai](https://www.conducting.ai/) | Value prop, FAQ с структурой Playbook | Средняя |
| [about](https://www.conducting.ai/about) | Origin story, core values, timeline | Низкая (нарратив) |
| [education](https://www.conducting.ai/education) | Department pathways, program FAQ | Средняя (мета, не уроки) |
| [ai-native-designs](https://www.conducting.ai/ai-native-designs) | Каталог designs (General beta, отрасли soon) | Низкая |
| [**saas**](https://www.conducting.ai/saas) | **Полное оглавление SaaS Playbook** | **Высокая (teaser TOC)** |
| [blog](https://www.conducting.ai/blog) | 3 AI-Native поста — **«coming soon»** | Нулевая |
| app.conducting.ai | Не проверялся (вне scope) | Gated |

### 2.2 Core values (actionable, не маркетинг)

- **Strategy first, tools second** — сначала operating model, потом стек.
- **Human-centered AI** — augment, не replace; change management = primary risk.
- **Responsible acceleration** — скорость без дестабилизации ops.
- **Plan for future, operate today** — фазы, не «всё сразу AGI».

### 2.3 AI Transformation Playbook — структура (из FAQ + SaaS landing)

**11 модулей верхнего уровня:**

| # | Модуль | Суть |
|---|--------|------|
| 1 | Starting Point | ROI math, roadmap stages, структура playbook |
| 2 | Bird's Eye View | One-pagers по фазам и 10 департаментам (5 мин read) |
| 3 | Quick Day-1 Wins | 7 off-the-shelf tools до custom agents |
| 4 | AI-Native Company Design | FigJam: департаменты + named agents + Phase 1–3 |
| 5 | Human-Centric Adoption | Cultural impact per department, comms templates |
| 6 | Team Roles & Ownership | AI Lead · Department Lead · AI Champion |
| 7–9 | Phase 1–3 execution | Co-Pilots → Brains → Multi-Agent |
| — | Per Department View | 110 секций, 11-sub-section template на агента |
| 10 | Going Forward | Maintenance, model migration, governance |

**7 отраслевых Playbooks (имена):** General, SaaS, Marketing Agency, Ecommerce, Real Estate, Recruitment, Accounting.

### 2.4 Трёхфазная модель зрелости (ключевой steal)

```
Phase 1 — Employee Co-Pilots & First Agents
  → dept co-pilots, light integrations, ~4 named production agents / dept
  → lowest risk, fastest ROI (~60 days pilot per FAQ)

Phase 2 — AI Brains & Expanded Agents
  → retrieval over company data, persistent memory, static + dynamic data
  → RBAC, cross-brain sharing, quality testing

Phase 3 — Multi-Agent Systems & Autonomous Agents
  → dept orchestrators → 5 cross-dept orchestrators → Chief Agent
```

**5 кросс-департаментных оркестраторов (Phase 3, публичные имена):**

1. Customer Save  
2. Inbound Lead Lifecycle  
3. Voice-of-Customer Loop  
4. Monthly Exec Reporting  
5. Incident → Customer Comms  

**Chief Agent:** доступ ко всем sub-Brains; use cases — board meetings, strategic analysis, decision-making.

### 2.5 Org design — три роли (антипаттерн «все ответственны»)

| Роль | Владение | Для Muster / Quiet Partner |
|------|----------|----------------------------|
| **AI Lead** | Стратегия AI, фазы, бюджет, ROI, board brief | Human Architect |
| **Department Lead** | Use cases функции, SOP, обучение команды | Role: PM / SME per domain |
| **AI Champion** | Early adopter, peer trainer, 2–3 на dept | Dogfood champion, QA lead |

### 2.6 Шаблон описания агента (11 подсекций — из SaaS TOC)

Каждый named agent в playbook (платно внутри, **структура бесплатна**):

- Business context  
- Honest tier picks (off-the-shelf vs custom)  
- Cost ranges  
- Autonomy levels  
- Risk overlay (MIT AI Risk V4, EU AI Act Art. 22, GDPR, SOC 2)  
- Rollout playbook  

**Steal для Quiet Partner:** шаблон `docs/agent-spec-template.md` с этими полями для navigator / auth / analytics agents.

### 2.7 Phase 1 — честный каталог отказов

Публично заявлен блок **«Where Co-Pilots Fail»:** broken connectors, hallucination patterns, **human-in-the-loop non-negotiable** — полезно для dogfood AC и QA checklist.

### 2.8 Education (метаданные, без уроков)

- Launch 2026; early access $99/mo lifetime lock.
- 6 недель part-time; assessment = quizzes + workflow assignments + portfolio.
- Module 10 = Applied AI Portfolio (prompts, workflows, documented use-cases).
- Роли программ: Operations, Sales, Marketing, CS, HR, Executive.

### 2.9 ROI claims (из FAQ — использовать осторожно)

- Quick Day-1 Wins: gains **в первую неделю**.
- Phase 1 named agents: dept ROI **~60 дней** pilot.
- 85% pilots fail из-за unprepared teams (blog teaser, тело gated).

---

## 3. Кросс-источниковые паттерны

| Паттерн | ProductMap | Conducting.ai | Наш стек |
|---------|------------|---------------|----------|
| **Repo-first memory** | `_knowledge/` + Git workflow | Artifacts in playbook; FigJam = visual layer | `knowledge-base/` + git branches |
| **PM как оркестратор** | TASK loop | AI Lead coordinates phases | Muster queue + Human Architect |
| **Фазирование** | Getting Started 5 steps | Co-Pilot → Brain → Multi-Agent | M0 waitlist → auth → navigator (Quiet Partner) |
| **Human judgment layer** | Skills pillar | Department Lead + Champions | `role-*.mdc`, SME critique |
| **Risk / compliance** | Defensible artifacts | MIT V4, EU AI Act overlay per workflow | ADR + qa-checklist; auth runbook |
| **Context = multiplier** | Weak context × AI = confusion | People-side failure > tech | Friction-driven loop в rules |
| **Department map** | 5 PM domains | 10 business functions | PM + Dev + Growth roles в matrix |
| **Honest limitations** | Two-bucket, no stuffing | Co-Pilots Fail catalogue | BLOCKED в queue с owner |

**Синтез зрелости для monorepo:**

```
Muster Level 0 (сейчас)     Rules + KB + queue + role agents
Muster Level 1 (Conducting P1)  Co-pilot per role, repeatable skills, dogfood logs
Muster Level 2 (Conducting P2)  Retrieval (codebase index + @KB), persistent project memory
Muster Level 3 (Conducting P3)  Cross-role orchestrators (parent agent + subagents)
```

---

## 4. Что требует подписки / логина

### ProductMap

| Tier | Цена | Gated |
|------|------|-------|
| Free | $0 | Key PM tools teaser; topic pages частично |
| Plus | от $29/мес | Growth plans, grades guide, product sprint |
| Pro | от $59/мес | Full agentic PM tools |
| App login | — | AI agent runs, personalized context, skills assessment internals, topic catalog body |

### Conducting.ai

| Tier | Цена | Gated |
|------|------|-------|
| Early Access | $99/мес | ~1000 lessons, full Playbook platform, FigJam download, education modules |
| Blog posts (AI-Native) | — | Заголовки есть, контент «coming soon» |
| FigJam / lessons | — | Instant download за подпиской |

**Не пытаться:** скрейпить app.conducting.ai, платные PDF, FigJam без лицензии.

---

## 5. Recommended steals для нашего стека

### 5.1 Немедленно (низкая стоимость)

1. **TASK loop в queue comment** — для каждой READY задачи: Topic (T-0xx) → Agent (role) → Skill (rule/skill) → Knowledge (output path).
2. **5 вопросов PM** — чеклист перед добавлением строки в rules/KB (см. §1.3).
3. **Initiative pack** — крупные эпики (M0, auth) = отдельная папка docs + ветка `update/*`.
4. **Consistency checker pass** — раз в sprint: агент сверяет brief vs landing vs queue AC.

### 5.2 Средний горизонт

5. **Maturity model в `architecture.md`** — Level 0–3 по Conducting (§3), текущий = 0–1.
6. **Agent spec template** — 11 полей Conducting для Quiet Partner agents (§2.6).
7. **Таксономия KB** — зеркало TASK 5 domains в root/subproject `knowledge-base/` (не обязательно `_knowledge/00–10`, но INDEX с секциями).
8. **Versioned skills** — `.cursor/skills/` в repo (ProductMap symlink pattern).

### 5.3 Quiet Partner specific

9. **Phase 1 only** — navigator как dept co-pilot; не Phase 3 multi-agent до dogfood PASS.
10. **Human-in-the-loop** — из «Where Co-Pilots Fail» → AC для auth, PII, navigator suggestions.
11. **Three roles** — Human = AI Lead; PM agent = Department Lead; QA/dogfood = Champion.

### 5.4 Не переносить

- Conducting 140+ use cases / 900+ sections verbatim (paywall, отраслевой шум).
- Product Map skills assessment / growth plans UI.
- McKinsey-price positioning и «15,000+ members» как аргументы в KB.

---

## 6. Источники (публичные URL)

| Источник | URL | Статус fetch |
|----------|-----|--------------|
| Context Engineering topic | https://app.productmap.io/topic/context-engineering~9790eb70-f1dd-44f9-9098-7746d7f0cce3 | ✅ Полный текст |
| TASK Framework article | https://www.productmap.io/task-agentic-product-management | ✅ Полный текст |
| Product Map marketing | https://www.productmap.io/ | ✅ |
| Product Map app landing | https://app.productmap.io/ | ✅ |
| Topic sitemap | https://app.productmap.io/sitemap.xml | ✅ 14 topics |
| Conducting home | https://www.conducting.ai/ | ✅ |
| Conducting about | https://www.conducting.ai/about | ✅ |
| Conducting education | https://www.conducting.ai/education | ✅ |
| Conducting SaaS playbook TOC | https://www.conducting.ai/saas | ✅ |
| Conducting blog | https://www.conducting.ai/blog | ⚠️ Teasers only |

---

## 7. Связанные артефакты

| Файл | Связь |
|------|-------|
| [`context-engineering-productmap.md`](./context-engineering-productmap.md) | Базовые 4 слоя, anti-stuffing, cadence — **не дублировать** |
| [`productmap-ux-ui-analysis-portable.md`](./productmap-ux-ui-analysis-portable.md) | UI tier only |
| [`.cursor/rules/context-engineering.mdc`](../.cursor/rules/context-engineering.mdc) | Layer 2 router rule |
| [`quiet-partner/knowledge-base/product-brief.md`](../quiet-partner/knowledge-base/product-brief.md) | Product context layer |

---

*Синтез для Human Architect · публичные источники only · без изменения AC и queue priorities.*

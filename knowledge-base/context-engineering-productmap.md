# Context Engineering — анализ Product Map для Muster / Vibecoder

> **Источник:** [Product Map — Context Engineering](https://app.productmap.io/topic/context-engineering~9790eb70-f1dd-44f9-9098-7746d7f0cce3) (публичная страница, июнь 2026).  
> **Режим:** «Для команды» · **Фокус:** AI-агенты, оркестрация, Cursor — **не** UX (см. `productmap-ux-ui-analysis-portable.md`, `quiet-partner/docs/ux-reference-productmap.md`).  
> **Связь:** Muster ≈ TASK framework Product Map (Topics → Agents → Skills → Knowledge).

---

## TL;DR

- **Context engineering** — проектирование *среды* агента (инструкции, память, retrieval, skills, tools), а не одного идеального промпта.
- **Главное правило:** каждая строка контекста должна оправдывать бюджет внимания модели; stuffing ≠ engineering.
- **Repo-first:** Git — единственный source of truth; vendor UI / IDE memory — кэш, не база.
- **Четыре слоя:** canonical knowledge → agent instructions → runtime context → personal memory.
- **Наш стек уже на 60–70% совпадает** (Muster, `orchestration-queue.md`, `knowledge-base/`, role rules); **главные пробелы:** `INDEX.md`, версионирование skills в репо, cadence обслуживания, явная anti-stuffing политика.

---

## 1. Терминология

| Термин | Определение (Product Map) | Аналог в Muster / Vibecoder |
|--------|---------------------------|-----------------------------|
| **Context engineering** | Что агент видит, в каком формате и порядке — для стабильных, проверяемых ответов | Rules + knowledge-base + queue + `@`-ссылки вместо paste в чат |
| **Prompt engineering** | Один запрос, одна сессия | Runtime prompt / Human message |
| **Context stuffing** | Дамп PRD + Slack + скриншотов в окно | Копипаст всего `orchestration-queue.md` или длинных spec в чат |
| **Instructions** | Стабильное поведение агента | `.cursor/rules/*.mdc`, `AGENTS.md`, role rules |
| **Memory (durable)** | Факты и предпочтения между сессиями | `knowledge-base/`, user rules (осторожно) |
| **Retrieval** | Документ по запросу задачи | `@knowledge-base/...`, `@docs/...`, codebase index |
| **Runtime context** | Только текущая задача | Активная ветка, T-0xx из queue, открытые файлы |
| **Personal memory** | Тон, формат, стиль пользователя | User rules в Cursor |
| **Skills** | Повторяемый workflow с guardrails | `~/.cursor/skills-cursor/`, Muster subagents |
| **Context rot** | Устаревшие факты + раздутые файлы | Старые AC в queue, дубли spec, неархивированные docs |
| **Two-bucket rule** | Писать только то, что агент не выведет из кода | Не дублировать file tree / очевидные паттерны в rules |
| **Friction-driven loop** | Ошибка → диагноз gap → fix в правильный слой → тест | Post-mortem после плохого agent output → rule или KB update |
| **TASK** | Topics · Agents · Skills · Knowledge | Muster roles · queue tasks · skills · markdown artifacts |

---

## 2. Ключевые принципы (actionable)

### 2.1 Среда важнее вопроса

Модель работает не с промптом, а с **окружением**: rules, memory, files, tool outputs, examples. Слабая среда умножает путаницу; сильная — полезную работу.

**Для нас:** перед задачей агент читает `orchestration-queue.md`; Human указывает `@knowledge-base/...` — не пересказывает product brief в чате.

### 2.2 Context engineering ≠ context stuffing

| Stuffing (антипаттерн) | Engineering (паттерн) |
|------------------------|----------------------|
| Всё в одно окно | Минимальный high-signal набор |
| Надежда на «разберётся» | Явный INDEX / ссылки |
| Дубли в чате и в git | Single source of truth в репо |
| Мега-prompt на 50 задач | Skills с lazy load |

**Рабочее правило:** если строку можно заменить ссылкой `@path` — заменяй; если факт меняется еженедельно — retrieval, не hard-code в rule.

### 2.3 Четыре слоя памяти

```
Layer 1 — Canonical knowledge     knowledge-base/, ADR, product-brief, playbook
Layer 2 — Agent instructions      .cursor/rules/, AGENTS.md, role-*.mdc
Layer 3 — Runtime context         orchestration-queue (IN_PROGRESS task), branch, ticket
Layer 4 — Personal memory         User rules, tone preferences
```

**Разделение shelf life:** policy → instructions; факты → knowledge; большие меняющиеся данные → retrieval; задача → runtime.

### 2.4 Repo-first и version control

- Контекст в Git: audit trail, review, rollback, branching (`feature/`, `update/`, `experiment/` для context changes).
- Vendor memory / IDE memory — **кэш**, не канон PM-системы.
- Flow как для кода: branch → update files → test with agent → review → merge.

### 2.5 Two-bucket rule

**Документировать:** стратегию, rationale решений, ICP, conventions, gotchas, release procedures.

**Не документировать в rules:** file structure, dependencies, очевидные code patterns (агент видит репо).

### 2.6 Linking beats stuffing

Корневой instruction file — **короткий маршрутизатор**, не вики:

- Указывает на `INDEX.md` / product one-pager
- Именует conventions и critical tools
- Ссылается на skills и templates

Глубокий материал подгружается **on demand** (skill activation, `@` file, subagent).

### 2.7 Skills как context-budgeting

Паттерн загрузки:

1. **Discovery** — короткое описание skill
2. **Activation** — `SKILL.md` только при match
3. **Expansion** — templates/examples по ссылке

**Для нас:** Muster role rules + `skills-cursor/`; цель — вынести повторяемые PM/Dev/QA workflows в repo-versioned skills.

### 2.8 Friction-driven maintenance

```
трение (wrong/generic/stale output)
  → диагноз (какой контекст отсутствовал/врал)
  → fix в правильный слой (rule / KB / skill / queue AC)
  → тест с агентом
```

**Cadence (рекомендация Product Map):**

| Ритм | Действие |
|------|----------|
| Еженедельно | Активные приоритеты, открытые решения в queue / brief |
| Ежемесячно | Prune stale docs, consolidate duplicates |
| Per release | Product facts, metrics, examples |
| Per initiative | Временный context pack (папка или ветка) |
| Per incident | Gotcha в knowledge-base пока свежо |

### 2.9 Team alignment

Shared context repo = memory для AI + onboarding для людей + review layer для решений.

**Антипаттерны:** «private product philosophy» у каждого PM в личных чатах; absolute paths в rules; mega-prompts вместо skills.

### 2.5 Cursor-specific (из Product Map)

| Делать | Не делать |
|--------|-----------|
| Rules → implementation patterns | Product strategy в rules |
| Pin shared context repo | IDE memory как канон PM |
| Сидеть поверх repo с INDEX + KB | Дублировать knowledge в user rules |

---

## 3. Применимость к нашему стеку

### 3.1 Что уже хорошо (Muster / Vibecoder)

| Product Map pattern | Наша реализация |
|---------------------|-----------------|
| Repo-first | Markdown в git: `orchestration-queue.md`, `knowledge-base/` per subproject |
| Agent instructions | `.cursor/rules/muster-orchestration.mdc`, `role-*.mdc`, `vibecoder-master.mdc` |
| Role-scoped agents | Muster coordination matrix, Role: PM / Developer / … |
| Runtime task context | Queue: READY → IN_PROGRESS → DONE, AC, deps |
| `@` вместо paste | muster-orchestration: «use @knowledge-base/...» |
| Skills (частично) | `skills-cursor/` (babysit, canvas, split-to-prs, …) |
| Subagents | Muster agents в `.cursor/agents/` |
| ADR / architecture | `knowledge-base/architecture.md`, `adr-template.md` |
| TASK-like loop | Topics (queue tasks) → Agents (roles) → Skills → Knowledge (artifacts) |

### 3.2 Пробелы vs текущий setup

| Пробел | Риск | Рекомендация |
|--------|------|--------------|
| Нет `knowledge-base/INDEX.md` | Агент гадает / грузит лишнее | Добавить TOC с кратким описанием каждого файла и subproject pointer |
| Skills только в `~/.cursor/` | Не versioned, не portable для команды | Symlink или `.cursor/skills/` в репо для project-specific skills |
| Нет branch workflow для context | Сломанный context попадает в main без review | `update/kb-*` ветки для крупных KB/rule changes |
| Queue раздувается | Stuffing при «прочитай весь queue» | Агент читает queue, но AC — через `@` на конкретный spec |
| Нет decision log / glossary (root) | Drift терминов между subprojects | `knowledge-base/decisions.md`, `glossary.md` — минимальные |
| User rules vs KB не разведены | Дубли и конфликт канона | User rules = Layer 4 only; product facts только в KB |
| Нет archive policy | Context rot | `knowledge-base/_archive/` или пометка DEPRECATED в frontmatter |
| Product Map UX docs отдельно | ✓ правильно | Этот doc — agent context; UX — portable/productmap UX refs |
| `cursor_dialog` / IDE rules | Vendor cache | Критичные принципы дублировать в git (этот файл), не только user rules |

### 3.3 Маппинг Product Map `_knowledge/` → наш monorepo

| Product Map folder | У нас сейчас | Примечание |
|--------------------|--------------|------------|
| `00_company` / onepager | `*/knowledge-base/product-brief.md` | Per subproject — ок |
| `04_delivery` / backlog | `orchestration-queue.md` | Source of truth ✓ |
| `08_frameworks` | Muster rules, PM Map cheatsheet в role-pm | Размазано |
| `09_templates` | `adr-template.md`, dogfood templates | Расширять по мере friction |
| `INDEX.md` | **отсутствует** | Priority #1 |

---

## 4. Рекомендуемые практики (чеклист)

### Для Human Architect

1. **Создать** `knowledge-base/INDEX.md` — оглавление monorepo KB + ссылки на subproject KB.
2. **При трении с агентом** — фиксировать gap в git (rule или KB), не только в чате.
3. **Крупные context changes** — отдельная ветка + smoke-test с Cursor agent.
4. **Ежемесячно** — prune: дубли AC, устаревшие BLOCKED без owner.

### Для агентов (в rules / queue)

1. Читать `orchestration-queue.md` **до** работы; claim IN_PROGRESS.
2. Тянуть spec через `@knowledge-base/` / `@docs/` — не просить Human пересказать.
3. Не дублировать в ответах то, что уже в cited files.
4. Role rule — только зона роли; не выполнять чужие duties.
5. Skills — invoke когда задача повторяемая (PR, CI, canvas, commit).

### Для новых subprojects

Минимальный context bootstrap (Product Map Step 1–2):

```
subproject/
  orchestration-queue.md
  knowledge-base/
    INDEX.md          ← локальный TOC
    product-brief.md
  .cursor/rules/      ← role + muster
  AGENTS.md           ← short router (optional)
```

### Anti-patterns (избегать)

- Context stuffing в Human message вместо `@` ссылок
- Product strategy в `vibecoder-master.mdc` (implementation rule)
- Один mega user rule на всё (дублирует KB)
- Хранение PM memory только в ChatGPT/Cursor threads
- Absolute paths в skills/rules
- «Comprehensive docs nobody trusts» — лучше lean repo с prune

---

## 5. Сравнение: Prompt vs Stuffing vs Engineering

| Критерий | Prompt engineering | Context stuffing | Context engineering |
|----------|-------------------|------------------|-------------------|
| Фокус | Вопрос | Объём | Среда |
| Горизонт | 1 turn | 1 turn, перегруз | Много сессий |
| Владелец | Индивид | Индивид | Команда / git |
| Исход | Лучший ответ | Шум, lost-in-middle | Стабильное поведение системы |

---

## 6. Getting Started (адаптация Product Map → наш репо)

| Шаг | Product Map | Наш следующий шаг |
|-----|-------------|-------------------|
| 1 Foundation | Git + one-pager + AGENTS.md | ✓ есть; добавить root `INDEX.md` |
| 2 Knowledge base | INDEX, ICP, glossary, decision log | Частично per project; glossary/decisions — root KB |
| 3 Skills | 3–5 top repeated tasks | Версионировать 3 top skills в `.cursor/skills/` |
| 4 Cross-tool | Same question across tools | Опционально: тест product question Claude vs Cursor |
| 5 Cadence | Owner + weekly/monthly review | Human Architect owns INDEX + queue hygiene |

---

## 7. Связанные артефакты (без дублирования UX)

| Файл | Содержание |
|------|------------|
| `knowledge-base/productmap-ux-ui-analysis-portable.md` | UX/UI tier, tokens, layout — **не agent context** |
| `quiet-partner/docs/ux-reference-productmap.md` | Quiet Partner UX adopt/reject |
| `.cursor/rules/muster-orchestration.mdc` | Layer 2 instructions, queue workflow |
| `.cursor/rules/role-*.mdc` | Role-scoped agent behavior |
| `orchestration-queue.md` (root + subprojects) | Layer 3 runtime + delivery backlog |

---

## References

- Product Map Context Engineering: https://app.productmap.io/topic/context-engineering~9790eb70-f1dd-44f9-9098-7746d7f0cce3
- Prompting Guide (DAIR): https://promptingguide.ai
- Product Map TASK article: https://www.productmap.io/task-agentic-product-management

---

*Документ подготовлен по запросу Human Architect · context layer для Muster/Vibecoder · без изменения AC и queue priorities.*

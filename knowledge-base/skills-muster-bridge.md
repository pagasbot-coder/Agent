# Мост: ProductMap skills ↔ Muster agents

> **Цель:** навыки из проекта `didactic-doodle` (`.agents/skills` + `.productmap`) работают вместе с ролями Muster в репо `Agent`.  
> **Импорт с Mac:** [`../scripts/import-didactic-skills.sh`](../scripts/import-didactic-skills.sh)

---

## TL;DR

| Skill (didactic-doodle) | Кто в Muster вызывает | Knowledge из `.productmap` |
|-------------------------|----------------------|----------------------------|
| `/prd-writer` | **PM** (`muster-pm`) | `09_templates/prd-template.md`, `ai-prd-template.md`, `04_delivery/backlog-requirements/` |
| `/competitor-analysis` | **Growth / CMO** (+ PM discovery) | `01_strategy/`, `02_generation/marketing/`, `08_frameworks/` |
| `/competitor-report` | **Growth / CMO**, handoff → PM | `01_strategy/`, `03_analysis/` |

После импорта skills лежат в **`.agents/skills/`**, база — в **`.productmap/`**.  
Очередь задач по-прежнему **`orchestration-queue.md`** (Muster).

---

## Как «поженить» на практике

1. Human: `Role: PM` + `/prd-writer` (или просит PRD в чате).
2. PM-агент читает skill + `@.productmap/INDEX.md` (нужный шаблон).
3. Черновик PRD → AC в формате Muster → задача `T-0xx` со статусом `READY` для Developer.
4. Growth: `/competitor-analysis` → артефакт в `knowledge-base/` или `.productmap/10_data/research/` → PM использует в gate.

**Не смешивать:** skill пишет продукт-артефакт; Muster-роль обновляет очередь и handoff. Код пишет только Developer.

---

## Роутинг по фазам Product Map 3.10

| Фаза | Skills | Muster |
|------|--------|--------|
| Strategy (1) | competitor-analysis | PM + Growth |
| Generation (2) | prd-writer, competitor-report | PM → UI/UX |
| Analysis (3) | competitor-report | Growth + PM |
| Delivery (4) | prd-writer → queue AC | PM → Dev → QA |

---

## Пути после импорта

```text
Agent/
├── .agents/skills/
│   ├── prd-writer/SKILL.md
│   ├── competitor-analysis/SKILL.md
│   └── competitor-report/SKILL.md
├── .productmap/INDEX.md          # канон ProductMap KB
├── .cursor/agents/muster-*.md    # роли знают про skills
└── orchestration-queue.md
```

---

## Импорт (Human на Mac)

```bash
cd /Users/marina/Projects/Agent
./scripts/import-didactic-skills.sh                  # dry-run
./scripts/import-didactic-skills.sh --apply          # copy
# если didactic-doodle не в ~/Projects/didactic-doodle:
SOURCE=/path/to/didactic-doodle ./scripts/import-didactic-skills.sh --apply
git add .agents/skills .productmap
git status   # не коммить чужие quiet-partner M-файлы
git commit -m "feat: import ProductMap skills and .productmap KB"
git push
```

Cloud Agent после `git pull` увидит skills и `.productmap`.

---

## Связанные файлы

- [`assistants-placement.md`](./assistants-placement.md) — куда что класть
- [`.cursor/agents/muster-pm.md`](../.cursor/agents/muster-pm.md) — вызов `/prd-writer`
- [`.cursor/agents/muster-growth-marketer.md`](../.cursor/agents/muster-growth-marketer.md) — competitor skills

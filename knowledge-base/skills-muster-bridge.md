# Мост: ProductMap skills ↔ Muster agents

> **Цель:** навыки из проекта `didactic-doodle` (`.agents/skills` + `.productmap`) работают вместе с ролями Muster в репо `Agent`.  
> **Импорт с Mac:** [`../scripts/import-didactic-skills.sh`](../scripts/import-didactic-skills.sh) · runbook: [`../docs/runbook-import-skills.md`](../docs/runbook-import-skills.md)

---

## TL;DR

| Skill / KB | Владелец (вызывает) | Кто ещё трогает | Не трогают |
|------------|---------------------|-----------------|------------|
| `/prd-writer` | **PM** | Senior PM (ревью), Copywriter (язык) | Dev, DevOps, Architect (как автор) |
| `/competitor-analysis` | **Growth** | PM (discovery read) | Senior PM/Architect/DevOps как авторы |
| `/competitor-report` | **Growth** | PM, Copywriter (язык) | Developer |
| `.productmap/09` templates | PM / Architect (ADR) | Senior PM | DevOps |
| `.productmap/08` frameworks | Senior PM / PM | Growth | DevOps |
| `.productmap/06` product-ops | DevOps (доп. чеклист) | — | не замена runbook |
| `.productmap/02` research | SME (структура) | PM | не замена field truth |

После импорта skills лежат в **`.agents/skills/`**, база — в **`.productmap/`**.  
Очередь задач по-прежнему **`orchestration-queue.md`** (Muster).

---

## Матрица всех ролей

| Роль | Skills / ProductMap | Роль в связке |
|------|---------------------|---------------|
| **PM** | Владеет `/prd-writer` | Артефакт → AC → очередь |
| **Senior PM** | Ревью PRD + `08`/`09` | Quality gate, не backlog |
| **Growth** | Владеет `/competitor-*` | Battlecard → PM |
| **IT-Architect** | `09` ADR/API templates; `04` risk/dev | Форма ADR; стек только ADR |
| **Developer** | Читает PRD/AC | Реализует; не владеет skills |
| **UI/UX** | Макеты; строки → Copywriter | Не invent final RU alone |
| **QA** | AC / smoke | Отчёты Human на русском |
| **DevOps** | `06` ops + import runbook | Infra; skills import help |
| **SME** | `02`/`10` structure optional | Field truth > templates |
| **Copywriter** | Редактура выходов skills | RU, факты не менять |

---

## Как «поженить» на практике

1. Human: `Role: PM` + `/prd-writer` (или просит PRD в чате).
2. PM-агент читает skill + `@.productmap/INDEX.md` (нужный шаблон).
3. Senior PM (по запросу) — gate полноты секций.
4. Copywriter — язык отчёта/PRD для Human (русский).
5. Черновик → AC Muster → `READY` для Developer.
6. Growth: `/competitor-analysis` → артефакт → PM gate.

**Не смешивать:** skill пишет продукт-артефакт; Muster-роль обновляет очередь и handoff. Код пишет только Developer.

---

## Роутинг по фазам Product Map 3.10

| Фаза | Skills | Muster |
|------|--------|--------|
| Strategy (1) | competitor-analysis | PM + Growth (+ SME critique) |
| Generation (2) | prd-writer, competitor-report | PM → Senior PM gate → UI/UX |
| Analysis (3) | competitor-report | Growth + PM |
| Delivery (4) | prd-writer → queue AC | PM → Dev → QA (+ DevOps deploy) |

---

## Пути после импорта

```text
Agent/
├── .agents/skills/
│   ├── prd-writer/SKILL.md
│   ├── competitor-analysis/SKILL.md
│   └── competitor-report/SKILL.md
├── .productmap/INDEX.md
├── .cursor/agents/muster-*.md
└── orchestration-queue.md
```

---

## Импорт (Human на Mac)

См. [`../docs/runbook-import-skills.md`](../docs/runbook-import-skills.md). Source **read-only** (`didactic-doodle`).

---

## Связанные файлы

- [`assistants-placement.md`](./assistants-placement.md)
- [`agent-ops-stream.md`](./agent-ops-stream.md)
- Все `muster-*.md` в `.cursor/agents/` + QP `@role-senior-pm`

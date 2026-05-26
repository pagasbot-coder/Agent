# ADR Template (Muster)

> Скопируйте блок ниже в `knowledge-base/architecture-decisions.md` и замените `NNN` на следующий номер.  
> **Владелец:** IT-Architect (`@role-it-architect`). После `Accepted` — PM обновляет очередь (`BLOCKED` → `READY`).

---

## ADR-NNN: Краткий заголовок

**Статус:** Proposed | Accepted | Superseded by ADR-XXX  
**Дата:** YYYY-MM-DD  
**Автор:** IT-Architect / muster-it-architect

### Контекст

- Какая бизнес- или техпроблема?
- Какие ограничения (OSS-only, self-host, срок MVP, команда)?
- Ссылки: `@knowledge-base/product-brief.md`, `@docs/tech-stack.md`, задача `T-0xx`.

### Решение

Что выбрали и почему (OSS-first, если применимо).

### Альтернативы

| Вариант | Тип (MVP / Classic / Async) | Pros | Cons | Почему не выбран |
|---------|----------------------------|------|------|------------------|
| A | MVP quick start | | | |
| B | Classic full-stack | | | |
| C | Scalable / async | | | |

### Последствия

- **Плюсы:** …
- **Минусы / tech debt:** …
- **Ops / infra:** …
- **RBAC / data model:** … (при необходимости — Mermaid ER в `architecture.md`)

### Связанные задачи

- `T-0xx` — статус после ADR: `READY` (PM) → implement (Developer) → verify (QA)

---

## Чеклист Architect перед `Accepted`

- [ ] 2–3 варианта стека сравнены (MVP / Classic / Async)
- [ ] OSS-first обоснован или waiver Human зафиксирован
- [ ] Mermaid (ER или sequence) приложен в чат или в `architecture.md`
- [ ] Индекс в `architecture-decisions.md` обновлён
- [ ] Запись в «Журнал» `orchestration-queue.md`

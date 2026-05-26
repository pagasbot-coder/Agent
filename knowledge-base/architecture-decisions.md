# Architecture Decision Records (ADR)

> **Владелец:** IT-Architect (`@role-it-architect`).  
> **High-level архитектура приложений:** см. также `banya-digital/knowledge-base/architecture.md` (Banya-Digital ERP).

Журнал архитектурных решений для Muster monorepo и новых продуктов Human Architect.

---

## Как пользоваться

1. Architect добавляет ADR при выборе стека, auth, БД, очередей, deploy path.
2. Формат — один блок `## ADR-NNN` на решение; статус: `Proposed` → `Accepted` → `Superseded`.
3. В «Связанные задачи» указывать ID из `orchestration-queue.md` / `banya-digital/orchestration-queue.md`.
4. PM не дублирует ADR в AC — только ссылка `@knowledge-base/architecture-decisions.md#adr-nnn`.

---

## ADR template

```markdown
## ADR-NNN: Краткий заголовок

**Статус:** Proposed | Accepted | Superseded by ADR-XXX  
**Дата:** YYYY-MM-DD  
**Контекст:** Какая бизнес- или техпроблема?  
**Решение:** Что выбрали и почему (OSS-first).  
**Альтернatives:** A / B / C — почему отвергнуты.  
**Последствия:** Плюсы, минусы, tech debt, ops burden.  
**Связанные задачи:** T-0xx
```

---

## Индекс решений

| ID | Заголовок | Статус | Дата | Задачи |
|----|-----------|--------|------|--------|
| — | *(пусто — первый ADR добавит Architect)* | — | — | — |

---

## Pending decisions (Architect backlog)

| Вопрос | Очередь | Options | Рекомендация Architect |
|--------|---------|---------|------------------------|
| Auth provider + RBAC для ERP | T-009 (`banya-digital`) | NextAuth+PG, Keycloak, proprietary | TBD — `@role-it-architect` |

---

## ADR-001: *(placeholder — удалить при первом реальном ADR)*

**Статус:** Proposed  
**Дата:** —  
**Контекст:** Шаблон файла; не является принятым решением.  
**Решение:** —  
**Альтернatives:** —  
**Последствия:** —  
**Связанные задачи:** —

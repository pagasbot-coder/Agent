# ADR-006: Мост Пульт ↔ Тихий напарник (`stagesRadarBridge`)

**Статус:** Принято (v1)  
**Дата:** 2026-07-22 · **T-104**  
**PRD:** [`docs/prd-stages-radar-bridge.md`](../docs/prd-stages-radar-bridge.md)

## Контекст

Пульт (`/stages`, `qp-stages-*`) и напарник (`/radar`, Zustand `quiet-partner-v1`) — два автономных persist. Нужна явная связь: заполненный проект в пульте → оценка на радаре без слияния UI.

## Решение

1. **Контракт** `stagesRadarBridge` v1 в коде (`lib/stages/bridge.ts`).
2. **Канон:** операционка = пульт; scores после apply = store напарника.
3. **Поток:** CTA «Подтянуть в напарника» → `suggestScoresFromRegisters` → `applyStagesBridge` → `/radar` с баннером.
4. **Human Go:** режим **A с баннером** — apply по клику; confirm при overwrite другого проекта; без автосинка на кейстрок; без режима B (превью).
5. Существующий `exportProjectSnapshot` **не ломаем** (только домены); мост — отдельный тип.

### Схема (логическая)

```text
schemaVersion: 1
projectKey: string
linkedAt / stagesUpdatedAt: ISO
source: "stages"
project: { name, stageId: 0..6, stageName }
registers: Record<registerId, rows[]>   // снимок cache
suggestedScores: Record<D1..D8, number>
```

### Persist

| Ключ | Что |
|------|-----|
| `qp-stages-*` | без изменений |
| `quiet-partner-v1` | + `stagesBridge: StagesBridgeLink \| null` |

### Аналитика (без PII имени)

`bridge_pull_to_radar`, `bridge_scores_applied` — только `stage_id`, `register_count`, `overwrite: bool`.

## Последствия

- Developer: T-106…T-108  
- Senior PM: правила scores — [`docs/bridge-score-mapping.md`](../docs/bridge-score-mapping.md)  
- Отклонено: server sync, FS Access, reverse radar→stages в v1

## Phase 5

Multi-project / auth — вне этого ADR.

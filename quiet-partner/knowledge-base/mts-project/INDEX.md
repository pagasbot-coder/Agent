# Проект МТС — индекс (Quiet Partner)

**Код проекта:** Проект МТС  
**Продукт заказчика:** МТС Exolve (АО МТТ) — антифрод и требования законодательства  
**Статус:** подготовка / собес + kickoff-каркас  
**Обновлено:** 2026-08-04  

Агенты **сначала** читают этот INDEX, затем очередь (эпик **Проект МТС**), затем роль и скилл.

---

## Канон

| Файл | Владелец | Зачем |
|------|----------|-------|
| [`../mts-exolve-antifraud-project-prep.md`](../mts-exolve-antifraud-project-prep.md) | PM / Senior PM | Устав, НПА-обзор, workstreams, 90 дней |
| [`roles-matrix.md`](./roles-matrix.md) | PM | Роли Muster vs живая команда Exolve |
| [`../mts-exolve-npa-registry.md`](../mts-exolve-npa-registry.md) | **Legal** | Реестр обязательств |
| [`../mts-exolve-industry-brief.md`](../mts-exolve-industry-brief.md) | **SME** | Поле, глоссарий, боли, KPI |
| [`../mts-exolve-detection-policy.md`](../mts-exolve-detection-policy.md) | **Detection** | Правила / FP |
| [`../mts-exolve-gis-ops-runbook.md`](../mts-exolve-gis-ops-runbook.md) | **DevOps** | 24/7 узел обмена |
| [`../../docs/chat-handoff-mts-exolve-antifraud.md`](../../docs/chat-handoff-mts-exolve-antifraud.md) | — | Стартовые промпты чатов |
| [`../../orchestration-queue.md`](../../orchestration-queue.md) | PM | Задачи MTS-* |

---

## Скиллы (`.claude/skills/`)

| Роль | Скилл |
|------|-------|
| SME | `telecom-antifraud-sme.md` |
| Legal | `npa-registry-legal.md` |
| Detection | `detection-policy.md` |
| DevOps | `gis-antifraud-ops.md` |
| PM (общий) | `../project-lifecycle-playbook.md` + при необходимости ProductMap `prd-writer` из Agent |

---

## Активация ролей

См. таблицу в `orchestration-queue.md` и `roles-matrix.md`. Пример:

```text
Role: SME
Проект: Проект МТС
@knowledge-base/mts-project/INDEX.md
Задача: MTS-002 — industry brief v1
```

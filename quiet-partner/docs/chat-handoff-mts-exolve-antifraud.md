# Handoff: Проект МТС — антифрод Exolve (Quiet Partner)

**Куда:** `/Users/marina/Projects/Agent/quiet-partner`  
**Обновлено:** 2026-08-04  

## Как открыть

1. Workspace: `quiet-partner`
2. New Chat
3. Вставь один из стартовых блоков ниже

## Канон

| Файл | Зачем |
|------|-------|
| `@knowledge-base/mts-project/INDEX.md` | Оглавление проекта |
| `@knowledge-base/mts-project/roles-matrix.md` | Роли агентов vs Exolve |
| `@orchestration-queue.md` | Эпик **Проект МТС** (`MTS-*`) |
| `@knowledge-base/mts-exolve-antifraud-project-prep.md` | Устав / 90 дней |

## Стартовые сообщения

### PM / Senior PM

```
Role: PM
Проект: Проект МТС
@knowledge-base/mts-project/INDEX.md
@orchestration-queue.md
Задача: MTS-003 gap matrix (после MTS-001/002) или приоритезация READY.
Не выдумывай даты НПА. СОРМ ≠ антифрод.
```

### Legal

```
Role: Legal
Проект: Проект МТС
@knowledge-base/mts-exolve-npa-registry.md
@.claude/skills/npa-registry-legal.md
Задача: MTS-001 — углубить реестр + Top-10 вопросов юристу Exolve.
Всё без confirmed — помечай confirm with Exolve counsel.
```

### SME

```
Role: SME
Проект: Проект МТС
@knowledge-base/mts-exolve-industry-brief.md
@.claude/skills/telecom-antifraud-sme.md
Задача: MTS-002 — industry brief v1 (day-in-life, pains, KPI, anti-features).
```

### Detection / ИБ

```
Role: Detection
Проект: Проект МТС
@knowledge-base/mts-exolve-detection-policy.md
@.claude/skills/detection-policy.md
Задача: MTS-004 — policy draft + FP budget TBD.
```

### DevOps / SRE

```
Role: DevOps
Проект: Проект МТС
@knowledge-base/mts-exolve-gis-ops-runbook.md
@.claude/skills/gis-antifraud-ops.md
Задача: MTS-005 — каркас runbook 24/7 узла обмена с ГИС.
```

### IT-Architect

```
Role: IT-Architect
Проект: Проект МТС
@knowledge-base/mts-project/INDEX.md
Задача: MTS-006 (когда READY) — ADR черновик канала обмена с ГИС.
```

## Правило

Агенты Quiet Partner ≠ юрист МТС. Живой counsel Exolve — единственный SoT по датам обязательств.

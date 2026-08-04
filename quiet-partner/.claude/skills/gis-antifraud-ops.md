# Skill: GIS Antifraud Ops / SRE (Проект МТС)

## Когда применять

Role: DevOps / SRE — узел обмена с ГИС, 24/7, мониторинг, runbook.

## Метод

1. Inventory: канал обмена, журналы, RPO/RTO (черновик), владельцы дежурства.
2. Health: liveness/readiness, алерт «обмен недоступен», эскалация.
3. Resilience: retry/queue, дублирование (если применимо), degraded mode.
4. Security baseline: secrets, доступ к журналам, retention hint (→ Legal/ПДн).
5. Smoke checklist для QA после изменений.
6. Все SLA ГИС — `TBD / confirm with Exolve`.

## Источники

- `@knowledge-base/mts-exolve-gis-ops-runbook.md`
- Prep § риски (24/7)

## Выход

Runbook + checklist; handoff Architect (ADR) и QA.

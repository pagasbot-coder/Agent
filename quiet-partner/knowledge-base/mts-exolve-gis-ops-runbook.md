# МТС Exolve — GIS exchange ops runbook (DevOps / SRE)

**Проект:** Проект МТС  
**Владелец:** DevOps / SRE (`@role-devops`)  
**Статус:** v0.1 каркас (без прод-доступов Exolve)  
**Обновлено:** 2026-08-04  

> SLA и форматы ГИС — **TBD / confirm with Exolve**. Этот файл — чеклист подготовки, не прод-runbook МТС.

---

## 1. Цель

Обеспечить **непрерывность узла обмена** сигналами с ГИС «Антифрод»: доступность, журналы, алерт, эскалация, восстановление.

---

## 2. Inventory (заполнить на kickoff)

| Параметр | Значение |
|----------|----------|
| Канал обмена | TBD |
| Endpoint / очередь | TBD |
| Журналы / retention | TBD (→ Legal 152-ФЗ) |
| RTO / RPO | TBD |
| On-call primary / secondary | TBD |
| Architect ADR | TBD |

---

## 3. Health & alerts (черновик)

| Check | Порог | Действие |
|-------|-------|----------|
| Liveness узла | fail 2× | page on-call |
| Очередь обмена backlog | > N TBD | page + degraded mode |
| Ошибки auth/format к ГИС | spike | page + Architect |
| Диск журналов | > 80% | expand / rotate |

---

## 4. Degraded mode

1. Сохранять сигналы локально (durable queue).  
2. Retry с backoff; не терять must-report события.  
3. Статус «обмен деградирован» → Support/PM.  
4. После восстановления — replay + сверка.

---

## 5. Security baseline

- Секреты только в vault/CI secrets, не в git  
- Доступ к журналам по least privilege  
- Audit trail изменений конфига обмена  

---

## 6. Smoke checklist (QA)

- [ ] Health endpoint / probe OK  
- [ ] Тестовый сигнал → journal  
- [ ] Алерт test (dry-run)  
- [ ] Restore/replay drill задокументирован  

---

## Handoff

- **Architect:** ADR канала и границ сети  
- **Detection:** что писать в journal при block/report  
- **QA:** прогон smoke после изменений  

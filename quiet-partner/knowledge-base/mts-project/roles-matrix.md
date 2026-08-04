# Проект МТС — матрица ролей (Muster vs Exolve)

**Обновлено:** 2026-08-04  
**Цель:** закрыть пробелы команды агентов Quiet Partner и явно отделить подготовку в Cursor от живой команды Exolve.

---

## 1. Роли Muster в Quiet Partner (подключены к Проекту МТС)

| Роль | Rule | Скилл / библиотека | На старте проекта |
|------|------|--------------------|-------------------|
| **PM** | `@role-pm` | playbook, prep, очередь | Критично |
| **Senior PM** | `@role-senior-pm` | PMBOK lens, gate методологии | Критично (не SME) |
| **Legal / Compliance** | `@role-legal-compliance` | `npa-registry-legal` + `mts-exolve-npa-registry` | **Критично** |
| **SME (телеком/антифрод)** | `@role-sme` | `telecom-antifraud-sme` + industry brief | **Критично** |
| **Detection / ИБ** | `@role-detection-ib` | `detection-policy` | Для delivery / собес-глубина |
| **IT-Architect** | `@role-it-architect` | ADR, архитектура обмена | Для delivery |
| **DevOps / SRE** | `@role-devops` | `gis-antifraud-ops` + runbook | Для delivery (24/7) |
| **Developer** | `@role-developer` | — (код продукта Exolve вне QP) | Позже / вне QP app |
| **QA** | `@role-qa` | checklists | Smoke артефактов / позже |
| **UI/UX** | `@role-ui-ux` | — | Не критично на старте |
| **Growth** | `@role-growth-marketer` | — | Не критично на старте |
| **Copywriter** | `@role-copywriter` | — | Q&A / отчёты по запросу |

**Telephony / сеть:** отдельной роли нет — закрывает **SME** (+ Architect на интеграциях).  
**Юрист Exolve (живой):** не агент — Human эскалирует; Legal-агент готовит вопросы и черновик реестра.

---

## 2. Живая команда Exolve (ориентир, не агенты)

| Роль на стороне Exolve | Зачем | Кто в Cursor «зеркалит» |
|------------------------|-------|-------------------------|
| Руководитель IT-проекта / PO | план-график, Jira, стейкхолдеры | PM + Senior PM |
| Юристы / compliance | реестр НПА, даты | Legal (+ Human) |
| Продукт / B2B | кабинет, статусы, апелляции | PM (+ UI позже) |
| ИБ / antifraud | правила, FP | Detection |
| Разработка / интеграции | ГИС, API | Architect → Developer |
| Сеть / телефония | CLI, транзит, 8-800 | SME |
| Ops / дежурства | 24/7 | DevOps |
| Support / CS | runbook клиентов | PM + Copywriter |

---

## 3. Pipeline подготовки

```text
Legal (реестр НПА, Q-list)
    ∥
SME (поле, глоссарий, критика)
    → PM (gap matrix, backlog MTS-*)
    → Architect (ADR обмена)
    → DevOps (runbook 24/7) + Detection (policy draft)
    → QA / Human sign-off
```

Senior PM **не** заменяет SME и Legal.

---

## 4. Дисклеймер

Агенты Quiet Partner помогают готовить артефакты и собес.  
**Обязательные даты и состав обязательств для продукта Exolve** — только через юриста МТС/Exolve.

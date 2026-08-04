# МТС Exolve — Detection / policy draft (ИБ)

**Проект:** Проект МТС  
**Владелец:** Detection / ИБ (`@role-detection-ib`)  
**Статус:** v0.1 draft — критерии ГИС не подтверждены  
**Обновлено:** 2026-08-04  

---

## Принципы

1. Правила **конфигурируемы** — подзаконка и критерии могут сдвинуться.  
2. Detection engine ≠ канал обмена с ГИС (compliance exchange).  
3. FP budget утверждает бизнес/Human; агент не выдумывает X%.  
4. Любая «официальная» формулировка критерия — только после Legal/`confirmed`.

---

## Threat map (со SME)

| Тип | Сигналы (черновик) | Действие-кандидат | Риск FP |
|-----|--------------------|-------------------|---------|
| Подмена / серый CLI | Аномалии CLI vs маршрут | mark / throttle / block | Высокий для легального B2B |
| Голосовой фрод (wangiri, toll) | Коротких вызовов паттерн, toll destinations | block / report | Средний |
| SMS-фрод / фишинг | Рассылки, жалобы, репутация | block / report | Средний |
| Компрометация API | Внезапный spike, новые IP/гео | revoke / quarantine | Низкий FP если по ключу |
| Злоупотребление 8-800 / транзит | Аномальный объём/направление | review / throttle | Высокий |
| Ложный позитив | Жалоба клиента, VIP | unblock + whitelist | — |

---

## Policy template (строка)

| ID | Условие | Действие | Исключение | Апелляция | Владелец | Статус |
|----|---------|----------|------------|-----------|----------|--------|
| P-001 | TBD (критерии ГИС) | report to GIS | VIP whitelist | Support → ИБ 4h | Detection | draft |
| P-002 | API key anomaly | quarantine key | staging keys | Dev on-call | Detection + Dev | draft |
| P-003 | Confirmed fraud number | block egress | court/Legal override | Legal | Detection | draft until Legal |

---

## Метрики

| Метрика | Цель | Статус |
|---------|------|--------|
| FP rate | ≤ X% (TBD бизнес) | TBD |
| FN / пропуск | мониторинг тренда | TBD |
| Time-to-block | ≤ Y | TBD |
| Time-to-unblock | ≤ Z | TBD |

---

## Handoff

- **Legal:** constraints на block/report  
- **PM:** AC на кабинет (статус номера, апелляция)  
- **DevOps:** алерты на spike FP / очередь обмена  

# PMBOK 7 Domain Playbook — Quiet Partner

**Статус:** v1 (Senior PM — T-003 DONE)  
**Язык UI:** RU (EN glossary optional)  
**Последнее обновление:** 2026-05-30

> Продукт использует **8 performance domains** PMBOK 7 как *линзы*, не как exam syllabus.  
> Co-pilot задаёт вопросы; не выставляет «оценку соответствия PMI».

---

## Domain index (RU labels)

| ID | EN (PMBOK 7) | RU label | Radar wedge |
|----|--------------|----------|-------------|
| D1 | Stakeholders | Заинтересованные стороны | 1 |
| D2 | Team | Команда | 2 |
| D3 | Development Approach & Life Cycle | Подход и жизненный цикл | 3 |
| D4 | Planning | Планирование | 4 |
| D5 | Project Work | Работа проекта | 5 |
| D6 | Delivery | Поставка | 6 |
| D7 | Measurement | Измерение | 7 |
| D8 | Uncertainty | Неопределённость | 8 |

**Score scale (radar):** 0–100 perceived health (subjective + onboarding inputs); not audit score.

---

## D1 — Заинтересованные стороны

**Plain question:** Кто может остановить или ускорить проект — и знают ли они одно и то же?

| Signal | Indicators |
|--------|------------|
| **Green** | Есть список ключевых сторон; ожидания согласованы на горизонте 2–4 нед |
| **Amber** | Новые стороны «всплывают»; эскалации без владельца |
| **Red** | Спонсор/клиент не отвечает; конфликт целей блокирует работу |

**Co-pilot (stage 1):** «Кто последний раз менял ожидания — и зафиксировали ли вы это письменно?»

---

## D2 — Команда

**Plain question:** Может ли команда сказать «нет» без наказания?

| Signal | Indicators |
|--------|------------|
| **Green** | Роли ясны; перегруз обсуждается открыто |
| **Amber** | Тихие переработки; текучка / sick leave |
| **Red** | Ключевой человек выгорел или уходит mid-project |

**Co-pilot:** «Что команда сейчас делает *сверх* плана — и кто это видит?»

---

## D3 — Подход и жизненный цикл

**Plain question:** Мы реально работаем predictive, adaptive или hybrid — и процессы этому соответствуют?

| Signal | Indicators |
|--------|------------|
| **Green** | Подход выбран осознанно; ceremony match (спринты vs stage-gate) |
| **Amber** | «Agile на бумаге», waterfall в реальности |
| **Red** | Смена подхода без ретро / без согласия сторон |

**Co-pilot:** «Если завтра убрать один ritual — какой не заметят?»

---

## D4 — Планирование

**Plain question:** План помогает принимать решения или лежит мёртвым грузом?

| Signal | Indicators |
|--------|------------|
| **Green** | Ближайшие 2–3 нед понятны; зависимости видны |
| **Amber** | План обновляется только «для отчёта» |
| **Red** | Нет общего понимания scope / critical path |

**Co-pilot:** «Какое одно решение вы отложили из-за нехватки данных в плане?»

---

## D5 — Работа проекта

**Plain question:** Работа идёт — или много «работы о работе»?

| Signal | Indicators |
|--------|------------|
| **Green** | WIP ограничен; блокеры снимаются &lt;48ч |
| **Amber** | Много meetings, мало shipped outcomes |
| **Red** | Параллельные «пожары» без triage |

**Co-pilot:** «Какой блокер старше 3 дней — и кто его owner?»

---

## D6 — Поставка

**Plain question:** Пользователь / клиент получил ценность недавно?

| Signal | Indicators |
|--------|------------|
| **Green** | Increment за последние 2 нед с feedback |
| **Amber** | Долго без demo / release |
| **Red** | «Готово на 90%» месяцами |

**Co-pilot:** «Что можно показать stakeholder *на этой неделе* — даже черновик?»

---

## D7 — Измерение

**Plain question:** Метрики ведут к действию — или к красивым слайдам?

| Signal | Indicators |
|--------|------------|
| **Green** | 1–3 KPI с owner и порогом действия |
| **Amber** | Метрики есть, решений нет |
| **Red** | Никто не знает, on-track ли проект |

**Co-pilot:** «Какая одна метрика, если ухудшится, заставит вас менять план?»

---

## D8 — Неопределённость

**Plain question:** Риски и неизвестное обсуждаются до того, как они становятся кризисом?

| Signal | Indicators |
|--------|------------|
| **Green** | Top risks с mitigation owner |
| **Amber** | «Надеемся, что пронесёт» |
| **Red** | Внешний shock без запаса (время/бюджет/scope) |

**Co-pilot:** «Какой риск вы *не* записали, потому что «и так понятно»?»

---

## Tailoring matrix (delivery approach)

| Aspect | Predictive | Adaptive | Hybrid |
|--------|------------|----------|--------|
| **Radar default weights** | Planning, Delivery ↑ | Team, Uncertainty ↑ | Balanced |
| **HealthCommentary tone** | Milestone / baseline focus | Flow / WIP / feedback | «Which half fails?» |
| **Onboarding emphasis** | Scope, schedule | Iteration, stakeholders | Explicit split per workstream |
| **Refresh cadence** | Weekly | Daily standup hook | Weekly + sprint end |

Senior PM maintains this table; Developer implements as store defaults only after T-003 DONE.

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-05-30 | Developer (bootstrap) | Draft v0 all 8 domains + tailoring matrix |
| 2026-05-30 | Senior PM | v1: пороги 70/40; navigator-scenarios.md; sync с ТЗ |

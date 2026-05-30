# PM Governance — Quiet Partner (режим PM-led)

**Версия:** 1.0  
**Дата:** 2026-05-30  
**Владелец:** PM (muster-pm)  
**Архитектор (Human):** Pavel  
**Делегирование:** Human согласует только критические решения; операционный ритм — у PM.

> Связанные документы: [`orchestration-queue.md`](../orchestration-queue.md) · [`pm-status.md`](./pm-status.md) · [`team-assignments.md`](./team-assignments.md) · [`implementation-plan.md`](./implementation-plan.md) · [`technical-specification.md`](./technical-specification.md)

---

## TL;DR

PM владеет грумингом очереди, еженедельным статусом, раздачей ролей и подготовкой phase gates. Human (Pavel) подключается только по списку «MUST decide» ниже. Пороговые правки, QA smoke, черновики ADR, static prompt regression, competitive scan и подготовка staging **не эскалируются**.

---

## Что владеет PM

| Область | Артефакт / действие | Ритм |
|---------|---------------------|------|
| **Очередь** | `orchestration-queue.md`: статусы, AC, deps, «Журнал» | По каждому grooming / gate |
| **Приоритет** | P0/P1/P2, `BACKLOG` → `READY` после Product Map gate + DoR | По спринту |
| **Статус** | `docs/pm-status.md` — план vs факт, риски, gate | **Еженедельно** + на gate |
| **Раздача** | `docs/team-assignments.md` — WBS, владельцы, команды агентам | При смене спринта / gate |
| **Gate prep** | Чеклисты G0→1 … G4→5; evidence placeholders; memo черновики | До Human sign-off |
| **Product Map** | Привязка задач к фазам 1–4 + People; без логина в productmap.io | Каждая PM-сессия |
| **Эскалации** | Только по шаблону «Decision» (см. ниже) | По необходимости |

PM **не** пишет прикладной код, **не** ставит `DONE` на реализованные фичи без QA/Human, **не** хранит credentials productmap.io.

---

## Human — только по важным решениям

| # | Тема | Когда обязателен Human | Пример артефакта |
|---|------|------------------------|------------------|
| 1 | **M0 Go / Pause / Pivot** | Финальная подпись и решение по Phase 0 | [`m0-go-no-go-memo.md`](./m0-go-no-go-memo.md) |
| 2 | **Scope Phase 5+** | Auth, multi-tenant, billing, PostgreSQL persistence, интеграции | ADR + brief Out |
| 3 | **Budget / prod** | Платные SaaS, prod URL, лимиты LLM spend, Vercel/prod secrets policy | Architect + Human |
| 4 | **Внешние блокеры** | Ключи провайдеров в prod, legal, PMI positioning, third-party ToS | `.env` policy, memo |
| 5 | **Waiver G2→3** | Осознанное закрытие gate без ≥3 useful dogfood или без live BFF regression | Строка в «Журнал» queue |

Всё остальное PM закрывает с агентами или фиксирует как **OPTIONAL Human** (см. ниже).

---

## НЕ эскалировать Human

Следующие работы выполняются без согласования с Human (достаточно journal + pm-status):

- Выравнивание порогов health (40/70), sync playbook ↔ код (T-012 класс задач)
- QA compile/browser smoke, обновление `qa-report`, чеклистов
- Черновики ADR (analytics, deploy) — Architect review внутри Muster
- **Static** prompt regression (navigator-scenarios без live API)
- Competitive scan **черновик** и M0 memo **черновик** (sign-off — Human)
- Подготовка staging: runbook, preview URL, subset QA smoke (T-018)
- UX reference из **публичного** productmap.io (маркетинг, скриншоты, описание — **без логина**)
- Growth landing **one-pager** черновик (T-019)
- Design tokens refresh по UX reference (T-021 после T-020)
- Weekly pm-status и раздача `team-assignments`

---

## OPTIONAL Human (gate, не блокирует агентов)

| Действие | Назначение | Блокирует |
|----------|------------|-----------|
| Dogfood сессии #1–5 | Evidence для G2→3, North Star | **Закрытие G2→3** (не старт T-018/T-019/T-020) |
| `DEEPSEEK_API_KEY` в `.env.local` | Live BFF + dogfood на localhost/staging | Live prompt regression (waive = static only) |
| M0 sign-off в footer memo | Go/Pause/Pivot | Старт Phase 4 **implementation** landing route (не черновик copy) |

PM явно помечает в WBS: **OPTIONAL (gate)**.

---

## Шаблон эскалации к Human

Использовать в «Журнал» queue или в чате Architect только для пунктов «MUST decide»:

```markdown
**Decision:** [одно предложение — что решить]

**Options:**
| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| A | … | … |
| B | … | … |

**PM recommendation:** [вариант + краткое обоснование по brief/ТЗ/рискам]

**Need Human by:** YYYY-MM-DD
```

---

## Согласование с планом и ТЗ

| Источник | PM обязан |
|----------|-----------|
| [`technical-specification.md`](./technical-specification.md) | AC в «Детали задач» трассируются на §3–§7 |
| [`implementation-plan.md`](./implementation-plan.md) | Gates G0→1 … G4→5, WBS недель, M0/M3 вехи |
| [`knowledge-base/product-brief.md`](../knowledge-base/product-brief.md) | MVP In/Out, anti-persona, метрики |
| Product Map 3.10 (cheatsheet / workflow в monorepo `knowledge-base/`) | Фаза в Notes каждой `T-0xx` |

Отклонение от ТЗ без Human → `BLOCKED` с вопросом Architect, не silent scope creep.

---

## Роли и handoff

| Роль | Берёт из очереди | PM ожидает |
|------|------------------|------------|
| UI/UX | `READY` + design/UX tasks | `docs/ux-reference-*.md`, tokens spec |
| Developer | `READY` после deps | PR summary в «Итог» |
| QA | `READY` smoke/regression | PASS/FAIL в qa-report |
| IT-Architect | ADR, BLOCKED unblock | ADR merged, queue note |
| Growth | copy, positioning | one-pager, PM review |
| Senior PM | playbook, prompt quality | sign-off в docs |
| Human | MUST decide + OPTIONAL dogfood | Письменный ответ / sign-off в memo |

---

## История

| Дата | Событие |
|------|---------|
| 2026-05-30 | v1.0 — PM-led режим по делегированию Human Architect Pavel |

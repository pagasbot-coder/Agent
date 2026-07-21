# Поток Agent Ops (Muster / skills / роли)

> **Владелец потока:** Cloud Agent на ветке оркестрации (`cursor/assistants-placement-aaf3` и наследники).  
> **Не владеет:** реализацией Quiet Partner «Фокус на сегодня» и деплоем приложения — см. [`../quiet-partner/docs/handoff-focus-today-agent.md`](../quiet-partner/docs/handoff-focus-today-agent.md).

---

## TL;DR

- Этот поток = **агенты, роли, skills, `.productmap` в git, скрипты импорта, правила Copywriter**.
- Продуктовый код QP и Vercel — **другой агент**.
- Источник ProductMap-контента `didactic-doodle` — **read-only**; обновления забираем `import-didactic-skills.sh --apply`.

---

## Активные задачи потока (Agent Ops)

| ID | Задача | Роль | Статус | Приоритет | Итог |
|----|--------|------|--------|-----------|------|
| A-001 | Политика размещения ассистентов + migrate script | Architect / Ops | DONE | P0 | `assistants-placement.md`, `migrate-local-cursor-assistants.sh` |
| A-002 | Мост skills ↔ Muster + import script | Architect / Ops | DONE | P0 | `skills-muster-bridge.md`, `import-didactic-skills.sh` |
| A-003 | Импорт skills + `.productmap` из didactic-doodle | Human + Ops | DONE | P0 | commit `383b4bc` |
| A-004 | Copywriter: отчёты Human на русском, грамотные предложения | Copywriter / Ops | DONE | P0 | `role-copywriter.mdc`, `muster-copywriter.md` |
| A-005 | Handoff продуктового эпика агенту деплоя | PM / Ops | DONE | P0 | `quiet-partner/docs/handoff-focus-today-agent.md` |
| A-006 | Прописать Copywriter во все матрицы ролей QP + root | Ops | DONE | P1 | QP queue + INDEX; root уже имел Copywriter |
| A-007 | Сверить muster-* агентов со skills (UI/QA + bridge notes) | Ops | DONE | P1 | `muster-ui-ux`, `muster-qa` обновлены |
| A-008 | Чеклист «новый skill из doodle → Agent» (runbook 1 page) | Ops | DONE | P2 | `docs/runbook-import-skills.md` |
| A-009 | Не писать в didactic-doodle: guard в docs + script header | Ops | DONE | P0 | read-only note in import script |
| A-010 | Держать поток Agent Ops отдельно от QP деплоя | Ops | READY | P1 | Этот файл + handoff; продолжать по запросу Human |

---

## Правила работы

1. Менять `.cursor/agents/`, `.cursor/rules/`, `.agents/skills/`, `knowledge-base/*placement*`, `scripts/*skill*`.
2. **Не** брать T-090…T-100 Quiet Partner в код/деплой.
3. Перед импортом skills — dry-run; source только `SOURCE=…/didactic-doodle`.
4. Отчёты Human — русский, ясные предложения (`@role-copywriter`).

---

## Связанные файлы

| Файл | Зачем |
|------|--------|
| [`assistants-placement.md`](./assistants-placement.md) | куда класть ассистентов |
| [`skills-muster-bridge.md`](./skills-muster-bridge.md) | skill → роль |
| [`../scripts/import-didactic-skills.sh`](../scripts/import-didactic-skills.sh) | импорт |
| [`../docs/setup-other-device.md`](../docs/setup-other-device.md) | multi-device |
| [`../quiet-partner/docs/handoff-focus-today-agent.md`](../quiet-partner/docs/handoff-focus-today-agent.md) | продукт → другой агент |

# Runbook: каталог skills.sh

> **Каталог:** [skills.sh](https://www.skills.sh/) · **CLI:** `npx skills` ([vercel-labs/skills](https://github.com/vercel-labs/skills))  
> **Формат:** [agentskills.io](https://agentskills.io/home) (спека `SKILL.md`, не магазин)  
> **ProductMap skills** по-прежнему из `didactic-doodle` — см. [`runbook-import-skills.md`](./runbook-import-skills.md)

---

## Что уже в Agent

| Skill | Откуда | Зачем |
|-------|--------|--------|
| `find-skills` | `vercel-labs/skills` | Поиск и установка skills из каталога |
| `writing-guidelines` | `vercel-labs/agent-skills` | Ревью прозы по Writing Guidelines |

Lock: корневой `skills-lock.json`.  
**Канон тел:** только `.agents/skills/` (не копировать в `.cursor/skills/` — там README-указатель).

---

## Поиск

```bash
cd /Users/marina/Projects/Agent
npx skills find tdd
npx skills find react --owner vercel-labs
```

Или в чате: «найди skill для …» → агент читает `find-skills`.

Браузер: https://www.skills.sh/

---

## Установка в проект

```bash
cd /Users/marina/Projects/Agent

# один skill из репо
npx skills add vercel-labs/agent-skills --skill writing-guidelines -a cursor -y --copy

# пример: TDD
npx skills add obra/superpowers --skill tdd -a cursor -y --copy

# список без установки
npx skills add vercel-labs/agent-skills -l
```

Флаги: `-a cursor` (агент), `-y` (без вопросов), `--copy` (файлы в репо, не symlink).

Глобально (все проекты на Mac): добавь `-g`.

---

## Обновление / список / удаление

```bash
npx skills list
npx skills update -p -y
npx skills remove writing-guidelines -a cursor -y
```

Восстановить из lock (experimental):

```bash
npx skills experimental_install
```

---

## Политика Agent

1. Универсальные coding skills (TDD, React, design) → `npx skills add` сюда или `-g`.
2. ProductMap PM skills → только `import-didactic-skills.sh` из `didactic-doodle`.
3. Не коммитить `skills-lock.json` с путями `/tmp/...` — только `github` sources.
4. После нового skill — строка в [`skills-muster-bridge.md`](../knowledge-base/skills-muster-bridge.md), если нужна роль Muster.

---

## Быстрая проверка

В Agent-чате: «найди skill для code review» — должен активироваться `find-skills` и предложить команду `npx skills add …`.

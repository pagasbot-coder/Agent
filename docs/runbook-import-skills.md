# Runbook: новый skill из didactic-doodle → Agent

> **Source read-only.** Никогда не коммитить обратно в `didactic-doodle`.  
> Полная политика: [`assistants-placement.md`](../knowledge-base/assistants-placement.md) · мост: [`skills-muster-bridge.md`](../knowledge-base/skills-muster-bridge.md)

---

## Когда запускать

Ребята добавили skill или обновили `.productmap` в **didactic-doodle**, и это нужно команде Muster / Cloud Agent.

---

## Шаги (Mac Terminal, не Cloud `workspace $`)

```bash
cd /Users/marina/Projects/Agent
git checkout main   # или рабочая ветка Agent Ops
git pull

SOURCE=/Users/marina/Projects/didactic-doodle ./scripts/import-didactic-skills.sh
SOURCE=/Users/marina/Projects/didactic-doodle ./scripts/import-didactic-skills.sh --apply

git add .agents/skills .productmap .cursor/rules/productmap-gemini-agent.mdc
git status   # только импорт — без quiet-partner локального шума
git commit -m "chore: refresh ProductMap skills/KB from didactic-doodle"
git push
```

---

## После импорта

1. Если появился **новый** skill — добавить строку в `skills-muster-bridge.md` (кто вызывает: PM / Growth / …).
2. При необходимости — секция в `muster-*.md` (как у PM/Growth).
3. Обновить `knowledge-base/agent-ops-stream.md` журнал.
4. Human: короткий отчёт **по-русски** — что приехало, какие роли затронуты.

---

## Не делать

- `git add -A` при грязном `quiet-partner/`
- Править файлы внутри `didactic-doodle` «заодно»
- Брать продуктовые T-090… в этом же коммите

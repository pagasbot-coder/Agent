# Размещение ассистентов Cursor (git vs локально)

> **Решение (2026-07-21):** личное → User Rules; продукт-менеджмент → `product-copilot`; Muster / код → `Agent`.  
> **Скрипт миграции с ПК:** [`../scripts/migrate-local-cursor-assistants.sh`](../scripts/migrate-local-cursor-assistants.sh)

---

## TL;DR

| Что | Куда | В git? |
|-----|------|--------|
| Тон, язык, личные привычки | Cursor **User Rules** | Нет (аккаунт) |
| Источник ProductMap skills + `.productmap` | проект **`didactic-doodle`** (или `product-copilot`) | Да (там) |
| Skills + `.productmap` **в команде Muster** | импорт в **`Agent`** (`import-didactic-skills.sh`) | Да |
| Bridge `/prd-writer`, competitor-* | **`Agent`** `.agents/skills/` + [`skills-muster-bridge.md`](./skills-muster-bridge.md) | Да |
| Muster-роли, orchestration, vibecoder | **`pagasbot-coder/Agent`** | Да |
| Универсальные skills.sh (TDD, frontend…) | `npx skills add … -g` **или** репо, где реально нужны | По желанию |

**Не дублировать** один и тот же скилл в `Agent` и `product-copilot`.

---

## Три слоя

```text
Layer A — User Rules (аккаунт Cursor)
  → тон, «на ты», язык, стек по умолчанию

Layer B — product-copilot (отдельный private repo)
  → продуктовая команда, скиллы PM, книги, KB

Layer C — Agent (этот monorepo)
  → .cursor/rules, .cursor/agents (Muster), Quiet Partner, Banya
```

Cloud Agent видит **только то, что в выбранном GitHub-репо** (+ User Rules аккаунта).  
Папка `~/.cursor/skills` на Mac **не** попадает в Cloud Agent сама по себе.

---

## Куда класть файлы

### `Agent` (этот репозиторий)

| Путь | Назначение |
|------|------------|
| `.cursor/rules/*.mdc` | Роли и orchestration |
| `.cursor/agents/muster-*.md` | Subagents |
| `.cursor/skills/` | Только скиллы про **код / Muster / Quiet Partner** — не PM-книги |

### `product-copilot`

| Путь | Назначение |
|------|------------|
| `.cursor/skills/`, knowledge-base, PDF | Всё про продукт-менеджмент |

### User Rules (не в git)

Копировать в Settings → Rules → User Rules (см. `docs/setup-other-device.md`).

---

## Миграция с локального ПК

1. На Mac/ПК: `git pull` в `Agent` и в `product-copilot`.
2. Запустить:

```bash
# из корня Agent (после clone/pull)
./scripts/migrate-local-cursor-assistants.sh
```

3. Скрипт:
   - сканирует `~/.cursor/skills` и `~/.agents/skills`;
   - раскладывает по эвристике (product → copilot, muster/dev → Agent);
   - печатает `git status` и что оставить в User Rules;
   - **не** коммитит секреты и `.env`.

4. Проверить diff → `git commit` / `git push` в каждом репо.

---

## Эвристика имён (скрипт)

| Имя папки скилла содержит | Цель |
|---------------------------|------|
| `product`, `pm`, `prd`, `roadmap`, `discovery`, `stakeholder`, `interview` | `product-copilot` |
| `muster`, `deploy`, `next`, `react`, `tailwind`, `qa`, `devops`, `tdd`, `debug` | `Agent` |
| неоднозначно | спросить / dry-run список |

При сомнении — **в `product-copilot`**, если скилл про процесс продукта; иначе — `Agent`.

---

## Связанные документы

- [`docs/setup-other-device.md`](../docs/setup-other-device.md) — multi-device
- [`context-engineering-productmap.md`](./context-engineering-productmap.md) — repo-first
- [skills.sh](https://www.skills.sh/) — каталог open skills
- [Cursor Skills docs](https://cursor.com/docs/skills)

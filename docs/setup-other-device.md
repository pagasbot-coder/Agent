# Cursor + Muster на другом устройстве

> Всё, что нужно агентам, живёт **в git** — не в памяти чата.

## 0. Три слоя ассистентов (куда что класть)

| Слой | Где | Примеры |
|------|-----|---------|
| **User Rules** | Cursor Settings → Rules | тон, «на ты», язык, личные привычки |
| **product-copilot** | отдельный repo `pagasbot-coder/product-copilot` | PM-скиллы, PDF-книги, продуктовая KB |
| **Agent (этот repo)** | `.cursor/rules`, `.cursor/agents`, `.cursor/skills` | Muster-роли, Quiet Partner, код |

Полная политика + миграция с Mac: [`knowledge-base/assistants-placement.md`](../knowledge-base/assistants-placement.md).

```bash
# На ПК: перенести локальные ~/.cursor/skills в правильный git-репо
./scripts/migrate-local-cursor-assistants.sh        # сначала dry-run
./scripts/migrate-local-cursor-assistants.sh --apply
```

Cloud Agent видит только выбранный GitHub-репозиторий (+ User Rules аккаунта).  
Локальная папка `~/.cursor/skills` на телефон **сама не попадает**.

## 1. Клонировать репозиторий

```bash
git clone https://github.com/pagasbot-coder/Agent.git
cd Agent
```

Проект **Тихий напарник**: подпапка `quiet-partner/`.

## 2. Открыть в Cursor

- **Monorepo (вся команда Muster):** `File → Open Folder` → корень `Agent/`
- **Только Quiet Partner:** `File → Open Folder` → `Agent/quiet-partner/`

## 3. Что подтянется из git автоматически

| Путь | Назначение |
|------|------------|
| `.cursor/rules/*.mdc` | Правила ролей (PM, Developer, QA, …) |
| `.cursor/agents/muster-*.md` | Subagents Muster |
| `.cursor/skills/` | Скиллы кода/Muster (не PM-книги — те в `product-copilot`) |
| `.cursorrules` | Указатель на Muster (legacy) |
| `orchestration-queue.md` | Очередь задач monorepo |
| `knowledge-base/` | Общая память + INDEX |
| `quiet-partner/.cursor/rules/` | Правила проекта Quiet Partner |
| `quiet-partner/orchestration-queue.md` | Очередь Quiet Partner |
| `quiet-partner/knowledge-base/` | ТЗ, playbook, ADR |
| `quiet-partner/docs/pm-governance.md` | Что делает PM vs Human |

После `git pull` на втором ПК агенты видят те же правила.

## 4. Что git **не** переносит (сделать вручную)

| Что | Где настроить |
|-----|----------------|
| **User Rules** (глобальные) | Cursor Settings → Rules → User Rules |
| **API-ключи** | `quiet-partner/.env.local`, Vercel Env |
| **История чатов** | Локально в Cursor; контекст — в файлах выше |

Рекомендуемый User Rules блок (копировать в Settings):

```markdown
Обращаться на «ты», мужской род. Язык — русский, если не попросили иное.
Стек: Next.js + TypeScript + Tailwind + shadcn/ui.
Проект Muster: перед задачей читать orchestration-queue.md.
Роли: Role: PM | Developer | UI/UX | QA | Architect + @role-*.
Продуктовые скиллы/книги — репозиторий product-copilot; код/Muster — Agent.
Не дублировать длинные spec в чат — @knowledge-base/... и @docs/...
```

## 5. Запуск агента (Agents Window или Chat)

**Monorepo:**

```text
Role: Developer. @role-developer @orchestration-queue.md
```

**Quiet Partner:**

```text
Role: Developer. @role-developer @quiet-partner/orchestration-queue.md
```

Отдельный чат на роль: Agents Window → New Agent.

## 6. Синхронизация между устройствами

```bash
# На старом ПК (перед сменой машины)
git add -A
git status          # проверьте: нет .env, secrets
git commit -m "ваше сообщение"
git push

# На новом ПК
git pull
cd quiet-partner && npm install   # если нужен локальный dev
```

## 7. Задачи на Human (Quiet Partner)

См. `quiet-partner/docs/pm-status.md` и `docs/m0-go-no-go-memo.md`:

- Dogfood 0/5 → `docs/dogfood-log-template.md`
- M0 Go/Pause/Pivot — ваша подпись
- `DEEPSEEK_API_KEY` в Vercel — по желанию

---

**Remote:** `https://github.com/pagasbot-coder/Agent.git` · ветка `main`

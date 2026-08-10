# Пульт этапов — хранение проектов (MTS-012)

**Зачем:** не вбивать реестры заново после перезагрузки браузера / смены машины.

## Как работает сейчас

| Среда | Backend | Где лежат данные |
|-------|---------|------------------|
| Локально (по умолчанию) | `file` | `.data/stages-projects.json` |
| Vercel / общая БД | `postgres` | таблица `stages_projects` (Neon) |

При открытии `/stages`:
1. Сервер поднимает сид **Проект МТС** (`mts-exolve`), если его ещё нет.
2. Пульт загружает последний проект и **сам сохраняет правки** (пауза ~0,8 с).
3. Кнопка **«Сбросить шаблон МТС»** — только если нужно вернуть канон из кода.

Браузерный `localStorage` остаётся кэшем; источник правды — сервер.

## Env

```bash
STAGES_BACKEND=file          # default
# STAGES_BACKEND=postgres    # нужен DATABASE_URL + npm run db:push
# STAGES_FILE_PATH=.data/stages-projects.json
```

## API

| Метод | Путь | Назначение |
|-------|------|------------|
| GET | `/api/stages/projects` | Список + сид МТС |
| GET | `/api/stages/projects/[id]` | Снимок |
| PUT | `/api/stages/projects/[id]` | Сохранить |
| POST | `/api/stages/projects/mts/reset` | Сброс к шаблону |

## Postgres

После изменения схемы: `npm run db:push` с `DATABASE_URL`.  
Таблица: `stages_projects` (`id`, `name`, `stage_id`, `cache_json`, `updated_at`).

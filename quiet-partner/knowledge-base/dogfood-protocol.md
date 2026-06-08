# Dogfood protocol — Quiet Partner

**Владелец:** PM (T-014)  
**Лог:** [`docs/dogfood-log-template.md`](../docs/dogfood-log-template.md)  
**Гайды #1–#3:** [`docs/dogfood-session-guides.md`](../docs/dogfood-session-guides.md)  
**Длительность:** 30–45 мин на сессию

> Сессии исполняет Human (Pavel). **OPTIONAL** для спринта; **≥3 useful** нужны для gate G2→3.

---

## Цель

Проверить, помогает ли HealthCommentary сфокусировать внимание PM на 1–2 доменах без «compliance theater».

---

## Подготовка

1. Staging https://quiet-partner.vercel.app или `npm run dev` локально.
2. `DEEPSEEK_API_KEY` в Vercel / `.env.local` (live LLM) — опционально; fallback RU тоже валиден.
3. Реальный проект Human (R8: не выдуманный кейс).

---

## 5 шагов сессии

| # | Шаг | Действие | Критерий успеха |
|---|------|----------|-----------------|
| 1 | Onboarding | Пройти `/onboarding` или «Настроить проект» | Радар заполнен; баннер исчез |
| 2 | Radar | Изменить 1–2 домена в красную зону | Один pulse + callout «критичнее всего» |
| 3 | Commentary | «Обновить комментарий» | Loading → текст + ≥1 вопрос; disclaimer виден |
| 4 | Feedback | «Полезно» / «Не полезно» | Голос сохранён (localStorage) |
| 5 | Решение | Записать **одно** действие на сегодня | Строка в log «Действие принято» |

---

## После сессии

1. Заполнить строку в [`dogfood-log-template.md`](../docs/dogfood-log-template.md).
2. При «Полезно» = Y — увеличить счётчик в сводке log.
3. PM: одна строка в journal `orchestration-queue.md` (дата, #сессии, Y/N).

---

## Ссылки

- Эталоны AI: [`navigator-scenarios.md`](./navigator-scenarios.md) · панель на dashboard (T-038)
- M0 evidence: [`docs/m0-go-no-go-memo.md`](../docs/m0-go-no-go-memo.md)

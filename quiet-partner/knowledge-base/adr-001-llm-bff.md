# ADR-001: LLM через BFF (Backend-for-Frontend)

**Статус:** Принято  
**Дата:** 2026-05-30  
**Контекст:** Quiet Partner — HealthCommentary (фаза 2 spike)

---

## Решение

Все вызовы LLM выполняются **только на сервере** через Next.js Route Handler `POST /api/advisor/health-commentary`. Клиент не получает API-ключей.

| Параметр | Значение |
|----------|----------|
| **Primary provider** | DeepSeek Chat API (`deepseek-chat`) |
| **Fallback** | Заглушка на русском при отсутствии ключа или ошибке провайдера; Gemini — опционально в Phase 4 (env `GEMINI_API_KEY`) |
| **Endpoint** | `https://api.deepseek.com/chat/completions` (OpenAI-compatible) |
| **Max tokens ответа** | 512 (`ADVISOR_MAX_TOKENS`, default) |
| **Rate limit (MVP)** | 20 req / 15 min / IP (in-memory; заменить на Redis в Phase 5) |

---

## Переменные окружения

```env
DEEPSEEK_API_KEY=          # обязателен для live AI
ADVISOR_MAX_TOKENS=512
# GEMINI_API_KEY=          # Phase 4 optional fallback
```

**Запрещено:** `NEXT_PUBLIC_DEEPSEEK_*`, `NEXT_PUBLIC_GEMINI_*`, любые LLM-ключи в client bundle.

---

## Контракт BFF

- **Вход:** `domainScores` (D1–D8, 0–100), `deliveryApproach`, `locale`, опционально `projectMeta`
- **Выход:** `{ commentary, questions?, disclaimer, source: "llm" | "fallback" }`
- **Промпт:** `getSystemPrompt()` + контекст худших доменов; user message — анализ одного проблемного домена

---

## Безопасность

1. Ключи только в `process.env` на сервере  
2. Логи: request id, token count, provider — **без** текста проекта и PII  
3. CI (Phase 4): grep на `NEXT_PUBLIC_.*API.*KEY`  
4. Ответы 502/429 без тела с секретами  

---

## Отклонённые альтернативы

| Альтернатива | Причина отклонения |
|--------------|---------------------|
| LLM с клиента (Vercel AI SDK в browser) | Утечка ключа |
| Только rule-based без LLM | Нет «напарника»; оставлен fallback |
| Единый proxy на весь monorepo | Изоляция продукта; отдельный deploy `quiet-partner` |

---

## Последствия

- Developer: route handler + `lib/advisor.ts`  
- QA: smoke без ключа → fallback, не 500  
- Senior PM: владелец `lib/systemPrompt.ts`  

# Prompt regression — T-016 (Navigator scenarios)

**Дата:** 2026-05-30  
**Роли:** Senior PM (static sign-off) + QA (disclaimer cross-check)  
**Источники:** [`knowledge-base/navigator-scenarios.md`](../knowledge-base/navigator-scenarios.md) · [`lib/systemPrompt.ts`](../lib/systemPrompt.ts) · BFF [`lib/advisor/llm.ts`](../lib/advisor/llm.ts)

**Метод:** статический разбор правил `getSystemPrompt()` + user-template в `buildUserMessage()` (без вызова LLM).  
**Live BFF:** `.env.local` **не найден** → `DEEPSEEK_API_KEY` не проверялся; **live test = Human** с ключом (см. §Live test).

**Вердикт Senior PM (static):** **PASS** после правок правил 6–8 в `systemPrompt.ts` (2026-05-30).  
**Вердикт QA (disclaimer):** **PASS** — UI + API всегда отдают `DEFAULT_DISCLAIMER` (не из текста LLM).

---

## S1 — Конфликт стейкхолдеров

**Ввод (эталон):** «Два спонсора тянут архитектуру в разные стороны, сроки горят.»

| # | Ожидаемое поведение | Static (prompt) | Pass/Fail | Примечание |
|---|---------------------|-----------------|-----------|------------|
| S1.1 | Уточнить истинные цели каждого (отчёт vs пиар), не только «кнопки» | Правила 1, 6 | **PASS** | Questions-first + trade-offs / цели |
| S1.2 | Разрез по времени (v1/v2), не «выберите сторону» | Правило 6 | **PASS** | Явный запрет «выберите сторону» |
| S1.3 | Без «домен Stakeholders» в ответе | Правила 2, 8 | **PASS** | Без жаргона PMBOK / имён доменов |
| S1-Live | Ответ LLM на ввод S1 | — | **N/A** | Human + `DEEPSEEK_API_KEY` |

---

## S2 — Фича в середине спринта

**Ввод:** «Заказчик хочет новую фичу в середине спринта.»

| # | Ожидаемое поведение | Static (prompt) | Pass/Fail | Примечание |
|---|---------------------|-----------------|-----------|------------|
| S2.1 | Спросить: блокирует ли демо / gold plating? | Правила 1, 6 | **PASS** | Уточняющие вопросы до совета |
| S2.2 | Обмен на задачу из бэклога vs бюджет/срок | Правила 3, 6 | **PASS** | Trade-offs, не галочки |
| S2.3 | Не только «change request на $10k» | Правило 6 | **PASS** | Запрет бюрократии как единственного пути |
| S2-Live | Ответ LLM на ввод S2 | — | **N/A** | Human + key |

---

## S3 — Команда «опаздывает»

**Ввод:** «Команда опаздывает.»

| # | Ожидаемое поведение | Static (prompt) | Pass/Fail | Примечание |
|---|---------------------|-----------------|-----------|------------|
| S3.1 | «Есть метрики cycle time или это ощущение?» | Правила 1, 4 | **PASS** | Thin context → 1–3 вопроса; неопределённость |
| S3.2 | Отделить производительность vs scope creep | Правила 3, 6 | **PASS** | Сигналы здоровья, не compliance |
| S3-Live | Ответ LLM на ввод S3 | — | **N/A** | Human + key |

---

## S4 — Всё зелёное, но тревога

**Ввод:** «Все домены выше 70, но я не спокоен.»

| # | Ожидаемое поведение | Static (prompt) | Pass/Fail | Примечание |
|---|---------------------|-----------------|-----------|------------|
| S4.1 | Не обесценивать | Правило 7 | **PASS** | Добавлено в T-016 (был gap) |
| S4.2 | Спросить, какой домен «чувствуется» слабым | Правило 7 | **PASS** | |
| S4.3 | Один конкретный check-in на неделю | Правило 7 | **PASS** | |
| S4-Live | Ответ LLM на ввод S4 | — | **N/A** | Human + key |

---

## Глобальный чеклист (navigator-scenarios.md)

| # | Критерий | Static | Pass/Fail | Примечание |
|---|----------|--------|-----------|------------|
| G1 | Нет «официально PMBOK/PMI» | Правило 5 | **PASS** | |
| G2 | ≥1 вопрос при thin context | Правила 1 + `buildUserMessage` JSON `questions` | **PASS** | User template требует 1–3 вопроса |
| G3 | Фокус 1–2 домена, не все 8 | Правила 8, default domains | **PASS** | Default сменён с «все 8 доменов» |
| G4 | Русский без канцелярита | Правило 2 | **PASS** | Plain language |
| G5 | Disclaimer «не сертификация PMBOK» | `DEFAULT_DISCLAIMER` в UI/BFF | **PASS** | Не в system prompt — by design |

---

## Сводная таблица (T-016 AC)

| Scenario ID | Static regression | Live BFF (T-076 staging) | Notes |
|-------------|-------------------|--------------------------|-------|
| S1 | **PASS** | **BLOCKED** (fallback) | provider error 2026-06-13 |
| S2 | **PASS** | **BLOCKED** (fallback) | |
| S3 | **PASS** | **BLOCKED** (fallback) | |
| S4 | **PASS** (after rule 7) | **BLOCKED** (fallback) | |

**Senior PM sign-off (static):** prompt regression **PASS** для правил; live — открыто.  
**QA cross-check:** disclaimer на каждом ответе API/UI — **PASS** (`lib/domains.ts` → `HealthCommentary`).

---

## Live test — T-076 (staging, 2026-06-13)

**Роли:** Senior PM + QA · **Задача:** T-076 · **URL:** https://quiet-partner.vercel.app/api/advisor/health-commentary

| Проверка | Результат |
|----------|-----------|
| `GET /api/health` → `deepseek_api_key_configured` | **true** (ключ задан в Vercel) |
| POST S1–S4 с `userSituation` + `navigatorScenarioId` | HTTP **200** + JSON |
| Live DeepSeek response | **BLOCKED** — все 4 сценария вернули fallback suffix `(сервис LLM временно недоступен)` |
| Root cause (2026-06-13) | **DeepSeek account balance $0** — ключ валиден (`health` → `true`); rotate key **не** первый шаг |
| Disclaimer в каждом ответе | **PASS** — `DEFAULT_DISCLAIMER` присутствует |
| `questions[]` в ответе | **PASS** — 2–3 вопроса (fallback template) |

**Вердикт T-076 (live):** **BLOCKED** — provider error (ключ сконфигурирован, но DeepSeek API не ответил OK). Static T-016 **PASS** не отменяется. QA: disclaimer + HTTP contract **PASS**; сценарная регрессия LLM — **не пройдена**.

### Прогон S1–S4 (staging curl)

| Scenario | userSituation (эталон) | HTTP | Live LLM | Fallback suffix | Senior PM notes |
|----------|------------------------|------|----------|-----------------|-----------------|
| **S1** | Два спонсора тянут архитектуру… | 200 | **FAIL** | да | Fallback не проверяет trade-offs / v1-v2; generic questions |
| **S2** | Заказчик хочет новую фичу… | 200 | **FAIL** | да | Нет вопроса про demo / gold plating |
| **S3** | Команда опаздывает. | 200 | **FAIL** | да | Нет cycle time vs ощущение |
| **S4** | Все домены выше 70, но не спокоен. | 200 | **FAIL** | да | Не обесценивает частично (fallback ok), но нет weekly check-in |

**Пример тела запроса (S1):**

```bash
curl -s -X POST https://quiet-partner.vercel.app/api/advisor/health-commentary \
  -H "Content-Type: application/json" \
  -d '{
    "domainScores":{"D1":35,"D2":55,"D3":60,"D4":45,"D5":65,"D6":50,"D7":60,"D8":38},
    "deliveryApproach":"hybrid",
    "locale":"ru",
    "projectMeta":{"name":"Regression S1","phase":"исполнение"},
    "userSituation":"Два спонсора тянут архитектуру в разные стороны, сроки горят.",
    "navigatorScenarioId":"S1"
  }'
```

**Human unblock (T-086):** пополнить баланс DeepSeek (platform.deepseek.com) — **root cause: $0 balance**, не invalid key. Ключ в Vercel OK; redeploy не нужен. После top-up повторить curl S1–S4; ожидание: **без** fallback suffix. Rotate key — только если top-up не помог.

### PM re-verify (2026-06-13, ~19:42 UTC)

| Check | Result |
|-------|--------|
| `GET /api/health` → `deepseek_api_key_configured` | **true** |
| `GET /` HTML contains «Фокус недели» | **yes** (book features live) |
| POST S1 (full body + `navigatorScenarioId`) | HTTP **200**; commentary contains `(сервис LLM временно недоступен)` |
| Disclaimer | **PASS** |
| Latency | ~1.1s (fallback path) |

**Вердикт unchanged:** live LLM **BLOCKED** → **T-086** (Human: DeepSeek top-up, balance $0).

### Root cause confirmed (2026-06-13, PM)

| Finding | Detail |
|---------|--------|
| `DEEPSEEK_API_KEY` in Vercel | **Valid** — `GET /api/health` → `deepseek_api_key_configured: true` |
| DeepSeek API response | **402 / insufficient balance** — account balance **$0** |
| Key rotation required? | **No** (first step) — top-up billing account |
| App behavior | Fallback + disclaimer **PASS** — product usable without live LLM |
| Code note | `lib/advisor/llm.ts` — HTTP 402 → friendlier suffix «баланс исчерпан» (deploy optional) |

---

## Live test (Human) — локальный прогон

**Статус (2026-05-30):** не выполнялся в первой сессии T-016.

| Проверка | Результат |
|----------|-----------|
| `quiet-partner/.env.local` | **отсутствует** |
| `DEEPSEEK_API_KEY` (local) | **не задан** |

**Рекомендуемый прогон Human:**

1. Скопировать `.env.example` → `.env.local`, задать `DEEPSEEK_API_KEY`.
2. `npm run dev` → dashboard или прямой POST:

```bash
curl -s -X POST http://localhost:3000/api/advisor/health-commentary \
  -H "Content-Type: application/json" \
  -d "{\"domainScores\":{\"D1\":45,\"D2\":20,\"D3\":70,\"D4\":70,\"D5\":70,\"D6\":70,\"D7\":70,\"D8\":38},\"deliveryApproach\":\"hybrid\",\"locale\":\"ru\",\"projectMeta\":{\"name\":\"Regression S1\",\"phase\":\"исполнение\"}}"
```

3. Для S1–S4: в будущем Phase 3 chat передать **user message** = эталонный ввод из `navigator-scenarios.md` (сейчас BFF шлёт только scores JSON). До появления чата — оценивать `questions[]` + `commentary` на соответствие таблицам выше.

**Ограничение MVP:** Health commentary BFF не принимает произвольный user text сценария; live-прогон S1–S4 дословно потребует чат-эндпоинта или расширения API (вне scope T-016).

---

## Изменения prompt (T-016)

| Файл | Изменение |
|------|-----------|
| `lib/systemPrompt.ts` | Правила 6–8 (RU/EN); default focus без «все 8 доменов» |

---

## Связанные задачи

- T-010: Senior PM sign-off prompt regression — **static закрыт**; live — tail Human.
- Gate G2→3: не блокируется static PASS; dogfood T-014 остаётся на Human.

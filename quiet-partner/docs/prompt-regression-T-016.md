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

| Scenario ID | Static regression | Live BFF | Notes |
|-------------|-------------------|----------|-------|
| S1 | **PASS** | N/A | generic/harmful — live only |
| S2 | **PASS** | N/A | |
| S3 | **PASS** | N/A | |
| S4 | **PASS** (after rule 7) | N/A | |

**Senior PM sign-off (static):** prompt regression **PASS** для правил; live — открыто.  
**QA cross-check:** disclaimer на каждом ответе API/UI — **PASS** (`lib/domains.ts` → `HealthCommentary`).

---

## Live test (Human)

**Статус:** не выполнялся в этой сессии.

| Проверка | Результат |
|----------|-----------|
| `quiet-partner/.env.local` | **отсутствует** |
| `DEEPSEEK_API_KEY` | **не задан** (значение не читалось) |

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

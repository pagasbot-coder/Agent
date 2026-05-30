# Deploy staging — Quiet Partner (Vercel)

**Версия:** 1.0  
**Дата:** 2026-05-30  
**Владелец:** DevOps + Developer  
**Контекст:** T-018 · ADR-001 (BFF, server-only keys) · [`pm-governance.md`](./pm-governance.md)

---

## TL;DR

| Параметр | Значение |
|----------|----------|
| **Платформа** | Vercel (managed preview/production) |
| **Проект** | `quiet-partner` (team `erp-db-spb-s-projects`) |
| **Production alias** | https://quiet-partner.vercel.app |
| **Последний deploy** | 2026-05-30 — `vercel --prod --yes` (T-025; `/waitlist` live) |
| **Build локально** | `npm run build` — PASS |
| **Live LLM на staging** | Нужен `DEEPSEEK_API_KEY` в Vercel → **Human OPTIONAL** (без ключа — fallback RU) |

`vercel.json` **не обязателен** для Next.js 16: Vercel определяет framework автоматически (`next build`).

---

## 1. Предусловия

- Node.js 20+ (локально совпадает с Vercel)
- Репозиторий: каталог `quiet-partner/` (корень deploy, не monorepo root)
- Аккаунт Vercel с доступом к team (или личный scope)
- **Секреты не в git:** только `.env.example`; `.env.local` / Vercel Env — вне репо

---

## 2. Создание проекта Vercel (Dashboard)

1. [vercel.com/new](https://vercel.com/new) → Import Git **или** Deploy без Git (CLI ниже).
2. **Root Directory:** `quiet-partner` (если импорт из monorepo `curorproject`).
3. **Framework Preset:** Next.js (auto).
4. **Build Command:** `npm run build` (default).
5. **Output:** Next.js default (не static export).
6. **Install Command:** `npm install` (default).

После первого `vercel link` / `vercel --yes` локально создаётся `.vercel/` — **в `.gitignore`**, не коммитить.

---

## 3. Переменные окружения (Vercel → Settings → Environment Variables)

Скопировать контракт из [`.env.example`](../.env.example). Для staging достаточно:

| Переменная | Production | Preview | Development | Примечание |
|------------|:----------:|:-------:|:-----------:|------------|
| `DEEPSEEK_API_KEY` | ✓ | ✓ | — | **Server-only**; live BFF (`source: llm`) |
| `GEMINI_API_KEY` | опц. | опц. | — | Phase 4 fallback (ADR-001) |
| `ADVISOR_LLM_PROVIDER` | опц. | опц. | — | default `deepseek` |
| `ADVISOR_LLM_MODEL` | опц. | опц. | — | default `deepseek-chat` |
| `ADVISOR_MAX_TOKENS` | опц. | опц. | — | default `512` |

**Запрещено:** `NEXT_PUBLIC_DEEPSEEK_*`, `NEXT_PUBLIC_GEMINI_*` (ADR-001).

**PostHog (Phase 4, ADR-002):** `POSTHOG_DISABLED=true` по умолчанию; `NEXT_PUBLIC_POSTHOG_*` — только после consent + self-host; не блокирует staging MVP.

### Как добавить ключ без CLI

1. Vercel → Project **quiet-partner** → **Settings** → **Environment Variables**
2. Name: `DEEPSEEK_API_KEY`, Value: ключ DeepSeek, scope **Production** + **Preview**
3. **Redeploy** последнего deployment (Deployments → ⋮ → Redeploy)

Без ключа: `POST /api/advisor/health-commentary` возвращает **fallback RU** (не 500) — см. smoke H2 в [`qa-checklist.md`](../knowledge-base/qa-checklist.md).

---

## 4. Deploy — команды

### 4.1 Локальная проверка перед deploy

```powershell
Set-Location D:\curorproject\quiet-partner
npm install
npm run build
npm run lint
```

### 4.2 Vercel CLI (рекомендуется для первого link)

**Требуется:** `npm i -g vercel` или `npx vercel`, затем `vercel login` (интерактивно в браузере).

```powershell
Set-Location D:\curorproject\quiet-partner
vercel link          # один раз: выбрать team + project
vercel --yes         # preview deploy (non-interactive, если уже linked)
vercel --prod --yes  # production alias (после проверки preview)
```

**Без интерактива / CI (нет браузера):**

```powershell
$env:VERCEL_TOKEN = "<token-from-vercel.com/account/tokens>"
vercel --yes --token $env:VERCEL_TOKEN
```

Токен: [vercel.com/account/tokens](https://vercel.com/account/tokens) — **не коммитить**, только GitHub Secrets / локальный shell.

**Если CLI недоступен:** Dashboard → Project → **Deployments** → **Deploy** (Git push на connected repo) или drag-and-drop через Import.

### 4.3 Git integration (опционально)

Подключить репозиторий в Vercel → каждый push в default branch = production; PR = preview URL.

---

## 5. Smoke URLs (staging)

Замените `{BASE}` на фактический URL (production alias или preview):

| # | Проверка | URL / действие | Ожидание |
|---|----------|----------------|----------|
| S1 | Home | `{BASE}/` | HTTP 200, dashboard |
| S2 | Onboarding | `{BASE}/onboarding` | HTTP 200, 3 шага RU |
| S3 | Waitlist | `{BASE}/waitlist` | HTTP 200, RU landing stub (T-023) |
| S4 | BFF fallback | `POST {BASE}/api/advisor/health-commentary` | 200, `commentary` + `disclaimer` |
| S5 | BFF live | То же, после `DEEPSEEK_API_KEY` в Vercel | `source: "llm"` (опционально) |
| S6 | Health | `GET {BASE}/api/health` | 200, `{ ok: true }`; boolean checks only |

**Текущий staging (2026-05-30):**

| Среда | URL |
|-------|-----|
| Production alias | https://quiet-partner.vercel.app |
| Waitlist (marketing stub) | https://quiet-partner.vercel.app/waitlist |
| Deployment (пример) | https://quiet-partner-189elmeik-erp-db-spb-s-projects.vercel.app |
| Inspect | https://vercel.com/erp-db-spb-s-projects/quiet-partner |

### Пример smoke (PowerShell)

```powershell
$base = "https://quiet-partner.vercel.app"
Invoke-WebRequest -Uri "$base/" -UseBasicParsing
Invoke-WebRequest -Uri "$base/onboarding" -UseBasicParsing
Invoke-WebRequest -Uri "$base/waitlist" -UseBasicParsing
Invoke-RestMethod -Uri "$base/api/health" -Method GET
$body = '{"domainScores":{"D1":50,"D2":60,"D3":70,"D4":80,"D5":90,"D6":85,"D7":75,"D8":65},"deliveryApproach":"hybrid","locale":"ru"}'
Invoke-RestMethod -Uri "$base/api/advisor/health-commentary" -Method POST -Body $body -ContentType "application/json"
```

**QA:** полный subset — [`knowledge-base/qa-checklist.md`](../knowledge-base/qa-checklist.md) §B1–H5 на `{BASE}` (отдельная задача после URL).

---

## 6. `vercel.json` (Next.js 16)

Файл **не создан** намеренно: deploy 2026-05-30 прошёл без него. Vercel применяет `modifyConfig` для Next 16 автоматически.

Добавлять `vercel.json` только при необходимости:

- custom `headers` / `redirects`
- `regions` (например `["fra1"]` для EU)
- monorepo `rootDirectory` при deploy из корня workspace

Пример минимального (если monorepo root = `curorproject`):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd quiet-partner && npm run build",
  "installCommand": "cd quiet-partner && npm install"
}
```

При deploy из каталога `quiet-partner/` (как сейчас) — **не нужен**.

---

## 7. Безопасность и ограничения

- Секреты только в Vercel Env / `.env.local`; grep в клиентском bundle — см. qa-checklist S2
- Rate limit BFF: in-memory per IP (ADR-001); на serverless — лимит на instance
- **Human MUST (pm-governance):** prod budget, политика LLM spend, финальный prod URL policy
- **Human OPTIONAL:** `DEEPSEEK_API_KEY` на staging для dogfood с live AI

---

## 8. Troubleshooting

| Симптом | Действие |
|---------|----------|
| `vercel login` требует браузер | Использовать `VERCEL_TOKEN` + `vercel --yes --token ...` |
| Build fail на Vercel, локально OK | Проверить Node version в Project Settings; `npm ci` |
| BFF всегда fallback | Добавить `DEEPSEEK_API_KEY` + Redeploy |
| 429 на BFF | Подождать 15 мин или сменить IP (rate limit ADR-001) |
| `.vercel` в git status | Не коммитить; уже в `.gitignore` |

---

## 9. Handoff

| Кому | Действие |
|------|----------|
| **QA** | Subset smoke на https://quiet-partner.vercel.app → обновить `qa-report-phase3.md` §Staging |
| **Human** | Опционально: `DEEPSEEK_API_KEY` в Vercel; dogfood без localhost |
| **PM** | T-018 DONE; staging не блокирует G2→3 |

---

## Журнал deploy

| Дата | Кто | Событие |
|------|-----|---------|
| 2026-05-30 | DevOps | `npm run build` PASS; `vercel --yes` → alias `quiet-partner.vercel.app`; S1–S3 smoke PASS (fallback BFF) |
| 2026-05-30 | DevOps | T-025: `vercel --prod --yes` → `/waitlist` live; GET https://quiet-partner.vercel.app/waitlist **200** |

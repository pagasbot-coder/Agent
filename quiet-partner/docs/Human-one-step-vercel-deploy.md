# Human: redeploy staging (Vercel)

**Когда:** после T-080…T-083 (book track) или любых изменений в `quiet-partner/`  
**Цель:** https://quiet-partner.vercel.app с актуальным кодом  
**Проверка prod 2026-06-13:** `/` **200**, book-фич **нет** (деплой от 2026-05-30) — нужен redeploy с **вашей** машины.

> **Не вставляйте в Terminal блок целиком** — строки с `#` shell выполнит как команды. Копируйте **по одной строке**.

---

## Шаг 0 — Node.js (если `npm: command not found`)

1. https://nodejs.org → **LTS** → установить `.pkg`
2. **Закрыть и открыть** Terminal
3. Проверка:

```bash
node -v && npm -v
```

Или: `brew install node`

---

## Шаги deploy

```bash
cd /Users/marina/Projects/Agent/quiet-partner
```

```bash
npm install
```

```bash
npm run build
```

```bash
npx vercel login
```

(браузер → войти в аккаунт с проектом **quiet-partner**)

```bash
npx vercel --prod --yes
```

Если проект не привязан — отдельно:

```bash
npx vercel link
```

Team: `erp-db-spb-s-projects` · Project: `quiet-partner`

**Токен вместо login:** https://vercel.com/account/tokens → Create →

```bash
export VERCEL_TOKEN="…"
npx vercel --prod --yes --token "$VERCEL_TOKEN"
```

---

## Проверка после deploy

| URL | Ожидание |
|-----|----------|
| https://quiet-partner.vercel.app/ | 200 · **«Фокус недели»** |
| https://quiet-partner.vercel.app/onboarding | 200 · **4 шага**, шаг «Проработка» |

Обновить дату в [`deploy-staging.md`](./deploy-staging.md) TL;DR.

---

## Без Node — только Vercel UI

**Vercel** → **quiet-partner** → **Deployments** → **Redeploy**  
или push в GitHub, если репозиторий подключён (Vercel соберёт сам).

Env vars на дашборде **не трогать** — они уже есть.

---

## Ссылки

- [`deploy-staging.md`](./deploy-staging.md) — полный runbook
- [`pm-status.md`](./pm-status.md) — статус redeploy

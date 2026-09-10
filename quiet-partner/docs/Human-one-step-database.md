# DATABASE_URL — один шаг (Human)

1. Создайте Neon project → скопируйте **pooled** connection string.
2. **Vercel** → Project `quiet-partner` → Settings → Environment Variables → `DATABASE_URL` (Production + Preview).
3. Локально (опционально): та же строка в `quiet-partner/.env.local` → `npm run db:push` → Vercel: `WAITLIST_BACKEND=postgres` → `vercel --prod`.

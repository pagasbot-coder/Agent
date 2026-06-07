# Drizzle migrations — Quiet Partner Phase 5

**OFF by default** until Human sets `DATABASE_URL` in Vercel / local `.env.local`.

## Human activation (Neon lean per ADR-004)

1. Create Neon project (e.g. `quiet-partner-staging`) in EU region.
2. Copy **pooled** connection string (`?sslmode=require`).
3. Vercel → **quiet-partner** → Environment Variables:
   - `DATABASE_URL` — pooled Neon URL (Production + Preview)
   - `WAITLIST_BACKEND=postgres` — only after step 4 succeeds
4. Run schema push **once** from a machine with `DATABASE_URL` in env:

```powershell
Set-Location D:\curorproject\quiet-partner
$env:DATABASE_URL = "<neon-pooled-url>"   # shell only — never commit
npm run db:push
```

5. Redeploy: `vercel --prod --yes`
6. Smoke: `GET /api/health` → `database_configured: true`, `waitlist_backend: "postgres"`

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run db:generate` | Generate SQL migration from `lib/db/schema.ts` |
| `npm run db:push` | Apply schema to live Postgres (Neon/Supabase) |
| `npm run db:migrate` | Apply generated migrations via drizzle-kit migrate |

## Tables (T-034 / T-051)

Auth.js core: `users`, `accounts`, `sessions`, `verification_tokens`  
App: `projects`, `domain_scores`, `audit_log`, `commentary_feedback`, `waitlist_signups`  
Ops: `token_usage_daily` (optional audit)

Waitlist hot path (T-051) uses `waitlist_signups` only — full schema pushed for future AUTH activation.

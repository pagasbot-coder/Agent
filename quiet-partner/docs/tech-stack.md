# Tech Stack — Quiet Partner

| Layer | Choice |
|-------|--------|
| Frontend | **Next.js 16** (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| State | Zustand |
| Charts | Recharts (DomainRadar) |
| Backend | Next.js API routes — BFF for LLM (DeepSeek / Gemini) |
| Secrets | Server-only env (`DEEPSEEK_API_KEY`, `GEMINI_API_KEY`) — never `NEXT_PUBLIC_*` |
| Database | Deferred (Phase 5+); local/session for spike |
| Deploy | **Vercel staging** — https://quiet-partner.vercel.app ([`deploy-staging.md`](./deploy-staging.md)); VPS — Phase 5+ |

## Explicitly not used

- **Vite** — rejected; legacy DeepSeek dialogue superseded by this stack.
- Client-side LLM SDKs with embedded keys.

## Conventions

- Agent rules: `.cursor/rules/` (`vibecoder-master.mdc`, `muster-orchestration.mdc`, `role-senior-pm.mdc`, …)
- LLM prompt: `lib/systemPrompt.ts`
- Domain logic docs: `knowledge-base/pmbok-domain-playbook.md`
- Commits: Conventional Commits when Human requests

## Local run

```bash
cd quiet-partner
cp .env.example .env.local   # add DEEPSEEK_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

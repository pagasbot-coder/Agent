# Тихий напарник / Quiet Partner

PMBOK 7 «silent co-pilot»: **DomainRadar** (8 domains), onboarding, **AI HealthCommentary** — co-pilot, not a certification tool.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · Zustand · Recharts · LLM BFF (DeepSeek/Gemini).

---

## Quick start

```bash
cd quiet-partner
cp .env.example .env.local
# Edit .env.local — set DEEPSEEK_API_KEY (server-side only)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run lint
```

---

## Muster workflow

| File | Purpose |
|------|---------|
| [`orchestration-queue.md`](./orchestration-queue.md) | Tasks T-001…T-009 |
| [`docs/implementation-plan.md`](./docs/implementation-plan.md) | **Master plan** — phases, WBS, risks, RACI, PMBOK map |
| [`knowledge-base/product-brief.md`](./knowledge-base/product-brief.md) | ICP, MVP, metrics |
| [`knowledge-base/pmbok-domain-playbook.md`](./knowledge-base/pmbok-domain-playbook.md) | 8 domains + health signals |

**Roles:** activate in Cursor with `Role: PM`, `Role: Senior PM`, `Role: Developer`, etc. See `.cursor/rules/`.

---

## Project structure

```
quiet-partner/
├── app/                 # Next.js App Router
├── lib/                 # systemPrompt, utils, (store later)
├── components/          # DomainRadar, HealthCommentary, OnboardingWizard
├── knowledge-base/      # Product + PMBOK specs
├── docs/                # roadmap, implementation-plan, tech-stack
└── .cursor/rules/       # Muster + role-senior-pm
```

---

## Parallel track

Отдельный трек monorepo `D:/curorproject`. Очередь: `orchestration-queue.md`, epic T-019 в корне.

Root queue: [`../orchestration-queue.md`](../orchestration-queue.md) — epic T-019.

---

## License

Private — Human Architect Pavel.

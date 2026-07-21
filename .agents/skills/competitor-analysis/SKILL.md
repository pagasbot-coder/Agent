---
name: competitor-analysis
description: Competitive / landscape analysis for GTM and discovery. Use for /competitor-analysis, competitors, positioning gaps. Prefer Growth/CMO or PM discovery.
disable-model-invocation: false
---

# Competitor Analysis — Muster bridge

> Import full skill from `didactic-doodle` with `scripts/import-didactic-skills.sh`.

## When to use

- `/competitor-analysis` or Human asks for competitors / feature matrix / positioning.
- Roles: **Growth** (`muster-growth-marketer`) or **PM** in discovery.

## Context

1. `@knowledge-base/skills-muster-bridge.md`
2. `@.productmap/INDEX.md` → `01_strategy/`, `02_generation/marketing/`, `08_frameworks/`
3. `@knowledge-base/marketing-brief.md`, `@knowledge-base/product-brief.md` when present
4. `@orchestration-queue.md` if analysis unlocks a READY task

## Workflow

1. Clarify ICP and which competitors (or discover 3–5).
2. Produce matrix: features, pricing signals, strengths/gaps, copy / avoid / differentiate.
3. Save durable notes under `.productmap/10_data/research/` or `knowledge-base/` (Human chooses path).
4. Handoff: Growth → PM for backlog implications; do not change MVP scope without PM.

## Hard limits

- No app code. No fake citations — mark assumptions.
- Prefer imported SKILL.md body after `--apply` import; keep Muster handoff.

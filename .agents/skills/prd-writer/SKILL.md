---
name: prd-writer
description: Write PRDs with ProductMap templates and Muster queue handoff. Use for /prd-writer, PRD, requirements, speclet. Prefer when Role PM / muster-pm.
disable-model-invocation: false
---

# PRD Writer — Muster bridge

> Full skill body is imported from `didactic-doodle` via `scripts/import-didactic-skills.sh`.  
> Until import: follow this bridge + `.productmap` templates.

## When to use

- Human runs `/prd-writer` or asks for PRD / requirements / AI-PRD.
- Active role: **PM** (`muster-pm` / `Role: PM`).

## Mandatory context

1. `@knowledge-base/skills-muster-bridge.md`
2. `@.productmap/INDEX.md` if present → templates:
   - `.productmap/09_templates/prd-template.md`
   - `.productmap/09_templates/ai-prd-template.md`
   - `.productmap/04_delivery/backlog-requirements/`
3. `@orchestration-queue.md` — куда лягут AC после PRD
4. Product brief of the active subproject (`quiet-partner/…` or root `knowledge-base/product-brief.md`)

## Workflow

1. **Ask first** (if missing): feature/initiative name; product + audience + problem; constraints (time, stack, out of scope, metrics).
2. Draft PRD from ProductMap template (RU unless Human asks EN).
3. Extract **Acceptance Criteria** in Muster style (checkboxes).
4. Propose queue task `T-0xx` for Developer/UI with role, P0/P1, `@` refs — **do not** implement app code.
5. Note Product Map phase (Generation / Delivery) in task Notes.

## Hard limits

- No application code (Muster PM rule).
- No login to productmap.io — only git `.productmap/`.
- After import, if `.agents/skills/prd-writer/SKILL.md` is longer/richer than this file, **prefer the imported file** and still finish with Muster queue handoff.

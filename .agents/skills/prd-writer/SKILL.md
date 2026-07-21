---
name: prd-writer
description: Generate comprehensive product requirements documents. Use when starting a new feature or product initiative and need structured documentation.
argument-hint: [feature name]
---

## Domain Context

This skill implements a proven product management framework. The approach combines best practices from industry leaders and is designed for practical application in day-to-day PM work.

## Input Requirements

- Context about your product, feature, or problem
- Relevant data, research, or constraints (recommended but optional)
- Clear articulation of what you're trying to achieve


# PRD Writer

## When to Use
- Starting a new feature or product initiative
- Need to document requirements for the engineering team
- Stakeholders need a detailed project overview
- Before beginning design or development work
- To align cross-functional teams on scope and goals

## What This Skill Does
Creates structured, comprehensive PRDs covering problem statement, proposed solution, requirements, success metrics, and implementation details.

## Instructions
Help me write a comprehensive PRD for [feature name]. Include:

1. Problem Statement
- Current situation
- User pain points
- Business impact

2. Proposed Solution
- Overview of the approach
- User stories
- Success metrics

3. Requirements
- Functional requirements
- Technical requirements
- Design requirements

4. Implementation
- Dependencies
- Timeline estimate
- Resources needed

5. Risks and Mitigations

Your context:
[Add product context, feature details, and constraints here]

## Best Practices
- Be specific about the problem and user pain points
- Include quantitative success metrics
- Define scope clearly (what's in scope and out of scope)
- Consider technical constraints upfront
- Add detailed user stories for key flows
- Include acceptance criteria

## Refining This Skill

After delivering a PRD, watch for user feedback or extra context that would improve **future** runs — not just the current document.

**Update this file when the user provides:**
- Output preferences (format, tone, level of detail, required/optional sections)
- Team or org conventions (naming, success-metric style, approval workflow)
- Product-domain defaults (personas, tech stack, compliance constraints)
- Corrections to recurring mistakes ("always include X", "never assume Y")
- Examples of PRDs they liked or rejected, with reasons

**Do not add to the skill:**
- Feature-specific details that won't generalize to other PRDs
- One-off context for a single initiative
- Temporary or time-bound constraints

**How to refine:**
1. Confirm the feedback is reusable across future PRDs (ask briefly if unclear).
2. Edit `.agents/skills/prd-writer/SKILL.md` — fold learnings into the relevant section (Instructions, Best Practices, or a new subsection) rather than appending a changelog.
3. Keep additions concise; remove or merge outdated guidance if it conflicts.
4. Tell the user what was updated and why, so they can correct it.

**Examples of good refinements:**
- User wants every PRD to include an "Out of scope" subsection → add to Instructions
- User's team uses RICE for prioritization → add to Best Practices
- User prefers shorter PRDs for small features → add a conditional note under Instructions

## Example
**Input:** Building a notification center for SaaS app, target users are power users who miss important updates
**Output:** Full PRD with problem statement, user stories, functional/technical requirements, success metrics (reduce missed notifications by 40%), timeline, and risk assessment


## Further Reading

- [Prd Templates](https://pmprompt.com/blog/prd-templates)
- [How To Write Prd Using Ai](https://pmprompt.com/blog/how-to-write-prd-using-ai)
- [Prd Examples](https://pmprompt.com/blog/prd-examples)

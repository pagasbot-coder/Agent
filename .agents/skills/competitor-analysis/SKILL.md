---
name: competitor-analysis
description: Analyzes competitor websites from a URL and produces structured summaries based on live page content. Use when the user provides a competitor link, asks for competitor analysis, competitive research, or wants to understand a rival product from their website.
argument-hint: [URL]
---

## Domain Context

This skill performs live competitor research by reading the actual content on a website page — not prior knowledge or assumptions about the company.

## Input Requirements

- A URL to the competitor page to analyze (homepage, product page, or pricing page)
- Optional: which page to prioritize if the user provides a company name without a URL
- Optional: comparison context (your product, market segment, or specific questions)

# Competitor Analysis

## When to Use

- Researching a competitor before a product or GTM decision
- Summarizing what a competitor communicates on their website
- Comparing positioning, features, or pricing visible on a live page
- Building competitive intelligence from primary source content

## What This Skill Does

Fetches the target page, extracts what is actually published there, and delivers a structured competitor summary grounded in that content.

## Instructions

Analyze the competitor at **[URL]**.

### Step 1: Fetch live page content

1. Use `WebFetch` on the provided URL first.
2. If content is missing, blocked, or clearly incomplete (e.g., empty shell, login wall, heavy JS rendering), use browser tools to load the page and capture visible text.
3. Record the exact URL analyzed and note if redirects occurred.
4. If multiple pages would materially change the summary (e.g., homepage vs. pricing), ask whether to analyze additional URLs — do not assume content from other pages.

### Step 2: Analyze only what is on the page

Base the summary strictly on fetched content:

- Quote or paraphrase specific headlines, claims, and feature names from the page
- Do not invent features, pricing, customers, or metrics not present on the page
- Mark inferred items clearly as **Inferred** vs **Stated on page**
- If a section is absent (e.g., no pricing), say **Not found on page** rather than guessing

### Step 3: Produce the competitor summary

Use this template:

```markdown
# Competitor Summary: [Company or Product Name]

**URL analyzed:** [full URL]
**Page type:** [homepage / product / pricing / other]
**Analysis date:** [today's date]

## Overview
[1–2 sentences: what this company/product appears to be, based on page content]

## Value Proposition
[Primary promise or problem they claim to solve — cite key headline or tagline]

## Target Audience
[Who the page speaks to — roles, industries, company sizes if mentioned]

## Key Features & Capabilities
[Bulleted list of capabilities explicitly mentioned on the page]

## Pricing & Packaging
[Plans, price points, free tier, trial — or "Not found on page"]

## Positioning & Messaging
[How they differentiate; tone; notable keywords or themes]

## Social Proof
[Logos, testimonials, case studies, metrics — or "Not found on page"]

## Calls to Action
[Primary CTAs and conversion paths visible on the page]

## Strengths (as presented)
[What the page emphasizes as advantages]

## Gaps or Open Questions
[What the page does not explain; ambiguities; missing information for a full competitive picture]

## Notable Quotes
[2–4 short quotes or paraphrases of the strongest on-page claims]
```

### Step 4: Optional comparison

If the user provided their product or context, add:

```markdown
## Comparison Notes (vs. [your product/context])
- Overlap: [...]
- Their emphasis: [...]
- Your potential angle: [...]
```

Keep comparison factual and tied to page content; avoid speculative strategy unless asked.

## Best Practices

- Prefer primary source content over memory or third-party descriptions
- Capture exact pricing figures and plan names when shown
- Note last-modified or version cues only if visible on the page
- Flag paywalls, geo-blocks, or bot protection that limited analysis
- Stay neutral — describe what they say, not whether it is true
- Keep the summary scannable; use bullets over long paragraphs

## Refining This Skill

After delivering a summary, watch for feedback that would improve **future** runs.

**Update this file when the user provides:**
- Preferred output sections or shorter/longer format
- Required pages to always check (pricing, docs, changelog)
- Industry-specific fields (compliance, integrations, SLAs)
- Comparison format preferences

**Do not add to the skill:**
- One-off notes about a single competitor
- Temporary market events or time-bound pricing

**How to refine:**
1. Confirm the feedback applies to future analyses.
2. Edit `.agents/skills/competitor-analysis/SKILL.md` — fold learnings into Instructions or Best Practices.
3. Tell the user what was updated.

## Example

**Input:** `https://example.com` (B2B analytics homepage)

**Output:** Structured summary with overview, value prop from hero headline, feature bullets from product section, "Not found on page" for pricing, social proof from logo bar, and CTAs ("Start free trial", "Book demo") — all sourced from fetched page content.

---
name: competitor-report
description: Fetches a competitor website and related pages to produce a Markdown report covering site overview, pricing/subscriptions, contacts, and social accounts, with table-based summaries. Use when the user asks for a competitor report, pricing/contact research, or `/competitor-report [URL]`.
argument-hint: [URL or company name]
---

## Domain Context

This skill produces operational competitive intelligence from live website content — pricing, contacts, and social presence — with table-based summaries. It complements `competitor-analysis`, which focuses on product/GTM positioning.

| Skill | Best for |
|-------|----------|
| `competitor-analysis` | Product/GTM summary: value prop, features, positioning, social proof, comparison notes |
| `competitor-report` | Operational intel: pricing tables, contact details, social accounts, executive summary tables |

If the user wants deeper positioning comparison after this report, suggest `competitor-analysis`.

## Input Requirements

- A URL to the competitor website (homepage preferred), or a company name if the URL is unknown
- Optional: specific pages to prioritize (pricing, contact, about)
- Optional: request to save the report as a file (default is chat output only)

# Competitor Report

## When to Use

- Building a competitor report focused on pricing, contacts, and social accounts
- Gathering subscription and packaging details from a live site
- Collecting public contact and social media information
- Producing a scannable Markdown report with table summaries

## What This Skill Does

Fetches the competitor site and related pages (pricing, contact, about, footer), extracts what is actually published, and delivers a Markdown report titled with the competitor name, including executive summary, pricing, and contacts tables.

## Instructions

Execute the following plan step by step.

1. Analyse the website of the competitor.
2. Review the pricing and any subscription information.
3. Collect all information about their contacts and social media accounts.
4. Assemble the final report with a summary using the table format.
5. Output everything in the Markdown with the name of the competitor.

### Step 1: Analyse the website of the competitor

1. Use `WebFetch` on the provided URL first.
2. If content is missing, blocked, or clearly incomplete (e.g., empty shell, login wall, heavy JS rendering), use browser tools to load the page and capture visible text.
3. Record the exact URL analyzed and note if redirects occurred.
4. From the homepage (and linked pages as needed), extract: company/product name, tagline, primary offering, target audience cues, and key nav links (especially Pricing, Contact, About).
5. Base findings strictly on fetched content:
   - Quote or paraphrase specific headlines and claims from the page
   - Do not invent features, pricing, contacts, or metrics not present on the page
   - Mark inferred items clearly as **Inferred** vs **Stated on page**
   - If a section is absent, say **Not found on page** rather than guessing

### Step 2: Review the pricing and any subscription information

1. Follow pricing links from nav/footer; fetch the dedicated pricing page if it exists.
2. Extract: plan names, prices, billing cadence (monthly/annual), free tier, trial length, enterprise/custom pricing, and feature limits per tier.
3. If pricing is gated (login, “Contact sales” only), record that explicitly — do not invent numbers.
4. Note the source URL for each plan or pricing claim.

### Step 3: Collect all information about their contacts and social media accounts

1. Check footer, `/contact`, `/about`, and legal pages for:
   - Email, phone, address, support channels, sales/demo CTAs
   - Social links: LinkedIn, X/Twitter, Facebook, Instagram, YouTube, GitHub, Discord, and others present on the site
2. Include the **source URL** for each contact or social item found.
3. Do not invent contact details or social accounts not linked or stated on the site.

### Step 4: Assemble the final report with a summary using the table format

Fill these three tables from live data.

**Executive summary table**

```markdown
| Field | Details |
|-------|---------|
| Competitor | [Name] |
| Website | [URL] |
| Page(s) analyzed | [URLs] |
| Analysis date | [date] |
| Overview | [1–2 sentences from page content] |
| Primary offering | [...] |
| Target audience | [...] or Not found on page |
```

**Pricing and subscriptions table**

```markdown
| Plan | Price | Billing | Trial / free tier | Key limits or features | Source |
|------|-------|---------|-------------------|------------------------|--------|
| ... | ... | ... | ... | ... | [URL] |
```

Use a single row `Not found on page` if no pricing is published.

**Contacts and social media table**

```markdown
| Type | Value | Source |
|------|-------|--------|
| Email | ... | footer / contact page |
| LinkedIn | [url] | footer |
| ... | ... | ... |
```

### Step 5: Output everything in the Markdown with the name of the competitor

Deliver the full report in this structure:

```markdown
# Competitor Report: [Competitor Name]

## Summary

[Executive summary table]

## Pricing and Subscriptions Summary

[Pricing and subscriptions table]

## Contacts and Social Media Summary

[Contacts and social media table]

## Website Analysis

[Concise bullets: value prop, features, positioning]

## Pricing and Subscriptions

[Narrative expansion of the pricing table]

## Contacts and Social Media

[Narrative expansion of the contact table]

## Gaps and Limitations

[Paywalls, missing pages, bot blocks, or incomplete data]
```

Default output is in chat. Only write a file to `reports/competitor-report-[slug].md` if the user explicitly asks to save it.

## Best Practices

- Prefer primary source content over memory or third-party descriptions
- Capture exact pricing figures and plan names when shown
- Always include source URLs for pricing, contacts, and social links
- Flag paywalls, geo-blocks, or bot protection that limited analysis
- Stay neutral — describe what they publish, not whether it is true
- Keep tables scannable; use narrative sections for detail, not duplication of every cell

## Refining This Skill

After delivering a report, watch for feedback that would improve **future** runs.

**Update this file when the user provides:**
- Preferred table columns or additional summary fields
- Required pages to always check (pricing, docs, careers)
- Industry-specific contact fields (compliance email, press kit)
- Save-to-file or naming conventions

**Do not add to the skill:**
- One-off notes about a single competitor
- Temporary market events or time-bound pricing

**How to refine:**
1. Confirm the feedback applies to future reports.
2. Edit `.agents/skills/competitor-report/SKILL.md` — fold learnings into Instructions or Best Practices.
3. Mirror the same change to `.claude/skills/competitor-report/SKILL.md`.
4. Tell the user what was updated.

## Example

**Input:** `https://example.com` (SaaS product homepage)

**Output:** `# Competitor Report: Example` with filled executive summary, pricing, and contacts tables; website analysis bullets from the homepage; pricing narrative from `/pricing`; contacts from the footer; and “Not found on page” where data is missing — all sourced from fetched page content.

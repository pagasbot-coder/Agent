# GTM sprint 1 — copy drafts (T-073)

**Задача:** T-073 · **Роль:** Growth  
**Статус:** DONE 2026-06-13 · **v2 Pavel-style** 2026-06-13 (**drafts only** — **не публиковать** без Human)  
**Каналы:** LinkedIn (Human Pavel) + 1 PM-community intro  
**Gate:** без checkout / Pro pricing CTA (billing paused)  
**Style source:** [linkedin.com/in/pavel-bidzhiev-86a37b265](https://www.linkedin.com/in/pavel-bidzhiev-86a37b265/) — WebFetch (posts visible); browser MCP → authwall (no login)

**Контекст:** [`gtm-roundtable-brief.md`](./gtm-roundtable-brief.md) · [`landing-waitlist-one-pager.md`](./landing-waitlist-one-pager.md) · [`waitlist-metrics-spec-T-074.md`](./waitlist-metrics-spec-T-074.md)

---

## Выбранные каналы (Growth recommendation)

| # | Канал | Owner | Sprint 1 |
|---|-------|-------|------------|
| 1 | **LinkedIn** (EN, Pavel voice) | Human Pavel | 2 поста / 2 нед |
| 2 | **PM-комьюнити** (Telegram/Slack проф. группа) | Human post · Growth draft | 1 intro |

SEO `/waitlist` — passive (T-053 DONE); paid ads — **не сейчас**.

---

## UTM table

**Base URL:** `https://quiet-partner.vercel.app/waitlist`

| Channel | Full link | `utm_source` | `utm_medium` | `utm_campaign` | `source` (API) |
|---------|-----------|--------------|--------------|----------------|----------------|
| LinkedIn post #1 | `https://quiet-partner.vercel.app/waitlist?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_v0&utm_content=post1_radar` | `linkedin` | `social` | `waitlist_v0` | `linkedin_waitlist_v0` |
| LinkedIn post #2 | `https://quiet-partner.vercel.app/waitlist?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_v0&utm_content=post2_questions` | `linkedin` | `social` | `waitlist_v0` | `linkedin_waitlist_v0` |
| Community intro | `https://quiet-partner.vercel.app/waitlist?utm_source=community&utm_medium=chat&utm_campaign=waitlist_v0&utm_content=intro_v0` | `community` | `chat` | `waitlist_v0` | `community_waitlist_v0` |
| Demo fallback | `https://quiet-partner.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_v0&utm_content=demo` | `linkedin` | `social` | `waitlist_v0` | — |

**Правило:** в постах — только waitlist URL с UTM; demo — secondary CTA без оплаты.

---

## Почему такой стиль

- **EN + framework voice:** оригинальные посты Pavel — на английском, с провокационным hook («Let's talk facts», «Stop building features…»), короткими абзацами и Unicode-bold заголовками; не короткий Growth-copy, а «учебный» пост с одной идеей.
- **Структура и engagement:** нумерованные блоки (1️⃣2️⃣3️⃣), стрелки →, TL;DR у data-постов; в конце — вопрос в комментарии + 👉 CTA; хештеги минимальны — упор на диалог, не на теги.
- **Практик, не вендор:** личный угол («When I started…», «My team…»), anti-fluff; RU — в комментариях/лайках, не в основных постах → Quiet Partner промо на EN, имя продукта **Тихий напарник / Quiet Partner** bilingual.

*Ограничение:* WebFetch дал headline, about, ~10 recent posts (текст); browser MCP → authwall. Лайки/комментарии по постам не видны — стиль выведен из текста и структуры, не из метрик.

---

## LinkedIn post #1 — «8 domains, one picture»

**Hook:** wedge DomainRadar · **UTM:** post1_radar  
**Когда:** неделя 1, вторник–среда  
**Язык:** EN (Pavel voice)

---

Running 2–8 projects at once — and every morning feels like **everything is on fire**?

Most PM tools give you more boards, more tabs, more noise.
You still don't know **where to look first**.

𝗧𝗵𝗮𝘁'𝘀 𝘄𝗵𝘆 𝘄𝗲'𝗿𝗲 𝗯𝘂𝗶𝗹𝗱𝗶𝗻𝗴 𝗧𝗶𝗵𝗶𝗶 𝗻𝗮𝗽𝗮𝗿𝗻𝗶𝗸 (Quiet Partner).

One screen. Eight PMBOK 7 domains. One **DomainRadar**:
→ green / yellow / red — no spreadsheet maze.
→ stakeholders, team, delivery, uncertainty — in one picture.

𝗪𝗵𝗮𝘁 𝗶𝘁 𝗶𝘀 𝗡𝗢𝗧:
❌ Another Jira clone
❌ PMP exam prep or certification trainer
❌ Enterprise PMO suite

It's a co-pilot for **"what needs attention today"** — when you're juggling agency or SMB projects and can't afford a full-time PMO.

𝗪𝗵𝗼 𝘄𝗲'𝗿𝗲 𝗹𝗼𝗼𝗸𝗶𝗻𝗴 𝗳𝗼𝗿:
PMs and project leads in agencies / SMB (5–50 people) running multiple client or internal projects.

We're opening a **closed beta** — early access via waitlist:

👉 https://quiet-partner.vercel.app/waitlist?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_v0&utm_content=post1_radar

Try the demo first (no signup): https://quiet-partner.vercel.app/?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_v0&utm_content=demo

*Co-pilot for project thinking — not PMI/PMBOK certification.*

💬 If you run 3+ projects in parallel: what's your signal that something is actually red — not just "busy"?

Drop it in the comments.

---

## LinkedIn post #2 — «AI asks before it answers»

**Hook:** questions-first HealthCommentary · **UTM:** post2_questions  
**Когда:** неделя 2, вторник–среда (≥5 дней после post #1)  
**Язык:** EN (Pavel voice)

---

Most "AI for PM" tools = **another chat that dumps paragraphs**.

You ask for help.
You get a compliance checklist.
You still don't know what's blocking the week.

𝗛𝗲𝗮𝗹𝘁𝗵𝗖𝗼𝗺𝗺𝗲𝗻𝘁𝗮𝗿𝘆 𝗶𝗻 𝗧𝗶𝗵𝗶𝗶 𝗻𝗮𝗽𝗮𝗿𝗻𝗶𝗸 (Quiet Partner) works differently:

𝟭️⃣ **Questions first**
→ 1–3 plain-language questions — so *you* surface the real blocker.
→ Not "here's your score." Discovery, not checkbox theater.

𝟮️⃣ **DomainRadar next**
→ 8 PMBOK 7 domains on one radar: see the red zone without tab-hopping.
→ Built for PMs who need focus, not another task tracker.

𝟯️⃣ **Built for real projects**
→ Agency & SMB. 2–8 parallel projects.
→ RU-first UI. No exam prep. No Jira replacement pitch.

I built this as a pet project after one too many weeks where **everything looked yellow and nothing had priority**.

Closed beta waitlist (RU product, EN-friendly demo):

👉 https://quiet-partner.vercel.app/waitlist?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_v0&utm_content=post2_questions

3-min demo, no account: https://quiet-partner.vercel.app/onboarding?utm_source=linkedin&utm_medium=social&utm_campaign=waitlist_v0&utm_content=demo

*Not a Jira replacement. Not an official PMI product.*

♻️ Repost if your team is tired of AI that talks *at* PMs instead of *with* them.

💬 What's the one question you wish your PM stack asked you every Monday?

---

---

## Community intro — PM-чат (Telegram / Slack)

**Формат:** короткое intro + ссылка · **UTM:** intro_v0  
**Когда:** после первого LinkedIn post (или параллельно, другая аудитория)

---

Привет! Делюсь pet-project для PM — **Тихий напарник**.

Проблема: 2–8 проектов, всё «жёлтое», нет приоритета. Решение — один экран здоровья проекта: **8 доменов PMBOK 7** на радаре + короткий AI-комментарий, который **сначала задаёт вопросы**, а не выдаёт простыню.

Не PMP-тренажёр и не Jira. Co-pilot «куда смотреть сегодня».

Ищем 10–15 PM из агентств/SMB в закрытый beta. Если откликается — waitlist:

https://quiet-partner.vercel.app/waitlist?utm_source=community&utm_medium=chat&utm_campaign=waitlist_v0&utm_content=intro_v0

Можно сразу потыкать demo: quiet-partner.vercel.app (онбординг ~3 мин).

Буду рад фидбеку в личку / в треде — что лишнее, что не хватает.

*Disclaimer: co-pilot, не сертификация PMBOK.*

---

## Guardrails (checklist перед публикацией Human)

- [ ] Нет цены / Pro / YooKassa / «990 ₽» в постах
- [ ] Disclaimer PMI присутствует (короткий footer)
- [ ] UTM-ссылки из таблицы выше — не сокращать без сохранения params
- [ ] Anti-persona: не exam prep, не enterprise PMO pitch
- [ ] После публикации — занести дату в weekly snapshot ([`waitlist-metrics-spec-T-074.md`](./waitlist-metrics-spec-T-074.md))

---

## Human actions (minimal)

| # | Действие | Блокирует |
|---|----------|-----------|
| 1 | Approve 2 канала (или «ок, как в brief») | Желательно, не блокирует drafts |
| 2 | Copy-paste посты #1 → #2 → community intro | Sprint 1 traction |
| 3 | OPTIONAL: Plausible/PostHog для uniques (T-075) | Точный CR без ручного счёта |

---

## История

| Дата | Автор | Изменение |
|------|-------|-----------|
| 2026-06-13 | Growth (PM orchestrator) | Sprint 1 drafts RU; UTM table; no posting |
| 2026-06-13 | Growth (subagent) | **v2 Pavel-style:** LinkedIn EN + Unicode-bold structure; «Почему такой стиль»; community intro unchanged |

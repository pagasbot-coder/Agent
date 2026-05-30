# UX Reference — Product Map → Тихий напарник

> **Задача:** T-020 · **Роль:** UI/UX  
> **Источник:** публичные страницы [productmap.io](https://productmap.io) и [app.productmap.io](https://app.productmap.io) (без логина, без credentials).  
> **Дата:** 30.05.2026 · **Режим:** «Для команды»

---

## TL;DR

Product Map задаёт **polish tier** для PM SaaS: светлый фон, card-based секции, короткие заголовки, один primary CTA на экран, каталог «ассистентов» как mental model для AI-помощника. Для **Тихого напарника** переносим **структуру и спокойствие**, не PM skills assessment, не pricing hero и не mind-map. Адаптируем под: **3-step onboarding → DomainRadar → HealthCommentary**.

---

## 1. Визуальный язык

### Что видно на публичных страницах Product Map

| Элемент | Паттерн (generic) | Комментарий |
|---------|-------------------|-------------|
| **Типографика** | Крупный H1 hero → H2 секции → body `text-sm`/`base`; uppercase eyebrow над заголовком | Маркетинг и app landing: «Knowledge-led PM assistants», «PM Assistant Catalog» |
| **Whitespace** | Щедрые вертикальные отступы между секциями; контент не прижат к краям | Hero + feature blocks с `gap` между карточками |
| **Карточки** | Белый/near-white surface, скругление ~12px, лёгкая тень или border | Feature cards, catalog tiles, pricing blocks |
| **Цвета** | Light theme: белый фон, тёмно-серый текст, **indigo/violet accent** на CTA | Спокойный B2B SaaS, без consumer-градиентов в рабочей зоне |
| **Тон** | Professional PM, «copilot», «navigation» — доверие через ясность, не через декор | Без visual noise, без gamification |

### Маппинг на «Тихий напарник» (calm PM aesthetic)

| Product Map signal | Наш контекст | Текущее состояние (`globals.css`, компоненты) |
|--------------------|--------------|-----------------------------------------------|
| Light, airy shell | РП открывает dashboard утром — не «ops war room» | `--background: oklch(0.99 …)` — уже light; сохраняем |
| Soft card elevation | Radar + advisor — две равноправные «панели решения» | `ring-1 ring-foreground/10` на radar; shadcn `Card` на commentary |
| Indigo-tier accent | Primary = «действие напарника», не exam red | `--accent: oklch(0.62 0.12 230)` — близко к PM SaaS norm |
| Muted meta | PMBOK disclaimer, подход к поставке — вторичный слой | `text-muted-foreground` в header и footer |
| Uppercase eyebrow | «PMBOK 7 · co-pilot», «Настройка проекта» | Уже в `DashboardShell`, `OnboardingWizard` |

**Принцип calm PM:** один экран — один фокус (радар + один вопрос AI). Никаких sidebar с 12 пунктами, нет skills progress bars, нет community feed.

---

## 2. Навигация и информационная иерархия

### Product Map (публично)

```
[Logo / brand]     [Products · AI · Resources · About]     [Get started · Log in]
─────────────────────────────────────────────────────────────────────────────────
Hero H1 → subtitle → primary CTA
Section H2 → grid of catalog cards (assistants / topics)
Footer: legal, roadmap, release notes
```

**App landing (без auth):** каталог ассистентов по категориям (Daily PM Tasks, Personal Growth), блок «Add product context to personalize», feature grid (Assessment → Gaps → Report).

### Адаптация для Quiet Partner

```
[Eyebrow: PMBOK 7 · co-pilot]
[H1: Тихий напарник]
[Meta: проект · фаза · подход]     [Настроить проект] [Запустить аудит]
─────────────────────────────────────────────────────────────────────────────
[Optional banner: пройдите настройку]
┌─────────────────────────────┬──────────────────┐
│ DomainRadar (primary viz)   │ HealthCommentary │
│ 8 доменов, legend, table    │ AI card + 👍/👎  │
└─────────────────────────────┴──────────────────┘
[Footer disclaimer — dashed, muted]
```

| Уровень | Product Map | Тихий напарник |
|---------|-------------|----------------|
| L0 | Brand + global nav | Минимальный header без multi-page nav (MVP single dashboard) |
| L1 | Hero / catalog title | H1 + project meta |
| L2 | Card sections | Radar section + Advisor section |
| L3 | Card body, lists | Domain labels, commentary text, feedback |
| Secondary | Settings, pricing, knowledge hub | `/onboarding`, glossary `<details>`, «Настроить проект» |

**Иерархия действий:** primary = «Показать радар» (onboarding finish) / «Обновить комментарий»; secondary = «Настроить проект», «Назад»; tertiary = glossary, disclaimer.

---

## 3. Онбординг / wizard — паттерны для 3 шагов

### Product Map (assessment flow, публичное описание)

Трёхшаговая **оценка навыков** (не наш домен, но UX-скелет переносим):

1. **Input context** — загрузить CV / self-assessment («Provide product experience»)
2. **Analysis** — AI анализ gaps («Identify gaps in expertise»)
3. **Report + CTA** — breakdown + «Start learning» / «Try for free»

Паттерны: **numbered steps**, один фокус на экран, progress indicator, финальный CTA с обещанием результата.

### Наш flow (`docs/onboarding-spec.md`)

| Шаг | PM copy | Product Map analogue | UX рекомендация |
|-----|---------|----------------------|-----------------|
| **1 — Профиль** | Название + подход к поставке | «Add product context» | Radio cards с `has-[:checked]:border-primary` — ✓ уже есть |
| **2 — Турбулентность** | 3 слайдера 1–5 | Self-assessment sliders (generic wizard) | Live value badge + hint под label — ✓; добавить **step subtitle** «2 из 3 — турбулентность» |
| **3 — Главная боль** | Single-select pain | «Pick your focus area» в growth plan | Collapsible glossary «8 доменов» = **progressive disclosure** (Product Map: advanced в secondary layer) |

**Паттерны для adoption:**

- **Progress bar + %** — уже реализовано; усилить: мини-лейблы шагов («Профиль · Турбулентность · Боль») под bar
- **One primary button per step** — «Далее» / «Показать раadar»; «Назад» = outline
- **Centered narrow column** (`max-w-lg`) — focus mode как PM assessment
- **Finish promise** — кнопка «Показать радар» (не «Submit») — outcome-oriented copy как «Get your report» у Product Map
- **Time budget** — subtitle «Три коротких шага — меньше 3 минут» (AC: time to first radar)

**Не копируем:** upload CV, LinkedIn parse, 50-page report, paywall «Detailed Report – $49».

---

## 4. Dashboard layout — идеи (адаптация, не клон)

### Product Map dashboard mental model

- **Catalog grid** — карточки ассистентов с category pill (Daily PM Tasks, Personal Growth)
- **Context banner** — «Add product context to personalize»
- **Feature trio** — Assessment | Gaps | Report (horizontal story)
- **Knowledge hub** — 50+ topics, 5 areas (sidebar taxonomy — heavy для MVP)

### Quiet Partner layout (текущий + улучшения)

| Зона | Сейчас | Идея из Product Map | Адаптация |
|------|--------|---------------------|-----------|
| **Radar** | `lg:col-span-3`, ring border | «Skill sunburst» / map viz — центральный anchor | Radar остаётся **hero viz**; добавить **один red callout** под chart (max 1 — уже в ТЗ) |
| **Advisor** | `lg:col-span-2`, shadcn Card | «Personal AI copilot» card — icon + title + body | Иконка Brain ✓; усилить **CardDescription** одной строкой «Один вопрос на сегодня» |
| **Context strip** | Header meta (name, approach) | «Context for Product Work» | Компактный **context chip row** под header: `[CRM] [гибридный] [Discovery]` |
| **Empty / pre-onboarding** | Banner primary/5 | Friendly empty + CTA | ✓ «Пройдите настройку» — сохранить |
| **Feedback** | 👍/👎 после commentary | (нет прямого аналога) | Оставить minimal; не превращать в NPS survey |

**Responsive:** mobile — stack radar → advisor (radar first); tablet — сохранить gap-6; не вводить sidebar до Phase 4.

**Anti-pattern Product Map:** topic map / 5672 nodes — **не** масштабировать на 8 доменов tree UI; radar + table достаточно.

---

## 5. Что adopt vs reject для «Тихий напарник»

### ✅ Adopt (структура и UX)

| # | Паттерн | Куда |
|---|---------|------|
| A1 | Clarity over density — один primary action | Dashboard header, onboarding footer |
| A2 | Card-based sections с consistent radius/shadow | Radar wrapper, HealthCommentary |
| A3 | Eyebrow + H1 + muted subtitle | Header, onboarding header |
| A4 | Numbered wizard + progress % | Onboarding (усилить step labels) |
| A5 | Outcome-oriented CTA copy | «Показать радар», «Обновить комментарий» |
| A6 | Progressive disclosure | Glossary collapsible; advanced audit — secondary |
| A7 | Context personalization message | Meta line + store-driven chips |
| A8 | Professional calm palette (light + single accent) | `globals.css` tokens |
| A9 | Catalog-card metaphor для AI | HealthCommentary = «один ассистент», не chat thread |
| A10 | Trust footer / disclaimer | Dashed footer ✓; не прятать PMI disclaimer |

### ❌ Reject (scope / anti-persona)

| # | Паттерн Product Map | Причина отказа |
|---|---------------------|----------------|
| R1 | PM skills assessment, grades, industry rank | Exam/career positioning — anti-persona |
| R2 | Growth plans, learning paths, 50+ topics hub | Не LMS; фокус — здоровье **текущего** проекта |
| R3 | Assistant catalog (6+ bots) | Один HealthCommentary достаточно для MVP |
| R4 | Pricing hero, Plus/Pro paywall blocks | Phase 4 Growth; не в dashboard |
| R5 | Light marketing hero gradients на dashboard | Calm tool, не landing |
| R6 | AI chat thread / context versioning UI | BFF single-shot commentary (ADR-001) |
| R7 | Community, contributors, public roadmap | Out of scope |
| R8 | Upload CV / LinkedIn для персонализации | Onboarding sliders достаточно |
| R9 | Mind-map / sunburst skills viz | DomainRadar — свой viz (Recharts) |
| R10 | Multi-page marketing nav | Single-page dashboard MVP |

---

## 6. Handoff Developer — T-021 (5 конкретных правок)

> **Задача T-021:** применить visual polish по этому reference. Файлы: `app/globals.css`, `components/DashboardShell.tsx`, `components/HealthCommentary.tsx`, `components/OnboardingWizard.tsx`, `components/ui/card.tsx`.

| # | Tweak | Tailwind / shadcn | Файл |
|---|-------|-------------------|------|
| **1** | Поднять tier карточек: мягкая тень вместо только ring | Radar section: `rounded-xl border border-border/80 bg-card p-6 shadow-sm` (убрать `ring-1 ring-foreground/10`) | `DashboardShell.tsx` |
| **2** | Увеличить radius token для «Product Map tier» | `:root { --radius: 0.625rem; }` (+ `--radius-xl: 0.875rem` optional) | `globals.css` |
| **3** | Advisor card — visual anchor при red domains | `Card` className: `cn(alertBorder && "border-l-4 border-l-destructive")` + `shadow-sm` | `HealthCommentary.tsx` |
| **4** | Onboarding — step labels под progress bar | Под bar: `flex justify-between text-[10px] text-muted-foreground` с тремя лейблами; active step `text-primary font-medium` | `OnboardingWizard.tsx` |
| **5** | Header CTA hierarchy — один solid primary | «Пройдите настройку» / finish onboarding = `Button` default; «Настроить проект» = `variant="outline" size="sm"`; «Запустить аудит» = `variant="ghost" size="sm"` | `DashboardShell.tsx` |

**Acceptance T-021 (draft):** build/lint green; визуально согласованные cards; mobile 375px без overflow; a11y focus states сохранены.

---

## Связанные артефакты

- `@docs/onboarding-spec.md` — flow и copy онбординга
- `@knowledge-base/product-brief.md` — calm co-pilot positioning
- `@docs/competitive-scan-1pager.md` — Product Map не конкурент radar; reference только UX tier
- Portable synthesis (workspace): `knowledge-base/productmap-ux-ui-analysis-portable.md`

---

## Метод

- WebFetch публичных URL productmap.io / app.productmap.io (май 2026).
- Authenticated app, login, pricing checkout — **не** изучались.
- Паттерны описаны generic там, где paywall/blocking.

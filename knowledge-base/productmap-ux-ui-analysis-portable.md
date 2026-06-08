# ProductMap UX/UI — переносимый анализ для SaaS

> **Назначение:** универсальный design reference для любого B2B SaaS / ops-dashboard.  
> **Источник синтеза:** анализ [Product Map](https://www.productmap.io/) и [app.productmap.io](https://app.productmap.io/) (публичные страницы; authenticated app не скрейпился).  
> **Дата:** 30&nbsp;мая&nbsp;2026 · **Режим:** «Для команды» (portable)

---

## TL;DR

- **Product Map** задаёт эталон *polish tier* для B2B SaaS: ясная иерархия, щедрые отступы, card-based layout — без копирования бренда или PM-специфики.
- **Универсальный принцип:** clarity over density — заголовок + однострочный subtitle, primary action на виду, advanced-сценарии спрятаны в `<details>` или вторичный слой.
- **Визуальная система:** два варианта одного tier — **light marketing** (белый фон, мягкие тени) и **dark ops** (slate shell, indigo accent); токены совместимы через CSS variables.
- **Layout-паттерны:** sticky header ~56&nbsp;px, pill-nav, card sections, filter toolbar внутри card, data tables со sticky thead, empty states с CTA.
- **Не переносить:** skills assessment, mind-map, AI chat, pricing hero, paywall, брендинг Product Map — только структурные и визуальные принципы.

---

## 1. Источник: app.productmap.io — что изучали

### Объект анализа

| Область | URL / зона | Что зафиксировали |
|---------|------------|-------------------|
| Маркетинг | [productmap.io](https://www.productmap.io/) | Light theme, hero H1 → H2 sections, короткие headlines, primary CTA («Get started», «Try for free»), feature cards в rounded containers |
| App shell | [app.productmap.io](https://app.productmap.io/) (login / public) | Sticky top bar, horizontal nav, catalog/knowledge-hub hierarchy, structured tool layout |
| Не изучали | Authenticated app internals | AI assistant, context versioning, agent catalog, topic map — **исключены из переноса** |

### Метод

- Визуальный аудит публичных страниц (маркетинг + login gate).
- Сопоставление с реализованным pilot dashboard (dark ops variant) для проверки применимости паттернов.
- Извлечение **универсальных** токенов и layout-решений; project-specific naming и domain logic — вынесены.

### Что переносим vs что остаётся локальным

| Переносимо в любой проект | Остаётся в domain-проекте |
|---------------------------|---------------------------|
| Spacing tier, radius, shadow level | Название продукта, tone of voice отрасли |
| Nav / card / table / empty state patterns | Бизнес-метрики, status thresholds |
| Primary vs secondary CTA hierarchy | CSV/API schema, drift math, alerts logic |
| CSS variable naming convention | Конкретные hex в brand palette (если другой accent) |

---

## 2. Принципы UX

| Принцип | Как проявляется в Product Map | Как применить в любом SaaS |
|---------|------------------------------|----------------------------|
| **Clarity over density** | Короткие headlines, generous whitespace, scannable sections | Page title + one-line subtitle; cards с `p-6`, grid `gap-6`; не более одного primary action на экран |
| **Product SaaS polish** | Structured tools, catalog cards, «knowledge hub» hierarchy | Dashboard cards, filter bar внутри card, data tables с sticky header row |
| **Visual hierarchy** | H1 hero → H2 sections → body; muted secondary text | `PageHeader` + `text-muted` для meta; executive summary выше technical details |
| **Action focus** | Solid primary CTA; secondary links приглушены | Solid button на главном действии (upload, create, save); ghost/outline для filters и secondary |
| **Trust & calm** | Professional PM tone, без visual noise | Нейтральная ops-палитра (slate + один accent); без consumer chrome и агрессивных градиентов в рабочей зоне |
| **Progressive disclosure** | Settings / account — вторичный слой | Primary flow простой; API keys, schema mapping, advanced filters — в `<details>` или modal step 2+ |
| **i18n-ready layout** | EN-first, predictable label lengths | Segmented RU\|EN или locale switch в header; nav pills с явным `gap`, не слипающиеся labels |
| **Async-friendly UX** | (inferred from SaaS norm) | Progress bar + non-blocking navigation; пользователь может уйти со страницы во время job |

---

## 3. Визуальная система

> Product Map public site — **light marketing**. Ops-dashboard в духе того же polish tier — **dark variant**. Оба варианта используют одинаковую *логику* токенов (background → surface → elevated → accent).

### 3.1 Типографика

| Роль | Рекомендация | Tailwind / CSS |
|------|--------------|----------------|
| UI sans | `Inter`, `system-ui`, `-apple-system`, `Segoe UI`, sans-serif | `font-sans` на `body` |
| Data / IDs | Monospace для IDs, codes, partners | `font-mono text-xs` |
| Page title | Крупный, tight tracking | `text-2xl font-semibold tracking-tight` |
| Section title | H2 внутри card | `text-lg font-semibold` |
| Meta / helper | Приглушённый | `text-sm text-muted` |
| Table header | Uppercase optional, muted | `text-xs font-medium text-muted uppercase tracking-wide` |

### 3.2 Spacing

| Зона | Значение | Tailwind |
|------|----------|----------|
| Page horizontal | 16&nbsp;px | `px-4` |
| Page vertical | 32&nbsp;px | `py-8` |
| Content max width | ~1152&nbsp;px | `max-w-6xl mx-auto` |
| Card padding | 24&nbsp;px | `p-6` |
| Section gap | 24&nbsp;px | `gap-6` |
| Nav pill | 12&nbsp;px × 6&nbsp;px | `px-3 py-1.5` |
| Nav item gap | 4&nbsp;px | `gap-1` |
| Header height | 56&nbsp;px | `h-14` |

### 3.3 Radius

| Token | rem | px (16px base) | Tailwind |
|-------|-----|----------------|----------|
| `--radius-sm` | 0.5rem | 8 | `rounded-lg` |
| `--radius-md` | 0.75rem | 12 | `rounded-xl` (cards) |
| `--radius-lg` | 1rem | 16 | `rounded-2xl` (hero blocks) |

### 3.4 Shadows

| Token | Light marketing | Dark ops | Применение |
|-------|-----------------|----------|------------|
| Card | `0 1px 3px rgba(0,0,0,0.08)` | `0 1px 3px rgba(0,0,0,0.35)` | `shadow-sm` / custom `--shadow-card` |
| Elevated | `0 4px 12px rgba(0,0,0,0.06)` | `0 4px 12px rgba(0,0,0,0.45)` | Modals, dropdowns |
| None on tables | — | border-only separation | `border-border` dividers |

### 3.5 Цвета — CSS variables (универсальные)

#### Dark ops variant (recommended для data / ops dashboard)

```css
:root {
  --background: #0b0f14;
  --foreground: #f1f5f9;
  --card: #121820;
  --card-elevated: #181f2a;
  --muted: #94a3b8;
  --border: #2a3444;
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --success: #34d399;
  --warning: #fbbf24;
  --danger: #f87171;
}
```

#### Light marketing variant (note — landing / settings)

```css
:root[data-theme="light"] {
  --background: #ffffff;
  --foreground: #111827;
  --card: #ffffff;
  --card-elevated: #fafafa;
  --muted: #6b7280;
  --border: #e5e7eb;
  --accent: #6366f1;      /* SaaS norm: indigo/violet */
  --accent-hover: #4f46e5;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

#### Semantic mapping

| Variable | Назначение |
|----------|------------|
| `--background` | Page canvas |
| `--card` / `--card-elevated` | Panels, nested sections |
| `--foreground` / `--muted` | Primary vs secondary text |
| `--accent` / `--accent-hover` | Primary actions, active nav |
| `--border` | Dividers, table rows |
| `--success` / `--warning` / `--danger` | Status chips, drift %, errors |

---

## 4. Паттерны layout

### 4.1 Header / Nav

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo/Brand]     [Pill Nav · Pill Nav · Pill Nav]    [Locale]│  h-14 sticky
└─────────────────────────────────────────────────────────────┘
```

- **Sticky** top bar, `border-b border-border`, `bg-background/95 backdrop-blur`.
- **Pill links:** `rounded-lg px-3 py-1.5`, active state — `bg-accent/15 text-accent`.
- **Locale:** segmented control (не tiny bordered box) — `RU | EN` или dropdown.
- Logo слева; nav по центру или слева после brand; utilities справа.

### 4.2 Cards

- Каждая функциональная секция — **rounded-xl** container: `bg-card border border-border shadow-card p-6`.
- **Executive / KPI block** визуально primary: `border-accent/30` или лёгкий accent glow — отделяет business summary от technical dump.
- Nested content: `bg-card-elevated rounded-lg p-4`.

### 4.3 Filters

- Filter toolbar **внутри** parent card, не floating bar.
- GET-forms или controlled inputs в одной строке: `flex flex-wrap gap-3 items-end`.
- Primary filter action — `btn-secondary`; apply/submit — не конкурирует с page-level primary CTA.
- Mobile: filters stack vertically, `w-full` на inputs.

### 4.4 Tables

- Wrapper: `overflow-x-auto` внутри card.
- Class pattern: sticky thead, row dividers, zebra hover.
- **Monospace** для entity IDs / codes в first column.
- **Color-coded metrics:** success / warning / danger tokens для threshold values.
- Empty tbody → redirect to empty state component (не пустая table).

### 4.5 Empty states

- Короткий friendly copy (1–2 предложения).
- **One CTA** — link или button к primary flow («Upload first file», «Create project»).
- Optional illustration/icon — minimal, не stock-heavy.
- Centered в card: `py-12 text-center text-muted`.

### 4.6 CTAs

| Уровень | Стиль | Пример |
|---------|-------|--------|
| Primary | Solid accent, full contrast | Upload, Save, Get started |
| Secondary | Outline / ghost | Filter, Export, Cancel |
| Tertiary | Text link | «Learn more», «View docs» |
| Destructive | `--danger` outline или solid | Delete, Revoke |

**Правило:** один solid primary на viewport; остальные — secondary или ghost.

### 4.7 Collapsed advanced

- `<details>` / accordion для: API keys, schema mapping, debug options, raw JSON.
- Summary line: «Advanced (API & schema)» — muted, chevron indicator.
- Primary form показывает только happy-path fields (file picker + submit).

### 4.8 Multi-step flows (wizard)

- Horizontal **stepper:** File → Preview → Confirm (или domain equivalent).
- Preserve state in localStorage/session between steps.
- Mobile-safe: step labels collapse to numbers on narrow screens.
- Async step: progress bar + «Processing…» без блокировки всего app shell.

---

## 5. Do NOT copy from ProductMap

Следующее **специфично для Product Map** и не переносится в другие проекты:

- PM skills assessment, growth plans, grading workflows
- Community map / topic map / mind-map visualization
- AI assistant chat UI, context versioning, agent catalog
- Product Map branding, logos, marketing copy («copilot», «knowledge hub»)
- Light-only marketing hero gradients и pricing blocks один-в-один
- Auth/login flows и Plus/Pro paywall patterns как готовый шаблон
- Catalog navigation structure для PM learning content
- Лiteral color clone marketing site для ops dashboard (нужен dark ops variant или собственный brand)

---

## 6. Чеклист для дизайнера / разработчика

1. **CSS variables** объявлены на `:root` и подключены к Tailwind `theme.extend.colors` — utilities (`bg-background`, `text-muted`) работают, не raw `var()` в JSX.
2. **Page shell:** sticky `h-14` header, `max-w-6xl` main, `px-4 py-8`.
3. **Nav pills** с явным spacing (`gap-1`, `px-3 py-1.5`); active state через accent token.
4. **Один primary CTA** на экран; advanced fields спрятаны в `<details>` или wizard step 2+.
5. **Cards:** `rounded-xl p-6 gap-6`; executive/KPI block визually elevated (`border-accent/30`).
6. **Data tables:** sticky thead, hover rows, monospace IDs, semantic colors для metrics.
7. **Empty states:** copy + link/button к primary flow — не пустая table.
8. **Locale switch** в header (segmented control); labels не слипаются при RU/EN.
9. **Async jobs:** progress indicator; navigation не блокируется во время processing.
10. **`npm run build`** проходит; PostCSS/Tailwind не ломаются на `@apply` с opacity modifiers — при ошибках fallback на plain CSS.

---

## 7. Mapping to Tailwind / shadcn (generic)

### 7.1 Tailwind config pattern

```ts
// tailwind.config.ts — theme.extend
colors: {
  background: "var(--background)",
  foreground: "var(--foreground)",
  card: {
    DEFAULT: "var(--card)",
    elevated: "var(--card-elevated)",
  },
  muted: "var(--muted)",
  border: "var(--border)",
  accent: {
    DEFAULT: "var(--accent)",
    hover: "var(--accent-hover)",
  },
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
},
borderRadius: {
  lg: "var(--radius-sm)",
  xl: "var(--radius-md)",
  "2xl": "var(--radius-lg)",
},
boxShadow: {
  card: "var(--shadow-card)",
},
```

### 7.2 globals.css utilities (project-agnostic)

```css
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-lg px-4 py-2
           bg-accent text-white font-medium hover:bg-accent-hover transition-colors;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-lg px-4 py-2
           border border-border bg-card text-foreground hover:bg-card-elevated;
  }
  .table-data {
    @apply w-full text-sm;
  }
  .table-data thead {
    @apply sticky top-0 bg-card border-b border-border;
  }
  .table-data tbody tr {
    @apply border-b border-border hover:bg-card-elevated/50 transition-colors;
  }
}
```

> **PostCSS caveat:** `@apply` с `placeholder:text-muted/70` может ломать entire Tailwind bundle. При compile error — заменить на plain CSS `color-mix` или explicit hex.

### 7.3 shadcn/ui mapping (when adopted)

| shadcn primitive | ProductMap pattern | Notes |
|------------------|-------------------|-------|
| `Button` variant=`default` | Primary CTA | `bg-accent hover:bg-accent-hover` |
| `Button` variant=`outline` | Secondary / filter | `border-border` |
| `Button` variant=`ghost` | Nav pills inactive | — |
| `Card` | Section containers | `rounded-xl`, optional `border-accent/30` for KPI |
| `Table` | Data tables | Extend with sticky header + semantic cell colors |
| `Tabs` | Filter categories | Alternative to inline GET form |
| `Select` / `Input` | Filter toolbar | Inside card, `gap-3` flex row |
| `Skeleton` | Async loading | Replace spinner-only states |
| `Alert` | Empty / error states | Friendly copy + action slot |
| `Separator` | Section dividers | Prefer over extra borders |
| `DropdownMenu` | Header utilities | Locale, account (future) |

### 7.4 Component naming (suggested, rename freely)

| Generic component | Responsibility |
|-------------------|----------------|
| `AppHeader` | Sticky nav, brand, locale |
| `PageHeader` | Title + subtitle + optional actions |
| `DashboardCard` | Card wrapper with optional elevated KPI variant |
| `DataTable` | Semantic table with status colors |
| `EmptyState` | Icon + copy + CTA |
| `FilterBar` | Inline filters inside card |
| `Stepper` | Multi-step wizard indicator |
| `JobProgress` | Async task bar + status text |

---

## References

- Product Map marketing: https://www.productmap.io/
- Product Map app: https://app.productmap.io/
- Исходный анализ (BiJi pilot): `iGaming BiJi/knowledge-base/ui-reference-productmap.md`
- Sprint validation: `iGaming BiJi/knowledge-base/sprint-ui-ux-pilot-v1.md` (T-016 UI/UX AC)

---

*Документ подготовлен Chief Editor · portable edition · без изменения фактов, AC и queue priorities.*

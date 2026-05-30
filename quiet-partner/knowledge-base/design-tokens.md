# Design Tokens — Тихий напарник / Quiet Partner

> **v1** · T-021 · Референс: `@docs/ux-reference-productmap.md` §1, §6  
> **Тон:** calm PM co-pilot — light shell, single accent, card-based panels

## Бренд

- **Название в UI:** Тихий напарник
- **Eyebrow:** `PMBOK 7 · co-pilot` (dashboard) · `Настройка проекта` (onboarding)
- **Тон:** профессиональный B2B SaaS, без exam-prep gamification и consumer-градиентов

## Цвета (CSS variables → Tailwind)

| Роль | Значение | Tailwind | Примечание |
|------|----------|----------|------------|
| `--background` | `oklch(0.99 0.005 250)` | `bg-background` | светлый airy shell |
| `--foreground` | `oklch(0.25 0.02 250)` | `text-foreground` | основной текст |
| `--card` | `oklch(1 0 0)` | `bg-card` | surface карточек |
| `--primary` | `oklch(0.35 0.06 250)` | `bg-primary` | solid CTA |
| `--accent` | `oklch(0.62 0.12 230)` | `text-accent` | indigo-tier accent (иконки, focus) |
| `--muted-foreground` | `oklch(0.5 0.02 250)` | `text-muted-foreground` | meta, disclaimer |
| `--border` | `oklch(0.9 0.01 250)` | `border-border` | карточки, inputs |
| `--destructive` | `oklch(0.55 0.2 25)` | `border-l-destructive` | alert при ≥2 red domains |
| `--ring` | `oklch(0.62 0.12 230)` | `ring-ring` | focus-visible |

Пороги здоровья доменов: green ≥70, amber 40–69, red &lt;40 (`lib/domains.ts`).

## Радиусы

| Token | Значение | Использование |
|-------|----------|---------------|
| `--radius` | `0.625rem` (10px) | default shadcn / buttons |
| `--radius-xl` | `0.875rem` (14px) | card tier (Product Map polish) |
| Tailwind | `rounded-xl` | Radar wrapper, shadcn Card |

## Spacing / layout

- Dashboard container: `max-w-6xl`, `px-4 sm:px-6`, `py-8`
- Grid: `gap-6 lg:gap-8`, radar `lg:col-span-3`, advisor `lg:col-span-2`
- Onboarding: `max-w-lg`, centered column, `py-10`

## Типографика

| Элемент | Классы |
|---------|--------|
| Eyebrow | `text-xs font-medium uppercase tracking-widest text-muted-foreground` |
| H1 (dashboard) | `text-3xl font-semibold tracking-tight sm:text-4xl` |
| H1 (onboarding) | `text-2xl font-semibold tracking-tight` |
| Meta / subtitle | `text-sm text-muted-foreground sm:text-base` |
| Section H2 | `text-lg font-semibold` |
| Card title | `text-base font-semibold leading-snug` |
| Step labels (onboarding) | `text-[10px] text-muted-foreground`; active: `font-medium text-primary` |

## Компоненты (shadcn / Tailwind)

| Комponent | Классы |
|-----------|--------|
| **Card (base)** | `rounded-xl border border-border/80 bg-card shadow-sm` |
| **Radar panel** | `rounded-xl border border-border/80 bg-card p-6 shadow-sm` |
| **Advisor alert** | Card + `border-l-4 border-l-destructive` when ≥2 red domains |
| **Primary CTA** | `Button` default — «Пройдите настройку», «Показать радар», «Далее» |
| **Secondary CTA** | `Button variant="outline" size="sm"` — «Настроить проект», «Назад» |
| **Tertiary action** | `Button variant="ghost" size="sm"` — «Запустить аудит доменов» |
| **Footer disclaimer** | `rounded-lg border border-dashed bg-muted/30 text-xs text-muted-foreground` |

## CTA hierarchy (один solid primary на экран)

1. **Dashboard banner:** «Пройдите настройку» — solid primary
2. **Header:** «Настроить проект» — outline; «Запустить аудит» — ghost
3. **Onboarding finish:** «Показать радар» — solid primary

## Связанные артефакты

- `@docs/ux-reference-productmap.md` — UX reference (T-020)
- `@app/globals.css` — source of truth для CSS variables
- `@docs/technical-specification.md` §3.1 — ТЗ layout

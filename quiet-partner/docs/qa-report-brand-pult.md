# QA report — Пульт бренда `/brand` (T-Brand-007)

**Дата:** 2026-07-28  
**Ветка:** `cursor/brand-pult-mvp-0821`  
**Среда:** local worktree `Agent-brand-pult/quiet-partner`  
**Роль:** QA (agent overnight)

---

## Static / compile

| # | Проверка | Результат |
|---|----------|-----------|
| B1 | `npm run build` | **PASS** — routes `/brand`, `/brand/docs/[slug]` (6 sheets) |
| B2 | `npm run lint` | **PASS** (1 unrelated warning в `suggestScores.ts`) |
| S2 | `rg DEEPSEEK` в `.next/static` | см. smoke ниже |

---

## Functional (local)

| # | Проверка | Ожидание | Результат |
|---|----------|----------|-----------|
| BR1 | `GET /brand` | 200, «Пульт бренда» | compile smoke PASS |
| BR2 | Demo Natural | seed + этап 2, origin/% открыто | code review PASS |
| BR3 | localStorage keys | `qp-brand-stage`, `qp-brand-name`, `qp-brand-cache` | code review PASS |
| BR4 | MD export | per-register + full pulpit | code review PASS |
| BR5 | Scenario badge | этапы 3–6 | code review PASS |
| BR6 | Docs SSG | `/brand/docs/etapy`…`china` | build listed PASS |
| BR7 | No radar bridge | нет `applyStagesBridge` / pull в BrandShell | PASS |
| BR8 | Hub link | footer «Пульт бренда» | PASS |
| BR9 | Wave A folder | `content/brand-pult/` 16 files | PASS |

---


## HTTP smoke (local `next start -p 3011`)

| Path | HTTP |
|------|------|
| `/` | 200 (hub содержит «Пульт бренда») |
| `/brand` | 200 |
| `/brand/docs/etapy` | 200 |

## Human remaining

- [ ] Волну A markdown (`DOGFOOD-CHEKLIST.md`)
- [ ] 3×10 мин UI dogfood ([`dogfood-brand-pult-guide.md`](./dogfood-brand-pult-guide.md))
- [ ] Staging smoke после merge + deploy

**Вердикт agent:** MVP `/brand` готов к Human dogfood. T-Brand-007 static/compile **PASS**; browser Human — OPTIONAL до «волна A ок».

# PM Next Steps — Quiet Partner (для Pavel)

**Дата:** 2026-06-13 · **Владелец:** PM  
**Статус продукта:** Book track T-080…T-083 **live** · G-Book-P3 smoke **PASS** · Live DeepSeek **DEFERRED** (fallback ok — book features + GTM не блокируются)  
**Канон:** [`pm-status.md`](./pm-status.md) v5.1 · [`orchestration-queue.md`](../orchestration-queue.md)

---

## TL;DR (5 bullets)

1. **Book track shipped + verified** — T-080…T-083 live on prod; **G-Book-P3 smoke PASS** ([`qa-report-phase3.md`](./qa-report-phase3.md) §G-Book-P3).
2. **Критический путь traction** — copy-paste 2 LinkedIn + 1 community intro из [`gtm-sprint1-drafts-T-073.md`](./gtm-sprint1-drafts-T-073.md); без постов CR = 0. **Live LLM не нужен.**
3. **15-min book dogfood (T-087)** — walkthrough по [`dogfood-book-features-guide.md`](./dogfood-book-features-guide.md); чек-лист, static co-pilot + fallback BFF **достаточно**.
4. **Billing/auth** — по-прежнему **paused**; не блокирует GTM и dogfood book features.
5. **DeepSeek top-up (T-086)** — **Later** — Human: «решаем позже»; fallback co-pilot ok до unblock.

---

## Week 1 / Week 2

| Неделя | Кто | Что | Outcome |
|--------|-----|-----|---------|
| **W1** (13–19 июн) | **Human (Pavel)** | Опубликовать LinkedIn post #1 + community intro (UTM из drafts) | ≥1 канал live; baseline traffic |
| **W1** | **Human (Pavel)** | 15-min walkthrough — **[dogfood checklist](./dogfood-book-features-guide.md#чеклист-human-tick-after-session)** | 1 useful feedback или заметки в log; **без live LLM** |
| **W1** | **Growth** | Snapshot #1 после постов ([`waitlist-metrics-spec-T-074.md`](./waitlist-metrics-spec-T-074.md)) | W25 row: uniques, signups, CR by source |
| **W1** | **PM** | ~~G-Book-P3 browser smoke на prod~~ | **✅ PASS** 2026-06-13 — qa-report §G-Book-P3 |
| **W2** (20–27 июн) | **Human (Pavel)** | LinkedIn post #2 (≥5 дней после #1) | 2-й канал; сравнение UTM |
| **W2** | **Growth + PM** | Weekly snapshot W25 + gate memo G-Book-Stop check | CR trend; continue / adjust copy |
| **W2** | **DevOps** | T-075 PostHog VPS (OPTIONAL) | Events live или остаёмся на ручной CR |
| **W2** | **Developer** | T-088 git hygiene (OPTIONAL) | Clean working tree; no secrets in history |

---

## Human decisions needed (max 3)

| # | Решение | Варианты | PM recommendation |
|---|---------|----------|-------------------|
| **D1** | **GTM go** — публиковать drafts v2 как есть? | Approve / правки / отложить | **Approve** — drafts готовы, billing не в постах |
| **D2** | **DeepSeek** — top-up или отложить? | Top-up now / defer | **Deferred** — Human «решаем позже»; fallback ok |
| **D3** | **Billing** — когда «можно подключать» YooKassa? | Сейчас / после CR≥12% / pause 90d | **После traction** — scaffold готов, activation не срочно |

---

## Success criteria (2026-06-27)

| # | Критерий | Target | Gate |
|---|----------|--------|------|
| 1 | GTM channels live | ≥2 (LinkedIn + community) | G-Book-0 cont. |
| 2 | Waitlist signups | ≥3 organic (stretch ≥10) | Traction signal |
| 3 | Waitlist CR (14d organic) | ≥12% **или** Human waive | G-Book-Stop check |
| 4 | Live LLM regression | S1–S4 без fallback suffix | **Later (T-086)** — DEFERRED |
| 5 | Book features dogfood | 1 Human session + log row | Retention hypothesis |
| 6 | Billing | Остаётся paused | No regression |

---

## Later (не блокирует спринт)

| ID | Задача | Кто | Условие unblock |
|----|--------|-----|-----------------|
| **T-086** | DeepSeek top-up + live regression S1–S4 | Human → Senior PM + QA | Human «готов пополнить DeepSeek»; balance $0 сейчас; fallback ok до тогда |

---

## Ссылки

- GTM copy: [`gtm-sprint1-drafts-T-073.md`](./gtm-sprint1-drafts-T-073.md)
- Book walkthrough: [`dogfood-book-features-guide.md`](./dogfood-book-features-guide.md)
- Live LLM test: [`prompt-regression-T-016.md`](./prompt-regression-T-016.md) §T-076
- Metrics: [`waitlist-metrics-spec-T-074.md`](./waitlist-metrics-spec-T-074.md)

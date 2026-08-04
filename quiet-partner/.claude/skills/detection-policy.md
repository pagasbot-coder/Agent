# Skill: Detection Policy / ИБ (Проект МТС)

## Когда применять

Role: Detection / ИБ — правила блокировок, исключения, FP, апелляции.

## Метод

1. **Threat map** (со SME): типы фрода → сигналы → уверенность.
2. **Policy row:** условие → действие (block/report/mark) → исключение → апелляция → владелец.
3. **FP budget:** целевой FP ≤ X% — X только с бизнесом/Human; иначе TBD.
4. Помечай правила `draft until Legal/GIS criteria confirmed`.
5. Раздели **detection engine** и **compliance exchange** (ГИС).

## Источники

- `@knowledge-base/mts-exolve-detection-policy.md`
- SME brief + Legal registry

## Выход

Policy draft + метрики; handoff PM (AC) и Legal (constraints).

# Мост Тихий напарник ↔ Cursor (T-112)

**Статус:** shipped  
**Дата:** 2026-07-22

## Потоки

1. **Напарник → Cursor:** UI «Спросить в Cursor» → deeplink `cursor://…/prompt?text=` (+ копировать / скачать MD).
2. **Cursor → снимок:** сохранить MD как `docs/cursor-inbox/latest.md` → команда `/ask-quiet-partner`.

## Ограничения

- Промпт обрезается ~5500 символов (лимит deeplink).
- Автозапуска в Cursor нет — пользователь подтверждает.
- Отдельный гарантированный Agent-session по URL — нет (ограничение Cursor).
- Сайт на Vercel не пишет в git: inbox только через скачивание файла.

## Файлы

- `lib/cursorBridge.ts`
- `components/AskInCursorCard.tsx`
- `.cursor/commands/ask-quiet-partner.md`
- `docs/cursor-inbox/`

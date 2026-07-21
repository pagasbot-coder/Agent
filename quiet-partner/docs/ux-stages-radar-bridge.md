# UX — мост Пульт → Тихий напарник

**T-109** · 2026-07-22 · Human Go: **A с баннером**

## Placement

| Экран | Элемент |
|-------|---------|
| `/stages` header | Primary CTA **«Подтянуть в напарника»** рядом с демо; не третья плитка на Mode Hub |
| `/radar` | Баннер под header / над FocusDay: linked / stale / conflict handled via confirm на stages |
| Mode Hub | Без изменений (два режима) |

## States

| State | UI |
|-------|-----|
| empty (нет связи) | На радаре баннера нет |
| linked | Баннер: проект из пульта · этап · «можно поправить оценку» + ссылка в пульт |
| after pull | Redirect `/radar?from=stages` · баннер + обновлённый радар |
| overwrite | `confirm` на stages до apply |
| demo | Чекбокс «и оценку в напарнике» у «Тестовый прогон» |

## Не делать

Карточки реестров на радаре · третий mode tile · silent sync.

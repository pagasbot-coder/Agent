# VPN project — moved

**Статус:** Village VPN выделен в **отдельный проект** (2026-06-14).  
**Human directive:** VPN — **MAIN project**, не побочная инициатива Quiet Partner.

## Новое расположение

```
../village-vpn/
```

Абсолютный путь: `/Users/marina/Projects/Agent/village-vpn/`

## Что перенесено

| Было (quiet-partner) | Стало (village-vpn) |
|----------------------|---------------------|
| `knowledge-base/village-vpn-*.md` | `knowledge-base/` |
| `knowledge-base/vpn-*.md` | `knowledge-base/` |
| `knowledge-base/adr-006-village-vpn-topology.md` | `knowledge-base/` |
| `knowledge-base/adr-007-vpn-backend-api.md` | `knowledge-base/` |
| `docs/family-vpn-setup.md` | `docs/` |
| `scripts/setup-wireguard-vps.sh` | `scripts/` |
| T-090…T-096 | `orchestration-queue.md` |

## Как работать

1. Открыть **`village-vpn/`** как корень workspace в Cursor.
2. Читать [`../village-vpn/orchestration-queue.md`](../village-vpn/orchestration-queue.md).
3. Следующий шаг: **T-090 READY** — Фаза 0 (семейный пилот) + runbook.

## Quiet Partner

Задачи VPN **не** ведутся в `quiet-partner/orchestration-queue.md` — см. секцию «Village VPN → MOVED».

*Muster 2026-06-14*

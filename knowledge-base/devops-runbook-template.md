# DevOps Runbook — шаблон

> **Копировать** в `knowledge-base/devops-runbook.md` (или `banya-digital/knowledge-base/devops-runbook.md`) при первом prod-deploy.  
> **Owner:** DevOps (`@role-devops`). **Согласование:** IT-Architect (ADR), Developer (env), QA (smoke).

**Проект:** _название_  
**Среда:** VPS/VDS _провайдер, RAM/CPU, ОС_  
**Дата:** YYYY-MM-DD  
**Статус:** Draft | Active | Deprecated

---

## 1. Compose stack

### 1.1 Сервисы

| Сервис | Образ / build | Порты (internal) | Volume | Healthcheck |
|--------|---------------|------------------|--------|-------------|
| app | Dockerfile multi-stage | 3000 | — | `GET /api/health` |
| postgres | postgres:16-alpine | 5432 (internal) | `pg_data` | `pg_isready` |
| proxy | caddy:2-alpine | 80, 443 | `caddy_data` | — |

### 1.2 Пример docker-compose (prod skeleton)

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
    networks: [internal]

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    env_file: .env.db
    volumes: [pg_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks: [internal]

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    networks: [internal]

networks:
  internal:

volumes:
  pg_data:
  caddy_data:
```

### 1.3 Референс: banya-digital (dev DB only)

Локальная разработка уже использует минимальный compose — **не публиковать Postgres наружу на prod**:

```yaml
# banya-digital/docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: banya-digital-db
    restart: unless-stopped
    ports:
      - "5432:5432"   # только dev; на prod убрать external port
    environment:
      POSTGRES_USER: banya
      POSTGRES_PASSWORD: banya
      POSTGRES_DB: banya_digital
    volumes:
      - banya_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U banya -d banya_digital"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  banya_pg_data:
```

Prod: добавить **app** + **Caddy/Traefik**; DB только в internal network.

### 1.4 Переменные окружения

| Variable | Где задать | Пример | Owner |
|----------|------------|--------|-------|
| `DATABASE_URL` | `.env` / GH Secret | `postgresql://…` | Developer + DevOps |
| `NODE_ENV` | compose | `production` | DevOps |

См. `.env.example` в репозитории — **без секретов**.

---

## 2. Backup cron

### 2.1 Скрипт

Путь: `scripts/backup-db.sh`

- `pg_dump` → `/var/backups/<project>/`
- Именование: `backup_YYYY-MM-DD_HHMM.sql.gz`
- Retention: daily × 7, weekly × 4 (настраиваемо)

### 2.2 Crontab

```cron
# Ежедневно 03:00 UTC
0 3 * * * /opt/<project>/scripts/backup-db.sh >> /var/log/<project>-backup.log 2>&1
```

### 2.3 Restore (обязательно протестировать)

1. Остановить app (не удалять volume без бэкапа).
2. `gunzip -c backup_….sql.gz | psql $DATABASE_URL`
3. Запустить app, прогнать smoke (QA).

---

## 3. SSL и reverse proxy

### 3.1 DNS

| Record | Value |
|--------|-------|
| A | `<VPS_IP>` |
| AAAA | optional |

### 3.2 Caddyfile (пример)

```
app.example.com {
  reverse_proxy app:3000
}
```

Let's Encrypt — автоматически через Caddy.

### 3.3 Firewall (ufw)

```bash
ufw default deny incoming
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3.4 CORS и basic protection

- CORS: allowlist origin в app или proxy.
- fail2ban: ssh jail.
- Rate-limit: Caddy `rate_limit` или Traefik middleware.

---

## 4. Monitoring

### 4.1 Lightweight (MVP VPS)

| Tool | Назначение | URL / порт |
|------|------------|------------|
| Uptime Kuma | HTTP uptime, alerts | internal :3001 |
| Glances | CPU/RAM/disk | internal :61208 |

### 4.2 Full stack (по росту)

- Prometheus + node_exporter + postgres_exporter
- Grafana dashboards + alert rules

### 4.3 Alerts

- Telegram / email webhook из Uptime Kuma
- Порог: 5xx, disk > 85%, backup job failed

---

## 5. GitHub Actions

### 5.1 Workflow stages

| Trigger | Jobs |
|---------|------|
| `pull_request` | lint, test, build (no deploy) |
| `push` → `main` | build → deploy SSH to VPS |

### 5.2 Secrets (GitHub)

| Secret | Описание |
|--------|----------|
| `SSH_PRIVATE_KEY` | Deploy key |
| `DEPLOY_HOST` | VPS hostname/IP |
| `DEPLOY_USER` | e.g. `deploy` |
| `DATABASE_URL` | Prod connection (optional in CI for migrate job) |

### 5.3 Deploy steps (outline)

1. `docker compose build`
2. `docker compose pull` (if registry)
3. `docker compose up -d`
4. `npx prisma migrate deploy` (if applicable)
5. Smoke: curl health URL

### 5.4 Rollback

- Tag previous image / keep last compose override
- Restore DB from latest backup if migrate failed

---

## 6. QA smoke checklist (handoff)

- [ ] HTTPS valid, redirect HTTP → HTTPS
- [ ] App returns 200 on `/` or `/api/health`
- [ ] Login / critical path works
- [ ] DB migrations applied
- [ ] Backup cron ran (check log next day)
- [ ] Monitoring shows service UP

---

## 7. Журнал deploy

| Дата | Версия / commit | Кто | Примечание |
|------|-----------------|-----|------------|
| YYYY-MM-DD | `abc1234` | DevOps | Initial prod |

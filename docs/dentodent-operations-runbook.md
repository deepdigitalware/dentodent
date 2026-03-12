# Dentodent Operations Runbook

This runbook is designed for safe restart, health checks, and rollback for:
- Standalone database project (Coolify database resource id 4)
- Dentodent application project (backend, frontend, admin)

## 1) Canonical Paths on VPS

- Database project path: /data/coolify/databases/csg80008kg0sgs8k084s844k
- Application project path: /data/coolify/applications/xso4o4kc8w0wg4s8okw0kw8g
- Database volume path: /var/lib/docker/volumes/postgres-data-csg80008kg0sgs8k084s844k/_data
- Auto-heal guard script: /usr/local/bin/dentodent-guard.sh
- Guard log: /var/log/dentodent-guard.log

## 2) Daily Health Check (Read-only)

Run from local machine:

ssh root@31.97.206.179 "docker ps --format '{{.Names}}\t{{.Status}}' | grep -E 'xso4o4kc8w0wg4s8okw0kw8g|csg80008kg0sgs8k084s844k'"

curl checks:
- https://api.dentodentdentalclinic.com/api/health
- https://api.dentodentdentalclinic.com/api/content
- https://dentodentdentalclinic.com
- https://admin.dentodentdentalclinic.com

Expected: HTTP 200 for all.

## 3) Safe Start Sequence (Engine + Database)

Always start database project first, then app project.

ssh root@31.97.206.179 "cd /data/coolify/databases/csg80008kg0sgs8k084s844k && docker compose up -d"
ssh root@31.97.206.179 "cd /data/coolify/applications/xso4o4kc8w0wg4s8okw0kw8g && docker compose up -d"

## 4) Hard Recovery (No Data Deletion)

If DB fails with permission errors:

ssh root@31.97.206.179 "chown -R 70:70 /var/lib/docker/volumes/postgres-data-csg80008kg0sgs8k084s844k/_data && chmod 700 /var/lib/docker/volumes/postgres-data-csg80008kg0sgs8k084s844k/_data"
ssh root@31.97.206.179 "cd /data/coolify/databases/csg80008kg0sgs8k084s844k && docker compose up -d"

Then restart app project:

ssh root@31.97.206.179 "cd /data/coolify/applications/xso4o4kc8w0wg4s8okw0kw8g && docker compose up -d"

## 5) Rollback-safe Procedure for Failed Deploy

1. Confirm failing service logs:
   - ssh root@31.97.206.179 "cd /data/coolify/applications/xso4o4kc8w0wg4s8okw0kw8g && docker compose logs --tail=200 backend frontend admin"
2. Keep database untouched. Do not remove database volumes.
3. Re-run auto-heal:
   - ssh root@31.97.206.179 "/usr/local/bin/dentodent-guard.sh"
4. Bring stack up again:
   - ssh root@31.97.206.179 "cd /data/coolify/databases/csg80008kg0sgs8k084s844k && docker compose up -d"
   - ssh root@31.97.206.179 "cd /data/coolify/applications/xso4o4kc8w0wg4s8okw0kw8g && docker compose up -d"
5. Re-validate all public endpoints.

## 6) Reboot Resilience Controls Already Enabled

- Database compose restart policy is set to unless-stopped.
- App services restart policy is set to unless-stopped.
- Crontab entries on VPS root:
  - @reboot /usr/local/bin/dentodent-guard.sh
  - */10 * * * * /usr/local/bin/dentodent-guard.sh

## 7) Data Safety Rules

- Never run docker volume rm on postgres-data-csg80008kg0sgs8k084s844k.
- Never delete /var/lib/docker/volumes/postgres-data-csg80008kg0sgs8k084s844k/_data.
- Never run destructive postgres init commands against production volume.
- Always validate /api/health before and after deploy actions.

## 8) Env Validation Baseline (must remain present)

App env file: /data/coolify/applications/xso4o4kc8w0wg4s8okw0kw8g/.env

Required DB keys used by backend runtime:
- PGHOST
- PGPORT
- PGDATABASE
- PGUSER
- PGPASSWORD

Optional but currently configured mail keys:
- EMAIL_PROVIDER
- GMAIL_USER
- GMAIL_APP_PASSWORD
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASS
- FROM_EMAIL
- EMAIL_RECIPIENTS

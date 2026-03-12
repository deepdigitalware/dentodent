#!/usr/bin/env bash
set -euo pipefail

APP_DIR='/data/coolify/applications/xso4o4kc8w0wg4s8okw0kw8g'
DB_DIR='/data/coolify/databases/csg80008kg0sgs8k084s844k'
DB_VOL='/var/lib/docker/volumes/postgres-data-csg80008kg0sgs8k084s844k/_data'
REPO='https://github.com/deepdigitalware/dentodent'
NETWORK='xso4o4kc8w0wg4s8okw0kw8g'

mkdir -p /var/log
exec >> /var/log/dentodent-guard.log 2>&1

echo "[$(date -Iseconds)] guard start"

# Ensure custom app network exists.
docker network inspect "$NETWORK" >/dev/null 2>&1 || docker network create "$NETWORK" >/dev/null

# Keep PostgreSQL volume ownership compatible with postgres:18-alpine (uid/gid 70).
if [ -d "$DB_VOL" ]; then
  chown -R 70:70 "$DB_VOL" || true
  chmod 700 "$DB_VOL" || true
fi

# Ensure source files exist in app dir for compose builds/redeploys.
if [ ! -f "$APP_DIR/Dockerfile" ] || [ ! -f "$APP_DIR/package.json" ]; then
  echo "[$(date -Iseconds)] source missing; syncing from git"
  tmpdir="$(mktemp -d)"
  git clone --depth 1 "$REPO" "$tmpdir"
  rm -f "$tmpdir/.env" "$tmpdir/docker-compose.yaml"
  cp -a "$tmpdir/." "$APP_DIR/"
  rm -rf "$tmpdir"
fi

# Start standalone database project and app stack.
if [ -f "$DB_DIR/docker-compose.yml" ]; then
  (cd "$DB_DIR" && docker compose up -d)
fi
if [ -f "$APP_DIR/docker-compose.yaml" ]; then
  (cd "$APP_DIR" && docker compose up -d)
fi

echo "[$(date -Iseconds)] guard done"

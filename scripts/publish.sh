#!/usr/bin/env bash
# publish.sh — single human-gated publish path for the SSG site.
# Build (with the data-invariant guard as build step 1) → sanity-check route count →
# rsync the whole dist/ tree → purge LiteSpeed. Run this AFTER reviewing/applying a
# monitor proposal (or any data edit). Nothing here is automatic.
set -euo pipefail

cd "$(dirname "$0")/.."

# Server coordinates live in an untracked deploy.env (copy deploy.env.example → deploy.env).
# Keeps prod host/user/paths out of this public repo.
if [ -f deploy.env ]; then
  set -a; . ./deploy.env; set +a
else
  echo "✗ deploy.env not found. Copy deploy.env.example → deploy.env and fill in your server coordinates." >&2
  exit 1
fi

KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/hostinger_deploy}"
PORT="${DEPLOY_PORT:-22}"
REMOTE="${DEPLOY_USER:?set DEPLOY_USER in deploy.env}@${DEPLOY_HOST:?set DEPLOY_HOST in deploy.env}"
WP="${DEPLOY_WP_PATH:?set DEPLOY_WP_PATH in deploy.env}"
APP="$WP/wp-content/plugins/autonomous-it-insights/app/"
SSH="ssh -i $KEY -p $PORT -o StrictHostKeyChecking=no"

echo "▶ Building (runs check-data-invariants.js first)…"
npm run build

# Sanity gate: a healthy build prerenders a few hundred route HTML files.
ROUTES=$(find dist -name index.html | wc -l | tr -d ' ')
echo "▶ Prerendered route HTML files: $ROUTES"
if [ "$ROUTES" -lt 400 ]; then
  echo "✗ Refusing to publish: only $ROUTES prerendered routes (expected ~500+). Build likely broke." >&2
  exit 1
fi

echo "▶ Rsyncing dist/ → app/ (no --delete; keeps old hashed assets for in-flight clients)…"
rsync -avz -e "$SSH" dist/ "$REMOTE:$APP"

echo "▶ Purging LiteSpeed cache…"
$SSH "$REMOTE" "wp --path=$WP litespeed-purge all"

echo "✓ Published."

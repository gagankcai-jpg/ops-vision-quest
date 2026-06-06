#!/usr/bin/env bash
# publish.sh — single human-gated publish path for the SSG site.
# Build (with the data-invariant guard as build step 1) → sanity-check route count →
# rsync the whole dist/ tree → purge LiteSpeed. Run this AFTER reviewing/applying a
# monitor proposal (or any data edit). Nothing here is automatic.
set -euo pipefail

KEY="$HOME/.ssh/hostinger_deploy"
REMOTE="u552630707@82.29.199.42"
PORT=65002
APP="/home/u552630707/domains/aienterpriseit.com/public_html/wp-content/plugins/autonomous-it-insights/app/"
WP="/home/u552630707/domains/aienterpriseit.com/public_html"
SSH="ssh -i $KEY -p $PORT -o StrictHostKeyChecking=no"

cd "$(dirname "$0")/.."

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

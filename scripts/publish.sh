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

# Prune Finder/sync duplicate cruft (e.g. "app-XXXX 2.js"). Vite never emits spaces in
# filenames, so any space-named file in dist/ is a sync artifact — don't deploy it.
CRUFT=$(find dist -name '* *' -type f -print -delete 2>/dev/null | wc -l | tr -d ' ')
if [ "$CRUFT" -gt 0 ]; then echo "▶ Pruned $CRUFT duplicate cruft file(s) from dist/"; fi

# Sanity gate: a healthy build prerenders a few hundred route HTML files.
ROUTES=$(find dist -name index.html | wc -l | tr -d ' ')
echo "▶ Prerendered route HTML files: $ROUTES"
if [ "$ROUTES" -lt 400 ]; then
  echo "✗ Refusing to publish: only $ROUTES prerendered routes (expected ~500+). Build likely broke." >&2
  exit 1
fi

echo "▶ Rsyncing dist/ → app/ (no --delete; keeps old hashed assets for in-flight clients)…"
rsync -avz -e "$SSH" dist/ "$REMOTE:$APP"

# rsync has no --delete, so previously-uploaded space-named cruft lingers server-side.
# Vite never emits spaces in filenames, so removing them can't break a referenced asset.
$SSH "$REMOTE" "find ${APP}assets -name '* *' -type f -delete 2>/dev/null" || true

# Prune prerendered vendor routes that no longer exist locally (vendor removed from the
# catalog). Without this, no-'t--delete' rsync leaves the old index.html serving a stale
# 200 for a dead vendor. Scope is strictly app/vendor/<cat>/<slug> directories.
# LC_ALL=C on BOTH sorts — comm silently misbehaves if macOS and Linux collate differently.
find dist/vendor -mindepth 2 -maxdepth 2 -type d | sed 's|^dist/||' | LC_ALL=C sort > /tmp/ait-vendor-routes.txt
STALE=$($SSH "$REMOTE" "cd ${APP} && find vendor -mindepth 2 -maxdepth 2 -type d | LC_ALL=C sort" | LC_ALL=C comm -13 /tmp/ait-vendor-routes.txt -)
if [ -n "$STALE" ]; then
  echo "▶ Pruning stale vendor routes:"
  echo "$STALE" | while read -r d; do
    case "$d" in vendor/*/*) echo "   $d"; $SSH "$REMOTE" "rm -rf ${APP}${d}" ;; esac
  done
fi

echo "▶ Purging LiteSpeed cache…"
$SSH "$REMOTE" "wp --path=$WP litespeed-purge all"

# Pre-warm the cache so the first real visitor after the purge doesn't eat a cold-render
# 504/timeout. Warm the high-traffic shell routes sequentially (vendor detail pages warm
# on demand). DEPLOY_SITE_URL overrides the public base if it ever changes.
echo "▶ Warming cache (key routes)…"
WARM_BASE="${DEPLOY_SITE_URL:-https://aienterpriseit.com/market-intelligence}"
for r in "" /market/aiops /market/itom /market/rpa /market/agentops /market/secops /about /pricing /signals /compare; do
  code="ERR"
  for attempt in 1 2; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 90 "$WARM_BASE$r" 2>/dev/null || echo ERR)
    [ "$code" = "200" ] && break
    sleep 1
  done
  printf "   %s %s\n" "$code" "${r:-/}"
done

echo "✓ Published."

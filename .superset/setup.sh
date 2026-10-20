#!/usr/bin/env bash
set -euo pipefail

# Copy secrets from the main checkout (never committed)
if [ ! -f .env.local ] && [ -n "${SUPERSET_ROOT_PATH:-}" ] && [ -f "$SUPERSET_ROOT_PATH/.env.local" ]; then
  cp "$SUPERSET_ROOT_PATH/.env.local" .env.local
fi

npm install

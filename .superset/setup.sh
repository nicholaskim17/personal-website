#!/usr/bin/env bash
set -euo pipefail

# Copy secrets from the main checkout (never committed)
if [ -n "${SUPERSET_ROOT_PATH:-}" ] && [ -f "$SUPERSET_ROOT_PATH/.env.local" ]; then
  cp -n "$SUPERSET_ROOT_PATH/.env.local" .env.local
fi

npm install

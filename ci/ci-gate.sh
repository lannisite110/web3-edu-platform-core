#!/usr/bin/env bash
# CI gate for v0.2.0 — register, integration, frontend build
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> register plugins"
make register-plugins PLUGINS_DIR=..

echo "==> integration all plugins"
make integration-all-plugins

echo "==> frontend build"
(cd frontend-web && npm ci && npm run build)

echo "==> e2e smoke"
make test-e2e-smoke

echo "==> CI gate PASSED (v0.2.0)"

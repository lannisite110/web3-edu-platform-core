#!/usr/bin/env bash
# CI gate — register, integration, frontend build, smoke
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> compliance check"
make compliance-check

echo "==> register plugins"
make register-plugins PLUGINS_DIR=..

echo "==> integration all plugins"
make integration-all-plugins

echo "==> frontend build"
(cd frontend-web && npm ci && npm run build)

echo "==> e2e smoke"
make test-e2e-smoke

echo "==> CI gate PASSED"

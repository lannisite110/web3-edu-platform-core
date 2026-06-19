#!/usr/bin/env bash
# v0.5 — smoke container-manager HTTP API.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${CONTAINER_MANAGER_PORT:-8083}"

cleanup() {
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

source "${ROOT}/ci/lib/stack-common.sh"
ci_build_go_services "$ROOT"
ci_start_service \
  "http://127.0.0.1:${PORT}/health" \
  "container-manager" "$PORT" -- \
  env CORE_ROOT="$ROOT" CONTAINER_MANAGER_PORT="$PORT" "${ROOT}/.ci-bin/container-manager"

curl -sf "http://127.0.0.1:${PORT}/toolchains" | grep -q evm
curl -sf "http://127.0.0.1:${PORT}/resolve/HOT_MULTI_LANG_COMPILE" | grep -q toolchain-evm
echo "==> container-manager smoke PASSED"

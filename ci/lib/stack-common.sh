#!/usr/bin/env bash
# Shared helpers for integration / e2e stack startup.
set -euo pipefail

_ci_stack_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd
}

_ci_bin_dir() {
  local root="$1"
  echo "${root}/.ci-bin"
}

# Pre-build Go services so first-run module download does not race health checks.
ci_build_go_services() {
  local root="$1"
  local bin
  bin="$(_ci_bin_dir "$root")"
  mkdir -p "$bin"
  echo "==> build scheduler + gateway"
  (cd "${root}/control-plane-go" && go build -o "${bin}/scheduler" ./cmd/scheduler)
  (cd "${root}/api-gateway-go" && go build -o "${bin}/gateway" ./cmd/gateway)
}

ci_wait_health() {
  local url="$1"
  local label="${2:-service}"
  local tries="${3:-45}"
  local i=1
  while [ "$i" -le "$tries" ]; do
    if curl -sf "$url" 2>/dev/null | grep -q ok; then
      echo "  ready: $label"
      return 0
    fi
    sleep 1
    i=$((i + 1))
  done
  echo "TIMEOUT: $label not healthy at $url (${tries}s)"
  return 1
}

ci_start_stack() {
  local root="$1"
  local python="$2"
  local bin
  bin="$(_ci_bin_dir "$root")"

  ci_build_go_services "$root"

  echo "==> start stack"
  (cd "${root}/rule-engine-py" && "$python" main.py) &
  ci_wait_health "http://127.0.0.1:${RULE_ENGINE_PORT}/health" "rule-engine"

  (CORE_ROOT="$root" SCHEDULER_PORT="${SCHEDULER_PORT}" "${bin}/scheduler") &
  ci_wait_health "http://127.0.0.1:${SCHEDULER_PORT}/health" "scheduler"

  (CORE_ROOT="$root" GATEWAY_PORT="${GATEWAY_PORT}" "${bin}/gateway") &
  ci_wait_health "http://127.0.0.1:${GATEWAY_PORT}/health" "gateway"
}

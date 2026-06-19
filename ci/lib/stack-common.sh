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
  echo "==> build scheduler + gateway + container-manager"
  (cd "${root}/control-plane-go" && go build -o "${bin}/scheduler" ./cmd/scheduler)
  (cd "${root}/control-plane-go" && go build -o "${bin}/container-manager" ./cmd/container-manager)
  (cd "${root}/api-gateway-go" && go build -o "${bin}/gateway" ./cmd/gateway)
}

ci_wait_health() {
  local url="$1"
  local label="${2:-service}"
  local tries="${3:-45}"
  local i=1
  while [ "$i" -le "$tries" ]; do
    if ci_health_ok "$url"; then
      echo "  ready: $label"
      return 0
    fi
    sleep 1
    i=$((i + 1))
  done
  echo "TIMEOUT: $label not healthy at $url (${tries}s)"
  return 1
}

ci_health_ok() {
  local url="$1"
  curl -sf "$url" 2>/dev/null | grep -q ok
}

# Start only when health check fails. Reuse an already-healthy listener on :port.
ci_start_service() {
  local url="$1"
  local label="$2"
  local port="$3"
  shift 3
  [[ "${1:-}" == "--" ]] && shift
  if ci_health_ok "$url"; then
    echo "  reuse: $label (:${port})"
    return 0
  fi
  if fuser "${port}/tcp" >/dev/null 2>&1; then
    echo "ERROR: port ${port} in use but ${label} unhealthy at ${url}" >&2
    echo "  hint: make stop-backend" >&2
    return 1
  fi
  "$@" &
  ci_wait_health "$url" "$label"
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

  ci_start_service \
    "http://127.0.0.1:${CONTAINER_MANAGER_PORT:-8083}/health" \
    "container-manager" "${CONTAINER_MANAGER_PORT:-8083}" -- \
    env CORE_ROOT="$root" CONTAINER_MANAGER_PORT="${CONTAINER_MANAGER_PORT:-8083}" "${bin}/container-manager"

  ci_start_service \
    "http://127.0.0.1:${SCHEDULER_PORT}/health" \
    "scheduler" "${SCHEDULER_PORT}" -- \
    env CORE_ROOT="$root" SCHEDULER_PORT="${SCHEDULER_PORT}" \
      CONTAINER_MANAGER_URL="http://127.0.0.1:${CONTAINER_MANAGER_PORT:-8083}" \
      "${bin}/scheduler"

  (CORE_ROOT="$root" GATEWAY_PORT="${GATEWAY_PORT}" "${bin}/gateway") &
  ci_wait_health "http://127.0.0.1:${GATEWAY_PORT}/health" "gateway"
}

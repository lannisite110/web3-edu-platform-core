#!/usr/bin/env bash
# Shared helpers for LabWeave deploy scripts.
set -euo pipefail

deploy_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd
}

core_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd
}

load_deploy_env() {
  local root="$1"
  local f="${LABWEAVE_ENV:-${root}/deploy/env/labweave.prod.env}"
  if [ -f "$f" ]; then
    echo "==> load env: $f"
    set -a
    # shellcheck disable=SC1090
    source "$f"
    set +a
  fi
}

wait_url() {
  local url="$1" name="$2" tries="${3:-45}"
  for _ in $(seq 1 "$tries"); do
    if curl -sf "$url" >/dev/null 2>&1; then
      echo "    OK $name"
      return 0
    fi
    sleep 1
  done
  echo "ERROR: $name not healthy at $url"
  return 1
}

ensure_venv() {
  local root="$1"
  local py="${root}/.venv/bin/python"
  if [ ! -x "$py" ]; then
    python3 -m venv "${root}/.venv"
    "${root}/.venv/bin/pip" install -q -r "${root}/rule-engine-py/requirements.txt" \
      -r "${root}/agent-assist-py/requirements.txt" pyyaml
  fi
}

build_go_binaries() {
  local root="$1"
  local bin="${root}/.labweave/bin"
  mkdir -p "$bin"
  (cd "${root}/api-gateway-go" && go build -o "${bin}/gateway" ./cmd/gateway)
  (cd "${root}/control-plane-go" && go build -o "${bin}/scheduler" ./cmd/scheduler)
  (cd "${root}/control-plane-go" && go build -o "${bin}/container-manager" ./cmd/container-manager)
}

start_bg() {
  local pid_file="$1"
  local name="$2"
  shift 2
  local log="${LOG_DIR:-/tmp}/${name}.log"
  echo "    starting $name → $log"
  nohup "$@" >>"$log" 2>&1 &
  echo $! >>"$pid_file"
}

k8s_preflight() {
  if ! command -v kubectl >/dev/null 2>&1; then
    echo "ERROR: kubectl not found. Install kubectl and configure KUBECONFIG."
    return 1
  fi
  if ! kubectl cluster-info >/dev/null 2>&1; then
    echo "ERROR: kubectl cannot reach a cluster. Check KUBECONFIG and context."
    kubectl config current-context 2>/dev/null || true
    return 1
  fi
  echo "==> kubectl context: $(kubectl config current-context 2>/dev/null || echo '?')"
  kubectl get nodes --no-headers 2>/dev/null | head -3 || true
}

#!/usr/bin/env bash
# Shared helpers for k8s cluster smoke scripts.
set -euo pipefail

k8s_smoke_start_scheduler() {
  local root="$1"
  export CORE_ROOT="$root"
  export JOB_SUBMIT_MODE=cluster
  export SCHEDULER_PORT="${SCHEDULER_PORT:-8082}"
  export JOB_POLL_TIMEOUT_SEC="${JOB_POLL_TIMEOUT_SEC:-120}"

  PYTHON="${root}/.venv/bin/python"
  [ -x "$PYTHON" ] || {
    python3 -m venv "${root}/.venv"
    "${root}/.venv/bin/pip" install -q -r rule-engine-py/requirements.txt pyyaml
  }

  cleanup() {
    fuser -k "${SCHEDULER_PORT}/tcp" 2>/dev/null || true
    kill $(jobs -p) 2>/dev/null || true
  }
  trap cleanup EXIT

  echo "==> apply base namespaces (idempotent)"
  kubectl apply -f "${root}/k8s-manifests/base/namespaces.yaml"
  kubectl apply -f "${root}/k8s-manifests/base/testnet-rpc-configmaps.yaml"

  echo "==> start scheduler (cluster mode)"
  # shellcheck source=../ci/lib/stack-common.sh
  source "${root}/ci/lib/stack-common.sh"
  ci_build_go_services "$root"
  (CORE_ROOT="$root" SCHEDULER_PORT="$SCHEDULER_PORT" "${root}/.ci-bin/scheduler") &
  ci_wait_health "http://127.0.0.1:${SCHEDULER_PORT}/health" "scheduler"
}

k8s_smoke_wait_task() {
  local scheduler_port="$1"
  local task_id="$2"
  local python_bin="${3:-python3}"

  for i in $(seq 1 60); do
    REPORT=$(curl -sf "http://127.0.0.1:${scheduler_port}/report/${task_id}")
    STATUS=$(echo "$REPORT" | "$python_bin" -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
    echo "  poll $i status=$STATUS"
    if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
      echo "$REPORT" | "$python_bin" -m json.tool
      [ "$STATUS" = "completed" ]
      return
    fi
    sleep 2
  done

  echo "TIMEOUT waiting for task $task_id"
  return 1
}

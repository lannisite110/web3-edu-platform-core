#!/usr/bin/env bash
# v0.4.2 — smoke HOT_MULTI_LANG_COMPILE via scheduler + K8s Job (requires kubectl).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Use busybox when toolchain images are not loaded locally.
export JOB_SMOKE_BUSYBOX="${JOB_SMOKE_BUSYBOX:-1}"

# shellcheck source=k8s-smoke-common.sh
source "${ROOT}/scripts/k8s-smoke-common.sh"
k8s_smoke_start_scheduler "$ROOT"

PYTHON="${ROOT}/.venv/bin/python"
echo "==> submit HOT_MULTI_LANG_COMPILE job (edu.hot.language-advisor)"
RESP=$(curl -sf -X POST "http://127.0.0.1:${SCHEDULER_PORT}/submit" \
  -H 'Content-Type: application/json' \
  -d '{"plugin_id":"edu.hot.language-advisor","task_type":"HOT_MULTI_LANG_COMPILE","params":{"language":"solidity"}}')
TASK_ID=$(echo "$RESP" | "$PYTHON" -c "import sys,json; print(json.load(sys.stdin)['id'])")
echo "  task_id=$TASK_ID"

k8s_smoke_wait_task "$SCHEDULER_PORT" "$TASK_ID" "$PYTHON"
echo "==> k8s multilang smoke PASSED"

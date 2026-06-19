#!/usr/bin/env bash
# v0.6 — scheduler resolves toolchain via container-manager HTTP.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CM_PORT="${CONTAINER_MANAGER_PORT:-8083}"
SCHED_PORT="${SCHEDULER_PORT:-8084}"
PYTHON="${ROOT}/.venv/bin/python"
[ -x "$PYTHON" ] || PYTHON=python3

cleanup() {
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

source "${ROOT}/ci/lib/stack-common.sh"
ci_build_go_services "$ROOT"

ci_start_service \
  "http://127.0.0.1:${CM_PORT}/health" \
  "container-manager" "$CM_PORT" -- \
  env CORE_ROOT="$ROOT" CONTAINER_MANAGER_PORT="$CM_PORT" "${ROOT}/.ci-bin/container-manager"

ci_start_service \
  "http://127.0.0.1:${SCHED_PORT}/health" \
  "scheduler" "$SCHED_PORT" -- \
  env CORE_ROOT="$ROOT" SCHEDULER_PORT="$SCHED_PORT" \
    CONTAINER_MANAGER_URL="http://127.0.0.1:${CM_PORT}" \
    "${ROOT}/.ci-bin/scheduler"

RESP=$(curl -sf -X POST "http://127.0.0.1:${SCHED_PORT}/submit" \
  -H 'Content-Type: application/json' \
  -d '{"plugin_id":"edu.hot.language-advisor","task_type":"HOT_MULTI_LANG_COMPILE","params":{}}')
TASK_ID=$(echo "$RESP" | "$PYTHON" -c "import sys,json; print(json.load(sys.stdin)['id'])")

for i in $(seq 1 30); do
  REPORT=$(curl -sf "http://127.0.0.1:${SCHED_PORT}/report/${TASK_ID}")
  STATUS=$(echo "$REPORT" | "$PYTHON" -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
    echo "$REPORT" | "$PYTHON" -c "import sys,json; r=json.load(sys.stdin)['report']; assert 'toolchain-evm' in r.get('toolchain_image',''), r; print('toolchain_image=', r.get('toolchain_image'))"
    [ "$STATUS" = "completed" ]
    echo "==> scheduler resolver smoke PASSED"
    exit 0
  fi
  sleep 1
done

echo "TIMEOUT waiting for task $TASK_ID"
exit 1

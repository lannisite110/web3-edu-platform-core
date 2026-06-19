#!/usr/bin/env bash
# v0.4 — smoke one Kubernetes Job via scheduler (requires kubectl + cluster access).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export CORE_ROOT="$ROOT"
export JOB_SUBMIT_MODE=cluster
export SCHEDULER_PORT="${SCHEDULER_PORT:-8082}"
export JOB_POLL_TIMEOUT_SEC="${JOB_POLL_TIMEOUT_SEC:-120}"

PYTHON="${ROOT}/.venv/bin/python"
[ -x "$PYTHON" ] || { python3 -m venv "${ROOT}/.venv" && "${ROOT}/.venv/bin/pip" install -q -r rule-engine-py/requirements.txt pyyaml; }

cleanup() {
  fuser -k "${SCHEDULER_PORT}/tcp" 2>/dev/null || true
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

echo "==> apply base namespaces (idempotent)"
kubectl apply -f "${ROOT}/k8s-manifests/base/namespaces.yaml"

echo "==> start scheduler (cluster mode)"
source "${ROOT}/ci/lib/stack-common.sh"
ci_build_go_services "$ROOT"
(CORE_ROOT="$ROOT" SCHEDULER_PORT="$SCHEDULER_PORT" "${ROOT}/.ci-bin/scheduler") &
ci_wait_health "http://127.0.0.1:${SCHEDULER_PORT}/health" "scheduler"

echo "==> submit HOT_DAO_VOTE_SIM job"
RESP=$(curl -sf -X POST "http://127.0.0.1:${SCHEDULER_PORT}/submit" \
  -H 'Content-Type: application/json' \
  -d '{"plugin_id":"edu.hot.dao","task_type":"HOT_DAO_VOTE_SIM","params":{}}')
TASK_ID=$(echo "$RESP" | "$PYTHON" -c "import sys,json; print(json.load(sys.stdin)['id'])")
echo "  task_id=$TASK_ID"

for i in $(seq 1 60); do
  REPORT=$(curl -sf "http://127.0.0.1:${SCHEDULER_PORT}/report/${TASK_ID}")
  STATUS=$(echo "$REPORT" | "$PYTHON" -c "import sys,json; print(json.load(sys.stdin).get('status',''))")
  echo "  poll $i status=$STATUS"
  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
    echo "$REPORT" | "$PYTHON" -m json.tool
    [ "$STATUS" = "completed" ] || exit 1
    echo "==> k8s job smoke PASSED"
    exit 0
  fi
  sleep 2
done

echo "TIMEOUT waiting for task $TASK_ID"
exit 1

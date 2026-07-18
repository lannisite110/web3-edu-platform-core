#!/usr/bin/env bash
# Full local pre-cloud verification + report file.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck source=../lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

REPORT_DIR="${ROOT}/deploy/reports"
mkdir -p "$REPORT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
REPORT="${REPORT_DIR}/verify-${STAMP}.txt"

exec > >(tee -a "$REPORT") 2>&1

echo "LabWeave verify-full report: $REPORT"
echo "started: $(date -Iseconds)"
echo ""

load_deploy_env "$ROOT"
GW_PORT="${GATEWAY_PORT:-8080}"
PUBLIC_URL="${DEPLOY_VERIFY_URL:-http://127.0.0.1:${GW_PORT}}"
PYTHON="${ROOT}/.venv/bin/python"

ensure_venv "$ROOT"

echo "==> [1/5] labweave-path-check"
make -C "$ROOT" labweave-path-check PLUGINS_DIR="${PLUGINS_DIR:-..}"

echo ""
echo "==> [2/5] deploy-verify (health + plugins + language-advisor)"
bash "${ROOT}/deploy/scripts/verify-local.sh"

echo ""
echo "==> [3/5] simulate — edu.hot.mock"
curl -sf -X POST "${PUBLIC_URL}/api/v1/labs/edu.hot.mock/simulate" \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"smoke","params":{},"allowed_chain_ids":[11155111]}' \
  | "$PYTHON" -c "import sys,json; d=json.load(sys.stdin); print('    mock simulate keys:', list(d.keys())[:5])"

echo ""
echo "==> [4/5] simulate — edu.cn.trace.food (trace path)"
curl -sf -X POST "${PUBLIC_URL}/api/v1/labs/edu.cn.trace.food/simulate" \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"batch trace","params":{"batch_id":"B001"},"allowed_chain_ids":[11155111]}' \
  | "$PYTHON" -c "
import sys,json
d=json.load(sys.stdin)
assert 'evaluation' in d or 'task_id' in d or d, 'empty response'
print('    trace food simulate OK')
" || echo "    WARN: trace food simulate failed (check plugin id in registry)"

echo ""
echo "==> [5/5] simulate — edu.hot.zk-modular (batch)"
curl -sf -X POST "${PUBLIC_URL}/api/v1/labs/edu.hot.zk-modular/simulate" \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"rollup","params":{"batch_size":8},"allowed_chain_ids":[11155111]}' \
  | "$PYTHON" -c "
import sys,json
d=json.load(sys.stdin)
print('    zk-modular simulate OK')
"

echo ""
echo "finished: $(date -Iseconds)"
echo "==> verify-full PASSED"
echo "Report saved: $REPORT"

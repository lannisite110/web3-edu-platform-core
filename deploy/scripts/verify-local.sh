#!/usr/bin/env bash
# Post-deploy smoke: health + plugin list + one simulate call.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck source=../lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

load_deploy_env "$ROOT"

GW_PORT="${GATEWAY_PORT:-8080}"
RULE_PORT="${RULE_ENGINE_PORT:-8081}"
SCHED_PORT="${SCHEDULER_PORT:-8082}"
AGENT_PORT="${AGENT_ASSIST_PORT:-8084}"
PUBLIC_URL="${DEPLOY_VERIFY_URL:-http://127.0.0.1:${GW_PORT}}"

echo "==> LabWeave deploy verify"
echo "    gateway: $PUBLIC_URL"

wait_url "${PUBLIC_URL}/health" "gateway"
wait_url "http://127.0.0.1:${RULE_PORT}/health" "rule-engine"
wait_url "http://127.0.0.1:${SCHED_PORT}/health" "scheduler"
wait_url "http://127.0.0.1:${AGENT_PORT}/health" "agent-assist"

COUNT=$(curl -sf "${PUBLIC_URL}/api/v1/plugins" | "${ROOT}/.venv/bin/python" -c "import sys,json; print(len(json.load(sys.stdin)))")
echo "    plugins registered: $COUNT"
[ "$COUNT" -ge 20 ] || { echo "ERROR: expected >= 20 plugins"; exit 1; }

echo "==> simulate edu.hot.language-advisor"
RESP=$(curl -sf -X POST "${PUBLIC_URL}/api/v1/labs/edu.hot.language-advisor/simulate" \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"zk cairo rollup","params":{"scenario":"zk cairo rollup","tags":"zk"},"allowed_chain_ids":[11155111]}')
echo "$RESP" | "${ROOT}/.venv/bin/python" -c "
import sys, json
d = json.load(sys.stdin)
ev = d.get('evaluation') or {}
if isinstance(ev, str):
    ev = json.loads(ev)
lang = ev.get('recommended_language','')
assert lang == 'cairo', f'expected cairo, got {lang!r}'
print('    recommended_language=cairo OK')
"

if [ -f "${ROOT}/frontend-web/dist/index.html" ]; then
  echo "    frontend dist: OK"
else
  echo "WARN: frontend-web/dist/index.html missing — run make labweave-prod-build"
fi

echo "==> deploy verify PASSED"

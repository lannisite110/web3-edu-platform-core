#!/usr/bin/env bash
# 全插件联调：rule-engine /evaluate + gateway /simulate
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export CORE_ROOT="$ROOT"
export GATEWAY_PORT="${GATEWAY_PORT:-8080}"
export RULE_ENGINE_PORT="${RULE_ENGINE_PORT:-8081}"
export SCHEDULER_PORT="${SCHEDULER_PORT:-8082}"

PYTHON="${ROOT}/.venv/bin/python"
[ -x "$PYTHON" ] || { python3 -m venv "${ROOT}/.venv" && "${ROOT}/.venv/bin/pip" install -q -r rule-engine-py/requirements.txt pyyaml; }

cleanup() {
  fuser -k "${GATEWAY_PORT}/tcp" "${RULE_ENGINE_PORT}/tcp" "${SCHEDULER_PORT}/tcp" 2>/dev/null || true
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

echo "==> register plugins"
"$PYTHON" ci/register-plugins.py ..

# shellcheck source=lib/stack-common.sh
source "${ROOT}/ci/lib/stack-common.sh"
ci_start_stack "$ROOT" "$PYTHON"

REGISTRY="${ROOT}/api-gateway-go/config/plugins.registry.json"
PLUGIN_IDS=$("$PYTHON" -c "import json; print(' '.join(p['id'] for p in json.load(open('$REGISTRY'))))")

PASS=0
FAIL=0
FAILED=""

for pid in $PLUGIN_IDS; do
  echo "==> evaluate $pid"
  if ! "$PYTHON" -c "
import json, urllib.request, sys
pid = sys.argv[1]
req = urllib.request.Request(
    'http://127.0.0.1:${RULE_ENGINE_PORT}/evaluate',
    data=json.dumps({'plugin_id': pid, 'user_prompt': 'integration test', 'params': {}, 'allowed_chain_ids': [11155111, 'fabric-local']}).encode(),
    headers={'Content-Type': 'application/json'},
    method='POST',
)
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        body = json.loads(r.read().decode())
        assert body.get('compliance_passed') is True, body
except Exception as e:
    print(e)
    sys.exit(1)
" "$pid"; then
    echo "  FAIL evaluate: $pid"
    FAIL=$((FAIL + 1))
    FAILED="$FAILED $pid(eval)"
    continue
  fi

  echo "==> simulate $pid"
  CODE=$(curl -s -o /tmp/sim-"$pid".json -w '%{http_code}' -X POST \
    "http://127.0.0.1:${GATEWAY_PORT}/api/v1/labs/${pid}/simulate" \
    -H 'Content-Type: application/json' \
    -d '{"user_prompt":"integration","params":{},"allowed_chain_ids":[11155111]}')
  if [ "$CODE" != "202" ]; then
    echo "  FAIL simulate: $pid HTTP $CODE"
    cat /tmp/sim-"$pid".json 2>/dev/null || true
    FAIL=$((FAIL + 1))
    FAILED="$FAILED $pid(sim)"
    continue
  fi
  PASS=$((PASS + 1))
  echo "  OK $pid"
done

echo ""
echo "==> Integration summary: PASS=$PASS FAIL=$FAIL"
if [ "$FAIL" -gt 0 ]; then
  echo "Failed:$FAILED"
  exit 1
fi
echo "==> All plugins integration PASSED"

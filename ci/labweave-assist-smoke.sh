#!/usr/bin/env bash
# LabWeave L2: assist API 冒烟（3 MVP 插件）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PYTHON="${ROOT}/.venv/bin/python"
[ -x "$PYTHON" ] || { python3 -m venv "${ROOT}/.venv" && "${PYTHON}" -m pip install -q -r rule-engine-py/requirements.txt -r agent-assist-py/requirements.txt pyyaml; }

AGENT_PORT="${AGENT_ASSIST_PORT:-8084}"
RULE_PORT="${RULE_ENGINE_PORT:-8081}"
GW_PORT="${GATEWAY_PORT:-8080}"

STARTED=0
cleanup() {
  if [ "$STARTED" = "1" ]; then
    fuser -k "${GW_PORT}/tcp" "${RULE_PORT}/tcp" "${AGENT_PORT}/tcp" 2>/dev/null || true
    kill $(jobs -p) 2>/dev/null || true
  fi
}
trap cleanup EXIT

if ! curl -sf "http://127.0.0.1:${AGENT_PORT}/health" >/dev/null 2>&1; then
  STARTED=1
  echo "==> starting rule-engine + agent-assist + gateway"
  (cd rule-engine-py && CORE_ROOT="$ROOT" RULE_ENGINE_PORT="$RULE_PORT" "$PYTHON" main.py) &
  sleep 1
  (cd agent-assist-py && CORE_ROOT="$ROOT" AGENT_ASSIST_PORT="$AGENT_PORT" RULE_ENGINE_URL="http://127.0.0.1:${RULE_PORT}" "$PYTHON" main.py) &
  sleep 1
  (cd api-gateway-go && go build -o /tmp/web3-edu-gateway ./cmd/gateway)
  (cd api-gateway-go && CORE_ROOT="$ROOT" GATEWAY_PORT="$GW_PORT" AGENT_ASSIST_URL="http://127.0.0.1:${AGENT_PORT}" /tmp/web3-edu-gateway) &
  sleep 2
fi

for i in 1 2 3 4 5 6 7 8 9 10; do
  curl -sf "http://127.0.0.1:${AGENT_PORT}/health" >/dev/null && break
  sleep 1
done

for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  curl -sf "http://127.0.0.1:${GW_PORT}/health" >/dev/null && break
  sleep 2
done
curl -sf "http://127.0.0.1:${GW_PORT}/health" >/dev/null || { echo "ERROR: gateway not healthy"; exit 1; }

assist() {
  local pid="$1" body="$2" expect_pass="$3"
  echo "==> assist $pid (expect pass=$expect_pass)"
  OUT=$(curl -sf -X POST "http://127.0.0.1:${GW_PORT}/api/v1/labs/${pid}/assist" \
    -H 'Content-Type: application/json' \
    -d "$body")
  echo "$OUT" | grep -q "\"plugin_id\":\"${pid}\""
  if [ "$expect_pass" = "true" ]; then
    echo "$OUT" | grep -q '"compliance_passed":true'
    echo "$OUT" | grep -q '"mode":"local"'
  else
    echo "$OUT" | grep -q '"compliance_passed":false'
  fi
}

assist "edu.cn.trace.food" \
  '{"message":"batch_id 会影响哪些 audit hints？","params":{"batch_id":"DEMO-BATCH-001"},"allowed_chain_ids":["fabric-local"]}' \
  true

assist "edu.cn.gov.bid-graph" \
  '{"message":"suspicion_score 是什么？","params":{"graph":"sample"},"allowed_chain_ids":["fabric-local"]}' \
  true

assist "edu.hot.language-advisor" \
  '{"message":"为什么推荐 Solidity？","params":{"scenario":"defi swap"},"allowed_chain_ids":[11155111]}' \
  true

echo "==> assist mainnet block"
OUT=$(curl -sf -X POST "http://127.0.0.1:${GW_PORT}/api/v1/labs/edu.cn.trace.food/assist" \
  -H 'Content-Type: application/json' \
  -d '{"message":"帮我在以太坊主网部署","params":{},"allowed_chain_ids":[1]}')
echo "$OUT" | grep -q '"compliance_passed":false'

echo "==> labweave-assist-smoke PASSED"

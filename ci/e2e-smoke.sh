#!/usr/bin/env bash
# E2E smoke: gateway -> rule-engine -> scheduler
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export CORE_ROOT="$ROOT"
export GATEWAY_PORT="${GATEWAY_PORT:-8080}"
export RULE_ENGINE_PORT="${RULE_ENGINE_PORT:-8081}"
export SCHEDULER_PORT="${SCHEDULER_PORT:-8082}"

cleanup() {
  fuser -k "${GATEWAY_PORT}/tcp" "${RULE_ENGINE_PORT}/tcp" "${SCHEDULER_PORT}/tcp" 2>/dev/null || true
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

PYTHON="${ROOT}/.venv/bin/python"
if [ ! -x "$PYTHON" ]; then
  python3 -m venv "${ROOT}/.venv"
  "${ROOT}/.venv/bin/pip" install -q -r "${ROOT}/rule-engine-py/requirements.txt" pyyaml
fi

echo "==> register plugins"
"$PYTHON" ci/register-plugins.py ..

echo "==> start rule-engine"
(cd rule-engine-py && "$PYTHON" main.py) &
sleep 1

echo "==> start scheduler"
(cd control-plane-go && CORE_ROOT="$ROOT" go run ./cmd/scheduler) &
sleep 2

echo "==> start gateway"
(cd api-gateway-go && CORE_ROOT="$ROOT" go run ./cmd/gateway) &
sleep 2

echo "==> health checks"
for i in 1 2 3 4 5; do
  curl -sf "http://127.0.0.1:${SCHEDULER_PORT}/health" && break
  sleep 1
done
curl -sf "http://127.0.0.1:${SCHEDULER_PORT}/health" | grep -q ok
curl -sf "http://127.0.0.1:${RULE_ENGINE_PORT}/health" | grep -q ok
for i in 1 2 3 4 5; do
  curl -sf "http://127.0.0.1:${GATEWAY_PORT}/health" && break
  sleep 1
done
curl -sf "http://127.0.0.1:${GATEWAY_PORT}/health" | grep -q ok

echo "==> simulate edu.hot.mock"
RESP=$(curl -sf -X POST "http://127.0.0.1:${GATEWAY_PORT}/api/v1/labs/edu.hot.mock/simulate" \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"mock defi","params":{},"allowed_chain_ids":[11155111]}')
echo "$RESP" | grep -q edu.hot.mock
echo "$RESP" | grep -q compliance_passed || echo "$RESP" | grep -q completed

echo "==> mainnet blocked"
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://127.0.0.1:${GATEWAY_PORT}/api/v1/labs/edu.hot.mock/simulate" \
  -H 'Content-Type: application/json' \
  -d '{"params":{"target_network":"mainnet"}}')
test "$CODE" = "403"

echo "==> E2E smoke PASSED"

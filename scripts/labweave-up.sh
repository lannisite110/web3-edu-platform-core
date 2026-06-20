#!/usr/bin/env bash
# LabWeave L3: 一键启动（register + 四后端 + 前端）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PLUGINS_DIR="${PLUGINS_DIR:-..}"
RUN_DIR="${ROOT}/.labweave/run"
LOG_DIR="${ROOT}/.labweave/logs"
BIN_DIR="${ROOT}/.labweave/bin"
GATEWAY_BIN="${BIN_DIR}/gateway"
PID_FILE="${RUN_DIR}/labweave.pids"

RULE_PORT="${RULE_ENGINE_PORT:-8081}"
SCHED_PORT="${SCHEDULER_PORT:-8082}"
GW_PORT="${GATEWAY_PORT:-8080}"
AGENT_PORT="${AGENT_ASSIST_PORT:-8084}"
FE_PORT="${FRONTEND_PORT:-5173}"

PYTHON="${ROOT}/.venv/bin/python"

mkdir -p "$RUN_DIR" "$LOG_DIR" "$BIN_DIR"

echo "==> LabWeave · 沙箱码坊 — 一键启动"
echo "    工作区: $(dirname "$ROOT")"

for repo in web3-hot-topic-labs supervision-trace-edu-suite enterprise-gov-edu-demo global-social-edu-sandbox; do
  if [ ! -d "${ROOT}/${PLUGINS_DIR}/${repo}" ]; then
    echo "ERROR: missing ${PLUGINS_DIR}/${repo} — clone 四子库到 web3home/"
    exit 1
  fi
done

if [ -f "$PID_FILE" ] && kill -0 "$(head -1 "$PID_FILE" 2>/dev/null)" 2>/dev/null; then
  echo "WARN: LabWeave 似乎已在运行。先执行: make labweave-down"
  exit 1
fi

make stop-backend 2>/dev/null || true
fuser -k "${FE_PORT}/tcp" 2>/dev/null || true

echo "==> register plugins + path check"
make register-plugins PLUGINS_DIR="$PLUGINS_DIR"
make labweave-path-check

echo "==> build gateway + scheduler"
(cd api-gateway-go && go build -o "$GATEWAY_BIN" ./cmd/gateway)
(cd control-plane-go && go build -o "${BIN_DIR}/scheduler" ./cmd/scheduler)
SCHEDULER_BIN="${BIN_DIR}/scheduler"

if [ ! -d frontend-web/node_modules ]; then
  echo "==> npm ci (first run)"
  (cd frontend-web && npm ci)
fi

start_bg() {
  local name="$1"
  shift
  local log="${LOG_DIR}/${name}.log"
  echo "    starting $name → $log"
  nohup "$@" >>"$log" 2>&1 &
  echo $! >>"$PID_FILE"
}

: >"$PID_FILE"

echo "==> starting backends"
start_bg rule-engine env CORE_ROOT="$ROOT" RULE_ENGINE_PORT="$RULE_PORT" \
  bash -c "cd '${ROOT}/rule-engine-py' && '${PYTHON}' main.py"

start_bg agent-assist env CORE_ROOT="$ROOT" AGENT_ASSIST_PORT="$AGENT_PORT" \
  RULE_ENGINE_URL="http://127.0.0.1:${RULE_PORT}" \
  bash -c "cd '${ROOT}/agent-assist-py' && '${PYTHON}' main.py"

start_bg scheduler env CORE_ROOT="$ROOT" SCHEDULER_PORT="$SCHED_PORT" \
  "$SCHEDULER_BIN"

start_bg gateway env CORE_ROOT="$ROOT" GATEWAY_PORT="$GW_PORT" \
  AGENT_ASSIST_URL="http://127.0.0.1:${AGENT_PORT}" RULE_ENGINE_URL="http://127.0.0.1:${RULE_PORT}" \
  SCHEDULER_URL="http://127.0.0.1:${SCHED_PORT}" \
  "$GATEWAY_BIN"

wait_url() {
  local url="$1" name="$2" tries="${3:-45}"
  for i in $(seq 1 "$tries"); do
    if curl -sf "$url" >/dev/null 2>&1; then
      echo "    OK $name"
      return 0
    fi
    sleep 1
  done
  echo "ERROR: $name not healthy at $url (see ${LOG_DIR}/)"
  tail -20 "${LOG_DIR}/${name}.log" 2>/dev/null || true
  make labweave-down 2>/dev/null || true
  exit 1
}

echo "==> health checks"
wait_url "http://127.0.0.1:${RULE_PORT}/health" "rule-engine"
wait_url "http://127.0.0.1:${AGENT_PORT}/health" "agent-assist"
wait_url "http://127.0.0.1:${SCHED_PORT}/health" "scheduler"
wait_url "http://127.0.0.1:${GW_PORT}/health" "gateway"

echo "==> starting frontend :${FE_PORT}"
start_bg frontend bash -c "cd '${ROOT}/frontend-web' && npm run dev -- --host 127.0.0.1 --port ${FE_PORT}"

for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${FE_PORT}/" >/dev/null 2>&1; then
    echo "    OK frontend"
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "WARN: frontend slow to respond — check ${LOG_DIR}/frontend.log"
  fi
done

cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║  LabWeave · 沙箱码坊 已启动                                   ║
╠══════════════════════════════════════════════════════════════╣
║  首页      http://127.0.0.1:${FE_PORT}/                        ║
║  学习地图  http://127.0.0.1:${FE_PORT}/learn                   ║
║  网关      http://127.0.0.1:${GW_PORT}/health                  ║
║  助教 API  http://127.0.0.1:${GW_PORT}/api/v1/labs/.../assist  ║
╠══════════════════════════════════════════════════════════════╣
║  日志: ${LOG_DIR}/
║  停止: make labweave-down
╚══════════════════════════════════════════════════════════════╝

EOF

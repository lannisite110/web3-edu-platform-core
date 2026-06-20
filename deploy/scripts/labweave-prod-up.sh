#!/usr/bin/env bash
# Production runtime: start backends (127.0.0.1). Frontend served by Nginx from dist/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck source=../lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

PLUGINS_DIR="${PLUGINS_DIR:-..}"
RUN_DIR="${ROOT}/.labweave/run"
LOG_DIR="${ROOT}/.labweave/logs"
BIN_DIR="${ROOT}/.labweave/bin"
PID_FILE="${RUN_DIR}/labweave-prod.pids"

load_deploy_env "$ROOT"

export CORE_ROOT="$ROOT"
export LISTEN_HOST="${LISTEN_HOST:-127.0.0.1}"
export JOB_SUBMIT_MODE="${JOB_SUBMIT_MODE:-local}"

RULE_PORT="${RULE_ENGINE_PORT:-8081}"
SCHED_PORT="${SCHEDULER_PORT:-8082}"
GW_PORT="${GATEWAY_PORT:-8080}"
AGENT_PORT="${AGENT_ASSIST_PORT:-8084}"
CM_PORT="${CONTAINER_MANAGER_PORT:-8083}"

PYTHON="${ROOT}/.venv/bin/python"
GATEWAY_BIN="${BIN_DIR}/gateway"
SCHEDULER_BIN="${BIN_DIR}/scheduler"
CM_BIN="${BIN_DIR}/container-manager"

mkdir -p "$RUN_DIR" "$LOG_DIR" "$BIN_DIR"
export LOG_DIR

if [ ! -f "${ROOT}/frontend-web/dist/index.html" ]; then
  echo "ERROR: frontend dist missing — run: make labweave-prod-build"
  exit 1
fi

if [ ! -x "$GATEWAY_BIN" ] || [ ! -x "$SCHEDULER_BIN" ]; then
  echo "==> binaries missing, building…"
  build_go_binaries "$ROOT"
fi

if [ -f "$PID_FILE" ]; then
  while read -r pid; do
    [ -n "$pid" ] && kill "$pid" 2>/dev/null || true
  done <"$PID_FILE"
  rm -f "$PID_FILE"
fi

make stop-backend 2>/dev/null || true
: >"$PID_FILE"

ensure_venv "$ROOT"

echo "==> starting production backends (LISTEN_HOST=$LISTEN_HOST, JOB_SUBMIT_MODE=$JOB_SUBMIT_MODE)"

start_bg "$PID_FILE" rule-engine env CORE_ROOT="$ROOT" LISTEN_HOST="$LISTEN_HOST" RULE_ENGINE_PORT="$RULE_PORT" \
  bash -c "cd '${ROOT}/rule-engine-py' && '${PYTHON}' main.py"

start_bg "$PID_FILE" agent-assist env CORE_ROOT="$ROOT" LISTEN_HOST="$LISTEN_HOST" AGENT_ASSIST_PORT="$AGENT_PORT" \
  RULE_ENGINE_URL="${RULE_ENGINE_URL:-http://127.0.0.1:${RULE_PORT}}" \
  bash -c "cd '${ROOT}/agent-assist-py' && '${PYTHON}' main.py"

if [ "$JOB_SUBMIT_MODE" = "cluster" ]; then
  if [ ! -x "$CM_BIN" ]; then
    build_go_binaries "$ROOT"
  fi
  start_bg "$PID_FILE" container-manager env CORE_ROOT="$ROOT" LISTEN_HOST="$LISTEN_HOST" CONTAINER_MANAGER_PORT="$CM_PORT" \
    "$CM_BIN"
  start_bg "$PID_FILE" scheduler env CORE_ROOT="$ROOT" LISTEN_HOST="$LISTEN_HOST" SCHEDULER_PORT="$SCHED_PORT" \
    JOB_SUBMIT_MODE=cluster \
    CONTAINER_MANAGER_URL="${CONTAINER_MANAGER_URL:-http://127.0.0.1:${CM_PORT}}" \
    "$SCHEDULER_BIN"
else
  start_bg "$PID_FILE" scheduler env CORE_ROOT="$ROOT" LISTEN_HOST="$LISTEN_HOST" SCHEDULER_PORT="$SCHED_PORT" \
    JOB_SUBMIT_MODE=local \
    "$SCHEDULER_BIN"
fi

start_bg "$PID_FILE" gateway env CORE_ROOT="$ROOT" LISTEN_HOST="$LISTEN_HOST" GATEWAY_PORT="$GW_PORT" \
  AGENT_ASSIST_URL="${AGENT_ASSIST_URL:-http://127.0.0.1:${AGENT_PORT}}" \
  RULE_ENGINE_URL="${RULE_ENGINE_URL:-http://127.0.0.1:${RULE_PORT}}" \
  SCHEDULER_URL="${SCHEDULER_URL:-http://127.0.0.1:${SCHED_PORT}}" \
  "$GATEWAY_BIN"

wait_url "http://127.0.0.1:${RULE_PORT}/health" "rule-engine"
wait_url "http://127.0.0.1:${AGENT_PORT}/health" "agent-assist"
wait_url "http://127.0.0.1:${SCHED_PORT}/health" "scheduler"
wait_url "http://127.0.0.1:${GW_PORT}/health" "gateway"

cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║  LabWeave · 生产后端已启动                                    ║
╠══════════════════════════════════════════════════════════════╣
║  Gateway   http://127.0.0.1:${GW_PORT}/health                  ║
║  静态站点  ${ROOT}/frontend-web/dist                           ║
║  模式      JOB_SUBMIT_MODE=${JOB_SUBMIT_MODE}                  ║
╠══════════════════════════════════════════════════════════════╣
║  配置 Nginx: deploy/nginx/labweave.conf.example                ║
║  验收:       make deploy-verify                                ║
║  停止:       make labweave-prod-down                           ║
╚══════════════════════════════════════════════════════════════╝

EOF

#!/usr/bin/env bash
# LabWeave L3: 停止 labweave-up 启动的进程
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="${ROOT}/.labweave/run/labweave.pids"
FE_PORT="${FRONTEND_PORT:-5173}"

echo "==> LabWeave down"

if [ -f "$PID_FILE" ]; then
  while read -r pid; do
    [ -n "$pid" ] || continue
    kill "$pid" 2>/dev/null || true
  done <"$PID_FILE"
  rm -f "$PID_FILE"
fi

cd "$ROOT"
make stop-backend 2>/dev/null || fuser -k 8080/tcp 8081/tcp 8082/tcp 8083/tcp 8084/tcp 2>/dev/null || true
fuser -k "${FE_PORT}/tcp" 2>/dev/null || true

echo "==> LabWeave stopped"

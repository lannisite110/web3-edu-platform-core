#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PID_FILE="${ROOT}/.labweave/run/labweave-prod.pids"

echo "==> LabWeave production down"

if [ -f "$PID_FILE" ]; then
  while read -r pid; do
    [ -n "$pid" ] && kill "$pid" 2>/dev/null || true
  done <"$PID_FILE"
  rm -f "$PID_FILE"
fi

cd "$ROOT"
make stop-backend 2>/dev/null || true
echo "==> production backends stopped"

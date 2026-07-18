#!/usr/bin/env bash
# Install systemd units (requires sudo). Run after labweave-prod-build.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LABWEAVE_ROOT="${LABWEAVE_ROOT:-$ROOT}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run with sudo: sudo LABWEAVE_ROOT=$LABWEAVE_ROOT bash deploy/scripts/install-systemd.sh"
  exit 1
fi

mkdir -p /etc/labweave
if [ ! -f /etc/labweave/labweave.env ]; then
  cp "${ROOT}/deploy/env/labweave.prod.env.example" /etc/labweave/labweave.env
  sed -i "s|LABWEAVE_ROOT=.*|LABWEAVE_ROOT=${LABWEAVE_ROOT}|" /etc/labweave/labweave.env
  echo "Created /etc/labweave/labweave.env — edit LABWEAVE_PUBLIC_HOST before enable."
fi

for unit in rule-engine agent-assist scheduler gateway container-manager; do
  src="${ROOT}/deploy/systemd/labweave-${unit}.service"
  dest="/etc/systemd/system/labweave-${unit}.service"
  sed "s|%LABWEAVE_ROOT%|${LABWEAVE_ROOT}|g" "$src" >"$dest"
  echo "installed $dest"
done

systemctl daemon-reload

echo ""
echo "Enable & start (always):"
echo "  sudo systemctl enable --now labweave-rule-engine labweave-agent-assist labweave-scheduler labweave-gateway"

if grep -q '^JOB_SUBMIT_MODE=cluster' /etc/labweave/labweave.env 2>/dev/null; then
  echo ""
  echo "cluster mode detected — also enable container-manager:"
  echo "  sudo systemctl enable --now labweave-container-manager"
else
  echo ""
  echo "JOB_SUBMIT_MODE=local — container-manager unit installed but not required."
fi

echo ""
echo "Logs: journalctl -u labweave-gateway -f"

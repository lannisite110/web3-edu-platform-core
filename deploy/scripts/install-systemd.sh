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
  echo "Created /etc/labweave/labweave.env — edit before enable."
fi

for unit in rule-engine agent-assist scheduler gateway; do
  src="${ROOT}/deploy/systemd/labweave-${unit}.service"
  dest="/etc/systemd/system/labweave-${unit}.service"
  sed "s|%LABWEAVE_ROOT%|${LABWEAVE_ROOT}|g" "$src" >"$dest"
  echo "installed $dest"
done

systemctl daemon-reload
echo ""
echo "Enable & start:"
echo "  sudo systemctl enable --now labweave-rule-engine labweave-agent-assist labweave-scheduler labweave-gateway"
echo "Logs: journalctl -u labweave-gateway -f"

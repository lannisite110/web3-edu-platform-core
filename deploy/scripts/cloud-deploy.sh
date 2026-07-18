#!/usr/bin/env bash
# First-time cloud deploy helper (on VPS, after cloud-bootstrap + git clone).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PLUGINS_DIR="${PLUGINS_DIR:-..}"
DOMAIN="${LABWEAVE_DOMAIN:-}"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  LabWeave · cloud-deploy                                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"

cd "$ROOT"
bash scripts/labweave-doctor.sh || true

echo ""
echo "==> production build"
make labweave-prod-build PLUGINS_DIR="$PLUGINS_DIR"

echo ""
echo "==> next steps (sudo on cloud VPS)"
echo "  sudo LABWEAVE_ROOT=$ROOT bash deploy/scripts/install-systemd.sh"
echo "  sudo systemctl enable --now labweave-rule-engine labweave-agent-assist labweave-scheduler labweave-gateway"

if grep -q '^JOB_SUBMIT_MODE=cluster' /etc/labweave/labweave.env 2>/dev/null; then
  echo "  sudo systemctl enable --now labweave-container-manager"
fi

if [ -n "$DOMAIN" ]; then
  echo ""
  echo "  export LABWEAVE_DOMAIN=$DOMAIN"
  echo "  sudo -E LABWEAVE_ROOT=$ROOT bash deploy/scripts/nginx-install.sh --http-only"
  echo "  DEPLOY_VERIFY_URL=http://$DOMAIN make deploy-verify-cloud"
  echo "  sudo certbot --nginx -d $DOMAIN"
  echo "  sudo -E LABWEAVE_ROOT=$ROOT bash deploy/scripts/nginx-install.sh --tls"
  echo "  DEPLOY_VERIFY_URL=https://$DOMAIN make deploy-verify-cloud"
else
  echo ""
  echo "  export LABWEAVE_DOMAIN=your.domain  # then nginx-install steps"
fi

echo ""
echo "Full guide: deploy/04-cloud-vps.md"

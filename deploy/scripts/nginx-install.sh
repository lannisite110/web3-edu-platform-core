#!/usr/bin/env bash
# Install / reload Nginx site for LabWeave on cloud VPS.
#
#   export LABWEAVE_ROOT=/home/ubuntu/web3home/web3-edu-platform-core
#   export LABWEAVE_DOMAIN=labweave.example.com
#   sudo -E bash deploy/scripts/nginx-install.sh --http-only
#   sudo certbot --nginx -d "$LABWEAVE_DOMAIN"
#   sudo -E bash deploy/scripts/nginx-install.sh --tls
set -euo pipefail

MODE="${1:---http-only}"
ROOT="${LABWEAVE_ROOT:-}"
DOMAIN="${LABWEAVE_DOMAIN:-}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run with sudo -E (preserve LABWEAVE_ROOT, LABWEAVE_DOMAIN)"
  exit 1
fi

if [ -z "$ROOT" ] || [ ! -d "${ROOT}/frontend-web/dist" ]; then
  echo "ERROR: set LABWEAVE_ROOT to core repo with built dist/"
  exit 1
fi

if [ -z "$DOMAIN" ]; then
  echo "ERROR: set LABWEAVE_DOMAIN (e.g. labweave.example.com)"
  exit 1
fi

DEPLOY="${ROOT}/deploy"
SITE="/etc/nginx/sites-available/labweave"
ENABLED="/etc/nginx/sites-enabled/labweave"

case "$MODE" in
  --http-only) SRC="${DEPLOY}/nginx/labweave-http-only.conf.example" ;;
  --tls)       SRC="${DEPLOY}/nginx/labweave.conf.example" ;;
  *) echo "Usage: nginx-install.sh [--http-only|--tls]"; exit 1 ;;
esac

sed "s|__LABWEAVE_ROOT__|${ROOT}|g; s|__LABWEAVE_DOMAIN__|${DOMAIN}|g; s|labweave.example.com|${DOMAIN}|g" \
  "$SRC" >"$SITE"

ln -sf "$SITE" "$ENABLED"
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

nginx -t
systemctl enable nginx
systemctl reload nginx

echo "==> nginx installed: $SITE (mode=$MODE)"
echo "    http://$DOMAIN/"

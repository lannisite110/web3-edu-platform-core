#!/usr/bin/env bash
# Install OS packages on a fresh Ubuntu 22.04+ cloud VPS.
# Run: sudo bash deploy/scripts/cloud-bootstrap.sh
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash deploy/scripts/cloud-bootstrap.sh"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "==> LabWeave cloud-bootstrap (Ubuntu)"
. /etc/os-release 2>/dev/null || true
echo "    OS: ${PRETTY_NAME:-unknown}"

apt-get update -qq
apt-get install -y -qq \
  git curl ca-certificates gnupg \
  nginx certbot python3-certbot-nginx \
  python3 python3-venv python3-pip \
  build-essential ufw \
  jq

if ! command -v node >/dev/null 2>&1 || [ "$(node -p "process.version.slice(1).split('.')[0]" 2>/dev/null || echo 0)" -lt 18 ]; then
  echo "==> install Node.js 20.x"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi

need_go=1
if command -v go >/dev/null 2>&1; then
  GO_MINOR=$(go version | awk '{print $3}' | tr -d 'go' | cut -d. -f1,2)
  case "$GO_MINOR" in
    1.2[1-9]|1.[3-9][0-9]|2.*) need_go=0 ;;
  esac
fi
if [ "$need_go" -eq 1 ]; then
  echo "==> install Go 1.22.5 to /usr/local/go"
  ARCH=$(dpkg --print-architecture)
  case "$ARCH" in
    amd64) GOARCH=amd64 ;;
    arm64) GOARCH=arm64 ;;
    *) echo "unsupported arch $ARCH"; exit 1 ;;
  esac
  curl -fsSL "https://go.dev/dl/go1.22.5.linux-${GOARCH}.tar.gz" -o /tmp/go.tgz
  rm -rf /usr/local/go
  tar -C /usr/local -xzf /tmp/go.tgz
  rm /tmp/go.tgz
  echo 'export PATH=$PATH:/usr/local/go/bin' >/etc/profile.d/labweave-go.sh
  export PATH=$PATH:/usr/local/go/bin
fi

echo ""
echo "==> versions"
go version || echo "WARN: go not in PATH"
node -v
npm -v
python3 --version
nginx -v 2>&1 | head -1

echo ""
echo "==> firewall (ufw)"
if ufw status 2>/dev/null | grep -q inactive; then
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  echo "y" | ufw enable || true
fi
ufw status || true

echo ""
echo "==> cloud-bootstrap done"

#!/usr/bin/env bash
# Production build: register plugins + frontend dist + Go binaries.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck source=../lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

PLUGINS_DIR="${PLUGINS_DIR:-..}"
load_deploy_env "$ROOT"

cd "$ROOT"
echo "==> LabWeave production build"
echo "    CORE_ROOT=$ROOT"

for repo in web3-hot-topic-labs supervision-trace-edu-suite enterprise-gov-edu-demo global-social-edu-sandbox; do
  if [ ! -d "${ROOT}/${PLUGINS_DIR}/${repo}" ]; then
    echo "ERROR: missing ${PLUGINS_DIR}/${repo}"
    exit 1
  fi
done

ensure_venv "$ROOT"

echo "==> register plugins"
make register-plugins PLUGINS_DIR="$PLUGINS_DIR"

echo "==> frontend build"
if [ ! -d frontend-web/node_modules ]; then
  (cd frontend-web && npm ci)
fi
(cd frontend-web && npm run build)

echo "==> go binaries"
build_go_binaries "$ROOT"

echo "==> done"
echo "    dist:  ${ROOT}/frontend-web/dist"
echo "    bins:  ${ROOT}/.labweave/bin/"
echo "    next:  make labweave-prod-up  (backends)"
echo "           configure deploy/nginx/labweave.conf.example"

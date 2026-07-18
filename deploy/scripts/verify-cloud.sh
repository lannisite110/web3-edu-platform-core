#!/usr/bin/env bash
# Verify deployed LabWeave via public URL.
#   DEPLOY_VERIFY_URL=https://labweave.example.com make deploy-verify-cloud
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
URL="${DEPLOY_VERIFY_URL:-}"

if [ -z "$URL" ]; then
  echo "ERROR: set DEPLOY_VERIFY_URL=https://your.domain"
  exit 1
fi

URL="${URL%/}"
export DEPLOY_VERIFY_URL="$URL"

# shellcheck source=../lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

echo "==> LabWeave cloud verify: $URL"
wait_url "$URL/" "homepage" 30
wait_url "$URL/learn" "learn page" 30
bash "${ROOT}/deploy/scripts/verify-local.sh"

if [[ "$URL" == https://* ]]; then
  HOST="${URL#https://}"
  echo | openssl s_client -connect "${HOST}:443" -servername "$HOST" 2>/dev/null \
    | openssl x509 -noout -subject -dates 2>/dev/null || echo "WARN: TLS cert check skipped"
fi

echo "==> deploy-verify-cloud PASSED"
echo "    manual: deploy/checklists/post-deploy-smoke.md"

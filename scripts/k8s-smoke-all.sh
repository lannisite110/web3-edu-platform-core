#!/usr/bin/env bash
# Run all K8s Job smoke tests (DAO + multi-lang compile). Requires kubectl + cluster.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=../deploy/lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  LabWeave · K8s Job 冒烟（cluster 模式调度链）                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"

k8s_preflight

echo ""
echo "==> [1/2] k8s-job-smoke (HOT_DAO_VOTE_SIM)"
bash "${ROOT}/scripts/k8s-job-smoke.sh"

echo ""
echo "==> [2/2] k8s-multilang-smoke (HOT_MULTI_LANG_COMPILE)"
bash "${ROOT}/scripts/k8s-multilang-smoke.sh"

cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║  K8s 冒烟全部通过                                             ║
╠══════════════════════════════════════════════════════════════╣
║  生产启用 cluster 模式:                                       ║
║    JOB_SUBMIT_MODE=cluster 于 /etc/labweave/labweave.env      ║
║    make labweave-prod-up  (会启动 container-manager)         ║
╚══════════════════════════════════════════════════════════════╝

EOF

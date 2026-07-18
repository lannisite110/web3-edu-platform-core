#!/usr/bin/env bash
# Run all K8s Job smoke tests + write report.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=../deploy/lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

REPORT_DIR="${ROOT}/deploy/reports"
mkdir -p "$REPORT_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
REPORT="${REPORT_DIR}/k8s-smoke-${STAMP}.txt"

exec > >(tee -a "$REPORT") 2>&1

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  LabWeave · K8s Job 冒烟（cluster 模式调度链）                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo "report: $REPORT"
echo "started: $(date -Iseconds)"

k8s_preflight

echo ""
echo "==> [0/2] optional base apply (K8S_SMOKE_APPLY_BASE=1)"
if [ "${K8S_SMOKE_APPLY_BASE:-0}" = "1" ]; then
  bash "${ROOT}/deploy/scripts/k8s-apply-base.sh"
fi

echo ""
echo "==> [1/2] k8s-job-smoke (HOT_DAO_VOTE_SIM)"
bash "${ROOT}/scripts/k8s-job-smoke.sh"

echo ""
echo "==> [2/2] k8s-multilang-smoke (HOT_MULTI_LANG_COMPILE)"
bash "${ROOT}/scripts/k8s-multilang-smoke.sh"

echo ""
echo "==> cluster jobs snapshot"
kubectl get jobs -A 2>/dev/null | tail -n +1 | head -20 || true

echo ""
echo "finished: $(date -Iseconds)"
cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║  K8s 冒烟全部通过                                             ║
╠══════════════════════════════════════════════════════════════╣
║  报告: ${REPORT}
║  生产: JOB_SUBMIT_MODE=cluster → deploy/env/labweave.cloud-k8s.env.example
║  文档: deploy/03-k8s-jobs.md
╚══════════════════════════════════════════════════════════════╝

EOF

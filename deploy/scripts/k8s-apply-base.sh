#!/usr/bin/env bash
# Apply core K8s base manifests + optional hot-labs Job templates.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PLUGINS_DIR="${PLUGINS_DIR:-..}"
HOT_ROOT="${ROOT}/${PLUGINS_DIR}/web3-hot-topic-labs"

# shellcheck source=../lib/common.sh
source "${ROOT}/deploy/lib/common.sh"

APPLY_HOT="${K8S_APPLY_HOT_OVERLAYS:-1}"

k8s_preflight

echo "==> apply core base (namespaces + testnet configmaps)"
kubectl apply -f "${ROOT}/k8s-manifests/base/namespaces.yaml"
kubectl apply -f "${ROOT}/k8s-manifests/base/testnet-rpc-configmaps.yaml"
[ -f "${ROOT}/k8s-manifests/base/testnet-rpc-configmap.yaml" ] && \
  kubectl apply -f "${ROOT}/k8s-manifests/base/testnet-rpc-configmap.yaml" || true

echo ""
echo "==> namespaces:"
kubectl get ns -l edu.web3/tier 2>/dev/null || kubectl get ns | grep -E '^ns-' || true

if [ "$APPLY_HOT" = "1" ] && [ -d "$HOT_ROOT/k8s/overlays" ]; then
  echo ""
  echo "==> apply hot-topic-labs Job templates (educational; no auto-run)"
  find "$HOT_ROOT/k8s/overlays" -name '*.yaml' -type f | sort | while read -r f; do
    echo "    kubectl apply -f $f"
    kubectl apply -f "$f"
  done
else
  echo ""
  echo "==> skip hot overlays (K8S_APPLY_HOT_OVERLAYS=0 or repo missing)"
fi

echo ""
echo "==> k8s-apply-base done"
echo "    next: make k8s-smoke-all"

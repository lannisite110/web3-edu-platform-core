#!/usr/bin/env bash
# v0.3 — Apply Fabric teaching sandbox overlays (fictional endpoints, no real network).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TRACE_ROOT="${TRACE_ROOT:-$(cd "$ROOT/.." && pwd)/supervision-trace-edu-suite}"
KUBECTL="${KUBECTL:-kubectl}"

echo "==> fabric-sandbox-bootstrap (v0.3)"
echo "    CORE_ROOT=$ROOT"
echo "    TRACE_ROOT=$TRACE_ROOT"

if ! command -v "$KUBECTL" >/dev/null 2>&1; then
  echo "WARN: kubectl not found — dry-run manifest paths only"
  echo "  - $ROOT/k8s-manifests/base/namespaces.yaml"
  echo "  - $TRACE_ROOT/k8s/overlays/ns-domain-cn/fabric-sandbox-configmap.yaml"
  exit 0
fi

"$KUBECTL" apply -f "$ROOT/k8s-manifests/base/namespaces.yaml"
"$KUBECTL" apply -f "$TRACE_ROOT/k8s/overlays/ns-domain-cn/fabric-sandbox-configmap.yaml"

for job in charity-ledger food-trace medical-tamper; do
  f="$TRACE_ROOT/k8s/overlays/ns-domain-cn/${job}-job.yaml"
  if [ -f "$f" ]; then
    "$KUBECTL" apply -f "$f"
    echo "  applied $job job template"
  fi
done

echo "==> Fabric sandbox bootstrap complete (edu-cn-trace-sandbox / fabric-local)"

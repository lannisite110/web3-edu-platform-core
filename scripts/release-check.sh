#!/usr/bin/env bash
# v1.0 — pre-release gate (lighter than full ci-gate for local use).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> release-check (core $(tr -d '[:space:]' < VERSION))"

make compliance-check
make register-plugins PLUGINS_DIR=..
make tutorial-audit PLUGINS_DIR=..
STRICT=1 make core-version-check PLUGINS_DIR=.. || {
  echo "NOTE: sub-repo coreVersion bumps required before v1.0.0 tag"
  exit 1
}
make container-manager-smoke
make scheduler-resolver-smoke
make integration-all-plugins
bash ci/bazel-gate.sh

echo "==> release-check PASSED"

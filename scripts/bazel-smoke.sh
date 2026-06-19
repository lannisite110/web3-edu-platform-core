#!/usr/bin/env bash
# v0.6 — optional Bazel scaffold check (skips when bazel is not installed).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v bazel >/dev/null 2>&1; then
  echo "SKIP: bazel not installed — MODULE.bazel scaffold only"
  test -f MODULE.bazel
  test -f BUILD.bazel
  echo "==> bazel scaffold smoke PASSED (skip)"
  exit 0
fi

bazel version
bazel build //:all
echo "==> bazel scaffold smoke PASSED"

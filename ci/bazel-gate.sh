#!/usr/bin/env bash
# CI Bazel gate — build Go control-plane + gateway binaries.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BAZEL="${BAZEL:-bazelisk}"
if ! command -v "$BAZEL" >/dev/null 2>&1 && ! command -v bazel >/dev/null 2>&1; then
  BAZEL="${ROOT}/.ci-bin/bazelisk"
  if [ ! -x "$BAZEL" ]; then
    mkdir -p .ci-bin
    curl -sSL -o "$BAZEL" \
      "https://github.com/bazelbuild/bazelisk/releases/download/v1.25.0/bazelisk-linux-amd64"
    chmod +x "$BAZEL"
  fi
fi
command -v "$BAZEL" >/dev/null 2>&1 || BAZEL=bazel

echo "==> bazel-gate"
"$BAZEL" version 2>&1 | sed -n '1p' || true
"$BAZEL" mod tidy
"$BAZEL" build \
  //control-plane-go/cmd/scheduler:scheduler \
  //control-plane-go/cmd/container-manager:container-manager
echo "==> bazel-gate PASSED"

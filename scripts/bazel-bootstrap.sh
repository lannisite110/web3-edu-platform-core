#!/usr/bin/env bash
# Generate BUILD.bazel via gazelle and build control-plane binaries.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BAZEL="${BAZEL:-}"
if [ -z "$BAZEL" ]; then
  if command -v bazelisk >/dev/null 2>&1; then
    BAZEL=bazelisk
  elif command -v bazel >/dev/null 2>&1; then
    BAZEL=bazel
  else
  mkdir -p .ci-bin
  BAZEL="${ROOT}/.ci-bin/bazelisk"
  if [ ! -x "$BAZEL" ]; then
    echo "==> download bazelisk"
    curl -sSL -o "$BAZEL" \
      "https://github.com/bazelbuild/bazelisk/releases/download/v1.25.0/bazelisk-linux-amd64"
    chmod +x "$BAZEL"
  fi
  fi
fi

echo "==> bazel ($("$BAZEL" version 2>/dev/null | head -1))"
"$BAZEL" mod tidy
"$BAZEL" run //:gazelle
"$BAZEL" build //control-plane-go/cmd/scheduler //control-plane-go/cmd/container-manager
echo "==> bazel bootstrap PASSED"

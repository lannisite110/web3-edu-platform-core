#!/usr/bin/env bash
# CI Bazel gate wrapper for Makefile.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
bash "${ROOT}/ci/bazel-gate.sh"

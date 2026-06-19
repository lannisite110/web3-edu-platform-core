#!/usr/bin/env bash
# v1.0 — verify plugin coreVersion ranges include the main repo VERSION.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLUGINS_DIR="${PLUGINS_DIR:-$(cd "$ROOT/.." && pwd)}"
STRICT="${STRICT:-0}"
PYTHON="${ROOT}/.venv/bin/python"
[ -x "$PYTHON" ] || PYTHON=python3

CORE_VERSION="$(tr -d '[:space:]' < "${ROOT}/VERSION")"
fail=0
total=0
incompatible=0

while IFS= read -r manifest; do
  total=$((total + 1))
  spec="$("$PYTHON" - "$manifest" "$CORE_VERSION" <<'PY'
import sys, yaml, re
from pathlib import Path

manifest_path, core_version = sys.argv[1:3]
data = yaml.safe_load(Path(manifest_path).read_text(encoding="utf-8"))
spec = (data.get("spec") or {}).get("coreVersion", "")
pid = data["metadata"]["id"]

def parse_ver(s):
    return tuple(int(x) for x in s.split("."))

def satisfies(version, range_spec):
    if not range_spec:
        return False
    v = parse_ver(version)
    parts = re.findall(r"(>=|>|<=|<)\s*([\d.]+)", range_spec)
    for op, bound_s in parts:
        bound = parse_ver(bound_s)
        if op == ">=" and v < bound:
            return False
        if op == ">" and v <= bound:
            return False
        if op == "<" and v >= bound:
            return False
        if op == "<=" and v > bound:
            return False
    return True

ok = satisfies(core_version, spec)
print(f"{pid}\t{spec}\t{ok}")
PY
)"
  plugin_id="${spec%%	*}"
  rest="${spec#*	}"
  range="${rest%%	*}"
  ok="${rest##*	}"
  if [ "$ok" != "True" ]; then
    incompatible=$((incompatible + 1))
    echo "INCOMPATIBLE $plugin_id coreVersion=$range (core=$CORE_VERSION)"
    fail=$((fail + 1))
  fi
done < <(find "$PLUGINS_DIR" -name 'plugin.manifest.yaml' | sort)

echo "==> core-version-check: core=$CORE_VERSION plugins=$total incompatible=$incompatible"
if [ "$fail" -gt 0 ] && [ "$STRICT" = "1" ]; then
  exit 1
fi
if [ "$fail" -gt 0 ]; then
  echo "WARN: $fail plugin(s) need coreVersion bump for v1.0 (set STRICT=1 to fail)"
fi

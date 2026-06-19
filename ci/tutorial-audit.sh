#!/usr/bin/env bash
# v0.5 — verify each plugin manifest lists existing tutorial/docs paths.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLUGINS_DIR="${PLUGINS_DIR:-$(cd "$ROOT/.." && pwd)}"
PYTHON="${ROOT}/.venv/bin/python"
[ -x "$PYTHON" ] || PYTHON=python3

fail=0
total=0
missing=0

while IFS= read -r manifest; do
  total=$((total + 1))
  repo_root="$("$PYTHON" - <<PY
from pathlib import Path
p = Path("$manifest").resolve()
if p.parent.name == "examples":
    print(p.parent.parent)
elif p.parent.parent.name == "plugins":
    print(p.parent.parent.parent)
else:
    print(p.parent.parent)
PY
)"

  docs="$("$PYTHON" - <<PY
import yaml
from pathlib import Path
data = yaml.safe_load(Path("$manifest").read_text(encoding="utf-8"))
for doc in (data.get("spec") or {}).get("docs") or []:
    print(doc)
PY
)"

  if [ -z "$docs" ]; then
    echo "FAIL $manifest — spec.docs is empty"
    fail=$((fail + 1))
    continue
  fi

  while IFS= read -r doc; do
    [ -n "$doc" ] || continue
    path="${repo_root}/${doc}"
    if [ ! -f "$path" ]; then
      echo "FAIL $manifest — missing doc: $doc"
      missing=$((missing + 1))
      fail=$((fail + 1))
    fi
  done <<< "$docs"
done < <(find "$PLUGINS_DIR" -name 'plugin.manifest.yaml' | sort)

echo "==> tutorial audit: plugins=$total missing_docs=$missing failures=$fail"
[ "$fail" -eq 0 ]

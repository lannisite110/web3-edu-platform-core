#!/usr/bin/env bash
# v0.5+ — verify plugin docs exist and include testnet compliance wording.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLUGINS_DIR="${PLUGINS_DIR:-$(cd "$ROOT/.." && pwd)}"
PYTHON="${ROOT}/.venv/bin/python"
[ -x "$PYTHON" ] || PYTHON=python3

fail=0
total=0
missing=0
content_fail=0

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
      continue
    fi
    case "$doc" in
      *.md) ;;
      *) continue ;;
    esac
    if ! grep -qiE 'testnet|测试网|沙箱|sandbox|fabric' "$path"; then
      echo "FAIL $manifest — doc missing testnet disclaimer: $doc"
      content_fail=$((content_fail + 1))
      fail=$((fail + 1))
    fi
  done <<< "$docs"
done < <(find "$PLUGINS_DIR" -name 'plugin.manifest.yaml' | sort)

echo "==> tutorial audit: plugins=$total missing_docs=$missing content_fail=$content_fail failures=$fail"
[ "$fail" -eq 0 ]

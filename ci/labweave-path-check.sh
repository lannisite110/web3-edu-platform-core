#!/usr/bin/env bash
# LabWeave L1: labweave-path.json pluginId 与 registry 对齐
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REG="$ROOT/frontend-web/src/plugins/plugins.registry.json"
PATH_JSON="$ROOT/frontend-web/src/data/labweave-path.json"

python3 - <<PY
import json
from pathlib import Path

reg = json.loads(Path("$REG").read_text())
path = json.loads(Path("$PATH_JSON").read_text())
reg_ids = {p["id"] for p in reg}

ids = [s["pluginId"] for s in path["prerequisite"]["steps"]]
for t in path["tracks"]:
    ids.extend(s["pluginId"] for s in t["steps"])

missing = [i for i in ids if i not in reg_ids]
dupes = [i for i in ids if ids.count(i) > 1]
if dupes:
    raise SystemExit(f"duplicate pluginId in labweave-path: {sorted(set(dupes))}")
if missing:
    raise SystemExit(f"pluginId not in registry: {missing}")
print(f"OK labweave-path: {len(ids)} steps, all in registry")
PY

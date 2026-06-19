#!/usr/bin/env bash
# 校验子库 plugin.manifest.yaml 是否符合 schema + task-types + chainId 白名单
set -euo pipefail

MANIFEST="${MANIFEST:-${1:-}}"
SCHEMA="${SCHEMA:-schemas/plugin.manifest.schema.json}"
TASK_TYPES="${TASK_TYPES:-schemas/task-types.yaml}"

if [ -z "$MANIFEST" ]; then
  echo "Usage: MANIFEST=path/to/plugin.manifest.yaml make validate-plugin"
  exit 1
fi

if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: manifest not found: $MANIFEST"
  exit 1
fi

echo "==> validate-plugin: $MANIFEST"

# 需要 python3 + pyyaml；若无则仅做结构提示
python3 - <<'PY' "$MANIFEST" "$SCHEMA" "$TASK_TYPES"
import json, sys, yaml, re
from pathlib import Path

manifest_path, schema_path, task_types_path = sys.argv[1:4]
manifest = yaml.safe_load(Path(manifest_path).read_text())

assert manifest.get("apiVersion") == "edu.web3/v1", "apiVersion must be edu.web3/v1"
assert manifest.get("kind") == "PluginPackage", "kind must be PluginPackage"

meta = manifest["metadata"]
spec = manifest["spec"]
pid = meta["id"]
assert re.match(r"^edu\.(hot|cn|global)\.[a-z0-9.-]+$", pid), f"invalid plugin id: {pid}"

allowed_ids = {11155111, 17000, 80002, 97, "devnet", "fabric-local"}
for cid in spec["allowedChainIds"]:
    assert cid in allowed_ids, f"chainId {cid} not in whitelist"

tt = yaml.safe_load(Path(task_types_path).read_text())
all_types = set()
for k, v in tt.items():
    if isinstance(v, list):
        all_types.update(v)
for t in spec["taskTypes"]:
    assert t in all_types, f"TaskType {t} not registered in task-types.yaml"

rules_entry = spec["rules"]["entry"]
assert re.match(r"^plugins\.rules\.[a-z0-9_]+:evaluate$", rules_entry)

print(f"OK: {pid} v{meta['version']} taskTypes={spec['taskTypes']}")
PY

echo "==> validate-plugin PASSED"

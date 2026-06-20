"""Load per-plugin context bundles for LabWeave assist."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import yaml

CORE_ROOT = Path(os.environ.get("CORE_ROOT", Path(__file__).resolve().parent.parent))
REGISTRY_CANDIDATES = [
    CORE_ROOT / "api-gateway-go" / "config" / "plugins.registry.json",
    CORE_ROOT / "frontend-web" / "src" / "plugins" / "plugins.registry.json",
]

BUNDLE_OVERRIDES: dict[str, dict[str, Any]] = {
    "edu.hot.language-advisor": {
        "focus": ["语言择优", "toolchain_group", "suggested_lab", "7 语言组"],
        "disclaimer": "仅推荐测试网教学语言，不提供主网部署建议。",
    },
    "edu.cn.trace.food": {
        "focus": ["batch_id", "merkle_proof", "fabric-local", "溯源链"],
        "disclaimer": "虚构批次数据 · Fabric 沙箱 only。",
    },
    "edu.cn.gov.bid-graph": {
        "focus": ["suspicion_score", "risk_level", "图谱节点", "关联评分"],
        "disclaimer": "虚构招投标数据 · 不对接真实采购系统。",
    },
}


def _registry_path() -> Path:
    for p in REGISTRY_CANDIDATES:
        if p.exists():
            return p
    raise FileNotFoundError("plugins.registry.json not found; run make register-plugins")


def find_plugin(plugin_id: str) -> dict[str, Any] | None:
    data = json.loads(_registry_path().read_text(encoding="utf-8"))
    for p in data:
        if p.get("id") == plugin_id:
            return p
    return None


def _repo_root(manifest_path: Path) -> Path:
    cur = manifest_path.parent
    for _ in range(6):
        if (cur / "VERSION").exists() or (cur / "TASK.md").exists():
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    return manifest_path.parent.parent.parent


def _read_tutorial_excerpt(repo: Path, manifest_path: Path) -> str:
    try:
        doc = yaml.safe_load(manifest_path.read_text(encoding="utf-8"))
        docs = (doc or {}).get("spec", {}).get("docs") or []
        if not docs:
            return ""
        rel = docs[0]
        tutorial = repo / rel
        if not tutorial.is_file():
            return ""
        text = tutorial.read_text(encoding="utf-8")
        return text[:2400].strip()
    except Exception:
        return ""


def load_bundle(plugin_id: str) -> dict[str, Any]:
    plugin = find_plugin(plugin_id)
    if not plugin:
        return {"plugin_id": plugin_id, "error": "plugin not found"}

    manifest_path = Path(plugin.get("manifestPath", ""))
    excerpt = ""
    if manifest_path.is_file():
        excerpt = _read_tutorial_excerpt(_repo_root(manifest_path), manifest_path)

    override = BUNDLE_OVERRIDES.get(plugin_id, {})
    return {
        "plugin_id": plugin_id,
        "name": plugin.get("name", plugin_id),
        "task_types": plugin.get("taskTypes", []),
        "namespaces": plugin.get("namespaces", []),
        "allowed_chain_ids": plugin.get("allowedChainIds", []),
        "compliance_tier": plugin.get("complianceTier", ""),
        "rules_entry": plugin.get("rulesEntry", ""),
        "tutorial_excerpt": excerpt,
        "focus_topics": override.get("focus", []),
        "disclaimer": override.get(
            "disclaimer",
            "教学模拟 only — not compliance or financial advice.",
        ),
    }

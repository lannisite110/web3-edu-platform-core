"""Python 规则插件注册表 — 按 manifest 所属仓库隔离加载，避免 plugins.rules 包名冲突。"""

from __future__ import annotations

import importlib
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable

_SUB_REPO_MARKERS = (
    "web3-hot-topic-labs",
    "supervision-trace-edu-suite",
    "enterprise-gov-edu-demo",
    "global-social-edu-sandbox",
)


@dataclass
class RuleInput:
    user_prompt: str
    params: dict[str, Any]
    allowed_chain_ids: list[int | str]


@dataclass
class RuleOutput:
    recommended_template: str
    recommended_language: str
    audit_hints: list[str]
    compliance_passed: bool
    rejection_reason: str | None = None


EvaluateFn = Callable[[RuleInput], RuleOutput]


def repo_root_from_manifest(manifest_path: str | Path) -> Path:
    p = Path(manifest_path).resolve()
    if p.parent.name == "examples":
        return p.parent.parent
    if p.parent.parent.name == "plugins":
        return p.parent.parent.parent
    return p.parent.parent


def resolve_plugin_root(manifest_path: str | Path) -> Path:
    repo = repo_root_from_manifest(manifest_path)
    bundled = repo / "rule-engine-py" / "plugins" / "rules"
    if bundled.is_dir():
        return repo / "rule-engine-py"
    return repo


def _clear_plugin_modules() -> None:
    for key in list(sys.modules):
        if key == "plugins" or key.startswith("plugins."):
            del sys.modules[key]


def load_evaluator(entry: str, manifest_path: str | Path | None = None) -> EvaluateFn:
    """entry format: plugins.rules.zk_modular:evaluate"""
    module_path, func_name = entry.split(":")

    if manifest_path is None:
        module = importlib.import_module(module_path)
    else:
        repo_root = resolve_plugin_root(manifest_path)
        old_path = sys.path[:]
        filtered = [p for p in sys.path if not any(m in p for m in _SUB_REPO_MARKERS)]
        _clear_plugin_modules()
        sys.path = [str(repo_root)] + [p for p in filtered if p != str(repo_root)]
        try:
            module = importlib.import_module(module_path)
        finally:
            _clear_plugin_modules()
            sys.path = old_path

    fn = getattr(module, func_name)
    if not callable(fn):
        raise TypeError(f"{entry} is not callable")
    return fn


def run_plugin(
    entry: str,
    inp: RuleInput,
    manifest_path: str | Path | None = None,
) -> RuleOutput:
    blocked_mainnet = {1, 56, 137, 42161, 10, 8453}
    for cid in inp.allowed_chain_ids:
        if isinstance(cid, int) and cid in blocked_mainnet:
            return RuleOutput(
                recommended_template="",
                recommended_language="",
                audit_hints=[],
                compliance_passed=False,
                rejection_reason=f"mainnet chainId {cid} blocked",
            )
    evaluator = load_evaluator(entry, manifest_path)
    return evaluator(inp)

"""Web3 Education Platform — Rule Engine (FastAPI)."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from plugins.registry import RuleInput, RuleOutput, run_plugin  # noqa: E402

app = FastAPI(title="Web3 Edu Rule Engine", version="0.1.0")

REGISTRY_PATH = ROOT.parent / "api-gateway-go" / "config" / "plugins.registry.json"
if not REGISTRY_PATH.exists():
    REGISTRY_PATH = ROOT.parent / "frontend-web" / "src" / "plugins" / "plugins.registry.json"


class EvaluateRequest(BaseModel):
    plugin_id: str
    user_prompt: str = ""
    params: dict[str, Any] = Field(default_factory=dict)
    allowed_chain_ids: list[int | str] = Field(default=[11155111])


class EvaluateResponse(BaseModel):
    recommended_template: str
    recommended_language: str
    audit_hints: list[str]
    compliance_passed: bool
    rejection_reason: str | None = None


def _load_registry() -> list[dict]:
    if not REGISTRY_PATH.exists():
        return []
    return json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))


def _find_plugin(plugin_id: str) -> dict | None:
    for p in _load_registry():
        if p["id"] == plugin_id:
            return p
    return None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "rule-engine-py"}


@app.post("/evaluate", response_model=EvaluateResponse)
def evaluate(req: EvaluateRequest) -> EvaluateResponse:
    plugin = _find_plugin(req.plugin_id)
    if not plugin:
        raise HTTPException(status_code=404, detail=f"plugin not found: {req.plugin_id}")

    inp = RuleInput(
        user_prompt=req.user_prompt,
        params=req.params,
        allowed_chain_ids=req.allowed_chain_ids,
    )
    try:
        out: RuleOutput = run_plugin(
            plugin["rulesEntry"],
            inp,
            plugin.get("manifestPath"),
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return EvaluateResponse(
        recommended_template=out.recommended_template,
        recommended_language=out.recommended_language,
        audit_hints=out.audit_hints,
        compliance_passed=out.compliance_passed,
        rejection_reason=out.rejection_reason,
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("RULE_ENGINE_PORT", "8081"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

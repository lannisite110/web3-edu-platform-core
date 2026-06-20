"""LabWeave Agent Assist — compliance-gated sandbox tutor (L2)."""

from __future__ import annotations

import os
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from context import load_bundle
from tutor import generate_answer

app = FastAPI(title="LabWeave Agent Assist", version="0.1.0")

RULE_ENGINE_URL = os.environ.get("RULE_ENGINE_URL", "http://127.0.0.1:8081")


class AssistRequest(BaseModel):
    message: str
    user_prompt: str = ""
    params: dict[str, Any] = Field(default_factory=dict)
    allowed_chain_ids: list[int | str] = Field(default_factory=lambda: ["fabric-local"])
    audit_hints: list[str] = Field(default_factory=list)


class AssistResponse(BaseModel):
    plugin_id: str
    compliance_passed: bool
    rejection_reason: str | None = None
    answer: str
    mode: str
    evaluation: dict[str, Any]
    context_summary: dict[str, Any]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "agent-assist-py"}


@app.post("/assist/{plugin_id}", response_model=AssistResponse)
async def assist(plugin_id: str, req: AssistRequest) -> AssistResponse:
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message is required")

    bundle = load_bundle(plugin_id)
    if bundle.get("error"):
        raise HTTPException(status_code=404, detail=bundle["error"])

    eval_payload = {
        "plugin_id": plugin_id,
        "user_prompt": req.user_prompt or req.message,
        "params": req.params,
        "allowed_chain_ids": req.allowed_chain_ids or bundle.get("allowed_chain_ids", ["fabric-local"]),
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            er = await client.post(f"{RULE_ENGINE_URL}/evaluate", json=eval_payload)
            er.raise_for_status()
            evaluation = er.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"rule engine unavailable: {exc}") from exc

    if not evaluation.get("compliance_passed", False):
        reason = evaluation.get("rejection_reason") or "compliance check failed"
        answer = (
            f"【合规拦截】本次 assist 已调用 rule-engine evaluate，未通过合规检查。\n\n"
            f"原因：{reason}\n\n"
            f"audit_hints: {', '.join(evaluation.get('audit_hints') or [])}\n\n"
            "助教仅可解释拒绝原因，不能协助绕过沙箱策略。"
        )
        return AssistResponse(
            plugin_id=plugin_id,
            compliance_passed=False,
            rejection_reason=reason,
            answer=answer,
            mode="compliance-block",
            evaluation=evaluation,
            context_summary={
                "name": bundle.get("name"),
                "focus_topics": bundle.get("focus_topics"),
            },
        )

    answer, mode = await generate_answer(plugin_id, req.message, evaluation, bundle)

    return AssistResponse(
        plugin_id=plugin_id,
        compliance_passed=True,
        answer=answer,
        mode=mode,
        evaluation=evaluation,
        context_summary={
            "name": bundle.get("name"),
            "task_types": bundle.get("task_types"),
            "focus_topics": bundle.get("focus_topics"),
            "disclaimer": bundle.get("disclaimer"),
        },
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("AGENT_ASSIST_PORT", "8084"))
    host = os.environ.get("LISTEN_HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=False)

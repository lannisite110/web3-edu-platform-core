"""LabWeave local sandbox tutor (L2 MVP). Optional LLM when configured."""

from __future__ import annotations

import os
import re
from typing import Any

MAINNET_PATTERNS = re.compile(
    r"mainnet|主网|ethereum\s*1\b|chain\s*id\s*=\s*1\b",
    re.IGNORECASE,
)


def _hint_map(hints: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for h in hints:
        if "=" in h:
            k, v = h.split("=", 1)
            out[k.strip()] = v.strip()
    return out


def local_answer(
    plugin_id: str,
    message: str,
    evaluation: dict[str, Any],
    bundle: dict[str, Any],
) -> str:
    msg = message.strip()
    lower = msg.lower()
    hints = evaluation.get("audit_hints") or []
    hm = _hint_map(hints)
    lines = [
        f"【沙箱助教 · {bundle.get('name', plugin_id)}】",
        bundle.get("disclaimer", ""),
        "",
    ]

    if plugin_id == "edu.cn.trace.food":
        if any(k in lower for k in ("batch", "批次", "batch_id")):
            bid = hm.get("batch_id", "（运行仿真后可见）")
            lines += [
                f"修改 `batch_id` 会写入规则 hints 中的 `batch_id={bid}`。",
                "当前参数经 evaluate 后进入 audit_hints，并随 simulate 提交到 Fabric 教学 Job。",
                "Merkle 证明在 UI 中为教学简化示意，链码路径见 `plugins/food-trace/chaincode/food_trace.go`。",
            ]
        elif any(k in lower for k in ("merkle", "证明", "hash")):
            lines += [
                "本 Lab 演示批次链路哈希与 Merkle root 概念。",
                "hints 含 `merkle_proof_enabled`；真实证明结构见教程分步实验。",
            ]
        elif any(k in lower for k in ("fabric", "通道", "chaincode")):
            lines += [
                "沙箱 chainId: `fabric-local`，通道 `edu-cn-trace-sandbox`，组织 `OrgEduDemo`。",
                "Job 门禁会校验 chaincode 路径存在（见 ns-domain-cn Job 模板）。",
            ]
        else:
            lines += [
                "可问：batch_id 如何影响 hints？Merkle 证明做什么？Fabric 沙箱通道？",
                f"当前 evaluate hints: {', '.join(hints[:6]) or '（先运行一次仿真实验）'}",
            ]

    elif plugin_id == "edu.cn.gov.bid-graph":
        score = hm.get("suspicion_score", "?")
        risk = hm.get("risk_level", "?")
        if any(k in lower for k in ("score", "评分", "suspicion", "风险")):
            lines += [
                f"教学评分 `suspicion_score={score}`，风险等级 `risk_level={risk}`。",
                "图谱中相同法定代表人（如张某某）连接多节点会抬高关联分。",
                "findings 列表来自规则引擎文本 hints（非真实采购数据）。",
            ]
        elif any(k in lower for k in ("graph", "图谱", "节点", "边")):
            lines += [
                f"当前图规模：nodes={hm.get('nodes', '?')} edges={hm.get('edges', '?')}。",
                "UI SVG 为示意；规则侧使用 sample-graph.json 做图算法教学。",
            ]
        else:
            lines += [
                "可问：suspicion_score 怎么算？风险等级含义？图谱节点/边数量？",
                f"当前 hints 摘要: suspicion_score={score}, risk_level={risk}",
            ]

    elif plugin_id == "edu.hot.language-advisor":
        lang = evaluation.get("recommended_language") or hm.get("language", "solidity")
        tg = evaluation.get("toolchain_group") or hm.get("toolchain_group", "evm")
        lab = evaluation.get("suggested_lab", "")
        if any(k in lower for k in ("语言", "language", "推荐", "solidity", "cairo", "rust")):
            lines += [
                f"当前推荐语言：**{lang}**（toolchain_group={tg}）。",
                f"建议跳转 Lab: `{lab or '见 suggested_lab'}`。",
                "场景 chip 会映射到 `language-choice-rules.yaml` 静态规则，非 LLM 臆测。",
            ]
        elif any(k in lower for k in ("compile", "编译", "job")):
            lines += [
                "进阶 TaskType: `HOT_MULTI_LANG_COMPILE` 会触发对应 Namespace 编译 Job。",
                "需 K8s 时拉取 toolchain 镜像；本地模式为模拟报告。",
            ]
        else:
            lines += [
                "可问：为什么推荐某语言？toolchain_group 是什么？如何触发编译 Job？",
                f"最近一次 evaluate: language={lang}, toolchain_group={tg}",
            ]
    else:
        lines += [
            f"插件 {plugin_id} 的 L2 助教 MVP 未定制话术，以下为 evaluate 摘要：",
            f"hints: {', '.join(hints[:8]) or '无'}",
        ]

    lines += ["", "— 合规声明：测试网/沙箱 only · 禁止主网部署与金融建议 —"]
    return "\n".join(lines)


async def generate_answer(
    plugin_id: str,
    message: str,
    evaluation: dict[str, Any],
    bundle: dict[str, Any],
) -> tuple[str, str]:
    """Returns (answer, mode)."""
    if MAINNET_PATTERNS.search(message):
        return (
            "请求涉及主网部署或主网 chainId，已被沙箱助教拒绝。"
            "本平台仅支持测试网与 fabric-local 教学环境。",
            "blocked",
        )

    mode = os.environ.get("LABWEAVE_AGENT_MODE", "local").lower()
    api_key = os.environ.get("LABWEAVE_AGENT_API_KEY", "")
    base_url = os.environ.get("LABWEAVE_AGENT_BASE_URL", "")

    if mode == "llm" and api_key and base_url:
        try:
            import httpx

            system = (
                "You are LabWeave sandbox tutor. Education only. "
                "Never advise mainnet deployment, ICO, or real financial compliance. "
                f"Context: {bundle.get('tutorial_excerpt', '')[:1200]}"
            )
            async with httpx.AsyncClient(timeout=30.0) as client:
                r = await client.post(
                    f"{base_url.rstrip('/')}/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}"},
                    json={
                        "model": os.environ.get("LABWEAVE_AGENT_MODEL", "gpt-4o-mini"),
                        "messages": [
                            {"role": "system", "content": system},
                            {
                                "role": "user",
                                "content": f"plugin={plugin_id}\nevaluation={evaluation}\nquestion={message}",
                            },
                        ],
                        "max_tokens": 600,
                    },
                )
                r.raise_for_status()
                data = r.json()
                content = data["choices"][0]["message"]["content"]
                return content.strip(), "llm"
        except Exception as exc:
            fallback = local_answer(plugin_id, message, evaluation, bundle)
            return fallback + f"\n\n(LLM 不可用，已回退本地助教: {exc})", "local-fallback"

    return local_answer(plugin_id, message, evaluation, bundle), "local"

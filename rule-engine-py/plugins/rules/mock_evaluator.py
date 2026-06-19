"""Built-in mock evaluator for E2E smoke tests."""

from __future__ import annotations

from plugins.registry import RuleInput, RuleOutput


def evaluate(inp: RuleInput) -> RuleOutput:
    if inp.params.get("target_network") == "mainnet":
        return RuleOutput(
            recommended_template="",
            recommended_language="",
            audit_hints=[],
            compliance_passed=False,
            rejection_reason="mainnet forbidden",
        )
    return RuleOutput(
        recommended_template="examples/mock-contract.sol",
        recommended_language="solidity",
        audit_hints=["mock smoke test passed", "testnet-only"],
        compliance_passed=True,
    )

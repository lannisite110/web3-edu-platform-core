#!/usr/bin/env bash
# 主网/违规关键词扫描 — 全仓 CI 必须调用
set -euo pipefail

ROOT="${1:-.}"
BLOCKED_FILE="${2:-schemas/allowed-chain-ids.yaml}"

should_skip() {
  local f="$1"
  [[ "$f" == *"COMPLIANCE"* ]] && return 0
  [[ "$f" == *"AGENT_CONTRACT"* ]] && return 0
  [[ "$f" == *"PLUGIN_CONTRACT"* ]] && return 0
  [[ "$f" == *"allowed-chain-ids.yaml"* ]] && return 0
  [[ "$f" == *"compliance-check.sh"* ]] && return 0
  [[ "$f" == *"registry.py"* ]] && return 0
  [[ "$f" == *"README.md"* ]] && return 0
  # 主网拦截中间件：blockedPatterns 为合规 deny-list 元数据，非实际 RPC 配置
  [[ "$f" == *"/security/mainnet.go" ]] && return 0
  [[ "$f" == *"/internal/security/"* ]] && return 0
  return 1
}

echo "==> compliance-check scanning: $ROOT"

PATTERNS=(
  "mainnet.infura.io"
  "api.mainnet-beta.solana.com"
  "eth-mainnet"
  "token sale"
)

FAIL=0
for pat in "${PATTERNS[@]}"; do
  while IFS= read -r hit; do
    should_skip "$hit" && continue
    echo "BLOCKED pattern '$pat' in: $hit"
    FAIL=1
  done < <(grep -rIl --exclude-dir={.git,node_modules,dist,vendor} "$pat" "$ROOT" 2>/dev/null || true)
done

# 单独检测 chainId:1 硬编码（排除 schema/文档）
while IFS= read -r hit; do
  should_skip "$hit" && continue
  if grep -qE 'chain[_-]?[iI]d["\s:=]+1[^0-9]' "$hit" 2>/dev/null; then
    echo "BLOCKED: mainnet chainId 1 in: $hit"
    FAIL=1
  fi
done < <(grep -rIl --include='*.{yaml,yml,json,env,ts,go,py,sol}' -E 'chain[_-]?[iI]d' "$ROOT" 2>/dev/null || true)

if [ "$FAIL" -eq 1 ]; then
  echo "==> compliance-check FAILED"
  exit 1
fi

echo "==> compliance-check PASSED"

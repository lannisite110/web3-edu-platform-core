# 主库合规细则 — 子库 README 须链接到此文件

见工作区根目录 [COMPLIANCE_MASTER.md](../../COMPLIANCE_MASTER.md)

## 主库专属责任

- `security-hub` 运行时拦截主网参数
- `ci/compliance/` 脚本为全仓标准
- `schemas/allowed-chain-ids.yaml` 为唯一 chainId 权威源

## 子库责任

- manifest 中 `allowedChainIds` 必须是本文件白名单子集
- 文档不得使用「生产环境」「机构级」「替代 XX 产品」等表述

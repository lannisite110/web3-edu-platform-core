# LabWeave 学习地图

> 机器可读副本：`frontend-web/src/data/labweave-path.json`（驱动 `/learn` UI）  
> 主库 [LABWEAVE.md](LABWEAVE.md) · 更新于 LabWeave **L1**

---

## 起步（约 0.5 天）

| # | 插件 | 说明 | 时长 |
|---|------|------|------|
| 0 | `edu.hot.mock` | E2E 最小路径：simulate → status → report | 2h |

---

## 轨道 3A · Web3 热点（11 插件 · 约 2 周业余）

子库：[HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md)

| # | 插件 | 主题 | 时长 |
|---|------|------|------|
| 1 | `edu.hot.language-advisor` | 智能语言择优入口 | 4h |
| 2 | `edu.hot.zk-modular` | ZK Rollup 流水线 | 6h |
| 3 | `edu.hot.zk-circuit` | Cairo 电路编译 | 6h |
| 4 | `edu.hot.aa-wallet` | ERC-4337 UserOp | 5h |
| 5 | `edu.hot.aa-session` | 会话密钥 TTL | 4h |
| 6 | `edu.hot.dao` | DAO 投票 / quorum | 5h |
| 7 | `edu.hot.mev` | PBS 拍卖仿真 | 4h |
| 8 | `edu.hot.did` | DID 选择性披露 | 4h |
| 9 | `edu.hot.depin` | DePIN 节点仿真 | 4h |
| 10 | `edu.hot.rwa-edu` | 虚构 RWA 映射 | 3h |
| 11 | `edu.hot.ai-agent` | Agent 权限沙箱 | 4h |

---

## 轨道 3B · 国内民生溯源（3 插件 · 约 3 天）

子库：[TRACE_LEARNING_PATH.md](../supervision-trace-edu-suite/docs/TRACE_LEARNING_PATH.md)

| # | 插件 | 主题 | 时长 |
|---|------|------|------|
| 1 | `edu.cn.trace.food` | 食品批次 / Merkle / Fabric | 6h |
| 2 | `edu.cn.trace.medical` | 医疗防篡改 / 哈希链 | 5h |
| 3 | `edu.cn.trace.charity` | 慈善流水 / 公开隐私字段 | 5h |

---

## 轨道 3C · 政企内控（3 插件 · 约 3 天）

子库：[GOV_LEARNING_PATH.md](../enterprise-gov-edu-demo/docs/GOV_LEARNING_PATH.md)

| # | 插件 | 主题 | 时长 |
|---|------|------|------|
| 1 | `edu.cn.gov.bid-graph` | 招投标关联图谱 | 6h |
| 2 | `edu.cn.gov.multisig` | Sepolia 多级多签 | 6h |
| 3 | `edu.cn.gov.supply` | 供应链哈希链 / 断链演示 | 5h |

---

## 轨道 3D · 海外规则沙箱（5 插件 · 约 5 天）

子库：[GLOBAL_LEARNING_PATH.md](../global-social-edu-sandbox/docs/GLOBAL_LEARNING_PATH.md)

| # | 插件 | 主题 | 时长 |
|---|------|------|------|
| 1 | `edu.global.sandbox.regulatory` | OFAC/MiCA 静态 fixture | 5h |
| 2 | `edu.global.sandbox.election` | 选举哈希共识 | 4h |
| 3 | `edu.global.sandbox.welfare` | 福利反欺诈 / Merkle | 5h |
| 4 | `edu.global.sandbox.logistics` | 物流审计链 | 4h |
| 5 | `edu.global.sandbox.religion` | Zakat/Waqf 表达式 | 4h |

---

## 推荐顺序

```text
起步 mock → 3A 热点（或按兴趣跳 3B/3C/3D）→ 跨轨道复习 compliance_passed
```

全平台 **22** 业务插件 + **1** mock = **23** Lab。

验收：`make tutorial-audit PLUGINS_DIR=..` · `make integration-all-plugins`

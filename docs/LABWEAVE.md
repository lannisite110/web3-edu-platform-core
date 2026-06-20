# LabWeave · 沙箱码坊

> **产品代号** LabWeave（中文：**沙箱码坊**）  
> **基线**：主库 **v1.1.0** · 四子库 **v0.4.0** · P0 收官  
> **性质**：纯教育培训 · 测试网/沙箱 only

---

## 一句话

把 **Codewale 式结构化教程** + **可运行 Lab**（simulate → Job → report）+ **合规沙箱**（rule-engine 硬拦截）织成一条垂直 **学 → 练 → 合规自检** 链路。

**L1 不做 Agent**；L2 起才加「当前 Lab 上下文内的合规助教」。

---

## 四层架构

| 层 | 内容 | P0 / L1 状态 |
|----|------|----------------|
| **教程层** | 22 插件分步 `.md` + 四条子库 LEARNING_PATH | ✅ P0 |
| **Lab 层** | Vue Lab + `useLabSimulate` + eval-card | ✅ P0 |
| **合规层** | `COMPLIANCE_MASTER` + `/evaluate` + 网关拦截 | ✅ P0 |
| **Agent 层** | `/assist` 合规助教 | 🔜 L2 |

---

## 路线图

| 阶段 | 口令 | 交付 |
|------|------|------|
| P0 | （已完成） | 四子库 v0.4.0 + 主库 v1.1.0 + LEARNING_PATH 3A–3D |
| **L1** | `LabWeave L1` | 本文件 + [LABWEAVE_PATH.md](LABWEAVE_PATH.md) + 前端 `/learn` |
| L2 | `LabWeave L2` | Agent `/assist` · 3 插件 MVP |
| L3 | `LabWeave L3` | `make labweave-up` 一键启动 · 对外发布 |

---

## L1：门户层（当前）

### 文档

- [LABWEAVE_PATH.md](LABWEAVE_PATH.md) — 四轨道 × 22 插件学习 DAG
- [LEARNING_PATH.md](LEARNING_PATH.md) — 主库阶段 0–4
- 各子库 `*LEARNING_PATH.md` — 3A / 3B / 3C / 3D

### 前端

- 路由 **`/learn`** — 学习地图、轨道进度（localStorage）
- 首页 — LabWeave 入口与轨道概览
- `ComplianceBadge` — 合规状态展示组件（L1 用于门户；各 Lab eval-card 逐步统一）

### 启动

```bash
cd ~/web3home/web3-edu-platform-core
make register-plugins PLUGINS_DIR=..
make run-rule-engine & make run-scheduler & make run-gateway &
cd frontend-web && npm run dev
# → http://127.0.0.1:5173/learn
```

---

## 不做 / 要做

| 不做 | 要做 |
|------|------|
| 通用终端 Agent | 绑 plugin_id + evaluate 的领域助教（L2） |
| 泛 Web 开发教程站 | Web3 / 溯源 / 政企 / 海外规则 **垂直** 22 Lab |
| 主网 / ICO / 真实 RWA | 测试网 + Fabric 沙箱 + 虚构数据 |

---

## 相关链接

| 子库 | 完整路线 |
|------|----------|
| hot-labs | [HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md) |
| trace | [TRACE_LEARNING_PATH.md](../supervision-trace-edu-suite/docs/TRACE_LEARNING_PATH.md) |
| gov | [GOV_LEARNING_PATH.md](../enterprise-gov-edu-demo/docs/GOV_LEARNING_PATH.md) |
| global | [GLOBAL_LEARNING_PATH.md](../global-social-edu-sandbox/docs/GLOBAL_LEARNING_PATH.md) |

合规：[COMPLIANCE_MASTER.md](../../COMPLIANCE_MASTER.md)

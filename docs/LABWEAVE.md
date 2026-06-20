# LabWeave · 沙箱码坊

> **产品代号** LabWeave（中文：**沙箱码坊**）  
> **版本** v1.2.0-labweave · 主库 **v1.2.0** · 四子库 **v0.4.0**  
> **性质**：纯教育培训 · 测试网/沙箱 only

---

## 一句话

把 **Codewale 式结构化教程** + **可运行 Lab**（simulate → Job → report）+ **合规沙箱**（rule-engine 硬拦截）+ **沙箱助教** 织成 **学 → 练 → 合规自检 → 问助教** 链路。

---

## 一键启动（L3）

```bash
cd ~/web3home/web3-edu-platform-core
make labweave-up PLUGINS_DIR=..
# → http://127.0.0.1:5173/learn

make labweave-down
```

对外发布说明：[LABWEAVE_RELEASE.md](LABWEAVE_RELEASE.md)

---

## 四层架构

| 层 | 内容 | 状态 |
|----|------|------|
| **教程层** | 22 插件分步 `.md` + 四条子库 LEARNING_PATH | ✅ |
| **Lab 层** | Vue Lab + `useLabSimulate` + eval-card | ✅ |
| **合规层** | `COMPLIANCE_MASTER` + `/evaluate` + 网关拦截 | ✅ |
| **Agent 层** | `/assist` 合规助教（3 MVP Lab） | ✅ L2 |

---

## 路线图

| 阶段 | 口令 | 交付 |
|------|------|------|
| P0 | （已完成） | 四子库 v0.4.0 + 主库 v1.1.0 + LEARNING_PATH 3A–3D |
| L1 | `LabWeave L1` | [LABWEAVE_PATH.md](LABWEAVE_PATH.md) + `/learn` |
| L2 | `LabWeave L2` | `agent-assist-py` + `/assist` + 三 Lab 抽屉 |
| **L3** | `LabWeave L3` | **`make labweave-up`** + [LABWEAVE_RELEASE.md](LABWEAVE_RELEASE.md) ✅ |

---

## L1：门户层

- 路由 **`/learn`** — 四轨道 3A–3D · localStorage 进度
- 首页 LabWeave 入口 · `ComplianceBadge`

## L2：合规助教

| 模块 | 路径 |
|------|------|
| Agent 服务 | `agent-assist-py/` · **8084** |
| 网关 | `POST /api/v1/labs/{id}/assist` |
| MVP Lab | language-advisor · food-trace · bid-graph |
| 冒烟 | `make labweave-assist-smoke` |

可选 LLM：`LABWEAVE_AGENT_MODE=llm` + API Key（默认 `local` 规则助教）。

## L3：产品化

| 命令 | 说明 |
|------|------|
| `make labweave-up` | register + 四后端 + 前端 + 健康检查 |
| `make labweave-down` | 停止全部进程 |
| `make labweave-path-check` | 学习地图与 registry 对齐 |

---

## 不做 / 要做

| 不做 | 要做 |
|------|------|
| 通用终端 Agent | 绑 plugin_id + evaluate 的领域助教 |
| 泛 Web 教程站 | Web3 / 溯源 / 政企 / 海外 **垂直** 22 Lab |
| 主网 / ICO | 测试网 + Fabric 沙箱 |

---

## 相关链接

| 子库 | 完整路线 |
|------|----------|
| hot-labs | [HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md) |
| trace | [TRACE_LEARNING_PATH.md](../supervision-trace-edu-suite/docs/TRACE_LEARNING_PATH.md) |
| gov | [GOV_LEARNING_PATH.md](../enterprise-gov-edu-demo/docs/GOV_LEARNING_PATH.md) |
| global | [GLOBAL_LEARNING_PATH.md](../global-social-edu-sandbox/docs/GLOBAL_LEARNING_PATH.md) |

合规：[COMPLIANCE_MASTER.md](../../COMPLIANCE_MASTER.md)

# LabWeave · 沙箱码坊 — 对外发布说明

> **版本** v1.2.0-labweave · **主库** `web3-edu-platform-core` · **四子库** v0.4.0  
> **一句话**：合规约束下的 Web3 动手实验室 + 沙箱助教

---

## 产品是什么

**LabWeave（沙箱码坊）** 把结构化教程、可运行 Lab（simulate → Job → report）、合规 rule-engine 与 **当前 Lab 上下文内的沙箱助教** 织成一条 **学 → 练 → 合规自检 → 问助教** 链路。

| 能力 | 说明 |
|------|------|
| 23 Lab | 22 子库插件 + mock · 热点 / 溯源 / 政企 / 海外 |
| 学习地图 | `/learn` · 四轨道 3A–3D · 本机进度 |
| 合规沙箱 | 测试网 + `fabric-local` only · 网关拦截主网 |
| 沙箱助教 | 三 MVP：`language-advisor` · `food-trace` · `bid-graph` |

**不做**：通用编程 Agent、主网部署、ICO/募资、真实 RWA。

---

## 一键试用（推荐）

```bash
mkdir -p ~/web3home && cd ~/web3home
git clone git@github.com:lannisite110/web3-edu-platform-core.git
git clone git@github.com:lannisite110/web3-hot-topic-labs.git
git clone git@github.com:lannisite110/supervision-trace-edu-suite.git
git clone git@github.com:lannisite110/enterprise-gov-edu-demo.git
git clone git@github.com:lannisite110/global-social-edu-sandbox.git

cd web3-edu-platform-core
git checkout v1.2.0-labweave   # 发布后
python3 -m venv .venv
make labweave-up PLUGINS_DIR=..
```

浏览器打开：

- 首页：http://127.0.0.1:5173/
- 学习地图：http://127.0.0.1:5173/learn

停止：`make labweave-down`

---

## 版本矩阵

| 仓库 | Tag |
|------|-----|
| web3-edu-platform-core | **v1.2.0-labweave** |
| web3-hot-topic-labs | v0.4.0 |
| supervision-trace-edu-suite | v0.4.0 |
| enterprise-gov-edu-demo | v0.4.0 |
| global-social-edu-sandbox | v0.4.0 |

---

## LabWeave 阶段

| 阶段 | 交付 |
|------|------|
| P0 | 四子库 v0.4.0 + 主库 v1.1.0 + LEARNING_PATH 3A–3D |
| L1 | [LABWEAVE.md](LABWEAVE.md) · `/learn` 学习地图 |
| L2 | `agent-assist-py` · `/assist` · 三 Lab 助教抽屉 |
| **L3** | **`make labweave-up`** · 本发布说明 |

---

## 合规声明

纯开源**教育培训**项目。全部实验仅允许在官方公开测试网或本地/Fabric 沙箱进行，**严格禁止主网部署**。禁止用于代币发行、融资、交易炒作及任何非法金融活动。

详见 [COMPLIANCE_MASTER.md](../../COMPLIANCE_MASTER.md)。

---

## 文档索引

- [LABWEAVE.md](LABWEAVE.md) — 产品总纲
- [LABWEAVE_PATH.md](LABWEAVE_PATH.md) — 22 插件学习 DAG
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) — 部署与排错
- [LEARNING_PATH.md](LEARNING_PATH.md) — 主库学习路径

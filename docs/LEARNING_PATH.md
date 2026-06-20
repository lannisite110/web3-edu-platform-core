# 学习路径 · Web3 教育培训平台

> **主库** `web3-edu-platform-core` v1.0.0 · 测试网/沙箱 only  
> 配套四子库各 22 插件 + mock，共 **23** 个 Lab 联调。

---

## 阶段 0：环境与工作区（1 天）

| 步骤 | 内容 |
|------|------|
| 0.1 | 克隆五仓到同一父目录 `web3home/`（见 [QUICK_DEPLOY.md](QUICK_DEPLOY.md)） |
| 0.2 | 安装：Go 1.23+、Python 3.11+、Node 20+、kubectl（可选） |
| 0.3 | 阅读合规：[COMPLIANCE_MASTER.md](../../COMPLIANCE_MASTER.md)（工作区根目录） |

---

## 阶段 1：契约与主库骨架（2–3 天）

**目录**: `web3-edu-platform-core/`

| 顺序 | 文档/路径 | 目标 |
|------|-----------|------|
| 1 | [docs/PLUGIN_CONTRACT.md](PLUGIN_CONTRACT.md) | 插件目录禁令、API、manifest 字段 |
| 2 | `schemas/task-types.yaml` | TaskType 枚举（不可私增） |
| 3 | `schemas/allowed-chain-ids.yaml` | 测试网 chainId 白名单 |
| 4 | [docs/DEV.md](DEV.md) | 本地四进程启动 |
| 5 | `make register-plugins PLUGINS_DIR=..` | 理解 registry + `lab-loaders.ts` 生成 |
| 6 | `make ci-gate` | 合规 + 23 插件联调 + 前端构建 |

**动手**: 跑通 `edu.hot.mock` → 网关 → 规则引擎 → 调度器全链路。

---

## 阶段 2：控制面与 K8s Job（3–5 天）

| 顺序 | 主题 | 关键路径 |
|------|------|----------|
| 1 | 调度器 | `control-plane-go/cmd/scheduler` |
| 2 | Job 投递 | `internal/jobsubmit/` · `JOB_SUBMIT_MODE=local\|cluster` |
| 3 | container-manager | `cmd/container-manager` · `:8083/resolve/:taskType` |
| 4 | 集群冒烟 | `make k8s-job-smoke` · `make k8s-multilang-smoke` |

**动手**: 对比 `local` 与 `cluster` 模式报告 JSON 中的 `job_submit.extra`。

---

## 阶段 3：子库插件（按兴趣选读）

工作区根目录 [SUB_REPO_READING_ORDER.md](../../SUB_REPO_READING_ORDER.md) 有完整顺序。简表：

| 子库 | 插件数 | 适合读者 |
|------|--------|----------|
| [web3-hot-topic-labs](../web3-hot-topic-labs/) | 11 | 多语言合约、ZK、AA、DeFi 热点 |
| [supervision-trace-edu-suite](../supervision-trace-edu-suite/) | 3 | 食品/慈善/医疗溯源 |
| [enterprise-gov-edu-demo](../enterprise-gov-edu-demo/) | 3 | 政企供应链、招投标、多签 |
| [global-social-edu-sandbox](../global-social-edu-sandbox/) | 5 | 海外规则沙箱 Demo |

每个子库：`README.md` → `TASK.md` → `plugins/*/plugin.manifest.yaml` → `docs/tutorials/*.md`。

### 阶段 3A：Web3 热点专题（子库1 · 推荐）

> 完整 11 插件路线见子库 **[HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md)**  
> 教程索引：**[tutorials/README.md](../web3-hot-topic-labs/docs/tutorials/README.md)**

| 周 | 主题 | 插件 / 教程 |
|----|------|-------------|
| 1 | 入口 + ZK | [language-advisor](../web3-hot-topic-labs/docs/tutorials/language-advisor-intro.md) → [zk-modular](../web3-hot-topic-labs/docs/tutorials/zk-modular-intro.md) → [zk-circuit](../web3-hot-topic-labs/docs/tutorials/zk-circuit-intro.md) |
| 2 | AA + 治理 | [aa-wallet](../web3-hot-topic-labs/docs/tutorials/aa-wallet-intro.md) → [aa-session](../web3-hot-topic-labs/docs/tutorials/aa-session-intro.md) → [dao](../web3-hot-topic-labs/docs/tutorials/dao-intro.md) → [mev](../web3-hot-topic-labs/docs/tutorials/mev-intro.md) |
| 3 | 身份 / Infra | [did](../web3-hot-topic-labs/docs/tutorials/did-intro.md) → [depin](../web3-hot-topic-labs/docs/tutorials/depin-intro.md) → [rwa-edu](../web3-hot-topic-labs/docs/tutorials/rwa-edu-intro.md) → [ai-agent](../web3-hot-topic-labs/docs/tutorials/ai-agent-intro.md) |

分阶段工程路线（Phase 0–4）：[HOT_TOPIC_PHASES.md](../web3-hot-topic-labs/docs/HOT_TOPIC_PHASES.md)

---

## 阶段 4：发布与工程化（1–2 天）

| 命令 | 含义 |
|------|------|
| `make tutorial-audit` | 教程路径 + 合规措辞 |
| `make core-version-check` | manifest `coreVersion` 与主库 VERSION |
| `make release-check` | 发布前全量检查 |
| `make bazel-smoke` | Bazel 构建门禁 |

---

## 推荐实验顺序（插件）

1. `edu.hot.mock` — E2E 最小路径  
2. `edu.hot.language-advisor` — 热点总入口（→ [HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md)）  
3. `edu.hot.zk-modular` / `edu.hot.dao` / `edu.hot.aa-wallet` — Phase 2 深化 Lab  
4. `edu.hot.mev` / `edu.hot.did` — Phase 3 合约对齐  
5. `edu.cn.trace.food` — 国内溯源 + Fabric 沙箱  
6. 其余插件按侧边栏或 [tutorials/README.md](../web3-hot-topic-labs/docs/tutorials/README.md) 浏览

---

## 版本矩阵（v1.0.2）

| 仓库 | Tag | 说明 |
|------|-----|------|
| web3-edu-platform-core | **v1.0.2** | 主库 |
| web3-hot-topic-labs | **v0.4.0** | 热点 Phase 0–4 · [HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md) |
| 其余三子库 | **v0.3.0** | 下一目标：trace [TRACE_PHASES.md](../supervision-trace-edu-suite/docs/TRACE_PHASES.md) |

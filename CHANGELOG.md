# Changelog · web3-edu-platform-core

## v1.2.0-labweave — 2026-06-19

**LabWeave 产品轨收官**（L1 + L2 + L3）：

- **L1**：[LABWEAVE.md](docs/LABWEAVE.md) · [LABWEAVE_PATH.md](docs/LABWEAVE_PATH.md) · `/learn` 学习地图
- **L2**：`agent-assist-py` · `POST /assist` · 三 MVP Lab 沙箱助教抽屉
- **L3**：`make labweave-up` / `make labweave-down` · [LABWEAVE_RELEASE.md](docs/LABWEAVE_RELEASE.md)

验收：`make labweave-path-check` · `make labweave-assist-smoke` · `make labweave-up`

---

## v1.2.0-labweave-l2 — 2026-06-19

**LabWeave L2** — 合规绑定沙箱助教：

- `agent-assist-py/` · `POST /api/v1/labs/{id}/assist`
- 每次 assist 先 rule-engine `evaluate`；拒绝时仅解释原因
- 三 MVP Lab 抽屉：`language-advisor` · `food-trace` · `bid-graph`
- `make labweave-assist-smoke` · `make run-agent-assist`

---

## v1.2.0-labweave-l1 — 2026-06-19

**LabWeave L1** — Codewale 式门户层（不含 Agent）：

- [LABWEAVE.md](docs/LABWEAVE.md) · [LABWEAVE_PATH.md](docs/LABWEAVE_PATH.md)
- 前端 **`/learn`** 学习地图（四轨道 3A–3D + 起步 mock · localStorage 进度）
- 首页 LabWeave 门户 · `ComplianceBadge` 组件
- `ci/labweave-path-check.sh` 校验路径 JSON 与 registry 对齐

---

## v1.1.0 — 2026-06-19

**P0 收官**：四子库全部 **v0.4.0**，主库学习路径 **3A–3D** 齐全。

- [LEARNING_PATH.md](docs/LEARNING_PATH.md) 新增 **阶段 3B / 3C / 3D**
- 配套子库 tag 对齐：
  - [supervision-trace-edu-suite v0.4.0](../supervision-trace-edu-suite/) — [TRACE_LEARNING_PATH.md](../supervision-trace-edu-suite/docs/TRACE_LEARNING_PATH.md)
  - [enterprise-gov-edu-demo v0.4.0](../enterprise-gov-edu-demo/) — [GOV_LEARNING_PATH.md](../enterprise-gov-edu-demo/docs/GOV_LEARNING_PATH.md)
  - [global-social-edu-sandbox v0.4.0](../global-social-edu-sandbox/) — [GLOBAL_LEARNING_PATH.md](../global-social-edu-sandbox/docs/GLOBAL_LEARNING_PATH.md)
  - [web3-hot-topic-labs v0.4.0](../web3-hot-topic-labs/) — [HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md)（v1.0.2 已链接）

验收：`make register-plugins PLUGINS_DIR=..` · `make tutorial-audit` · `make release-check`

---

## v1.0.2 — 2026-06-20

文档与子库联调：

- [LEARNING_PATH.md](docs/LEARNING_PATH.md) 新增 **阶段 3A：Web3 热点专题**，链接子库教程总路线
- 配套子库 **web3-hot-topic-labs v0.4.0**：
  - [HOT_TOPIC_LEARNING_PATH.md](https://github.com/lannisite110/web3-hot-topic-labs/blob/main/docs/HOT_TOPIC_LEARNING_PATH.md)
  - [tutorials/README.md](https://github.com/lannisite110/web3-hot-topic-labs/blob/main/docs/tutorials/README.md)
  - [HOT_TOPIC_PHASES.md](https://github.com/lannisite110/web3-hot-topic-labs/blob/main/docs/HOT_TOPIC_PHASES.md)（Phase 0–4 完成）
- 网关 simulate 支持可选 `task_type`（language-advisor 编译 Job）
- 规则引擎 evaluate 返回 `toolchain_group` / `suggested_lab` 等扩展字段

下一子库规划：[supervision-trace-edu-suite/docs/TRACE_PHASES.md](../supervision-trace-edu-suite/docs/TRACE_PHASES.md)

---

## v1.0.1 — 2026-06-19

维护发布：从版本库移除误提交的 Bazel 输出符号链接，`.gitignore` 增加 `bazel-*`。

---

## v1.0.0 — 2026-06-19

首个稳定主库版本。

- 23 插件联调、`make release-check` 发布门禁
- container-manager HTTP + scheduler 解耦
- K8s Job cluster 模式 + 冒烟脚本
- Bazel/gazelle 构建 `scheduler` / `container-manager`（`ci/bazel-gate.sh`）
- 四子库 `coreVersion: ">=0.6.0 <2.0.0"`（子库 tag **v0.3.0**）

---

## v0.6.0

- scheduler 经 `CONTAINER_MANAGER_URL` HTTP 解析 toolchain
- `tutorial-audit` 教程合规措辞检查
- 根目录 `MODULE.bazel` 脚手架
- 开发端口冲突修复（`make stop-backend`、冒烟 reuse）

## v0.5.0

- `container-manager` HTTP 服务（`:8083`）
- mock 插件 Vue 面板
- `make tutorial-audit`

## v0.4.2

- K8s Job Pod 失败诊断（status/events/logs）
- `make k8s-multilang-smoke`
- Job 模板 `sigs.k8s.io/yaml` 修复

## v0.4.1

- Pod 日志尾行、Job 自动清理、kubeconfig 检测

## v0.4.0

- client-go 真实 K8s Job 创建与轮询

## v0.3.0

- GitHub Actions 五仓 CI、Fabric bootstrap、jobsubmit 脚手架

## v0.2.0

- 22 子库 + mock 共 23 插件联调、`lab-loaders` 自动生成

## v0.1.0

- 插件契约、合规 CI、E2E smoke

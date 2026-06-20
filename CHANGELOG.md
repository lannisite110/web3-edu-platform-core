# Changelog · web3-edu-platform-core

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

# Agent-0 任务书 · web3-edu-platform-core（主库）

> **v0.3.0 进行中** — CI、合规、jobsubmit、Fabric bootstrap 已启动

---

## Phase 1 交付清单（v0.1.0）

### A. 契约与 Schema
- [x] `schemas/plugin.manifest.schema.json`
- [x] `schemas/task-types.yaml`
- [x] `schemas/allowed-chain-ids.yaml`
- [x] `docs/AGENT_CONTRACT.md`
- [x] `ci/compliance/validate-plugin.sh`
- [x] `ci/compliance/compliance-check.sh`
- [x] `ci/register-plugins.py`

### B. 前端
- [x] `frontend-web/` Vue3+Vite 壳
- [x] 侧边栏分组 + 插件路由
- [x] `plugins.registry.json` 由 register-plugins 生成

### C. 网关
- [x] `api-gateway-go/` Gin `/api/v1/labs/{plugin_id}/*`
- [x] 主网参数拦截 middleware

### D. 控制面
- [x] `control-plane-go/` TaskType → Namespace 内存调度 stub

### E. 规则引擎
- [x] `rule-engine-py/main.py` FastAPI `/evaluate`
- [x] `plugins/rules/mock_evaluator.py` E2E mock

### F. 基础设施
- [x] `k8s-manifests/base/` Namespace + testnet ConfigMap
- [x] `ci/e2e-smoke.sh` 全链路 smoke
- [x] `examples/mock-plugin.manifest.yaml`

### G. 发布
- [x] `VERSION` = 0.1.0
- [x] `docs/DEV.md` 本地启动说明
- [x] git tag `v0.1.0`（主库首版由 v0.2.0 起算，子库已打 v0.1.0）

---

## Phase 2 交付清单（v0.2.0）✅

### A. 统一联调
- [x] `ci/register-plugins.py` 自动生成 `lab-loaders.ts`（22 子库 Vue 面板）
- [x] Vite alias：`@hot-labs` / `@trace` / `@gov` / `@sandbox`
- [x] `ci/integration-all-plugins.sh` — **23/23 PASS**
- [x] `frontend-web` 生产构建通过

### B. 增强调度器
- [x] `control-plane-go/internal/plugins` — 读取 registry（含 `jobTemplate`）
- [x] `control-plane-go/internal/toolchain` — `build-images/manifest.yaml` 七组镜像
- [x] 本地 Job 模拟报告（toolchain_image / job_template）

### C. Registry 扩展
- [x] manifest `k8s.jobTemplate` → registry JSON
- [x] scheduler / gateway / frontend 三份 registry 同步

### D. 发布
- [x] `VERSION` = 0.2.0
- [x] `docs/DEV.md` 更新
- [x] git tag `v0.2.0` 已推送 GitHub

---

## Phase 3 交付清单（v0.3.0）— 进行中

### A. 合规与发布基建
- [x] `compliance-check` 跳过 `security/mainnet.go` deny-list 误报
- [x] 五仓 `LICENSE`（PolyForm Noncommercial 1.0.0）
- [x] `.github/workflows/ci.yml` — 五仓 checkout + `ci-gate`
- [x] 根目录 `README.md` / 本任务书更新

### B. 调度与沙箱
- [x] `internal/jobsubmit` + `JOB_SUBMIT_MODE`（local / cluster 脚手架）
- [x] `scripts/fabric-sandbox-bootstrap.sh` + `make fabric-bootstrap`
- [ ] client-go 真实 K8s Job 创建与状态轮询
- [ ] `container-manager` 服务化（读取 hot-labs build-images）

### C. 文档与工程
- [ ] 22 插件教程齐套审查清单
- [ ] Bazel WORKSPACE（可选）
- [ ] git tag `v0.3.0`（client-go Job 实装后）

---

## 子库启动通知

> 主库 v0.3.0 开发中（CI + jobsubmit + Fabric bootstrap 已合入 main）。子库继续 v0.1.x 迭代插件；契约变更需 Agent-0 评审。

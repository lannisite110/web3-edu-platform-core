# Agent-0 任务书 · web3-edu-platform-core（主库）

> **v0.2.0 已完成** — 统一联调 + 增强调度器；子库 Agent 可并行迭代插件（见 `SUB_REPO_READING_ORDER.md`）

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
- [ ] git tag `v0.1.0`（Push 前由维护者打 tag）

---

## Phase 2 交付清单（v0.2.0）

### A. 统一联调
- [x] `ci/register-plugins.py` 自动生成 `lab-loaders.ts`（22 子库 Vue 面板）
- [x] Vite alias：`@hot-labs` / `@trace` / `@gov` / `@sandbox`
- [x] `ci/integration-all-plugins.sh` — **23/23 PASS**
- [x] `frontend-web` 生产构建通过

### B. 增强调度器
- [x] `control-plane-go/internal/plugins` — 读取 registry（含 `jobTemplate`）
- [x] `control-plane-go/internal/toolchain` — `build-images/manifest.yaml` 七组镜像
- [x] `completeV2` 本地 Job 模拟报告（toolchain_image / job_template）

### C. Registry 扩展
- [x] manifest `k8s.jobTemplate` → registry JSON
- [x] scheduler / gateway / frontend 三份 registry 同步

### D. 发布
- [x] `VERSION` = 0.2.0
- [x] `docs/DEV.md` 更新
- [ ] git tag `v0.2.0`（Push 前由维护者打 tag）

---

## 子库启动通知

> 主库 v0.2.0 已就绪并完成 23 插件联调。请阅读 `SUB_REPO_READING_ORDER.md` → `AGENT_TASK.md` 迭代插件。禁止修改主库（契约变更需 Agent-0 评审）。

# 本地开发启动（v0.2.0）

## 1. 注册插件（含前端 lab-loaders 自动生成）

```bash
cd web3-edu-platform-core
make register-plugins PLUGINS_DIR=..
```

生成物：
- `frontend-web/src/plugins/plugins.registry.json`
- `frontend-web/src/plugins/lab-loaders.ts`（22 个子库面板 + mock 回退 LabView）
- `api-gateway-go/config/plugins.registry.json`
- `control-plane-go/config/plugins.registry.json`（含 `jobTemplate`）

## 2. 启动后端（三个终端）

```bash
make run-rule-engine   # :8081
make run-scheduler     # :8082 — v0.2 加载 toolchain + plugin registry
make run-gateway       # :8080
```

## 3. 启动前端

```bash
cd frontend-web && npm install && npm run dev   # :5173
```

侧边栏切换 23 个 Lab，各子库 Vue 面板经 Vite alias 懒加载（`@hot-labs` / `@trace` / `@gov` / `@sandbox`）。

## 4. 验收

```bash
make test-e2e-smoke
make integration-all-plugins   # 23/23 evaluate + simulate
cd frontend-web && npm run build
make compliance-check
```

## v0.2.0 新增能力

| 能力 | 说明 |
|------|------|
| 统一前端面板 | `register-plugins.py` 按 manifest 解析各 Lab 的 `.vue` 并生成 `lab-loaders.ts` |
| 增强调度器 | 读取 `plugins.registry.json` 的 `jobTemplate`；本地 Job 模拟报告 |
| Toolchain 路由 | `control-plane-go/internal/toolchain` 读取 `web3-hot-topic-labs/build-images/manifest.yaml`，`HOT_MULTI_LANG_COMPILE` 等映射到 evm/zk/solana 镜像组 |
| Scheduler registry | 三份 registry 同步（frontend / gateway / control-plane） |

## 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `CORE_ROOT` | 主库根目录 | Go 服务读取 schema/registry |
| `GATEWAY_PORT` | 8080 | API 网关 |
| `RULE_ENGINE_PORT` | 8081 | Python 规则引擎 |
| `SCHEDULER_PORT` | 8082 | 任务调度（v0.2 本地 Job 模拟） |
| `TOOLCHAIN_MANIFEST` | `../web3-hot-topic-labs/build-images/manifest.yaml` | 覆盖 toolchain 清单路径 |

## 下一版（v0.3 规划）

- 真实 K8s Job 提交（client-go）
- Fabric testnet bootstrap（trace/gov 插件）
- GitHub Actions CI workflow

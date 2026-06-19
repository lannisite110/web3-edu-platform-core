# 本地开发启动（v0.3.0）

## 1. 注册插件（含前端 lab-loaders 自动生成）

```bash
cd web3-edu-platform-core
make register-plugins PLUGINS_DIR=..
```

## 2. 启动后端（三个终端）

```bash
make run-rule-engine   # :8081
make run-scheduler     # :8082
make run-gateway       # :8080
```

调度器 v0.3 通过 `JOB_SUBMIT_MODE` 选择 Job 投递方式：

| 值 | 行为 |
|----|------|
| `local`（默认） | 进程内模拟，报告含 toolchain / job_template |
| `cluster` | K8s Job 投递脚手架（需 `KUBECONFIG`；client-go 实装下一迭代） |

## 3. Fabric 教学沙箱（可选）

```bash
make fabric-bootstrap
# 或 TRACE_ROOT=../supervision-trace-edu-suite bash scripts/fabric-sandbox-bootstrap.sh
```

应用 `ns-domain-cn` 命名空间、Fabric ConfigMap 与 trace 子库 Job 模板（虚构端点，无真实链对接）。

## 4. 启动前端

```bash
cd frontend-web && npm install && npm run dev   # :5173
```

## 5. 验收

```bash
make compliance-check
make ci-gate                    # 合规 + 23 插件联调 + 前端构建 + smoke
make integration-all-plugins
```

GitHub Actions（主库 `.github/workflows/ci.yml`）在 push/PR 时检出五仓并运行 `ci-gate`。

## 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `CORE_ROOT` | 主库根目录 | Go 服务读取 schema/registry |
| `JOB_SUBMIT_MODE` | `local` | `local` \| `cluster` |
| `TOOLCHAIN_MANIFEST` | `../web3-hot-topic-labs/build-images/manifest.yaml` | 多语言镜像组 |
| `TRACE_ROOT` | `../supervision-trace-edu-suite` | Fabric bootstrap 脚本 |

## v0.3 路线图（进行中）

- [x] `compliance-check` 误报修复（security deny-list 白名单）
- [x] 五仓 PolyForm Noncommercial LICENSE
- [x] GitHub Actions 五仓联调 CI
- [x] `jobsubmit` 包 + `JOB_SUBMIT_MODE`
- [x] `scripts/fabric-sandbox-bootstrap.sh`
- [ ] client-go 真实 K8s Job 提交
- [ ] Bazel WORKSPACE
- [ ] 全插件教程文档齐套审查

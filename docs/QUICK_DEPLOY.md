# 快速部署 · 主库 + 四子库

> 目标：30 分钟内跑通 **23 插件联调** 与前端。仅测试网/沙箱。

---

## 1. 目录布局

```text
web3home/
├── web3-edu-platform-core/      # 主库（本仓）
├── web3-hot-topic-labs/
├── supervision-trace-edu-suite/
├── enterprise-gov-edu-demo/
└── global-social-edu-sandbox/
```

```bash
mkdir -p ~/web3home && cd ~/web3home
git clone git@github.com:lannisite110/web3-edu-platform-core.git
git clone git@github.com:lannisite110/web3-hot-topic-labs.git
git clone git@github.com:lannisite110/supervision-trace-edu-suite.git
git clone git@github.com:lannisite110/enterprise-gov-edu-demo.git
git clone git@github.com:lannisite110/global-social-edu-sandbox.git
```

---

## 2. 依赖安装

```bash
cd web3-edu-platform-core
python3 -m venv .venv
.venv/bin/pip install -r rule-engine-py/requirements.txt pyyaml
cd frontend-web && npm ci && cd ..
```

---

## 3. LabWeave 一键试用（推荐）

五仓克隆完成后：

```bash
cd ~/web3home/web3-edu-platform-core
make labweave-up PLUGINS_DIR=..
```

- 首页 http://127.0.0.1:5173/
- 学习地图 http://127.0.0.1:5173/learn
- 停止 `make labweave-down`

详见 [LABWEAVE_RELEASE.md](LABWEAVE_RELEASE.md)。  

**部署分册**（按顺序）：

| 阶段 | 文档 |
|------|------|
| 本地开发 | [deploy/01-local-dev.md](../deploy/01-local-dev.md) |
| 本地生产验收 | [deploy/02-local-prod-verify.md](../deploy/02-local-prod-verify.md) |
| K8s Job | [deploy/03-k8s-jobs.md](../deploy/03-k8s-jobs.md) |
| **云上 VPS** | [deploy/04-cloud-vps.md](../deploy/04-cloud-vps.md) |
| 运维 | [deploy/06-operations.md](../deploy/06-operations.md) |
| 索引 | [deploy/README.md](../deploy/README.md) |

---

## 4. 部署三档速查

| 档位 | 命令 | 何时用 |
|------|------|--------|
| 环境自检 | `make labweave-doctor` | 首次 / 每日开工 |
| 本地开发 | `make labweave-up` | WSL 改代码、试 Lab |
| 本地验收 | `make labweave-prod-build && make deploy-verify-full` | **上云前必做** |
| K8s 验收 | `make k8s-apply-base && make k8s-smoke-all` | 需要编译 Job 时 |
| **云上 VPS** | [deploy/04-cloud-vps.md](../deploy/04-cloud-vps.md) | 公网 HTTPS |

---

## 5. 一键验收（维护者）

```bash
cd ~/web3home/web3-edu-platform-core
make register-plugins PLUGINS_DIR=..
make ci-gate                    # 合规 + 23 插件 + 前端 build + e2e
```

发布前：

```bash
make release-check
```

---

## 6. 本地开发（四终端）

```bash
# 终端 0 — 可选 toolchain 服务
make run-container-manager      # :8083

# 终端 1–3
make run-rule-engine            # :8081
make run-scheduler-cm           # :8082（经 container-manager）
make run-gateway                # :8080

# 终端 4
cd frontend-web && npm run dev  # http://localhost:5173
```

端口冲突：`make stop-backend`

---

## 7. Kubernetes（可选）

需本机 `kubectl` 可用（k3d/kind/minikube 均可）。

```bash
make k8s-job-smoke
make k8s-multilang-smoke
```

默认 `JOB_SMOKE_BUSYBOX=1`，无本地 toolchain 镜像时可完成冒烟。

---

## 8. Fabric 教学沙箱（可选）

```bash
make fabric-bootstrap
```

---

## 9. CI / Bazel（维护者）

```bash
make bazel-smoke    # 本地需 bazelisk；CI 自动执行 bazel-gate
```

GitHub Actions：五仓 checkout → `ci-gate` + `bazel-gate`。

---

## 10. 健康检查

| 服务 | URL |
|------|-----|
| 规则引擎 | http://127.0.0.1:8081/health |
| 调度器 | http://127.0.0.1:8082/health |
| container-manager | http://127.0.0.1:8083/health |
| 网关 | http://127.0.0.1:8080/health |
| Agent 助教 | http://127.0.0.1:8084/health |
| 前端 | http://localhost:5173 |

---

## 11. 常见问题

| 现象 | 处理 |
|------|------|
| `:8083 address already in use` | `make stop-backend` 后重试 |
| scheduler 连不上 container-manager | 先起 `run-container-manager`，或用 `make run-scheduler`（本地 manifest） |
| 插件侧边栏为空 | `make register-plugins PLUGINS_DIR=..` |

详见 [DEV.md](DEV.md)、[LEARNING_PATH.md](LEARNING_PATH.md)。

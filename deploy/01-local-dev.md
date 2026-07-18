# Phase 1 · 本地开发手册（WSL）

> 目标：在 WSL 上完成 **五仓联调、改代码、试 23 插件**，不涉及云上 Nginx。  
> 一键命令：`make labweave-up` · 自检：`make labweave-doctor`

---

## 1. 环境要求

| 组件 | 最低版本 | 检查命令 |
|------|----------|----------|
| OS | WSL2 Ubuntu 22.04+ | `uname -a` |
| Go | 1.21+ | `go version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Python | 3.10+ | `python3 --version` |
| git | 2.x | `git --version` |
| curl | 任意 | `curl --version` |

**资源建议**：内存 ≥ 8GB，磁盘 ≥ 10GB（含 node_modules 与 Go cache）。

**可选（K8s Job 开发）**：Docker + kind/k3d + kubectl（见 [03-k8s-jobs.md](03-k8s-jobs.md)）。

---

## 2. 目录布局（必须遵守）

```text
~/web3home/
├── web3-edu-platform-core/      ← 主库（本手册所在仓）
├── web3-hot-topic-labs/         ← 11 热点 Lab
├── supervision-trace-edu-suite/ ← 3 溯源 Lab
├── enterprise-gov-edu-demo/     ← 3 政企 Lab
└── global-social-edu-sandbox/   ← 5 沙箱 Lab
```

### 为何必须 sibling？

1. **`make register-plugins PLUGINS_DIR=..`** 递归扫描 `../` 下所有 `plugin.manifest.yaml`
2. **Vite alias**（`frontend-web/vite.config.ts`）把 `@hot-labs` 等指到 sibling 路径，**开发态直接 import 子库 `.vue`**
3. **rule-engine** 动态 `sys.path` 加载子库 `plugins/rules/*.py`

若子库不在 `web3home/` 下，侧边栏为空或 simulate 500。

---

## 3. 首次安装

```bash
mkdir -p ~/web3home && cd ~/web3home
# 克隆五仓（SSH 或 HTTPS）
git clone git@github.com:lannisite110/web3-edu-platform-core.git
git clone git@github.com:lannisite110/web3-hot-topic-labs.git
git clone git@github.com:lannisite110/supervision-trace-edu-suite.git
git clone git@github.com:lannisite110/enterprise-gov-edu-demo.git
git clone git@github.com:lannisite110/global-social-edu-sandbox.git

cd web3-edu-platform-core
python3 -m venv .venv
.venv/bin/pip install -r rule-engine-py/requirements.txt \
  -r agent-assist-py/requirements.txt pyyaml
cd frontend-web && npm ci && cd ..

make labweave-doctor PLUGINS_DIR=..
make register-plugins PLUGINS_DIR=..
make labweave-up PLUGINS_DIR=..
```

浏览器打开：**http://127.0.0.1:5173/learn**

停止：`make labweave-down`

---

## 4. `labweave-up` 内部做了什么？

| 步骤 | 动作 | 日志文件 |
|------|------|----------|
| 1 | 检查四子库目录存在 | 终端 |
| 2 | `make stop-backend` 释放 8080–8084 | 终端 |
| 3 | `register-plugins` + `labweave-path-check` | 终端 |
| 4 | `go build` gateway、scheduler → `.labweave/bin/` | 终端 |
| 5 | 启动 rule-engine :8081 | `.labweave/logs/rule-engine.log` |
| 6 | 启动 agent-assist :8084 | `.labweave/logs/agent-assist.log` |
| 7 | 启动 scheduler :8082（**local** 模式） | `.labweave/logs/scheduler.log` |
| 8 | 启动 gateway :8080 | `.labweave/logs/gateway.log` |
| 9 | 健康检查四轮 curl | 终端 |
| 10 | `npm run dev -- --host 127.0.0.1 --port 5173` | `.labweave/logs/frontend.log` |

PID 列表：`.labweave/run/labweave.pids`

### 请求链路（开发态）

```text
浏览器 → Vite :5173
         └─ /api/*  proxy → Gateway :8080
              ├─ POST .../simulate → Rule Engine /evaluate
              ├─ .../status|report → Scheduler
              └─ .../assist → Agent Assist
```

---

## 5. 环境变量（开发常用）

| 变量 | 默认 | 说明 |
|------|------|------|
| `PLUGINS_DIR` | `..` | 四子库相对主库路径 |
| `LABWEAVE_BIND_HOST` | `127.0.0.1` | Vite 绑定；`0.0.0.0` 允许局域网 |
| `FRONTEND_PORT` | `5173` | 前端端口 |
| `GATEWAY_PORT` | `8080` | 网关端口 |
| `JOB_SUBMIT_MODE` | `local` | 开发默认；Job 进程内模拟 |

局域网试用（**仍非生产**）：

```bash
make labweave-up-lan PLUGINS_DIR=..
# 终端会打印本机 IP，如 http://192.168.x.x:5173/
```

---

## 6. 改代码工作流

### 6.1 改主库前端（core `frontend-web/src`）

保存 → 浏览器自动 HMR 刷新。无需 restart。

### 6.2 改子库 Lab 面板（如 `web3-hot-topic-labs/plugins/frontend/*.vue`）

保存 → Vite HMR。无需 `register-plugins`。

### 6.3 改 `plugin.manifest.yaml` 或新增插件

```bash
make register-plugins PLUGINS_DIR=..
# 若 gateway 已缓存 registry，建议：
make labweave-down && make labweave-up
```

### 6.4 改子库规则 Python（`plugins/rules/*.py`）

重启 rule-engine：最快 `make labweave-down && make labweave-up`  
或手动 kill rule-engine 进程后从 PID 文件重启。

### 6.5 改 Go 网关 / 调度器

```bash
make labweave-down
make labweave-up   # 会重新 go build
```

---

## 7. 与 CI 的关系

| 命令 | 耗时 | 何时跑 |
|------|------|--------|
| `make labweave-doctor` | ~10s | 每天开工前 |
| `make deploy-verify` | ~5s | 改 gateway/rule 后 |
| `make ci-gate` | 数分钟 | 提 PR / 发版前 |
| `make release-check` | 更长 | 打 tag 前 |

本地日常 **不必** 每次跑 `ci-gate`；上云前必须跑 [02-local-prod-verify.md](02-local-prod-verify.md) 中的 **`deploy-verify-full`**。

---

## 8. 日志与排查

### 8.1 日志位置

```bash
ls -la ~/web3home/web3-edu-platform-core/.labweave/logs/
tail -f .labweave/logs/gateway.log
tail -f .labweave/logs/rule-engine.log
```

### 8.2 常见问题

| 现象 | 原因 | 处理 |
|------|------|------|
| 侧边栏空 | 未 register 或子库路径错 | `make register-plugins PLUGINS_DIR=..` |
| `load plugin registry` fatal | 未 register | 同上 |
| `:8080 address in use` | 旧进程 | `make labweave-down` 或 `make stop-backend` |
| simulate 500 | rule 模块 import 失败 | 看 rule-engine.log |
| 前端白屏 | Vite 编译错误 | 看 frontend.log 或终端 |
| `/api` CORS/502 | gateway 未起 | `curl localhost:8080/health` |
| 改 manifest 不生效 | 未 re-register | register + restart |

### 8.3 手动分进程启动（调试单服务）

```bash
make register-plugins PLUGINS_DIR=..
make run-rule-engine    # 终端 1
make run-agent-assist   # 终端 2
make run-scheduler      # 终端 3
make run-gateway        # 终端 4
cd frontend-web && npm run dev   # 终端 5
```

---

## 9. 建议的每日开发循环

```bash
make labweave-doctor
make labweave-up
# … 开发 …
make labweave-down
```

发 PR 前：

```bash
make register-plugins PLUGINS_DIR=..
make ci-gate
```

准备上云前 → 进入 [02-local-prod-verify.md](02-local-prod-verify.md)。

---

## 10. 相关文件索引

| 文件 | 作用 |
|------|------|
| `scripts/labweave-up.sh` | 一键启动 |
| `scripts/labweave-down.sh` | 一键停止 |
| `scripts/labweave-doctor.sh` | 环境自检 |
| `ci/register-plugins.py` | 生成 registry + lab-loaders |
| `frontend-web/vite.config.ts` | 子库 alias + /api proxy |
| `docs/DEV.md` | 环境变量完整表 |

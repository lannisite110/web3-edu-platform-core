# LabWeave 部署指南

> **两种环境**：**本地**（WSL/本机开发与验收）· **云上**（云服务器/VPS 正式对外）  
> **三种能力**：`labweave-up` 开发 · `k8s-smoke-all` K8s 链验收 · `labweave-prod-*` + Nginx 云上上线  
> 建议顺序：本地 `labweave-up` → 本地 `labweave-prod-build` + `deploy-verify` → 云上同样流程 + 域名/TLS

---

## 本地 vs 云上

| | **本地** | **云上** |
|---|----------|----------|
| 机器 | 你的 WSL / 开发机 | 云 VPS、ECS、CVM 等 |
| 典型用途 | 改代码、试 Lab、上线前自测 | 学员/用户通过公网域名访问 |
| 开发启动 | `make labweave-up` | — |
| 生产形态 | `make labweave-prod-up`（可选，测 API） | `labweave-prod-up` + **Nginx** + systemd |
| 访问地址 | `http://127.0.0.1:5173` | `https://你的域名` |
| K8s Job | 可选 `k8s-smoke-all` 测链 | 建议 `JOB_SUBMIT_MODE=cluster` 接云 K8s |

```text
【本地】 浏览器 → Vite :5173 或 vite preview → Gateway :8080 → 后端

【云上】 浏览器 → Nginx :443 → dist/ 静态 + /api → Gateway :8080 (127.0.0.1)
                              └── Scheduler → 云 K8s Job（可选）
```

---

## 1. 本地开发：`labweave-up`

**用途**：在本机（WSL）改代码、跑 23 个 Lab、试 Quiz；**不上云**。

```bash
cd ~/web3home/web3-edu-platform-core
make labweave-up PLUGINS_DIR=..
# 首页 http://127.0.0.1:5173/learn
make labweave-down
```

| 变量 | 默认 | 说明 |
|------|------|------|
| `PLUGINS_DIR` | `..` | 四子库相对主库的路径 |
| `LABWEAVE_BIND_HOST` | `127.0.0.1` | 前端绑定地址 |
| `FRONTEND_PORT` | `5173` | Vite 端口 |

**同一台机器局域网访问（仍属本地开发，不是云上部署）：**

```bash
make labweave-up-lan PLUGINS_DIR=..
# 或 LABWEAVE_BIND_HOST=0.0.0.0 make labweave-up
# 用 http://<服务器内网IP>:5173 访问
```

日志：`.labweave/logs/`  
默认 `JOB_SUBMIT_MODE=local`，编译 Job 在本地模拟，**不创建 K8s Pod**。

---

## 2. K8s Job 冒烟

**用途**：维护者/上线前验证「Scheduler → kubectl → Namespace → Job 完成」链路。  
**不是**日常启动命令；没有 K8s 可跳过。

### 前置

- `kubectl` 可用，且 `kubectl cluster-info` 成功
- 可选：加载 toolchain 镜像；默认 `JOB_SMOKE_BUSYBOX=1` 用 busybox 占位

### 命令

```bash
# 单项
make k8s-job-smoke          # HOT_DAO_VOTE_SIM
make k8s-multilang-smoke    # HOT_MULTI_LANG_COMPILE (solidity)

# 一键两项 + 集群预检
make k8s-smoke-all
```

脚本会：`kubectl apply` base namespaces → 启动 cluster 模式 scheduler → 提交 Job → 轮询 report 至 completed。

### 生产启用真实 K8s Job

编辑 `/etc/labweave/labweave.env`（或 `deploy/env/labweave.prod.env`）：

```bash
JOB_SUBMIT_MODE=cluster
KUBECONFIG=/path/to/kubeconfig
JOB_SMOKE_BUSYBOX=0   # 使用真实 toolchain 镜像
```

然后 `make labweave-prod-up` 会额外启动 container-manager。

---

## 3. 云上部署（Nginx + 静态前端）

**用途**：在云服务器上对外提供 `https://域名`，本地验收通过后再执行同样构建。

### 3.0 本地先验收（上线云前必做）

在 WSL 本机完成，确认无误后再 SSH 到云机重复：

```bash
cd ~/web3home/web3-edu-platform-core
make labweave-prod-build PLUGINS_DIR=..
make labweave-prod-up
make deploy-verify
make labweave-prod-down
```

### 3.1 云服务器准备

1. 克隆五仓到云机（与本地相同目录布局 `web3home/`）
2. 安装：Go、Python3、Node、Nginx、（可选）kubectl + 云 K8s
3. 安全组/防火墙：**仅开放 80、443**；8080–8084 不对外开放

### 3.2 云上构建与启动

```bash
cp deploy/env/labweave.prod.env.example deploy/env/labweave.prod.env
# 编辑 LABWEAVE_ROOT、JOB_SUBMIT_MODE 等

export LABWEAVE_ENV=$PWD/deploy/env/labweave.prod.env
make labweave-prod-up
```

### 3.3 Nginx + 域名（云上公网入口）

```bash
sudo cp deploy/nginx/labweave.conf.example /etc/nginx/sites-available/labweave
sudo sed -i "s|__LABWEAVE_ROOT__|$(pwd)|g" /etc/nginx/sites-available/labweave
# 将 labweave.example.com 改为你的云域名；配置 Let's Encrypt 证书
sudo ln -sf /etc/nginx/sites-available/labweave /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

访问：`https://你的域名` / `https://你的域名/learn`

> 配置里保留的 `labweave.corp.local` 块供企业内网域名；纯公网云部署可只保留 HTTPS `server` 块。

### 3.4 systemd 常驻（可选）

```bash
make labweave-prod-build
sudo LABWEAVE_ROOT=$(pwd) bash deploy/scripts/install-systemd.sh
sudo systemctl enable --now labweave-rule-engine labweave-agent-assist labweave-scheduler labweave-gateway
```

### 3.5 更新发布

```bash
git pull  # 五仓分别 pull
make register-plugins PLUGINS_DIR=..
cd frontend-web && npm run build && cd ..
# 若 Go 变更: 重新 make labweave-prod-build
sudo systemctl restart labweave-gateway labweave-rule-engine labweave-scheduler labweave-agent-assist
sudo systemctl reload nginx
make deploy-verify
```

---

## 4. Makefile 速查

| 目标 | 说明 |
|------|------|
| `make labweave-up` | 开发一键启动 |
| `make labweave-up-lan` | 开发 + 内网可访问 :5173 |
| `make labweave-down` | 停止开发栈 |
| `make k8s-smoke-all` | K8s 双项冒烟 |
| `make labweave-prod-build` | register + npm build + go build |
| `make labweave-prod-up` | 生产后端 |
| `make labweave-prod-down` | 停止生产后端 |
| `make deploy-verify` | 健康 + 插件数 + simulate |

---

## 5. 常见问题

| 现象 | 处理 |
|------|------|
| 侧边栏无插件 | `make register-plugins PLUGINS_DIR=..` |
| 生产 502 /api | `make labweave-prod-up` + `curl localhost:8080/health` |
| K8s 冒烟 TIMEOUT | `kubectl get jobs -A`；设 `JOB_SMOKE_BUSYBOX=1` |
| 编译 Job 不建 Pod | 检查 `JOB_SUBMIT_MODE=cluster` 与 KUBECONFIG |
| 外网能打开但 API 失败 | Nginx `location /api/` 是否指向 8080 |

---

## 6. 相关文档

- [QUICK_DEPLOY.md](../docs/QUICK_DEPLOY.md) — 克隆与依赖
- [DEV.md](../docs/DEV.md) — 环境变量全集
- [LABWEAVE_RELEASE.md](../docs/LABWEAVE_RELEASE.md) — 产品说明
- [multi-language-toolchains.md](../../web3-hot-topic-labs/docs/multi-language-toolchains.md) — 语言组隔离

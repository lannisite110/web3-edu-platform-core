# Phase 4 · 云上 VPS 部署

> 在 **云服务器**（阿里云 ECS / 腾讯云 CVM / 任意 Linux VPS）上对外提供 `https://你的域名`。  
> **前提**：本地 WSL 已完成 [02-local-prod-verify.md](02-local-prod-verify.md) 与 [checklists/pre-cloud-launch.md](checklists/pre-cloud-launch.md)。

详细逐步操作见：[cloud/generic-vps.md](cloud/generic-vps.md)

---

## 1. 架构（云上）

```text
Internet
   │
   ▼
Nginx :443 ──► frontend-web/dist/     (静态 SPA)
   │
   └── /api/* ──► Gateway :8080 (127.0.0.1 only)
                    ├── Rule Engine :8081
                    ├── Scheduler :8082 ──► (可选) 云 K8s Job
                    └── Agent Assist :8084
```

**安全原则**：安全组 / ufw **只开放 22、80、443**；8080–8084 绑定 `127.0.0.1`，不对公网。

---

## 2. 云机规格建议

| 项 | 建议 |
|----|------|
| CPU / 内存 | 2 核 4GB 起（23 插件 + build 较吃内存） |
| 磁盘 | 40GB+ SSD |
| OS | Ubuntu 22.04 LTS |
| 网络 | 公网 IP + 域名 A 记录 |
| 安全组 | 入站：22、80、443；**禁止** 8080–8084 |

---

## 3. 部署总览（10 步）

| 步 | 动作 | 命令 / 文档 |
|----|------|-------------|
| 1 | 本地验收通过 | `make deploy-verify-full` |
| 2 | SSH 登录云 VPS | — |
| 3 | 安装系统依赖 | `sudo bash deploy/scripts/cloud-bootstrap.sh` |
| 4 | 克隆五仓 | 同本地 `web3home/` 布局 |
| 5 | 生产构建 | `make labweave-prod-build` |
| 6 | systemd 常驻 | `install-systemd.sh` + enable |
| 7 | Nginx HTTP | `nginx-install.sh --http-only` |
| 8 | 远程验收 | `make deploy-verify-cloud` |
| 9 | TLS 证书 | `certbot --nginx` + `nginx-install.sh --tls` |
| 10 | 人工冒烟 | [post-deploy-smoke.md](checklists/post-deploy-smoke.md) |

---

## 4. 步骤详解

### 4.1 安装依赖（root）

```bash
cd ~/web3home/web3-edu-platform-core
sudo bash deploy/scripts/cloud-bootstrap.sh
# 新开 shell 或: export PATH=$PATH:/usr/local/go/bin
```

安装：git、nginx、certbot、Python、Node 20、Go 1.22、ufw(80/443)。

### 4.2 克隆代码（deploy 用户）

```bash
mkdir -p ~/web3home && cd ~/web3home
git clone git@github.com:lannisite110/web3-edu-platform-core.git
git clone git@github.com:lannisite110/web3-hot-topic-labs.git
git clone git@github.com:lannisite110/supervision-trace-edu-suite.git
git clone git@github.com:lannisite110/enterprise-gov-edu-demo.git
git clone git@github.com:lannisite110/global-social-edu-sandbox.git
```

### 4.3 构建

```bash
cd ~/web3home/web3-edu-platform-core
python3 -m venv .venv
.venv/bin/pip install -r rule-engine-py/requirements.txt \
  -r agent-assist-py/requirements.txt pyyaml
cd frontend-web && npm ci && cd ..

make labweave-prod-build PLUGINS_DIR=..
# 或: make cloud-deploy PLUGINS_DIR=..
```

### 4.4 环境配置 + systemd

```bash
sudo LABWEAVE_ROOT=$(pwd) bash deploy/scripts/install-systemd.sh
sudo nano /etc/labweave/labweave.env   # 确认 LISTEN_HOST=127.0.0.1、域名等

sudo systemctl enable --now \
  labweave-rule-engine \
  labweave-agent-assist \
  labweave-scheduler \
  labweave-gateway

# 若 JOB_SUBMIT_MODE=cluster:
sudo systemctl enable --now labweave-container-manager
```

检查：

```bash
curl -s http://127.0.0.1:8080/health | jq .
systemctl status labweave-gateway --no-pager
```

### 4.5 DNS

在域名服务商添加 **A 记录**：

```text
labweave.example.com  →  <云 VPS 公网 IP>
```

等待解析生效：`dig +short labweave.example.com`

### 4.6 Nginx（先 HTTP）

```bash
export LABWEAVE_ROOT=~/web3home/web3-edu-platform-core
export LABWEAVE_DOMAIN=labweave.example.com

sudo -E bash deploy/scripts/nginx-install.sh --http-only
```

浏览器访问：`http://labweave.example.com/learn`

### 4.7 远程验收

```bash
cd ~/web3home/web3-edu-platform-core
DEPLOY_VERIFY_URL=http://labweave.example.com make deploy-verify-cloud
```

### 4.8 TLS（Let's Encrypt）

```bash
sudo certbot --nginx -d labweave.example.com
# 按提示输入邮箱、同意条款

sudo -E LABWEAVE_ROOT=~/web3home/web3-edu-platform-core \
  LABWEAVE_DOMAIN=labweave.example.com \
  bash deploy/scripts/nginx-install.sh --tls

DEPLOY_VERIFY_URL=https://labweave.example.com make deploy-verify-cloud
```

证书自动续期：`certbot renew --dry-run`

### 4.9 人工冒烟

逐项勾选 [checklists/post-deploy-smoke.md](checklists/post-deploy-smoke.md)。

---

## 5. 与本地流程的对应

| 本地 WSL | 云上 VPS |
|----------|----------|
| `make labweave-up` | — |
| `make labweave-prod-build` | **相同** |
| `make labweave-prod-up`（调试） | **systemd 常驻** |
| `make deploy-verify-full` | `make deploy-verify-cloud` |
| 无 Nginx | **Nginx + TLS** |

---

## 6. K8s（云上可选）

若 Language Advisor 等需要 **真实编译 Job**：

1. 使用云厂商 **托管 K8s**（ACK/TKE/EKS）或同机 kind  
2. 编辑 `/etc/labweave/labweave.env`：

```bash
JOB_SUBMIT_MODE=cluster
KUBECONFIG=/path/to/kubeconfig
CONTAINER_MANAGER_URL=http://127.0.0.1:8083
```

3. `sudo systemctl enable --now labweave-container-manager`  
4. 详见 [03-k8s-jobs.md](03-k8s-jobs.md)

---

## 7. 更新与回滚

见 [06-operations.md](06-operations.md)。

---

## 8. 故障排查

| 现象 | 处理 |
|------|------|
| 502 Bad Gateway | `systemctl status labweave-gateway`；`curl 127.0.0.1:8080/health` |
| 404 on /learn | Nginx `try_files` 与 `dist/` 路径 |
| API 404 | Nginx `location /api/` 是否 proxy 到 8080 |
| 证书错误 | `certbot certificates`；域名 DNS 是否指向本机 |
| 插件空白 | 云上重新 `register-plugins` + `npm run build` |
| 仅 HTTP 可访问 | 完成 certbot + `--tls` nginx 安装 |

---

## 9. 命令速查

```bash
make cloud-bootstrap          # sudo，首次装依赖
make cloud-deploy             # 构建 + 打印后续步骤
sudo bash deploy/scripts/install-systemd.sh
sudo -E bash deploy/scripts/nginx-install.sh --http-only
DEPLOY_VERIFY_URL=https://域名 make deploy-verify-cloud
```

---

## 10. 相关文件

| 文件 | 说明 |
|------|------|
| `deploy/scripts/cloud-bootstrap.sh` | OS 依赖 |
| `deploy/scripts/cloud-deploy.sh` | 构建编排 |
| `deploy/scripts/nginx-install.sh` | Nginx 站点 |
| `deploy/scripts/verify-cloud.sh` | 公网 URL 验收 |
| `deploy/nginx/labweave-http-only.conf.example` | 先 HTTP |
| `deploy/nginx/labweave.conf.example` | HTTPS 完整 |
| `deploy/env/labweave.prod.env.example` | 生产环境变量 |

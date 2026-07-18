# 通用 Linux VPS 逐步部署

> 适用于任意提供 Ubuntu 22.04 的 VPS（阿里云、腾讯云、DigitalOcean、Vultr 等）。  
> 主文档：[04-cloud-vps.md](../04-cloud-vps.md)

---

## 0. 准备清单

- [ ] 本地 `make deploy-verify-full` 已通过  
- [ ] VPS 公网 IP、SSH 密钥  
- [ ] 域名已购买，可添加 A 记录  
- [ ] 安全组：22 / 80 / 443 入站  

---

## 1. 首次 SSH 登录

```bash
ssh ubuntu@<公网IP>
# 或 root@<公网IP>，建议创建 deploy 用户并禁用 root 密码登录
```

---

## 2. 安装 LabWeave 依赖

```bash
# 若尚未 clone，先装 git
sudo apt-get update && sudo apt-get install -y git

git clone git@github.com:lannisite110/web3-edu-platform-core.git ~/web3home/web3-edu-platform-core
cd ~/web3home/web3-edu-platform-core

sudo bash deploy/scripts/cloud-bootstrap.sh
```

**重要**：Go 安装到 `/usr/local/go` 后，重新登录或：

```bash
export PATH=$PATH:/usr/local/go/bin
go version
```

---

## 3. 克隆其余四仓

```bash
cd ~/web3home
git clone git@github.com:lannisite110/web3-hot-topic-labs.git
git clone git@github.com:lannisite110/supervision-trace-edu-suite.git
git clone git@github.com:lannisite110/enterprise-gov-edu-demo.git
git clone git@github.com:lannisite110/global-social-edu-sandbox.git
```

---

## 4. Python + Node 依赖

```bash
cd ~/web3home/web3-edu-platform-core
python3 -m venv .venv
.venv/bin/pip install -r rule-engine-py/requirements.txt \
  -r agent-assist-py/requirements.txt pyyaml
cd frontend-web && npm ci && cd ..
```

---

## 5. 生产构建

```bash
cd ~/web3home/web3-edu-platform-core
make labweave-prod-build PLUGINS_DIR=..
```

确认：

```bash
test -f frontend-web/dist/index.html && echo "dist OK"
test -x .labweave/bin/gateway && echo "gateway OK"
```

---

## 6. 安装 systemd

```bash
sudo LABWEAVE_ROOT=$HOME/web3home/web3-edu-platform-core \
  bash deploy/scripts/install-systemd.sh

sudo nano /etc/labweave/labweave.env
```

必改项：

```bash
LABWEAVE_ROOT=/home/ubuntu/web3home/web3-edu-platform-core   # 你的实际路径
LABWEAVE_PUBLIC_HOST=labweave.example.com
LISTEN_HOST=127.0.0.1
JOB_SUBMIT_MODE=local   # 或 cluster
```

启动：

```bash
sudo systemctl enable --now \
  labweave-rule-engine labweave-agent-assist labweave-scheduler labweave-gateway

curl -s http://127.0.0.1:8080/health
```

---

## 7. 配置 DNS

在域名控制台：

| 类型 | 主机 | 值 |
|------|------|-----|
| A | @ 或 labweave | `<VPS 公网 IP>` |

验证：`dig +short labweave.example.com`

---

## 8. Nginx HTTP

```bash
export LABWEAVE_ROOT=$HOME/web3home/web3-edu-platform-core
export LABWEAVE_DOMAIN=labweave.example.com

sudo -E bash deploy/scripts/nginx-install.sh --http-only
```

浏览器：`http://labweave.example.com/learn`

---

## 9. 自动化远程验收

```bash
cd ~/web3home/web3-edu-platform-core
DEPLOY_VERIFY_URL=http://labweave.example.com make deploy-verify-cloud
```

---

## 10. 配置 HTTPS

```bash
sudo certbot --nginx -d labweave.example.com

sudo -E LABWEAVE_ROOT=$HOME/web3home/web3-edu-platform-core \
  LABWEAVE_DOMAIN=labweave.example.com \
  bash deploy/scripts/nginx-install.sh --tls
```

```bash
DEPLOY_VERIFY_URL=https://labweave.example.com make deploy-verify-cloud
```

---

## 11. 发布后人工检查

打开 [checklists/post-deploy-smoke.md](../checklists/post-deploy-smoke.md)，逐项勾选。

---

## 12. 云厂商差异（仅网络/控制台）

| 厂商 | 安全组位置 | 备注 |
|------|------------|------|
| 阿里云 ECS | 控制台 → 安全组 | 入方向 80/443 |
| 腾讯云 CVM | 防火墙 / 安全组 | 同上 |
| AWS EC2 | Security Groups | 同上 |
| 其他 | 面板防火墙 | 勿开放 8080 |

应用层步骤 **完全相同**，不因云厂商变化。

---

## 13. 从本地 rsync 构建产物（可选，省云机 build 时间）

若云机内存小，可在 **本地 WSL** build 后同步：

```bash
# 本地
cd ~/web3home/web3-edu-platform-core
make labweave-prod-build PLUGINS_DIR=..

rsync -avz frontend-web/dist/ ubuntu@<IP>:~/web3home/web3-edu-platform-core/frontend-web/dist/
rsync -avz .labweave/bin/ ubuntu@<IP>:~/web3home/web3-edu-platform-core/.labweave/bin/
```

云上仍须：`register-plugins`（若 manifest 变更）、systemd、Nginx。

---

## 14. 下一步

- 日常更新：[06-operations.md](../06-operations.md)  
- K8s Job：[03-k8s-jobs.md](../03-k8s-jobs.md)

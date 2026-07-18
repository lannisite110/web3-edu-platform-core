# Phase 5 · 运维（更新 / 回滚 / 日志 / 备份）

> 云上 LabWeave 上线后的日常操作。部署见 [04-cloud-vps.md](04-cloud-vps.md)。

---

## 1. 日常监控（最小方案）

```bash
# 每 5 分钟 cron（可选）
curl -sf https://labweave.example.com/learn >/dev/null || echo "DOWN" | mail -s LabWeave admin@example.com

# 后端健康
curl -sf http://127.0.0.1:8080/health | jq .
```

systemd 失败自动重启已写在 unit 文件中（`Restart=on-failure`）。

---

## 2. 日志

| 来源 | 命令 |
|------|------|
| Gateway | `journalctl -u labweave-gateway -f` |
| Rule Engine | `journalctl -u labweave-rule-engine -f` |
| Scheduler | `journalctl -u labweave-scheduler -f` |
| Agent Assist | `journalctl -u labweave-agent-assist -f` |
| Nginx 访问 | `tail -f /var/log/nginx/access.log` |
| Nginx 错误 | `tail -f /var/log/nginx/error.log` |

开发态日志（本地）：`.labweave/logs/*.log`

---

## 3. 更新发布 SOP

### 3.1 标准更新（五仓均有变更）

```bash
cd ~/web3home/web3-edu-platform-core
git pull
cd ../web3-hot-topic-labs && git pull && cd ../web3-edu-platform-core
# … 对其余三仓 repeat …

make register-plugins PLUGINS_DIR=..
make labweave-prod-build PLUGINS_DIR=..

sudo systemctl restart \
  labweave-rule-engine \
  labweave-agent-assist \
  labweave-scheduler \
  labweave-gateway

# 若 cluster 模式
sudo systemctl restart labweave-container-manager

sudo systemctl reload nginx
DEPLOY_VERIFY_URL=https://labweave.example.com make deploy-verify-cloud
```

### 3.2 仅前端文案 / i18n / 知识层

```bash
cd ~/web3home/web3-edu-platform-core
git pull
make register-plugins PLUGINS_DIR=..   # 若 knowledge 在 core 且无 manifest 变更可跳过
cd frontend-web && npm run build && cd ..
sudo systemctl reload nginx
```

### 3.3 仅 Go 后端

```bash
make labweave-prod-build   # 或仅 go build 部分
sudo systemctl restart labweave-gateway labweave-scheduler
```

---

## 4. 回滚 SOP

### 4.1 发布前备份（建议每次更新前）

```bash
BACKUP=~/labweave-backups/$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP"
cp -a frontend-web/dist "$BACKUP/"
cp -a .labweave/bin "$BACKUP/"
cp /etc/labweave/labweave.env "$BACKUP/" 2>/dev/null || true
echo "$BACKUP"
```

### 4.2 回滚 dist + 二进制

```bash
BACKUP=~/labweave-backups/<timestamp>
rm -rf frontend-web/dist && cp -a "$BACKUP/dist" frontend-web/
cp -a "$BACKUP/bin/"* .labweave/bin/
sudo systemctl restart labweave-gateway labweave-rule-engine labweave-scheduler labweave-agent-assist
sudo systemctl reload nginx
```

### 4.3 Git 回滚

```bash
cd ~/web3home/web3-edu-platform-core
git log -3 --oneline
git checkout <previous-commit>
make labweave-prod-build PLUGINS_DIR=..
# restart systemd …
```

---

## 5. 备份策略

| 内容 | 频率 | 位置 |
|------|------|------|
| `frontend-web/dist/` | 每次发布前 | `~/labweave-backups/` |
| `.labweave/bin/` | 每次发布前 | 同上 |
| `/etc/labweave/labweave.env` | 变更时 | 同上 |
| `plugins.registry.json` | register 后 | 随 git 或备份 |
| TLS 证书 | certbot 自动 | `/etc/letsencrypt/` |

数据库：**无**（LabWeave 教学平台无生产 DB；Quiz 进度在浏览器 localStorage）。

---

## 6. 证书续期

Let's Encrypt 90 天有效；certbot 安装时通常已加 cron/systemd timer。

```bash
sudo certbot renew --dry-run
sudo systemctl list-timers | grep certbot
```

---

## 7. 安全维护

- 定期 `apt update && apt upgrade`（非高峰）  
- 勿将 8080–8084 暴露公网  
- 审查 `/etc/labweave/labweave.env` 无 LLM API Key 泄露到 git  
- 保持 `COMPLIANCE_MASTER` testnet-only 约束  

---

## 8. 故障升级路径

1. `journalctl -u labweave-gateway -n 50`  
2. `curl http://127.0.0.1:8080/health`  
3. [04-cloud-vps.md §8 故障排查](04-cloud-vps.md#8-故障排查)  
4. 回滚上一备份  
5. 本地 WSL 复现 + `make ci-gate`

---

## 9. 相关命令

```bash
sudo systemctl status labweave-*
DEPLOY_VERIFY_URL=https://域名 make deploy-verify-cloud
make deploy-verify-full    # 在本地对比行为
```

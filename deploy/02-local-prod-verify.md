# Phase 2 · 本地生产态验收（上云前门槛）

> 在 WSL 模拟**云上运行时形态**：静态 `dist/` + 后端 `LISTEN_HOST=127.0.0.1`，无 Vite。  
> 通过本阶段后再把同样流程搬到云 VPS + Nginx。

---

## 1. 与开发态的差异

| 项 | 开发 `labweave-up` | 生产态验收 |
|----|-------------------|------------|
| 前端 | Vite dev :5173，HMR | `npm run build` → `dist/` |
| 后端绑定 | 默认全接口 | `LISTEN_HOST=127.0.0.1` |
| 访问方式 | 浏览器 → Vite | curl → Gateway；浏览器需 Nginx 或 preview |
| Job | local 模拟 | 仍 local（K8s 见 Phase 3） |
| 目的 | 改代码 | **证明 build 产物可运行** |

```text
labweave-prod-build  →  register + vite build + go build
labweave-prod-up     →  四后端（无 Vite）
deploy-verify        →  快速 API 冒烟
deploy-verify-full   →  路径检查 + 多 Lab simulate + 报告
```

---

## 2. 产物清单（build 之后应存在）

```bash
ls -la frontend-web/dist/index.html
ls -la .labweave/bin/gateway .labweave/bin/scheduler
wc -l frontend-web/src/plugins/plugins.registry.json
```

| 路径 | 说明 |
|------|------|
| `frontend-web/dist/` | 含 JS/CSS，上云后由 Nginx 托管 |
| `.labweave/bin/gateway` | API 入口二进制 |
| `.labweave/bin/scheduler` | 任务调度 |
| `.labweave/bin/container-manager` | cluster 模式才必需 |
| `api-gateway-go/config/plugins.registry.json` | 网关读用的 23 插件 |
| `frontend-web/src/plugins/lab-loaders.ts` | 构建时打入各 Lab chunk |

---

## 3. 标准验收流程

### 3.1 配置（可选）

```bash
cp deploy/env/labweave.local.env.example deploy/env/labweave.local.env
# 编辑 LABWEAVE_ROOT
export LABWEAVE_ENV=$PWD/deploy/env/labweave.local.env
```

### 3.2 构建

```bash
cd ~/web3home/web3-edu-platform-core
make labweave-prod-build PLUGINS_DIR=..
```

### 3.3 启动后端

```bash
make labweave-prod-up
# 期望 LISTEN_HOST=127.0.0.1，日志在 .labweave/logs/
```

### 3.4 快速验收

```bash
make deploy-verify
```

检查项：4 个 health、23 plugins、language-advisor → cairo、`dist/index.html` 存在。

### 3.5 完整验收（上云必做）

```bash
make deploy-verify-full
# 生成 deploy/reports/verify-YYYYMMDD-HHMMSS.txt
```

额外包含：

- `labweave-path-check`
- `edu.hot.mock` simulate
- `edu.cn.trace.food` simulate
- `edu.hot.zk-modular` simulate

### 3.6 停止

```bash
make labweave-prod-down
```

---

## 4. 无 Nginx 时如何「看一眼」前端

生产 build **不含** dev proxy，浏览器不能直接打开 `dist/index.html` 调 API（路径问题）。

**方式 A — 仅测 API（推荐上云前）**

```bash
make deploy-verify-full
```

**方式 B — 临时 preview（API 仍走 Gateway）**

```bash
# 终端 1：保持 labweave-prod-up
# 终端 2：
cd frontend-web
npx vite preview --host 127.0.0.1 --port 4173
```

注意：`vite preview` **默认不代理 /api**；需临时在 `vite.config.ts` 加 preview.proxy，或上云后用 Nginx。

**方式 C — 本地临时 Nginx（最接近云上）**

```bash
sudo cp deploy/nginx/labweave.conf.example /tmp/labweave-test.conf
sudo sed -i "s|__LABWEAVE_ROOT__|$(pwd)|g" /tmp/labweave-test.conf
# 改 listen 127.0.0.1:8888，去掉 SSL server，仅留 HTTP
sudo nginx -c /tmp/labweave-test.conf   # 或使用 docker nginx
```

---

## 5. curl 手册（5 条必会）

假设 Gateway 在 `http://127.0.0.1:8080`：

```bash
# 1. 健康
curl -s http://127.0.0.1:8080/health | jq .

# 2. 插件列表
curl -s http://127.0.0.1:8080/api/v1/plugins | jq 'length'

# 3. 语言择优
curl -s -X POST http://127.0.0.1:8080/api/v1/labs/edu.hot.language-advisor/simulate \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"zk cairo","params":{"scenario":"zk","tags":"zk"},"allowed_chain_ids":[11155111]}' | jq .

# 4. ZK 批次
curl -s -X POST http://127.0.0.1:8080/api/v1/labs/edu.hot.zk-modular/simulate \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"batch","params":{"batch_size":4},"allowed_chain_ids":[11155111]}' | jq .

# 5. 助教（MVP）
curl -s -X POST http://127.0.0.1:8080/api/v1/labs/edu.hot.language-advisor/assist \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"explain toolchain","params":{"scenario":"zk"},"allowed_chain_ids":[11155111]}' | jq .
```

---

## 6. LISTEN_HOST 说明

| 值 | 行为 | 场景 |
|----|------|------|
| 未设置 / `0.0.0.0` | 所有网卡可连 8080 | 仅开发调试 |
| `127.0.0.1` | 仅本机 + Nginx 反代 | **云 production** |

`labweave-prod-up` 默认加载 `LISTEN_HOST=127.0.0.1`（见 `deploy/env/labweave.prod.env.example`）。

验证：

```bash
ss -tlnp | grep 8080
# 应看到 127.0.0.1:8080 而非 0.0.0.0:8080
```

---

## 7. 上云门槛（与 checklist 对齐）

完成下列全部后再 SSH 到云机：

- [ ] `make deploy-verify-full` 通过
- [ ] 报告文件已保存 `deploy/reports/verify-*.txt`
- [ ] [checklists/pre-cloud-launch.md](checklists/pre-cloud-launch.md) 已勾选
- [ ] （若需 Job）Phase 3 `k8s-smoke-all` 通过

下一步：[04-cloud-vps.md](04-cloud-vps.md) + [cloud/generic-vps.md](cloud/generic-vps.md)。

---

## 8. 故障排查

| 现象 | 检查 |
|------|------|
| `dist missing` | `make labweave-prod-build` |
| gateway health FAIL | `tail .labweave/logs/gateway.log` |
| plugins < 23 | `make register-plugins` 后 rebuild |
| simulate 404 plugin | registry 与 manifest id 不一致 |
| path-check FAIL | `data/labweave-path.json` 与 registry 对齐 |
| 127.0.0.1 外无法 curl 8080 | **预期行为**；公网必须走 Nginx |

---

## 9. 相关命令

```bash
make labweave-prod-build
make labweave-prod-up
make deploy-verify
make deploy-verify-full
make labweave-prod-down
export LABWEAVE_ENV=deploy/env/labweave.local.env
```

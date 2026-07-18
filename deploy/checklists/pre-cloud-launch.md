# 上云前检查清单

> 在 **本地 WSL** 完成下列项后，再将同一套构建流程搬到 **云 VPS**。  
> 配套文档：[02-local-prod-verify.md](../02-local-prod-verify.md)

---

## A. 代码与仓库

- [ ] 五仓均在 `~/web3home/` 且为 **main** 或计划发布的 tag
- [ ] `web3-edu-platform-core` 与四子库 **commit 对应**（无混用旧子库）
- [ ] `make core-version-check` 通过（若维护者发版）
- [ ] `git status` 无未提交的关键配置（`.env` 密钥勿提交）

## B. 本地环境

- [ ] `make labweave-doctor` 全部 OK（或仅 WARN 可接受）
- [ ] Go ≥ 1.21、Node ≥ 18、Python ≥ 3.10
- [ ] `frontend-web/node_modules` 与 `.venv` 已安装
- [ ] 端口 5173、8080–8084 无冲突

## C. 插件注册

- [ ] `make register-plugins PLUGINS_DIR=..` 成功
- [ ] `frontend-web/src/plugins/plugins.registry.json` 含 **23** 个插件
- [ ] `make labweave-path-check` 通过（学习地图与 registry 对齐）

## D. 本地开发态冒烟

- [ ] `make labweave-up` 启动无 ERROR
- [ ] 浏览器 `http://127.0.0.1:5173/learn` 四轨道可见
- [ ] 至少打开 3 个 Lab：language-advisor、food-trace、zk-modular
- [ ] Quiz 选项高亮 + 提交后两题均显示对错
- [ ] `make labweave-down`

## E. 本地生产态构建

- [ ] `make labweave-prod-build PLUGINS_DIR=..` 成功
- [ ] 存在 `frontend-web/dist/index.html`
- [ ] 存在 `.labweave/bin/gateway` 与 `scheduler`

## F. 本地生产态 API 验收

- [ ] `make labweave-prod-up`
- [ ] `make deploy-verify` 通过
- [ ] **`make deploy-verify-full`** 通过并生成 `deploy/reports/verify-*.txt`
- [ ] `make labweave-prod-down`

## G. K8s（若云上需要编译 Job）

- [ ] 本地或云上有可用集群（kind / 云托管 K8s）
- [ ] `kubectl cluster-info` 成功
- [ ] `make k8s-apply-base` 成功
- [ ] `make k8s-smoke-all` 通过（或接受 `JOB_SMOKE_BUSYBOX=1` 占位模式）
- [ ] 计划在生产 `JOB_SUBMIT_MODE=cluster` 且 `KUBECONFIG` 路径已确认

## H. 云上资源（上机前填好）

- [ ] VPS 规格 ≥ 2C4G，磁盘 ≥ 40GB，Ubuntu 22.04 或同类
- [ ] 公网 IP 与 **域名 A 记录** 已配置
- [ ] 安全组：**仅** 22（SSH）、80、443；**不**开放 8080–8084
- [ ] SSH 密钥登录已配置
- [ ] （可选）云 K8s kubeconfig 已下载到安全路径

## I. 合规确认

- [ ] 仅测试网 / 教学沙箱（见 COMPLIANCE_MASTER）
- [ ] 无 mainnet RPC、无真实资金相关配置
- [ ] 对外文案含 testnet-only 说明

---

**签字 / 日期**（团队可选）：

| 角色 | 姓名 | 日期 |
|------|------|------|
| 部署执行 | | |
| 验收 | | |

全部勾选后 → 执行 [04-cloud-vps.md](../04-cloud-vps.md)。

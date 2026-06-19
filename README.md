<p align="center">
  <img src="assets/icon.png" alt="Web3 Education Platform" width="128"/>
</p>

# Web3 Education Platform Core

> **主库 · 唯一基础设施源**  
> **版本 v0.6.0** · 纯教育培训 | 测试网/沙箱 only

## 职责

本仓库提供**全部**跨子库共享能力。子库**禁止**在本仓之外重复实现：

- Vue3 壳应用 + 插件加载器
- Gin API 网关 + 合规拦截
- Go K8s Operator + 任务调度器
- Python 规则引擎主进程 + 插件注册表
- Bazel WORKSPACE + 合规 CI
- JSON Schema / TaskType 枚举

## 五层架构

1. **frontend-web/** — Vue3 + Vite，含 `src/plugins/loader.ts`
2. **api-gateway-go/** — Gin 网关
3. **control-plane-go/** — Operator、Scheduler、Security Hub
4. **rule-engine-py/** — FastAPI + `plugins/registry.py`
5. **infra/** — Podman/Docker/K8s base manifests

## 快速启动

见 [docs/DEV.md](docs/DEV.md)。

```bash
make register-plugins PLUGINS_DIR=..
make test-e2e-smoke          # 全链路 smoke 已通过
make run-rule-engine         # 终端1
make run-scheduler           # 终端2
make run-gateway             # 终端3
cd frontend-web && npm run dev   # 终端4 → http://localhost:5173
```

## 子库集成

子库通过 `plugin.manifest.yaml` 注册。见 [docs/PLUGIN_CONTRACT.md](docs/PLUGIN_CONTRACT.md)。

```bash
make validate-plugin MANIFEST=../web3-hot-topic-labs/plugin.manifest.yaml
make register-plugins PLUGINS_DIR=../
make compliance-check
make test-e2e-smoke
```

## 合规

- [../COMPLIANCE_MASTER.md](../COMPLIANCE_MASTER.md)
- [docs/COMPLIANCE.md](docs/COMPLIANCE.md)

## 路线图

| 版本 | 内容 |
|------|------|
| v0.1.0 | 插件契约 + 合规 CI + E2E smoke |
| v0.2.0 | 4 子库插件接入 + 23 插件联调 |
| v0.3.0 | CI + jobsubmit + Fabric bootstrap |
| v0.4.0 | client-go K8s Job + container-manager |
| v0.4.1 | Pod 日志采集 + Job 自动清理 |
| v0.4.2 | Pod 失败诊断 + 多语言 K8s 冒烟 |
| v0.5.0 | container-manager 服务 + 教程审查 |
| v0.6.0 | scheduler 解耦 + Bazel MODULE 脚手架 |

---

### 中文免责

本项目仅为区块链智能合约与 Web3 技术的**纯开源教育培训项目**。全部实验**仅允许在官方公开测试网或本地/Fabric 沙箱**进行，**严格禁止主网部署**。禁止用于代币发行、融资、交易炒作及任何非法金融活动。

### English Disclaimer

Open-source **education-only** platform. **Testnets and local sandboxes only.** Mainnet deployment strictly forbidden. No token issuance, fundraising, or financial speculation.

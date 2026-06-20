<p align="center">
  <img src="assets/icon.png" alt="Web3 Education Platform" width="128"/>
</p>

# Web3 Education Platform Core

> **主库 · 唯一基础设施源**  
> **版本 v1.2.0-labweave** · 纯教育培训 | 测试网/沙箱 only · **LabWeave 沙箱码坊**

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

- [LabWeave 一键启动](docs/LABWEAVE_RELEASE.md) — `make labweave-up`  
- [LabWeave 总纲](docs/LABWEAVE.md) · [学习地图 `/learn`](frontend-web/src/views/LearnView.vue)  
- [学习路径](docs/LEARNING_PATH.md) — 阶段 0–4；子库 **3A–3D**  
- [快速部署](docs/QUICK_DEPLOY.md) · [本地开发](docs/DEV.md)

```bash
make labweave-up PLUGINS_DIR=..
# 或维护者：make register-plugins PLUGINS_DIR=.. && make ci-gate
```

## 子库学习路径（v0.4.0）

| 阶段 | 子库 | 文档 |
|------|------|------|
| 3A | web3-hot-topic-labs | [HOT_TOPIC_LEARNING_PATH.md](../web3-hot-topic-labs/docs/HOT_TOPIC_LEARNING_PATH.md) |
| 3B | supervision-trace-edu-suite | [TRACE_LEARNING_PATH.md](../supervision-trace-edu-suite/docs/TRACE_LEARNING_PATH.md) |
| 3C | enterprise-gov-edu-demo | [GOV_LEARNING_PATH.md](../enterprise-gov-edu-demo/docs/GOV_LEARNING_PATH.md) |
| 3D | global-social-edu-sandbox | [GLOBAL_LEARNING_PATH.md](../global-social-edu-sandbox/docs/GLOBAL_LEARNING_PATH.md) |

## 子库集成

子库通过 `plugin.manifest.yaml` 注册。见 [docs/PLUGIN_CONTRACT.md](docs/PLUGIN_CONTRACT.md)。

```bash
make validate-plugin MANIFEST=../web3-hot-topic-labs/plugins/language-advisor/plugin.manifest.yaml
make register-plugins PLUGINS_DIR=..
make compliance-check
make integration-all-plugins
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
| v0.4.x | client-go K8s Job + container-manager + 多语言冒烟 |
| v1.0.0 | 稳定主库首发 · coreVersion 对齐 · release-check |
| v1.0.2 | 阶段 3A 热点专题 · hot-labs v0.4.0 联调 |
| **v1.2.0-labweave** | **LabWeave L1–L3** · `make labweave-up` · 沙箱助教 |

---

### 中文免责

本项目仅为区块链智能合约与 Web3 技术的**纯开源教育培训项目**。全部实验**仅允许在官方公开测试网或本地/Fabric 沙箱**进行，**严格禁止主网部署**。禁止用于代币发行、融资、交易炒作及任何非法金融活动。

### English Disclaimer

Open-source **education-only** platform. **Testnets and local sandboxes only.** Mainnet deployment strictly forbidden. No token issuance, fundraising, or financial speculation.

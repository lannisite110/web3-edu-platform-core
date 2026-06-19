# Agent 协作契约（子库 Agent 必读）

> **版本**: 1.0.0  
> **维护者**: 主库 Agent-0 only  
> **变更**: 子库 Agent 如需新增 TaskType/API，须提 Issue 到主库，不得私自扩展枚举

---

## 1. 架构原则

```
┌─────────────────────────────────────────────────────────┐
│  frontend-web (Vue3)                                     │
│  └── src/plugins/loader.ts  ← 读取 manifest 动态加载      │
├─────────────────────────────────────────────────────────┤
│  api-gateway-go (Gin)                                    │
│  └── /api/v1/labs/{plugin_id}/*  ← 统一路由前缀           │
├─────────────────────────────────────────────────────────┤
│  control-plane-go                                        │
│  └── task-scheduler/  ← 按 TaskType 分发到 Namespace      │
├─────────────────────────────────────────────────────────┤
│  rule-engine-py (FastAPI)                                │
│  └── plugins/registry.py  ← 按 plugin_id 加载 Python 插件 │
└─────────────────────────────────────────────────────────┘
         ▲ 仅通过 plugin.manifest.yaml 注册，不修改主库源码
         │
   [子库 web3home 下四个子库目录]
```

---

## 2. 子库目录规范（强制）

```
{sub-repo}/
├── plugin.manifest.yaml      # 必填，JSON Schema 校验
├── AGENT_TASK.md             # 本仓 Agent 任务书
├── README.md
├── plugins/
│   ├── contracts/            # 教学合约模板 (.sol, .rs, …)
│   ├── rules/                # Python 规则插件（单文件或包）
│   └── frontend/             # Vue 面板 SFC，export default { id, routes, … }
├── k8s/
│   └── overlays/
│       └── {namespace}/      # 仅 Job/ConfigMap/NetworkPolicy patch
└── docs/
    └── tutorials/
```

### 禁止项

- ❌ `api-gateway-go/`, `control-plane-go/`, `rule-engine-py/main.py`
- ❌ 新建 `WORKSPACE` / 独立 Bazel 根（子库用主库 Bazel 引用）
- ❌ 主网 RPC、真实 API Key、真实用户数据
- ❌ 覆盖 `k8s-manifests/base/`（主库独占）

---

## 3. plugin.manifest.yaml 规范

完整 Schema: [schemas/plugin.manifest.schema.json](../schemas/plugin.manifest.schema.json)

```yaml
apiVersion: edu.web3/v1
kind: PluginPackage
metadata:
  id: edu.hot.zk-modular          # 全局唯一，见 AGENT_ORCHESTRATION.md
  name: ZK Modular Rollup Lab
  version: 0.1.0
  repo: web3-hot-topic-labs
  compliance_tier: hot_topic       # hot_topic | cn_domain | global_sandbox

spec:
  taskTypes:                     # 必须是 schemas/task-types.yaml 已注册项
    - HOT_ZK_ROLLUP_SIM
  namespaces:
    - ns-hot-zk
  allowedChainIds:
    - 11155111                   # Sepolia only
  frontend:
    routePrefix: /labs/edu.hot.zk-modular
    entry: plugins/frontend/ZkModularLab.vue
  rules:
    entry: plugins.rules.zk_modular:evaluate
  contracts:
    - path: plugins/contracts/ModularRollupDemo.sol
      language: solidity
  k8s:
    jobTemplate: k8s/overlays/ns-hot-zk/zk-rollup-job.yaml
  docs:
    - docs/tutorials/zk-modular-intro.md
```

**校验命令**:

```bash
make validate-plugin MANIFEST=/path/to/plugin.manifest.yaml
```

---

## 4. TaskType 枚举（子库只能使用，不能私自新增）

见 [schemas/task-types.yaml](../schemas/task-types.yaml)。

子库 Agent 需要新 TaskType 时：

1. 在主库提 PR 修改 `schemas/task-types.yaml`
2. 主库 Agent-0 合并后，子库才能写入 manifest

---

## 5. Python 规则插件接口

```python
# 子库 plugins/rules/zk_modular.py

from typing import Any
from dataclasses import dataclass

@dataclass
class RuleInput:
    user_prompt: str
    params: dict[str, Any]
    allowed_chain_ids: list[int]

@dataclass
class RuleOutput:
    recommended_template: str      # 合约模板路径（相对子库）
    recommended_language: str      # solidity | rust | cairo | move
    audit_hints: list[str]
    compliance_passed: bool
    rejection_reason: str | None = None

def evaluate(inp: RuleInput) -> RuleOutput:
    """主库 rule-engine-py 通过 entry point 调用此函数。"""
    ...
```

**约束**:

- 函数名固定 `evaluate`
- 若检测到主网 chainId 或违规参数 → `compliance_passed=False`
- 不得发起外部网络请求（LLM 调用由主库 `llm-contract-advisor` 统一代理）

---

## 6. Vue 前端插件接口

```typescript
// 子库 plugins/frontend/ZkModularLab.vue 同目录 export plugin.ts

import type { LabPlugin } from '@core/plugins/types'  // 主库类型，子库 dev 时 path alias

export const plugin: LabPlugin = {
  id: 'edu.hot.zk-modular',
  title: 'ZK Modular Rollup Lab',
  routePrefix: '/labs/edu.hot.zk-modular',
  routes: [
    { path: '', component: () => import('./ZkModularLab.vue') },
  ],
  // 仅允许向内网网关发请求
  apiBase: '/api/v1/labs/edu.hot.zk-modular',
}
```

主库 `frontend-web/src/plugins/loader.ts` 在构建时读取已注册 manifest 列表，动态 import 子库 frontend entry。

---

## 7. Go 调度接口（子库不实现，仅声明）

子库在 manifest 声明 `taskTypes` + `k8s.jobTemplate`。

Job 模板必须：

```yaml
# k8s/overlays/ns-hot-zk/zk-rollup-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  labels:
    edu.web3/plugin-id: edu.hot.zk-modular
    edu.web3/compliance: testnet-only
spec:
  template:
    spec:
      containers:
        - name: runner
          env:
            - name: CHAIN_ID
              value: "11155111"    # 必须是 allowedChainIds 子集
            - name: RPC_URL
              valueFrom:
                configMapKeyRef:
                  name: testnet-rpc-sepolia   # 主库 ConfigMap，非主网
```

---

## 8. API 路由约定

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/labs/{plugin_id}/simulate` | 提交实验参数 |
| GET | `/api/v1/labs/{plugin_id}/status/{task_id}` | 查询任务 |
| GET | `/api/v1/labs/{plugin_id}/report/{task_id}` | 获取报告 |

网关自动注入：合规校验、限流、trace_id。子库无需实现网关。

---

## 9. 合规钩子（主库 enforce，子库配合）

| 检查点 | 位置 | 子库责任 |
|--------|------|----------|
| manifest chainId | CI validate-plugin | 只声明测试网 ID |
| 源码主网字符串 | CI compliance-check | 不含 mainnet 域名 |
| 运行时参数 | security-hub | params 不含 mainnet |
| 文档用语 | 人工 + CI keyword scan | 无「生产/商用/机构级」 |

---

## 10. 版本兼容

```yaml
# plugin.manifest.yaml
spec:
  coreVersion: ">=0.1.0 <0.2.0"   # 主库 semver 范围
```

主库 breaking change 时递增 minor/major 并更新本文档。

---

## 11. Agent-0 交付检查清单（完成后打 tag v0.1.0）

- [ ] `schemas/plugin.manifest.schema.json` 可校验
- [ ] `schemas/task-types.yaml` 含全部预分配 TaskType
- [ ] `make validate-plugin` / `make compliance-check` / `make test-e2e-smoke` 通过
- [ ] `frontend-web/src/plugins/loader.ts` 可加载 mock 插件
- [ ] `rule-engine-py/plugins/registry.py` 可动态 import 子库 rules
- [ ] 示例 manifest: `examples/sample-plugin.manifest.yaml`

**子库 Agent 看到 v0.1.0 tag 即可开始并行开发。**

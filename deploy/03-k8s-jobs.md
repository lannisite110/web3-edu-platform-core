# Phase 3 · Kubernetes Job 链

> 目标：理解并验收 **Scheduler → K8s Job → Pod 完成** 链路。  
> 日常开发 **不必** 开 K8s；Language Advisor「提交编译 Job」等能力在 `JOB_SUBMIT_MODE=cluster` 时走此链。

---

## 1. 何时需要 K8s？

| 能力 | local 模式 | cluster 模式 |
|------|------------|--------------|
| simulate / 规则评估 | ✅ | ✅ |
| Quiz / 知识面板 | ✅ | ✅ |
| 沙箱助教 /assist | ✅ | ✅ |
| 提交 HOT_* Job（编译、DAO sim 等） | 进程内模拟 | **真实 Pod** |
| Language Advisor 多语言编译 | 模拟 | ns-evm 等 Namespace 中 Job |

**结论**：纯浏览 Lab、做 Quiz → 不需要 K8s。  
要上 **真实编译 Job** 或冒烟调度链 → 需要 K8s + Phase 3。

---

## 2. 架构组件

```text
Gateway POST .../simulate (带 task_type)
    → Scheduler POST /submit
        → 读 plugins.registry jobTemplate 路径
        → container-manager 解析 toolchain（镜像/namespace）
        → client-go 创建 Job
        → 轮询 Pod → report (completed/failed)
```

| 组件 | 端口 | cluster 模式 |
|------|------|--------------|
| scheduler | 8082 | `JOB_SUBMIT_MODE=cluster` |
| container-manager | 8083 | 解析 `build-images/manifest.yaml` |
| kubectl | — | 使用 `KUBECONFIG` |

详细序列图：[diagrams/request-flow.mmd](diagrams/request-flow.mmd)

---

## 3. Namespace 等级（COMPLIANCE）

| 等级 | Namespace | 用途 |
|------|-----------|------|
| L1 | `ns-evm`, `ns-solana`, `ns-move` | 通用编译 |
| L2 | `ns-hot-zk`, `ns-hot-aa`, `ns-hot-sim` | 热点实训 Job |
| L3 | `ns-domain-cn`, `ns-domain-global` | 溯源/沙箱 Fabric 等 |
| 语言扩展 | `ns-lang-btc`, `ns-lang-flow`, `ns-lang-algorand` | 子库1 toolchain |

主库 base：`k8s-manifests/base/namespaces.yaml`  
子库 Job 模板：`web3-hot-topic-labs/k8s/overlays/**`

---

## 4. 本地 K8s 集群（WSL）

### 4.1 安装 kind（推荐）

```bash
# 需 Docker Desktop (WSL) 或 dockerd
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.24.0/kind-linux-amd64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/kind

kind create cluster --name labweave
kubectl cluster-info --context kind-labweave
```

### 4.2 或 k3d

```bash
k3d cluster create labweave -p "8088:80@loadbalancer"
```

### 4.3 WSL 注意

- Docker 必须 running：`docker ps`
- `kubectl config current-context` 应指向 kind/k3d
- 资源不足时 Job 会 Pending → `kubectl describe pod`

---

## 5. 应用 Manifest

```bash
cd ~/web3home/web3-edu-platform-core
make k8s-apply-base PLUGINS_DIR=..
```

等价于：

1. `kubectl apply -f k8s-manifests/base/namespaces.yaml`
2. `kubectl apply -f k8s-manifests/base/testnet-rpc-configmaps.yaml`
3. `kubectl apply -f web3-hot-topic-labs/k8s/overlays/**/*.yaml`（Job 模板）

跳过子库 overlays：

```bash
K8S_APPLY_HOT_OVERLAYS=0 make k8s-apply-base
```

验证：

```bash
kubectl get ns | grep -E '^ns-'
kubectl get jobs -A | head
```

---

## 6. 冒烟测试

### 6.1 一键两项

```bash
make k8s-smoke-all
```

| 步骤 | 脚本 | TaskType | 插件 |
|------|------|----------|------|
| 1 | k8s-job-smoke | HOT_DAO_VOTE_SIM | edu.hot.dao |
| 2 | k8s-multilang-smoke | HOT_MULTI_LANG_COMPILE | edu.hot.language-advisor |

内部流程（`k8s-smoke-common.sh`）：

1. `kubectl apply` base namespaces
2. 启动 container-manager + scheduler（**临时进程**，脚本结束即 cleanup）
3. `curl POST /submit` → 得到 task_id
4. 轮询 `/report/{id}` 至 completed/failed（最多 ~120s）

### 6.2 单项

```bash
make k8s-job-smoke
make k8s-multilang-smoke
```

### 6.3 busybox 回退

默认 `JOB_SMOKE_BUSYBOX=1`：集群**无** toolchain 镜像时，Job 仍用 busybox 跑通调度链。

```bash
JOB_SMOKE_BUSYBOX=0 make k8s-multilang-smoke   # 需要真实 edu/toolchain-evm 等镜像
```

---

## 7. 冒烟脚本失败排查

| 阶段 | 命令 | 常见原因 |
|------|------|----------|
| preflight | `kubectl cluster-info` | 无集群 / 错误 context |
| apply ns | `kubectl get ns ns-hot-sim` | 权限不足 |
| submit | scheduler log | registry 无 jobTemplate |
| Job Pending | `kubectl describe job -n ns-hot-sim` | 无镜像 pull |
| Job Failed | `kubectl logs job/...` | 脚本命令错误 |
| TIMEOUT | 增大 `JOB_POLL_TIMEOUT_SEC` | 集群慢 / 镜像大 |

```bash
kubectl get jobs -A | grep -v Complete
kubectl get pods -A | grep -E 'Error|Pending'
kubectl describe pod -n ns-hot-sim <pod>
```

---

## 8. 与生产 backend 集成

### 8.1 环境文件

```bash
cp deploy/env/labweave.cloud-k8s.env.example deploy/env/labweave.cloud-k8s.env
export LABWEAVE_ENV=$PWD/deploy/env/labweave.cloud-k8s.env
make labweave-prod-up   # 会启动 container-manager + cluster scheduler
```

### 8.2 云场景两种拓扑

**A. VPS + 远程 K8s（常见）**

- Gateway/scheduler 在云 VPS 本机
- `KUBECONFIG` 指向阿里云 ACK / 腾讯云 TKE kubeconfig
- Job 跑在托管集群，不在 VPS 上装 K8s

**B. VPS 单机 kind（教学/demo）**

- kind 与 backend 同机
- 资源有限，仅适合冒烟

### 8.3 systemd 补充

cluster 模式需 **container-manager** 常驻；可在 `install-systemd.sh` 后手动添加 unit（见 `deploy/systemd/` 待扩展）或 `labweave-prod-up` 前台调试。

---

## 9. Toolchain 镜像（进阶）

文档：[multi-language-toolchains.md](../../web3-hot-topic-labs/docs/multi-language-toolchains.md)

```bash
# 构建示例（EVM）
cd web3-hot-topic-labs/build-images/evm
docker build -t edu/toolchain-evm:0.1.0 .

# kind 加载
kind load docker-image edu/toolchain-evm:0.1.0 --name labweave

JOB_SMOKE_BUSYBOX=0 make k8s-multilang-smoke
```

manifest 路径：`web3-hot-topic-labs/build-images/manifest.yaml`

---

## 10. 合规提醒

- 所有 Job 强制 testnet 白名单（ConfigMap + 规则引擎）
- 禁止 mainnet RPC（CI + runtime 双检）
- 子库仅提交 overlay，不创建 ClusterRole 等集群级危险资源

见 [COMPLIANCE_MASTER.md](../../COMPLIANCE_MASTER.md)

---

## 11. 命令速查

```bash
make k8s-apply-base
make k8s-job-smoke
make k8s-multilang-smoke
make k8s-smoke-all
export LABWEAVE_ENV=deploy/env/labweave.cloud-k8s.env
make labweave-prod-up
kubectl get jobs -A
```

---

## 12. 与 Phase 2 / 上云的关系

```text
Phase 2 deploy-verify-full (local, JOB_SUBMIT_MODE=local)
        ↓
Phase 3 k8s-smoke-all (可选，验证 cluster 链)
        ↓
上云: labweave-prod-up + JOB_SUBMIT_MODE=cluster + 托管 K8s
        ↓
post-deploy-smoke checklist 含 Job 项
```

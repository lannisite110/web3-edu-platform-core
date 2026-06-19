# 本地开发启动（v0.4.2）

## 1. 注册插件

```bash
cd web3-edu-platform-core
make register-plugins PLUGINS_DIR=..
```

## 2. 启动后端

```bash
make run-rule-engine   # :8081
make run-scheduler     # :8082
make run-gateway       # :8080
```

### Job 投递模式（v0.4）

| `JOB_SUBMIT_MODE` | 行为 |
|-------------------|------|
| `local`（默认） | 进程内模拟；`ci-gate` 使用此模式 |
| `cluster` | client-go 创建 K8s Job，加载子库 `jobTemplate` YAML，轮询至成功/失败/超时 |

```bash
# 集群模式示例（需 kubectl 可用 + 命名空间已创建）
export JOB_SUBMIT_MODE=cluster
export JOB_POLL_TIMEOUT_SEC=120
make run-scheduler
```

```bash
# 单 Job 冒烟（提交 edu.hot.dao 模板 Job）
make k8s-job-smoke

# 多语言编译任务冒烟（edu.hot.language-advisor；默认 busybox 回退）
make k8s-multilang-smoke
```

## 3. Fabric 教学沙箱（可选）

```bash
make fabric-bootstrap
```

## 4. 启动前端

```bash
cd frontend-web && npm install && npm run dev
```

## 5. 验收

```bash
make compliance-check
make ci-gate
make integration-all-plugins
# 有 K8s 集群时：
make k8s-job-smoke
make k8s-multilang-smoke
```

## 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `CORE_ROOT` | 主库根目录 | schema / registry / Job 模板路径解析 |
| `JOB_SUBMIT_MODE` | `local` | `local` \| `cluster` |
| `JOB_POLL_TIMEOUT_SEC` | `90` | cluster 模式 Job 轮询超时 |
| `KUBECONFIG` | `~/.kube/config` | 集群凭证 |
| `TOOLCHAIN_MANIFEST` | `../web3-hot-topic-labs/build-images/manifest.yaml` | 镜像组（container-manager） |
| `JOB_AUTO_CLEANUP` | `true` | cluster 完成后删除 Job（设 `false` 保留） |
| `JOB_LOG_TAIL_LINES` | `80` | 报告内附 Pod 日志尾行数 |
| `JOB_SMOKE_BUSYBOX` | `0` | 设为 `1` 时 cluster 冒烟用 busybox 代替 toolchain 镜像 |

## v0.4.x 要点

- v0.4.0 — client-go Job 创建 + 模板加载 + `make k8s-job-smoke`
- v0.4.1 — Pod 日志采集、Job 自动清理、kubeconfig 路径检测
- v0.4.2 — Pod phase/reason/events 诊断、`make k8s-multilang-smoke`、toolchain 镜像 tag 与 manifest version 对齐

## 后续（v0.5+）

- Bazel WORKSPACE
- 22 插件教程齐套审查

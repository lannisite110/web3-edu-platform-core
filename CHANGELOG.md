# Changelog · web3-edu-platform-core

## v1.0.0 — 进行中

首个稳定教学平台主库版本：23 插件联调、K8s Job 投递、container-manager 服务化。

### 发布门槛

- [ ] 四子库 `coreVersion` 对齐 `>=0.6.0 <2.0.0`
- [ ] `make release-check` 全绿
- [ ] git tag `v1.0.0`

---

## v0.6.0

- scheduler 经 `CONTAINER_MANAGER_URL` HTTP 解析 toolchain
- `tutorial-audit` 教程合规措辞检查
- 根目录 `MODULE.bazel` 脚手架
- 开发端口冲突修复（`make stop-backend`、冒烟 reuse）

## v0.5.0

- `container-manager` HTTP 服务（`:8083`）
- mock 插件 Vue 面板
- `make tutorial-audit`

## v0.4.2

- K8s Job Pod 失败诊断（status/events/logs）
- `make k8s-multilang-smoke`
- Job 模板 `sigs.k8s.io/yaml` 修复

## v0.4.1

- Pod 日志尾行、Job 自动清理、kubeconfig 检测

## v0.4.0

- client-go 真实 K8s Job 创建与轮询

## v0.3.0

- GitHub Actions 五仓 CI、Fabric bootstrap、jobsubmit 脚手架

## v0.2.0

- 22 子库 + mock 共 23 插件联调、`lab-loaders` 自动生成

## v0.1.0

- 插件契约、合规 CI、E2E smoke

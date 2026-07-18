# LabWeave 部署手册 · 索引

> **本地**（WSL 开发/验收）→ **云上**（VPS 公网 HTTPS）  
> 完整路径：Phase 1 开发 → Phase 2 本地验收 → Phase 3 K8s（可选）→ **Phase 4 上云**

---

## 我该读哪一篇？

```text
刚 clone 五仓、想跑起来        → 01-local-dev.md
准备上云、想确认本地没问题      → 02-local-prod-verify.md + checklists/pre-cloud-launch.md
需要 K8s 编译 Job / 冒烟       → 03-k8s-jobs.md
部署到云 VPS、绑定域名          → 04-cloud-vps.md + cloud/generic-vps.md
上线后更新 / 回滚 / 日志        → 06-operations.md
已经上云、做发布后验收          → checklists/post-deploy-smoke.md
```

---

## 文档地图

| 文档 | 内容 | 阶段 |
|------|------|------|
| [01-local-dev.md](01-local-dev.md) | WSL 开发、`labweave-up`、改插件、日志排查 | Phase 1 ✅ |
| [02-local-prod-verify.md](02-local-prod-verify.md) | 本地生产态、`deploy-verify-full` | Phase 2 ✅ |
| [03-k8s-jobs.md](03-k8s-jobs.md) | K8s Job 链、冒烟、cluster 模式 | Phase 3 ✅ |
| [04-cloud-vps.md](04-cloud-vps.md) | 云 VPS + Nginx + TLS | Phase 4 ✅ |
| [cloud/generic-vps.md](cloud/generic-vps.md) | 通用 VPS 逐步操作 | Phase 4 ✅ |
| [06-operations.md](06-operations.md) | 更新、回滚、日志、备份 | 运维 ✅ |
| [checklists/pre-cloud-launch.md](checklists/pre-cloud-launch.md) | 上云前勾选 | ✅ |
| [checklists/post-deploy-smoke.md](checklists/post-deploy-smoke.md) | 上云后冒烟 | ✅ |
| [diagrams/](diagrams/) | 架构 Mermaid | ✅ |

---

## 命令速查

| 场景 | 命令 |
|------|------|
| 环境自检 | `make labweave-doctor` |
| 本地开发 | `make labweave-up` / `make labweave-down` |
| 本地生产构建 | `make labweave-prod-build` |
| 完整本地验收 | `make deploy-verify-full` |
| K8s 冒烟 | `make k8s-smoke-all` |
| **云机装依赖** | `sudo make cloud-bootstrap` |
| **云机构建** | `make cloud-deploy` |
| **Nginx 安装** | `sudo -E bash deploy/scripts/nginx-install.sh --http-only` |
| **公网验收** | `DEPLOY_VERIFY_URL=https://域名 make deploy-verify-cloud` |

---

## 推荐路径

```text
【本地 WSL】
1. make labweave-doctor
2. make labweave-up → 试 /learn
3. make labweave-prod-build && make labweave-prod-up
4. make deploy-verify-full
5. 勾选 checklists/pre-cloud-launch.md

【云 VPS】
6. sudo make cloud-bootstrap
7. clone 五仓 → make cloud-deploy
8. install-systemd + nginx-install
9. deploy-verify-cloud + post-deploy-smoke.md
10. 日常 → 06-operations.md
```

---

## 相关文档

- [QUICK_DEPLOY.md](../docs/QUICK_DEPLOY.md)
- [DEV.md](../docs/DEV.md)
- [LABWEAVE.md](../docs/LABWEAVE.md)

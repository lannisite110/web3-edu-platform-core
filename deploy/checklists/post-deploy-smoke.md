# 上云后冒烟清单

> 云 VPS + Nginx + systemd 就绪后，按本清单逐项验证。  
> 自动化辅助：`DEPLOY_VERIFY_URL=https://你的域名 make deploy-verify`

---

## 1. 基础设施

- [ ] `curl -sf https://你的域名/health` 或经 Nginx 反代的 gateway health（若暴露）
- [ ] `curl -sf https://你的域名/` 返回 HTML（非 502/404）
- [ ] `curl -sf https://你的域名/learn` 学习地图可加载
- [ ] 浏览器 HTTPS 证书有效（无 mixed content 告警）
- [ ] 安全组仍仅 80/443（8080 未对公网开放）

## 2. API（经 Nginx /api）

```bash
export URL=https://你的域名
curl -sf "$URL/api/v1/plugins" | jq 'length'    # 期望 23
curl -sf "$URL/health"                           # 若 Nginx 未暴露 health，改 curl 127.0.0.1:8080
```

- [ ] 插件数量 = 23
- [ ] language-advisor simulate 返回 `recommended_language=cairo`（zk prompt）

```bash
curl -sf -X POST "$URL/api/v1/labs/edu.hot.language-advisor/simulate" \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"zk cairo","params":{"scenario":"zk cairo","tags":"zk"},"allowed_chain_ids":[11155111]}' \
  | jq '.evaluation.recommended_language // .evaluation' 
```

## 3. 前端功能（浏览器手动）

- [ ] 中英文切换正常
- [ ] 侧边栏 23 插件名称与语言一致
- [ ] **edu.hot.language-advisor**：决策矩阵、获取推荐、跳转链接
- [ ] **edu.hot.zk-modular**：提交批次仿真
- [ ] **edu.trace.food**（或任一 trace Lab）：simulate 有结果
- [ ] 知识面板：学习目标 + Quiz 4 题可提交
- [ ] （可选）沙箱助教抽屉 3 个 MVP Lab 可打开

## 4. 后端进程（SSH 上云机）

```bash
systemctl status labweave-gateway labweave-rule-engine labweave-scheduler labweave-agent-assist
journalctl -u labweave-gateway -n 20 --no-pager
```

- [ ] 四个 unit 均为 active (running)
- [ ] 日志无持续 panic / connection refused

## 5. K8s Job（若 cluster 模式）

- [ ] `JOB_SUBMIT_MODE=cluster` 已写入 `/etc/labweave/labweave.env`
- [ ] Language Advisor 页「提交多语言编译 Job」后 scheduler 有 task
- [ ] `kubectl get jobs -A | grep edu.web3` 可见 Job 且 Completed（或 teaching busybox）

## 6. 性能与限流（可选）

- [ ] 首页加载 < 5s（首次除外）
- [ ] Nginx access log 有正常 200
- [ ] （建议）对 `/api/v1/labs/*/assist` 配置 limit_req

---

**结果**：通过 / 不通过  
**备注**：

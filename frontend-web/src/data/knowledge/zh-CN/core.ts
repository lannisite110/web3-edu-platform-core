import type { KnowledgeMap } from '../types'

const core: KnowledgeMap = {
  'edu.hot.mock': {
    concept:
      '起步 Mock 实验是整条平台链路的最小可运行样例：它不教某个具体业务，而是验证「前端 → 网关 → 规则引擎 evaluate → 调度器 Job → 报告回传」这条端到端通路是否打通。第一次部署平台后，先跑它做冒烟测试。',
    howItWorks: [
      '前端向网关 POST /api/v1/labs/edu.hot.mock/simulate，带上 user_prompt、params 与 allowed_chain_ids。',
      '网关先调用规则引擎对参数做合规 evaluate（拦截主网参数等），通过后才继续。',
      '调度器据 taskType 投递一个最小 Job，运行完写回任务状态与报告。',
      '前端轮询任务状态，completed 后展示 JSON 报告。',
    ],
    params: [
      { name: 'scenario', desc: '占位场景标识，mock 不做实际业务处理，仅用于贯通链路。' },
      { name: 'allowed_chain_ids', desc: '允许的链 ID 白名单，这里用 Sepolia 测试网 (11155111)。' },
    ],
    evalFields: [
      { name: 'compliance_passed', desc: '合规是否通过；mock 场景应恒为 true。' },
      { name: 'mode', desc: '评估模式标识，用于区分 evaluate-only 与完整执行。' },
    ],
    compliance: {
      allowed: ['测试网链路冒烟', '虚构占位参数'],
      forbidden: ['主网参数', '真实资金/合约调用'],
    },
    realWorld:
      '对应真实工程里的「健康检查 / 烟雾测试」——上线后先打一个最小请求确认整条服务链可用，再放真实流量。',
    furtherReading: [
      { label: 'LabWeave 平台总览 (docs/LABWEAVE.md)', url: 'https://github.com/lannisite110/web3-edu-platform-core/blob/main/docs/LABWEAVE.md' },
    ],
  },
}

export default core

import type { KnowledgeMap } from '../types'

const trace: KnowledgeMap = {
  'edu.cn.trace.food': {
    concept:
      '食品批次溯源实验演示如何把一条供应链（采收 → 冷链 → 零售）的每个环节写成不可篡改的链上记录。每个环节生成内容哈希作为叶子节点，所有叶子汇聚成一棵 Merkle 树并得到唯一的根哈希。只要校验根哈希即可证明整条链路未被篡改，而无需逐条比对原始数据。实验运行在 Hyperledger Fabric 教学沙箱（fabric-local / edu-cn-trace-sandbox 通道）上，全部为虚构数据。',
    howItWorks: [
      '前端以 batch_id 与 product_name 向网关 POST /api/v1/labs/edu.cn.trace.food/simulate（taskType=CN_FOOD_TRACE_SIM）。',
      '规则引擎先对参数做合规 evaluate，拦截主网参数后回写 audit_hints（如 batch_id、channel、org）。',
      '教学 Chaincode food_trace.go 维护 BatchRecord 与 MerkleProof 结构，将各环节哈希作为叶子计算 Merkle 根。',
      'UI 以时间线展示采收/冷链/零售三个环节及其叶子哈希，并显示 Merkle 根与证明路径。',
      '调度器投递 Fabric 沙箱 Job（校验 peer 与 chaincode 路径），任务 completed 后回传 JSON 报告。',
    ],
    params: [
      { name: 'batch_id', desc: '食品批次编号，默认 DEMO-BATCH-001，是溯源记录与 Merkle 叶子的索引键。' },
      { name: 'product_name', desc: '产品名称（如「有机蔬菜礼盒」），随 simulate 一并提交用于教学展示。' },
    ],
    evalFields: [
      { name: 'batch_id', desc: '审计提示中回显的批次号，应与提交参数一致以验证链路贯通。' },
      { name: 'channel', desc: 'Fabric 通道，固定为 edu-cn-trace-sandbox 教学沙箱。' },
      { name: 'org', desc: '提交记录的组织节点标识，沙箱中为 OrgEduDemo。' },
    ],
    compliance: {
      allowed: ['全部虚构农场/冷链/门店数据', 'Fabric 沙箱 fabric-local 通道演示'],
      forbidden: ['对接真实监管平台或支付系统', 'target_network=mainnet 主网部署'],
    },
    realWorld:
      '对应真实的食品供应链溯源系统——产地、加工、物流、零售各环节上链存证，消费者扫码即可核验来源与运输链路是否完整可信。',
    furtherReading: [
      { label: 'Hyperledger Fabric 官方文档', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: 'Merkle tree（Wikipedia）', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
    ],
  },
  'edu.cn.trace.medical': {
    concept:
      '医疗防篡改存证实验演示如何用内容哈希为病历提供防篡改证明。链上只存储病历快照的 SHA-256 摘要，校验时把「提交哈希」与「链上哈希」比对：一致说明内容未变，不一致则触发 tamper_detected 告警。多个版本的哈希按时间串成哈希链，可区分合法更新与异常篡改。实验仅演示数据结构，不对接真实 EMR/HIS。',
    howItWorks: [
      '前端以 record_id 与 submitted_hash 提交 simulate（taskType=CN_MEDICAL_TAMPER_DEMO）。',
      '前端本地先比对 submitted_hash 与 storedHash，决定 UI 是否显示「哈希一致」或「哈希不一致」。',
      '规则引擎 evaluate 回写 audit_hints，其中 tamper_detected 标记是否检测到篡改。',
      'UI 展示版本哈希链（v1 → v2 → 当前），每个版本含哈希、动作与时间戳。',
      '修改待校验哈希为任意值即可触发 tamper_detected=true，演示篡改检测告警。',
    ],
    params: [
      { name: 'record_id', desc: '病历记录编号，默认 DEMO-RECORD-001，作为存证与校验的索引键。' },
      { name: 'submitted_hash', desc: '待校验的内容哈希；与链上 stored_hash 不一致即判定为篡改。' },
    ],
    evalFields: [
      { name: 'tamper_detected', desc: '布尔值，提交哈希与链上哈希不一致时为 true，是核心检测结果。' },
      { name: 'record_id', desc: '审计提示中回显的记录号，用于核对校验对象。' },
      { name: 'stored_hash', desc: '链上存证的基准哈希（sha256:demo-medical-hash-abc123），比对的参照值。' },
    ],
    compliance: {
      allowed: ['病历哈希数据结构演示', '等保概念教学参考'],
      forbidden: ['对接真实 EMR/HIS 系统', '宣称等保三级认证'],
    },
    realWorld:
      '对应电子病历（EMR）的防篡改存证场景——医院把病历摘要哈希上链，事后任何一方都能比对哈希证明病历未被偷改，为医疗纠纷与审计提供可信证据。',
    furtherReading: [
      { label: 'Hyperledger Fabric 官方文档', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: 'SHA-2（Wikipedia）', url: 'https://en.wikipedia.org/wiki/SHA-2' },
    ],
  },
  'edu.cn.trace.charity': {
    concept:
      '慈善流水存证实验演示如何让公益募捐做到透明可审计：每笔虚构捐赠生成独立的内容哈希，同一 campaign_id 下的流水聚合为活动账本的 Merkle 根哈希。账本采用类似复式记账的思路逐笔留痕，并区分公开字段（金额、时间、捐赠者代号）与隐私字段（仅哈希上链）。实验不对接微信/支付宝等真实支付渠道，全部为虚构数据。',
    howItWorks: [
      '前端以 campaign_id、entry_count 与 ledger_hash 提交 simulate（taskType=CN_CHARITY_LEDGER_DEMO）。',
      '规则引擎 evaluate 拦截真实支付对接类 prompt，并回写 campaign_id、entry_count、channel 等 audit_hints。',
      '教学 Chaincode charity_ledger.go 为每笔捐赠生成内容哈希，并聚合为账本根哈希。',
      'UI 展示捐赠流水表，并以字段策略表对照公开 / 隐私 / 禁止三类字段的上链方式。',
      '任务 completed 后回传 JSON 报告，账本总额由各笔流水汇总得出。',
    ],
    params: [
      { name: 'campaign_id', desc: '募捐活动编号，默认 DEMO-CAMPAIGN-001，用于聚合该活动下的全部流水。' },
      { name: 'entry_count', desc: '本次提交的捐赠流水条数，参与账本根哈希的计算。' },
      { name: 'ledger_hash', desc: '活动账本的 Merkle 根哈希（ledger-merkle-root-demo-9b2c），代表流水整体的存证。' },
    ],
    evalFields: [
      { name: 'campaign_id', desc: '审计提示中回显的活动号，用于核对账本归属。' },
      { name: 'entry_count', desc: '回显的流水条数，应与提交值一致（如 2）。' },
      { name: 'channel', desc: 'Fabric 通道标识，沙箱中为 edu-cn-trace-sandbox。' },
    ],
    compliance: {
      allowed: ['虚构捐赠者代号，不含真实 PII', '公开/隐私字段策略教学演示'],
      forbidden: ['对接微信/支付宝等官方募捐支付渠道', '上链真实捐赠者手机号等 PII'],
    },
    realWorld:
      '对应公益慈善的透明账本场景——募捐机构把每笔捐赠流水哈希上链并公开汇总，公众可独立核验善款总额与去向，而捐赠者隐私字段仅以哈希形式留痕。',
    furtherReading: [
      { label: 'Hyperledger Fabric 官方文档', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: 'Merkle tree（Wikipedia）', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
    ],
  },
}

export default trace

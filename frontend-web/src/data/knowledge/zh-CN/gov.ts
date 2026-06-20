import type { KnowledgeMap } from '../types'

const gov: KnowledgeMap = {
  'edu.cn.gov.bid-graph': {
    concept:
      '招投标关联图谱把供应商、法定代表人、联系方式等实体建成一张图，用「连通分量」与「共享属性聚类」找出本应相互独立、却暗中关联的投标人。围标串标的典型特征就是多家公司共享同一法人、地址或银行账户，在图上表现为异常稠密的子图。本实验在虚构数据上演示这套算法，并输出教学用的 suspicion_score 与 risk_level。',
    howItWorks: [
      '前端把图谱标识（graph=sample）与场景一起 POST 到 /api/v1/labs/edu.cn.gov.bid-graph/simulate。',
      '规则引擎先做合规 evaluate，确认链 ID 为 fabric-local、参数为虚构数据后才放行。',
      '调度器以 taskType=CN_BID_GRAPH_SIM 投递 Job，在供应商图上计算连通分量与共享法人聚类。',
      '算法据共享属性的数量与强度累加可疑度，得到 suspicion_score、risk_level、nodes、edges 等 audit_hints。',
      '前端用 SVG 渲染关联图（橙色节点=共享法人「张某某」），并在评分条与 findings 列表中展示结论。',
    ],
    params: [
      { name: 'graph', desc: '图谱数据集标识，本实验固定为 sample，对应 fixtures/sample-graph.json 虚构供应商图。' },
      { name: 'scenario', desc: '场景标识（sample），用于区分不同教学算例，mock 阶段不改变业务逻辑。' },
    ],
    evalFields: [
      { name: 'suspicion_score', desc: '教学可疑度评分（0-100），由共享属性聚类强度累加得到，sample 数据约为 75。' },
      { name: 'risk_level', desc: '风险等级（low/medium/high），由 suspicion_score 分档映射，驱动评分条颜色。' },
      { name: 'nodes', desc: '参与分析的供应商节点数量。' },
      { name: 'edges', desc: '节点间关联边的数量，反映图的稠密程度。' },
    ],
    compliance: {
      allowed: ['虚构供应商图谱数据', '教学用关联分析与评分', 'fabric-local 沙箱链路'],
      forbidden: ['对接政府采购网等真实系统', '军队/涉密/作战相关表述', '将教学评分用作真实采购或审计决策'],
    },
    realWorld:
      '对应真实的采购反舞弊与围标串标识别：审计、纪检与采购合规团队会用实体关系图谱（共享法人、地址、IP、对公账户等）发现表面独立、实则关联的投标人，再转入人工核查。',
    furtherReading: [
      { label: '连通分量 (Connected component) — Wikipedia', url: 'https://en.wikipedia.org/wiki/Component_(graph_theory)' },
      { label: 'Neo4j 图数据库与欺诈检测', url: 'https://neo4j.com/use-cases/fraud-detection/' },
    ],
  },
  'edu.cn.gov.multisig': {
    concept:
      '多级多签审批演示一套 M-of-N 权限模型：一笔提案必须收集到至少「阈值」个授权人签名，才能从待审（pending）变为通过（approved），并把 confirm（确认）与 execute（执行）两个动作分离。这正是企业资金拨付、政务审批等场景里「无单人可独断」内控原则的链上表达。本实验在 Sepolia 测试网模板上演示，可逐个勾选签名人观察阈值达成过程。',
    howItWorks: [
      '前端收集 proposal_id、proposal_title、threshold 以及已勾选的 confirmations 地址数组。',
      '点击提交后 POST 到 simulate 接口，规则引擎校验 chainId 为 Sepolia（11155111）等合规约束。',
      '调度器以 taskType=CN_MULTISIG_APPROVAL_DEMO 投递 Job，比较确认数与阈值。',
      '当 confirmations 数量达到 threshold 时输出 approved=true，否则 approved=false 并保持 pending。',
      '前端用进度条与三步状态指示（签名 → 达阈值 → 通过）实时反映 approved 与 confirmations hints。',
    ],
    params: [
      { name: 'proposal_id', desc: '提案唯一标识，默认 PROPOSAL-DEMO-001。' },
      { name: 'proposal_title', desc: '提案标题（如「教学预算拨付提案」），仅用于展示。' },
      { name: 'threshold', desc: 'M-of-N 中的阈值 M，需要的最少签名人数（实验取值 1-3）。' },
      { name: 'confirmations', desc: '已确认签名的授权人地址数组，长度与 threshold 比较决定是否通过。' },
    ],
    evalFields: [
      { name: 'approved', desc: '是否已达阈值通过的布尔标志；confirmations 数 ≥ threshold 时为 true。' },
      { name: 'confirmations', desc: '当前已收集到的确认签名数量。' },
      { name: 'proposal_id', desc: '回显的提案标识，用于核对评估结果对应哪笔提案。' },
      { name: 'threshold', desc: '回显的阈值，便于核对达成条件。' },
    ],
    compliance: {
      allowed: ['虚构提案与授权人地址', 'Sepolia 测试网合约模板', '教学用阈值审批演示'],
      forbidden: ['以太坊等主网部署或真实资金', '对接真实 OA/政务审批系统', '使用真实人员或单位作为签名人'],
    },
    realWorld:
      '对应企业财务与 DAO 国库常用的多签钱包审批流（如 Gnosis Safe）：大额支付需多名授权人共同签名，confirm 与 execute 分离，从机制上杜绝单人挪用，实现职责分离与内控。',
    furtherReading: [
      { label: 'Safe (Gnosis Safe) 多签文档', url: 'https://docs.safe.global/' },
      { label: '职责分离 (Separation of duties) — Wikipedia', url: 'https://en.wikipedia.org/wiki/Separation_of_duties' },
    ],
  },
  'edu.cn.gov.supply': {
    concept:
      '物资供应链存证把每一次出入库（inbound/transfer/outbound）事件写成一条带「前序哈希」的记录，前后串成哈希链，任意一节被篡改都会让后续 prev_hash 校验失败。配合载荷哈希与库存结存曲线，可同时验证「数据未被改动」与「数量勾稽一致」。本实验在 Hyperledger Fabric 沙箱通道上演示正常链与人为断链两种情形。',
    howItWorks: [
      '前端提交 ledger、asset_id 与 simulate_break 标志到 simulate 接口。',
      '规则引擎校验链 ID 为 fabric-local、数据为虚构沙箱数据后放行。',
      '调度器以 taskType=CN_SUPPLY_CHAIN_DEMO 投递 Job，逐条重算事件的前序哈希与载荷哈希。',
      '按 inbound(+)/transfer(0)/outbound(-) 累计库存结存（sample 数据为 100 → 100 → 85，balance=85）。',
      '若 simulate_break=true，则第 3 节 prev_hash 校验失败，输出 chain_intact=false 并在哈希链示意中高亮断点。',
    ],
    params: [
      { name: 'ledger', desc: '账本数据集标识，固定为 sample，对应 fixtures/sample-ledger.json。' },
      { name: 'asset_id', desc: '被追溯的物资编号，默认 MAT-2024-DEMO-001。' },
      { name: 'simulate_break', desc: '是否人为制造哈希链断点的开关；勾选后第 3 节 prev_hash 失配以演示篡改检测。' },
    ],
    evalFields: [
      { name: 'chain_intact', desc: '哈希链是否完整的布尔标志；任意 prev_hash 失配则为 false。' },
      { name: 'balance', desc: '按出入库事件累计得到的当前库存结存（sample 数据为 85）。' },
      { name: 'event_count', desc: '参与校验的出入库事件总数。' },
      { name: 'merkle_root', desc: '全部事件聚合后的默克尔根，用于整体存证比对。' },
    ],
    compliance: {
      allowed: ['虚构出入库账本数据', 'Fabric 沙箱通道 edu-cn-gov-sandbox', '教学用哈希链与篡改检测演示'],
      forbidden: ['对接真实 WMS/ERP 生产系统', '将信创表述用于真实采信结论', '使用真实物资或单位的生产数据'],
    },
    realWorld:
      '对应供应链溯源与资产存证：用区块链/哈希链固化出入库、流转、质检等事件，使审计方能验证记录未被事后篡改，库存勾稽一致，广泛用于药品、食品、危化品与重要物资的可追溯管理。',
    furtherReading: [
      { label: 'Hyperledger Fabric 官方文档', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: '哈希链 (Hash chain) — Wikipedia', url: 'https://en.wikipedia.org/wiki/Hash_chain' },
    ],
  },
}

export default gov

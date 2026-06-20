import type { KnowledgeMap } from '../types'

const sandbox: KnowledgeMap = {
  'edu.global.sandbox.regulatory': {
    concept:
      '监管规则沙箱演示「制裁名单 / 加密资产合规规则」的最小匹配逻辑：把实体名称与本地静态的 OFAC 风格虚构名单做比对，并按 MiCA 风格的演示规则键检查典型问题（如白皮书缺失、引用资产、无牌照托管）。它教的是规则匹配与命中标记，而不是真实的法律或合规结论。全部基于本地 JSON/YAML 固定样例，不调用任何真实监管 API。',
    howItWorks: [
      '前端把 entity_name 与可选的 mica_pattern 提交到 /api/v1/labs/edu.global.sandbox.regulatory/simulate。',
      '规则引擎把实体名称与 fixtures/ofac-sample.json 中的虚构条目逐项比对，得到 ofac_match。',
      '若选择了 mica_pattern，则与 fixtures/mica-rules-sample.yaml 中的演示规则键比对，得到 mica_match。',
      '匹配结果写入 evaluation.audit_hints，前端逐条展示 ofac_match / mica_match 等命中标记。',
    ],
    params: [
      { name: 'entity_name', desc: '待筛查的实体名称字符串，与虚构 OFAC 风格名单 (fixtures/ofac-sample.json) 比对。' },
      { name: 'mica_pattern', desc: '可选的 MiCA 风格演示规则键（whitepaper-missing / asset-referenced / unlicensed-custodian），来自 fixtures/mica-rules-sample.yaml；留空表示不做该项检查。' },
    ],
    evalFields: [
      { name: 'ofac_match', desc: '实体名称是否命中静态制裁名单样例；命中即在课堂演示中标记为需复核。' },
      { name: 'mica_match', desc: '所选 MiCA 演示规则是否触发，用于讲解加密资产合规规则的命中判断。' },
    ],
    compliance: {
      allowed: ['仅用本地静态 JSON/YAML 固定样例', '虚构实体与虚构司法辖区', '课堂规则匹配教学演示'],
      forbidden: ['调用真实 OFAC / KYC 生产 API', '稳定币支付、跨境汇款或 RWA 发行', '当作真实法律或合规意见使用'],
    },
    realWorld:
      '对应金融机构的制裁名单筛查（sanctions screening）与加密资产合规初筛：真实系统会接入 OFAC SDN、欧盟 MiCA 等权威数据源，对客户与交易对手做名称匹配与规则校验，本演示只复刻其匹配骨架。',
    furtherReading: [
      { label: 'OFAC Sanctions Programs (U.S. Treasury)', url: 'https://ofac.treasury.gov/' },
      { label: 'EU MiCA Regulation (ESMA)', url: 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica' },
    ],
  },
  'edu.global.sandbox.election': {
    concept:
      '选举哈希共识演示展示多个虚构计票节点如何各自提交计票结果哈希（tally_hash），以及课堂沙箱如何检查这些哈希是否一致以判定共识。它教的是「用哈希比对来验证多方结果是否相同」这一思想，而不是真实的投票或计票系统。所有节点与哈希均为虚构样例。',
    howItWorks: [
      '前端构造一批节点 { node_id, tally_hash }，默认来自 fixtures/election-nodes-sample.json。',
      '点击「验证共识」时所有节点提交相同哈希；点击「演示不一致」时故意让某个节点提交篡改后的哈希。',
      '请求提交到 simulate 接口，规则引擎比较各节点的 tally_hash 是否全部相等。',
      '结果写入 audit_hints：node_count 记录节点数，consensus 标记是否达成一致。',
      '前端按 consensus 显示「共识达成 / 共识失败」，并逐条列出命中提示。',
    ],
    params: [
      { name: 'nodes', desc: '计票节点列表 { node_id, tally_hash }，可选；缺省使用 fixtures/election-nodes-sample.json。' },
    ],
    evalFields: [
      { name: 'node_count', desc: '参与比对的计票节点数量，用于说明共识的样本规模。' },
      { name: 'consensus', desc: '布尔标记：所有节点的 tally_hash 是否完全一致；一致为达成共识。' },
    ],
    compliance: {
      allowed: ['仅使用虚构城市 / 司法辖区', '虚构节点与哈希样例', '运行于 ns-domain-global / fabric-local 沙箱'],
      forbidden: ['接入真实选举或投票系统', '处理选民 PII（个人身份信息）', '当作真实计票结果对外发布'],
    },
    realWorld:
      '对应选举完整性（election integrity）与多方结果核对：真实场景中多个独立计票方对同一结果计算哈希并公开比对，任一不一致即提示需要人工复核或重新计票，本演示复刻了这种哈希一致性校验。',
    furtherReading: [
      { label: 'Cryptographic Hash Function (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Cryptographic_hash_function' },
      { label: 'CISA — Election Security', url: 'https://www.cisa.gov/topics/election-security' },
    ],
  },
  'edu.global.sandbox.logistics': {
    concept:
      '后勤审计账本演示在一批虚构补给记录上构建「哈希链」：每条记录的哈希都与前一条相关联，任何一行被篡改都会让后续哈希全部对不上，从而暴露改动。它是一个数据结构教学实验（防篡改账本 / hash-linked ledger），不是任何真实或涉密的后勤系统。',
    howItWorks: [
      '前端准备一批 { account, amount, memo } 演示记录作为账本行。',
      '点击「验证哈希链」提交干净账本；点击「插入异常行」会追加一条 DEMO-TAMPER 篡改记录。',
      '规则引擎按顺序对每行计算哈希并与前一行链接，得到链尾哈希。',
      '可选的 expected_tail_hash 用于和重新计算出的链尾哈希比对，判断账本是否被改动。',
      '结果写入 audit_hints：entry_count 记录行数，chain_valid 标记哈希链是否完整有效。',
    ],
    params: [
      { name: 'entries', desc: '账本记录列表 { account, amount, memo }，可选；用于构建哈希链的演示行。' },
      { name: 'expected_tail_hash', desc: '可选的期望链尾哈希，用于校验账本是否被篡改；与重新计算出的链尾比对。' },
    ],
    evalFields: [
      { name: 'entry_count', desc: '参与构建哈希链的账本行数。' },
      { name: 'chain_valid', desc: '布尔标记：哈希链是否完整一致；插入或篡改任意一行都会使其变为 false。' },
    ],
    compliance: {
      allowed: ['仅使用虚构账户代码与备注', '哈希链 / 防篡改账本的数据结构教学', '运行于 ns-domain-global / fabric-local 沙箱'],
      forbidden: ['处理真实国防数据或装备参数', '接入任何涉密或保密系统', '当作真实供应链审计结论使用'],
    },
    realWorld:
      '对应供应链 / 后勤审计中的防篡改账本：真实系统用哈希链或区块链记录物资流转，使任何事后改动都可被检测，从而保证审计轨迹（audit trail）的完整性，本演示复刻了哈希链验证的核心机制。',
    furtherReading: [
      { label: 'Hash Chain (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Hash_chain' },
      { label: 'Merkle Tree (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
    ],
  },
  'edu.global.sandbox.welfare': {
    concept:
      '民生救助防欺诈演示在一批虚构救助申领上构建 Merkle 树并计算 Merkle 根，同时检测是否存在重复的 claim_id（重复申领 / 双花）。它教的是「用 Merkle 根对一批数据做完整性承诺，并据此发现重复条目」的算法思想，全部基于虚构受益人数据。',
    howItWorks: [
      '前端准备一批 { claim_id, amount, region } 申领；可勾选「注入重复项」追加一条相同 claim_id 的记录。',
      '请求带上 claims 与 verify_claim_id 提交到 simulate 接口。',
      '规则引擎对所有申领构建 Merkle 树并计算 merkle_root 作为完整性承诺。',
      '引擎扫描 claim_id 是否出现重复，得到 duplicate_detected 标记。',
      '结果写入 audit_hints，前端显示 Merkle 根与「检测到重复 / 未检测到重复」。',
    ],
    params: [
      { name: 'claims', desc: '救助申领列表 { claim_id, amount, region }，可选；缺省使用 fixtures/welfare-claims-sample.json。' },
      { name: 'verify_claim_id', desc: '可选的待验证申领 ID，用于检查该申领是否属于这棵 Merkle 树（成员证明）。' },
    ],
    evalFields: [
      { name: 'merkle_root', desc: '对整批申领计算出的 Merkle 根，作为数据完整性承诺；任意条目变动都会改变它。' },
      { name: 'duplicate_detected', desc: '布尔标记：是否检测到重复的 claim_id，用于防止重复申领（双花）。' },
    ],
    compliance: {
      allowed: ['仅使用虚构受益人 ID', 'Merkle 根与防重复申领的算法教学', '运行于 fabric-local 沙箱'],
      forbidden: ['接入真实难民 / NGO 数据', '对接联合国或 NGO 的生产 API', '当作真实救助资格或反欺诈裁决'],
    },
    realWorld:
      '对应社会福利 / 援助发放中的反欺诈（welfare fraud detection）：真实系统用唯一标识与去重校验防止同一受益人重复领取，并用 Merkle 根等密码学承诺保证申领集合不可被悄悄篡改，本演示复刻了这两点。',
    furtherReading: [
      { label: 'Merkle Tree & Merkle Proofs (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
      { label: 'Double-spending (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Double-spending' },
    ],
  },
  'edu.global.sandbox.religion': {
    concept:
      '宗教规则沙箱对静态的 Zakat（天课）与 Waqf（瓦合甫）规则表达式做求值：给定规则类型与一个演示金额，按本地固定样例中的规则计算结果（如是否达到起征点、应缴比例等）。它教的是「把信仰相关的财务规则写成可求值的表达式」这一思路，不做真实的宗教资金清算或产品认证。',
    howItWorks: [
      '前端选择 rule_type（zakat 或 waqf）并输入一个 amount 演示金额。',
      '请求提交到 /api/v1/labs/edu.global.sandbox.religion/simulate。',
      '规则引擎从 fixtures/zakat-rules-sample.yaml 读取对应的静态规则表达式。',
      '引擎对该金额求值，把规则键与金额等写入 audit_hints。',
      '前端回显 rule 与 amount 等命中提示，展示规则求值结果。',
    ],
    params: [
      { name: 'rule_type', desc: '规则类型：zakat（天课）或 waqf（瓦合甫），决定使用哪套静态规则表达式。' },
      { name: 'amount', desc: '演示用数值金额（非负，步进 100），作为规则求值的输入。' },
    ],
    evalFields: [
      { name: 'rule', desc: '本次求值所使用的规则键 / 类型标识，用于说明命中了哪套规则。' },
      { name: 'amount', desc: '回显参与求值的演示金额，便于核对输入与结果的对应关系。' },
    ],
    compliance: {
      allowed: ['仅使用 fixtures/zakat-rules-sample.yaml 中的静态 YAML 规则', '信仰相关财务规则的表达式求值教学', '纯教育模拟'],
      forbidden: ['进行真实宗教资金清算 / 结算', 'Halal 产品认证或合规背书', '当作教法（fiqh）裁决或宗教权威意见'],
    },
    realWorld:
      '对应信仰金融（faith-based finance）中的规则引擎：真实场景会把 Zakat 起征点（nisab）、应缴比例与 Waqf 捐赠条款编码为可配置规则，由系统自动计算，本演示复刻了规则表达式求值的最小形态。',
    furtherReading: [
      { label: 'Zakat (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Zakat' },
      { label: 'Waqf (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Waqf' },
    ],
  },
}

export default sandbox

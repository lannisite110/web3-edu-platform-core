import type { ObjectivesQuizMap } from '../types'

const objectivesQuiz: ObjectivesQuizMap = {
  'edu.hot.mock': {
    objectives: [
      '理解 Mock Lab 作为平台端到端链路冒烟测试的定位与用途',
      '掌握前端 → 网关 → 规则引擎 evaluate → 调度器 Job → 报告回传的基本流程',
      '能够识别合规 evaluate 拦截主网参数、仅允许测试网演示的边界',
    ],
    quiz: [
      {
        question: 'Mock Lab 的主要目的是什么？',
        options: [
          '演示 ZK Rollup 批次提交与 L1 锚定',
          '验证「前端 → 网关 → 规则引擎 → 调度器 → 报告」整条平台链路是否打通',
          '推荐最优智能合约语言与工具链',
          '模拟 DAO 提案投票与 quorum 达标',
        ],
        answerIndex: 1,
        explanation:
          'Mock Lab 是平台最小可运行样例，不教具体业务，而是做部署后的冒烟测试，确认端到端通路可用。',
      },
      {
        question: 'Mock Lab 中 allowed_chain_ids 固定为 Sepolia (11155111) 的主要合规意图是？',
        options: [
          '提高交易吞吐量',
          '限制演示仅在测试网进行，禁止主网参数与真实资金操作',
          '启用 Cairo 电路编译',
          '连接真实 OFAC 制裁名单 API',
        ],
        answerIndex: 1,
        explanation:
          'allowed_chain_ids 是链 ID 白名单；Mock 场景只允许测试网链路演示，规则引擎会拦截主网参数。',
      },
    ],
  },

  'edu.hot.language-advisor': {
    objectives: [
      '理解智能合约语言择优如何将业务场景映射到 language-choice-rules.yaml 关键词规则',
      '掌握 recommended_language、toolchain_group 与 suggested_lab 在学习路径串联中的作用',
      '能够根据场景 chip 或自定义 prompt 解读推荐结果并跳转对应专题 Lab',
    ],
    quiz: [
      {
        question: 'Language Advisor 的核心输入参数是什么？',
        options: [
          'batch_size 与 allowed_chain_ids',
          'scenario（场景描述文本）与 tags（场景 id）',
          'owner 与 call_data',
          'entity_name 与 mica_pattern',
        ],
        answerIndex: 1,
        explanation:
          '用户选择场景 chip 或输入自定义 prompt 作为 scenario，tags 携带场景 id（如 zk / solana），二者驱动关键词规则匹配。',
      },
      {
        question: 'evaluation 中的 suggested_lab 字段用途是？',
        options: [
          '记录 L1 锚定区块高度',
          '标识建议下一步进入的专题 Lab plugin id，用于路径串联',
          '存储 Merkle 根哈希',
          '标记套利机器人是否 forbidden',
        ],
        answerIndex: 1,
        explanation:
          'suggested_lab 将语言推荐与后续热点实验关联，UI 可显示「打开专题 Lab」按钮实现学习路径跳转。',
      },
    ],
  },

  'edu.hot.zk-modular': {
    objectives: [
      '理解 ZK 模块化 Rollup 的四步流水线：collect → prove → submit → anchor',
      '掌握 batch_size 如何影响 mock_batch_root 与 tx_count 等演示指标',
      '能够区分教学 mock verifier 与生产级证明系统的边界',
    ],
    quiz: [
      {
        question: 'ZK Modular Rollup Lab 的四步流水线正确顺序是？',
        options: [
          'Build → Sign → Bundle → Validate → Execute',
          'collect → prove → submit → anchor',
          'draft → vote → tally → record',
          'inbound → transfer → outbound',
        ],
        answerIndex: 1,
        explanation:
          '本 Lab 演示 L2 流水线：交易批次收集、Mock 证明生成、批次提交、L1 锚定，对应 collect/prove/submit/anchor。',
      },
      {
        question: 'audit_hints 中 verifier 字段标注 mock-sepolia 的含义是？',
        options: [
          '已接入主网真实 Prover 集群',
          '强调使用教学级 mock 验证器，非生产证明系统',
          '表示 OFAC 名单命中',
          '表示会话密钥已过期',
        ],
        answerIndex: 1,
        explanation:
          'verifier 标识使用的验证器；mock-sepolia 表明这是教学占位，帮助学习者理解流程而不运行真实 ZK 证明。',
      },
    ],
  },

  'edu.hot.zk-circuit': {
    objectives: [
      '理解 ZK 电路编译环节：Cairo 电路经 scarb 编译为 Sierra/中间表示',
      '掌握 circuit_name 作为编译目标标识与 HOT_ZK_CIRCUIT_COMPILE 任务类型的关系',
      '能够说明「电路即程序、编译产物即可证明对象」的核心概念',
    ],
    quiz: [
      {
        question: 'ZK Circuit Lab 推荐的合约语言是？',
        options: ['Solidity', 'Rust', 'Cairo', 'Move'],
        answerIndex: 2,
        explanation:
          'ZK 电路场景应推荐 cairo；开发者用 Cairo 写电路，scarb 编译为 Sierra，再由 prover 生成 STARK 证明。',
      },
      {
        question: '本 Lab 的 taskType 是？',
        options: [
          'HOT_ZK_ROLLUP_SIM',
          'HOT_ZK_CIRCUIT_COMPILE',
          'HOT_AA_WALLET_SIM',
          'CN_FOOD_TRACE_SIM',
        ],
        answerIndex: 1,
        explanation:
          '前端以 circuit_name 调用 simulate，taskType 为 HOT_ZK_CIRCUIT_COMPILE，聚焦电路编译而非 Rollup 批次仿真。',
      },
    ],
  },

  'edu.hot.aa-wallet': {
    objectives: [
      '理解 ERC-4337 风格 UserOperation 五步流程：Build → Sign → Bundle → Validate → Execute',
      '掌握 owner、call_data 与 aa_flow_step 参数如何驱动流程模拟',
      '能够解释 EntryPoint 合约与 Bundler 在智能合约钱包中的角色',
    ],
    quiz: [
      {
        question: 'AA Wallet Lab 中 EntryPoint 合约的作用是？',
        options: [
          '存储食品批次 Merkle 根',
          'ERC-4337 的统一入口，校验 UserOperation',
          '执行 OFAC 制裁名单匹配',
          '计算 Zakat 应缴比例',
        ],
        answerIndex: 1,
        explanation:
          'EntryPoint 是 4337 架构的核心合约，负责校验 UserOp；本 Lab 以 mock EntryPoint 演示整条 AA 流程。',
      },
      {
        question: 'aa_flow_completed 字段的用途是？',
        options: [
          '记录已完成步骤的列表，驱动流程图高亮',
          '标记哈希链是否完整',
          '存储 Builder 最高出价',
          '标识 disclosure_level 级别',
        ],
        answerIndex: 0,
        explanation:
          '规则引擎产出 aa_flow_completed 为逗号分隔的已完成步骤，前端据此高亮 Build/Sign/Bundle/Validate/Execute 进度。',
      },
    ],
  },

  'edu.hot.aa-session': {
    objectives: [
      '理解会话密钥作为 AA 钱包之上「受限权限临时密钥」的设计思路',
      '掌握 session_ttl_hours 如何定义权限的时间边界',
      '能够对比 Owner 全权限与会话密钥在 callData 范围与过期拒绝上的差异',
    ],
    quiz: [
      {
        question: '会话密钥（Session Key）的主要优势是？',
        options: [
          '无限期全权委托主钱包资产',
          '在限定时间和动作范围内代签，无需每次唤起主钱包',
          '绕过 EntryPoint 直接上链',
          '替代 Merkle 树做批次校验',
        ],
        answerIndex: 1,
        explanation:
          '会话密钥带 TTL 与权限范围，链游/DeFi 自动化常用此手段提升体验，同时限制风险面；过期后应拒绝 execute。',
      },
      {
        question: '本 Lab 推荐的实现模板是？',
        options: [
          'MevPbsAuction.sol',
          'SessionKeyDemo.sol',
          'DepinNode.rs',
          'food_trace.go',
        ],
        answerIndex: 1,
        explanation:
          'taskType 为 HOT_AA_SESSION_KEY_DEMO，推荐 SessionKeyDemo.sol 模板，语言为 solidity，演示 TTL 概念。',
      },
    ],
  },

  'edu.hot.dao': {
    objectives: [
      '理解 DAO 治理中提案、投票计数与 quorum（法定人数）的关系',
      '掌握 yes_votes、no_votes 与 turnout_pct 如何影响 proposal_status',
      '能够解读 draft → vote → tally → record 四步治理流程',
    ],
    quiz: [
      {
        question: 'quorum 在 DAO 投票实验中的含义是？',
        options: [
          '单笔 Builder 最高出价',
          '法定人数门槛，决定提案是否有效成立',
          'Merkle 树的叶子节点数',
          '会话密钥的有效期小时数',
        ],
        answerIndex: 1,
        explanation:
          'quorum 是治理中的法定人数；yesVotes/noVotes 累计后需结合 quorum 与 turnout 决定提案 passed/rejected/active。',
      },
      {
        question: '本平台 DAO Lab 的合规边界是？',
        options: [
          '可连接主网真实治理代币操控协议',
          '仅在教学层模拟计票，不连接真实治理代币',
          '可对接真实 OA 审批系统',
          '可发行证券型 RWA 代币',
        ],
        answerIndex: 1,
        explanation:
          'DAO 实验用虚构提案与投票人做 testnet 治理教学，禁止主网真实治理与代币募资。',
      },
    ],
  },

  'edu.hot.mev': {
    objectives: [
      '理解 Proposer-Builder Separation（PBS）中 Builder 竞价与 Proposer 选块的机制',
      '掌握 winning_builder 与 winning_bid_gwei 如何反映 PBS 拍卖结果',
      '能够区分 PBS 算法教学与被禁止的抢跑/三明治套利机器人',
    ],
    quiz: [
      {
        question: 'PBS 实验中 Proposer 如何选择胜出 Builder？',
        options: [
          '随机抽签',
          '选择出价（bid）最高的 Builder',
          '选择注册最早的节点',
          '由 OFAC 名单决定',
        ],
        answerIndex: 1,
        explanation:
          'PBS 机制中 Builders 竞争性地为区块 slot 出价，Proposer 选择最高 bid 的区块打包，对应 selectWinningBuilder。',
      },
      {
        question: 'audit_hints 中 arbitrage_bot=forbidden 体现什么合规边界？',
        options: [
          '禁止在生产环境使用 Flashbots Relay',
          '禁止主网 MEV 套利机器人及 mempool 抢跑/三明治操控',
          '禁止在测试网演示 PBS',
          '禁止 Builder 参与竞价',
        ],
        answerIndex: 1,
        explanation:
          '本 Lab 教 PBS 拍卖算法叙事，明确区分于被禁止的抢跑/三明治套利；arbitrage_bot 标记为 forbidden。',
      },
    ],
  },

  'edu.hot.did': {
    objectives: [
      '理解 DID 选择性披露与可验证凭证（VC）的最小披露原则',
      '掌握 disclosure_level（email/minimal/none）对 proof_valid 的影响',
      '能够解释 revealed_field 与 withheld_hash 的区别',
    ],
    quiz: [
      {
        question: '当 disclosure_level=none 时，proof_valid 应为？',
        options: ['true', 'false', '取决于 batch_size', '取决于 quorum'],
        answerIndex: 1,
        explanation:
          '不披露任何 claim 时无法形成有效披露证明，规则引擎应返回 proof_valid=false；仅按需 reveal 必要字段。',
      },
      {
        question: 'withheld_hash 字段的作用是？',
        options: [
          '公开披露全部 PII 明文',
          '对被隐藏字段存 hash，证明持有而不泄露原文',
          '存储 L1 锚定区块号',
          '记录 Builder 出价排序',
        ],
        answerIndex: 1,
        explanation:
          '选择性披露中，允许公开的字段以 revealed_field 明文展示，其余以 withheld_hash 形式 withheld，体现最小披露。',
      },
    ],
  },

  'edu.hot.depin': {
    objectives: [
      '理解 DePIN 项目如何用链上注册表协调物理基础设施节点',
      '掌握 node_count 参数与 Solana Anchor 方向节点注册叙事的关系',
      '能够说明本 Lab 仅做虚构注册仿真、不涉及真实激励/代币经济',
    ],
    quiz: [
      {
        question: 'DePIN Node Lab 推荐的合约语言是？',
        options: ['Solidity', 'Cairo', 'Rust', 'Move'],
        answerIndex: 2,
        explanation:
          'Solana/DePIN 场景推荐 rust，模板为 DepinNode.rs，可选 anchor 工具链 gate 验证沙箱环境。',
      },
      {
        question: '本 Lab 的合规禁止项包括？',
        options: [
          '测试网节点注册仿真',
          '真实 DePIN 激励/代币经济与主网设备挖矿',
          '虚构 node_count 演示',
          'rustc/anchor 版本检查',
        ],
        answerIndex: 1,
        explanation:
          '允许测试网虚构 node_count 仿真与工具链 gate；禁止真实 DePIN 激励、代币经济及主网设备挖矿。',
      },
    ],
  },

  'edu.hot.rwa-edu': {
    objectives: [
      '理解 RWA 链上映射的基本概念：链下资产与链上记录的对应关系',
      '掌握 asset_id 作为虚构资产标识在映射演示中的作用',
      '能够划清教学映射演示与真实资产发行/证券型代币的边界',
    ],
    quiz: [
      {
        question: 'RWA Edu Lab 使用的 asset_id 性质是？',
        options: [
          '真实上市公司股票编号',
          '虚构资产标识符，作为链上映射占位键',
          'OFAC SDN 名单实体 ID',
          '真实选民身份证号',
        ],
        answerIndex: 1,
        explanation:
          '用户填写如 DEMO-RWA-001 的虚构 asset_id，演示映射概念模型，不涉及真实资产发行或募资。',
      },
      {
        question: '真实世界中与本实验概念相近的合规框架是？',
        options: [
          'ERC-3643 (T-REX) 等合规 RWA 代币化',
          'MEV-Boost Relay',
          'Hyperledger Fabric 食品溯源',
          '选举 tally_hash 共识',
        ],
        answerIndex: 0,
        explanation:
          'ERC-3643、Centrifuge、Ondo 等将链下资产经合规校验映射为受限 token；本实验仅演示映射思路。',
      },
    ],
  },

  'edu.hot.ai-agent': {
    objectives: [
      '理解链上 AI Agent 权限边界概念及 max_actions 护栏设计',
      '掌握 max_actions 如何限制 Agent 可执行的链上操作次数',
      '能够区分教学沙箱叙事与自主交易/抢跑 Agent 的合规边界',
    ],
    quiz: [
      {
        question: 'AI Agent Sandbox Lab 中 max_actions 的含义是？',
        options: [
          'Rollup 批次中的交易数',
          'Agent 允许执行的最大动作次数，作为权限护栏核心约束',
          '多签阈值 M',
          '慈善流水 entry_count',
        ],
        answerIndex: 1,
        explanation:
          'max_actions 限制自动化 Agent 在链上的操作上限，配合白名单、花费限额等约束防止失控操作。',
      },
      {
        question: '本 Lab 明确禁止的是？',
        options: [
          '虚构 Agent 策略与权限模型教学',
          '自主交易/抢跑 Agent 及真实 LLM 密钥上链',
          'Sepolia 测试网模板演示',
          'AgentSandbox.sol 模板使用',
        ],
        answerIndex: 1,
        explanation:
          '允许权限模型沙箱教学；禁止接入主网 RPC、部署自主交易/抢跑 Agent 或将真实 LLM 密钥上链。',
      },
    ],
  },

  'edu.cn.trace.food': {
    objectives: [
      '理解食品供应链各环节（采收→冷链→零售）上链存证与 Merkle 树聚合原理',
      '掌握 batch_id 作为溯源索引键与 Merkle 叶子节点的关系',
      '能够说明校验 Merkle 根即可证明整条链路未被篡改',
    ],
    quiz: [
      {
        question: '食品溯源 Lab 运行在哪个 Fabric 通道？',
        options: [
          'mainnet',
          'edu-cn-trace-sandbox',
          'Sepolia L1',
          'ns-domain-global 仅内存',
        ],
        answerIndex: 1,
        explanation:
          '实验在 Hyperledger Fabric 教学沙箱 fabric-local / edu-cn-trace-sandbox 通道上运行，全部为虚构数据。',
      },
      {
        question: 'Merkle 根哈希在食品溯源中的作用是？',
        options: [
          '替代 SHA-256 做加密签名',
          '将所有环节叶子哈希聚合为唯一根，校验根即可证明链路未被篡改',
          '记录 Builder 最高出价',
          '存储 Zakat 起征点',
        ],
        answerIndex: 1,
        explanation:
          '各环节生成内容哈希作为叶子，汇聚成 Merkle 树；校验根哈希可证明整条供应链记录完整可信。',
      },
    ],
  },

  'edu.cn.trace.medical': {
    objectives: [
      '理解医疗防篡改存证：链上仅存 SHA-256 摘要、比对 submitted_hash 与 stored_hash',
      '掌握 tamper_detected 作为核心篡改检测标志的含义',
      '能够区分合法版本更新哈希链与异常篡改告警',
    ],
    quiz: [
      {
        question: '何时 tamper_detected 为 true？',
        options: [
          'submitted_hash 与链上 stored_hash 一致',
          'submitted_hash 与链上 stored_hash 不一致',
          'entry_count 大于 10',
          'consensus 为 false',
        ],
        answerIndex: 1,
        explanation:
          '前端提交 submitted_hash 与链上基准哈希比对；不一致则判定篡改，audit_hints 中 tamper_detected=true。',
      },
      {
        question: '本 Lab 的合规边界是？',
        options: [
          '可对接真实 EMR/HIS 并宣称等保三级认证',
          '仅演示病历哈希数据结构，不对接真实 EMR/HIS',
          '可上链真实患者 PII',
          '可连接微信支付渠道',
        ],
        answerIndex: 1,
        explanation:
          '允许病历哈希结构与等保概念教学；禁止对接真实 EMR/HIS、宣称等保认证或处理真实公民健康数据。',
      },
    ],
  },

  'edu.cn.trace.charity': {
    objectives: [
      '理解慈善流水存证：每笔捐赠哈希聚合为 campaign 账本 Merkle 根',
      '掌握公开字段（金额、时间、捐赠者代号）与隐私字段（仅哈希上链）的区分',
      '能够说明本实验不对接微信/支付宝等真实支付渠道',
    ],
    quiz: [
      {
        question: '慈善流水 Lab 中 ledger_hash 代表什么？',
        options: [
          '单笔捐赠的私钥',
          '活动账本的 Merkle 根哈希，代表流水整体的存证',
          'Builder 区块 slot 索引',
          '会话密钥 TTL',
        ],
        answerIndex: 1,
        explanation:
          '同一 campaign_id 下多笔捐赠各自产生内容哈希，聚合为 ledger_hash（Merkle 根），公众可核验善款总额。',
      },
      {
        question: '本 Lab 禁止的上链内容是？',
        options: [
          '虚构捐赠者代号',
          '真实捐赠者手机号等 PII',
          '公开金额与时间字段',
          'campaign_id 活动编号',
        ],
        answerIndex: 1,
        explanation:
          '允许虚构代号与公开/隐私字段策略教学；禁止对接官方募捐支付渠道及上链真实捐赠者 PII。',
      },
    ],
  },

  'edu.cn.gov.bid-graph': {
    objectives: [
      '理解招投标关联图谱如何用连通分量与共享属性聚类识别围标串标',
      '掌握 suspicion_score 与 risk_level 作为教学可疑度输出的含义',
      '能够识别共享法人、地址等异常稠密子图为串标典型特征',
    ],
    quiz: [
      {
        question: '围标串标在关联图谱上的典型特征是？',
        options: [
          '节点完全孤立无连边',
          '多家公司共享同一法人、地址或账户，形成异常稠密子图',
          '所有节点 suspicion_score 为 0',
          'Merkle 根频繁变化',
        ],
        answerIndex: 1,
        explanation:
          '本应独立的投标人若共享法人、联系方式等属性，在图上表现为稠密聚类，算法据此累加 suspicion_score。',
      },
      {
        question: 'sample 数据集上 suspicion_score 约为多少？',
        options: ['0', '25', '75', '100（固定）'],
        answerIndex: 2,
        explanation:
          '教学算例 fixtures/sample-graph.json 中共享属性聚类强度累加，suspicion_score 约为 75，映射 risk_level。',
      },
    ],
  },

  'edu.cn.gov.multisig': {
    objectives: [
      '理解 M-of-N 多签模型：至少 threshold 个授权人签名方可批准提案',
      '掌握 confirmations 数量与 threshold 比较决定 approved 状态的逻辑',
      '能够说明 confirm 与 execute 分离体现「无单人可独断」内控原则',
    ],
    quiz: [
      {
        question: '提案何时 approved=true？',
        options: [
          'confirmations 数量 < threshold',
          'confirmations 数量 ≥ threshold',
          '任意一人签名即可',
          'quorum 未达标但 yes 票多',
        ],
        answerIndex: 1,
        explanation:
          '调度器比较已收集的 confirmations 与 threshold；达到 M-of-N 阈值时输出 approved=true，否则保持 pending。',
      },
      {
        question: '本 Lab 运行的网络环境是？',
        options: [
          '以太坊主网真实资金',
          'Sepolia 测试网 (11155111) 合约模板',
          'Fabric edu-cn-trace-sandbox',
          'Bitcoin 主网',
        ],
        answerIndex: 1,
        explanation:
          '多级多签审批在 Sepolia 测试网模板上演示，使用虚构提案与授权人地址，禁止主网部署与真实资金。',
      },
    ],
  },

  'edu.cn.gov.supply': {
    objectives: [
      '理解物资出入库事件通过 prev_hash 串成哈希链的防篡改原理',
      '掌握 simulate_break 如何演示第 3 节 prev_hash 失配与 chain_intact=false',
      '能够结合 inbound/transfer/outbound 累计库存结存（sample 数据 balance=85）',
    ],
    quiz: [
      {
        question: 'simulate_break=true 时会发生什么？',
        options: [
          'Merkle 根保持不变',
          '第 3 节 prev_hash 校验失败，chain_intact=false',
          '自动对接真实 WMS 系统',
          'consensus 强制为 true',
        ],
        answerIndex: 1,
        explanation:
          '勾选 simulate_break 人为制造哈希链断点，第 3 节 prev_hash 失配，输出 chain_intact=false 并高亮断点。',
      },
      {
        question: 'sample ledger 数据累计后的库存结存 balance 是？',
        options: ['100', '85', '0', '200'],
        answerIndex: 1,
        explanation:
          '按 inbound(+)/transfer(0)/outbound(-) 累计：100 → 100 → 85，最终 balance=85，同时验证数量勾稽一致。',
      },
    ],
  },

  'edu.global.sandbox.regulatory': {
    objectives: [
      '理解制裁名单筛查：实体名称与本地 OFAC 风格虚构名单比对得 ofac_match',
      '掌握 MiCA 风格演示规则键（whitepaper-missing 等）的 mica_match 命中逻辑',
      '能够说明本沙箱仅做规则匹配教学、不调用真实监管 API',
    ],
    quiz: [
      {
        question: 'ofac_match 如何产生？',
        options: [
          '调用美国财政部实时 OFAC API',
          '将 entity_name 与 fixtures/ofac-sample.json 静态名单逐项比对',
          '根据 batch_size 计算',
          '由 Builder 竞价最高者决定',
        ],
        answerIndex: 1,
        explanation:
          '规则引擎把 entity_name 与本地虚构 OFAC 风格名单匹配，命中则 ofac_match 标记需复核，无真实 API 调用。',
      },
      {
        question: 'mica_pattern 可选的演示规则键不包括？',
        options: [
          'whitepaper-missing',
          'asset-referenced',
          'unlicensed-custodian',
          'mainnet-fund-bridge',
        ],
        answerIndex: 3,
        explanation:
          'MiCA 演示规则来自 fixtures/mica-rules-sample.yaml，包括白皮书缺失、引用资产、无牌照托管等；不含主网桥接规则。',
      },
    ],
  },

  'edu.global.sandbox.election': {
    objectives: [
      '理解多方计票节点提交 tally_hash 并通过哈希一致性判定 consensus',
      '掌握「演示不一致」时某节点篡改哈希导致 consensus=false 的机制',
      '能够说明本实验教哈希比对思想、非真实投票系统',
    ],
    quiz: [
      {
        question: 'consensus=true 的条件是？',
        options: [
          '至少一个节点提交哈希',
          '所有节点的 tally_hash 完全一致',
          'node_count 为奇数',
          'ofac_match 为 false',
        ],
        answerIndex: 1,
        explanation:
          '规则引擎比较各节点 tally_hash 是否全部相等；一致则 consensus 标记为达成共识，否则共识失败。',
      },
      {
        question: '本 Lab 明确禁止的是？',
        options: [
          '虚构节点与哈希样例',
          '接入真实选举系统或处理选民 PII',
          '在 fabric-local 沙箱运行',
          '点击「验证共识」按钮',
        ],
        answerIndex: 1,
        explanation:
          '允许虚构司法辖区与节点；禁止接入真实选举/投票系统、处理选民 PII 或将输出当作真实计票结果发布。',
      },
    ],
  },

  'edu.global.sandbox.logistics': {
    objectives: [
      '理解哈希链账本：每行哈希与前一行链接，篡改任意行会破坏后续校验',
      '掌握 chain_valid 与 expected_tail_hash 比对判断账本完整性的方法',
      '能够区分数据结构教学与真实涉密后勤系统的边界',
    ],
    quiz: [
      {
        question: '插入 DEMO-TAMPER 异常行后 chain_valid 应为？',
        options: ['true', 'false', '取决于 entry_count', '取决于 rule_type'],
        answerIndex: 1,
        explanation:
          '「插入异常行」追加篡改记录，破坏哈希链顺序链接，规则引擎重新计算后 chain_valid 变为 false。',
      },
      {
        question: '后勤审计账本每条记录包含哪些字段？',
        options: [
          'batch_id 与 product_name',
          'account、amount、memo',
          'owner 与 call_data',
          'did_method 与 requested_claim',
        ],
        answerIndex: 1,
        explanation:
          'entries 为 { account, amount, memo } 演示行，按顺序构建哈希链；可选 expected_tail_hash 校验是否被改动。',
      },
    ],
  },

  'edu.global.sandbox.welfare': {
    objectives: [
      '理解 Merkle 根作为一批救助申领的完整性承诺',
      '掌握 duplicate_detected 如何检测重复 claim_id（双花/重复申领）',
      '能够说明注入重复项演示防欺诈算法的机制',
    ],
    quiz: [
      {
        question: 'duplicate_detected=true 表示什么？',
        options: [
          'Merkle 树构建失败',
          '检测到重复的 claim_id，存在重复申领风险',
          '所有申领金额为零',
          'OFAC 名单命中',
        ],
        answerIndex: 1,
        explanation:
          '引擎扫描 claim_id 是否重复；勾选「注入重复项」会追加相同 claim_id，触发 duplicate_detected 标记。',
      },
      {
        question: 'merkle_root 变化意味着？',
        options: [
          '仅 UI 主题切换',
          '任意申领条目变动都会改变 Merkle 根，体现完整性承诺',
          '共识自动达成',
          'threshold 自动降低',
        ],
        answerIndex: 1,
        explanation:
          'merkle_root 对整批 { claim_id, amount, region } 计算；任何条目增删改都会改变根哈希，防止悄悄篡改。',
      },
    ],
  },

  'edu.global.sandbox.religion': {
    objectives: [
      '理解 Zakat（天课）与 Waqf（瓦合甫）规则表达式的静态求值流程',
      '掌握 rule_type 与 amount 作为规则引擎输入参数的含义',
      '能够说明本沙箱仅做表达式教学、非真实宗教资金清算或 fiqh 裁决',
    ],
    quiz: [
      {
        question: 'rule_type 可选值是？',
        options: [
          'solidity / cairo',
          'zakat / waqf',
          'email / minimal / none',
          'inbound / outbound',
        ],
        answerIndex: 1,
        explanation:
          '前端选择 zakat（天课）或 waqf（瓦合甫），引擎从 fixtures/zakat-rules-sample.yaml 读取对应静态规则表达式。',
      },
      {
        question: '本 Lab 明确禁止的用途是？',
        options: [
          '静态 YAML 规则表达式求值教学',
          '真实宗教资金清算、Halal 产品认证或当作 fiqh 裁决',
          '输入演示 amount 数值',
          '在 audit_hints 回显 rule 与 amount',
        ],
        answerIndex: 1,
        explanation:
          '允许信仰相关财务规则的表达式求值演示；禁止真实清算结算、产品认证背书或充当宗教权威意见。',
      },
    ],
  },
}

export default objectivesQuiz

import type { KnowledgeMap } from '../types'

const hot: KnowledgeMap = {
  'edu.hot.language-advisor': {
    concept:
      '智能合约语言择优是整条热点学习路径的总入口 Lab。Web3 项目在技术选型阶段面临「同一场景、多种栈」的决策：EVM（Solidity/Vyper/Huff）生态与审计工具最成熟；Solana（Rust/Anchor）追求高 TPS 与 DePIN；Move（Aptos/Sui）以资源模型防重放；Cairo 服务 ZK-Rollup；Clarity/Cadence/TEAL 覆盖 BTC L2、链游与合规支付。本 Lab 不写业务合约，而是把用户的自然语言描述映射到 `language-choice-rules.yaml` 的 9 条关键词规则，输出 recommended_language、toolchain_group、隔离 Namespace、入门模板与 suggested_lab，并可选触发 HOT_MULTI_LANG_COMPILE 在对应 ns-* 中做工具链 gate 仿真。核心教学价值是：先按约束选对语言与栈，再进入 11 个专题实验深化。',
    howItWorks: [
      '页面展示 7 语言组隔离模型（独立镜像 + K8s Namespace + NetworkPolicy）与 9 场景决策矩阵，与 rules 文件一一对应。',
      '用户点击 chip 或矩阵行预选场景，可编辑 prompt（中英文关键词）；params 携带 scenario 与 tags（场景 id）。',
      'rule-engine 将 prompt + scenario + tags 拼接为小写文本，按 rules 数组顺序扫描 keywords，首个命中即选定 language / toolchain_group / tools / reason。',
      '未命中任何规则时回退 default：Solidity + EVM + solc/foundry。',
      'evaluation 返回 recommended_template（9 份教学模板路径）、suggested_lab（11 个热点 Lab 之一）、audit_hints（namespace、image、tools、match_reason 等）。',
      'UI 展示推荐卡片、命中规则 id、audit_hints 明细；可跳转 suggested_lab 或提交 HOT_MULTI_LANG_COMPILE Job。',
      'compliance 层拒绝 target_network=mainnet；allowed_chain_ids 固定 Sepolia (11155111) 测试网白名单。',
    ],
    params: [
      { name: 'scenario', desc: '业务场景描述文本（chip 预设或自定义），关键词匹配的主输入，如「zk cairo rollup」。' },
      { name: 'tags', desc: '当前场景 chip id（defi / zk / solana …），与 scenario 一并参与规则匹配。' },
      { name: 'language', desc: '编译 Job 阶段：从推荐结果带入的目标语言（solidity / cairo / rust / move 等）。' },
      { name: 'template', desc: '编译 Job 可选：recommended_template 路径，如 GenericDeFi.sol / ZkRollup.cairo。' },
      { name: 'toolchain_group', desc: '编译 Job 可选：evm / solana / move / zk 等，决定调度镜像与 Namespace。' },
      { name: 'task_type', desc: 'HOT_MULTI_LANG_COMPILE 触发多语言编译仿真；默认 simulate 为语言推荐。' },
      { name: 'allowed_chain_ids', desc: '链 ID 白名单，固定 [11155111]（Sepolia 测试网）。' },
    ],
    evalFields: [
      { name: 'recommended_language', desc: '规则推荐的合约语言：solidity / vyper / huff / rust / move / cairo / clarity / cadence / teal。' },
      { name: 'toolchain_group', desc: '7 组之一：evm / solana / move / zk / btc / flow / algorand，决定 ns-* 与 Job 镜像。' },
      { name: 'recommended_template', desc: 'plugins/language-advisor/templates/ 下对应语言的入门模板相对路径。' },
      { name: 'tools', desc: '该场景推荐的原生工具链，如 solc+foundry、cairo+starknet-foundry、anchor 等。' },
      { name: 'suggested_lab', desc: '建议下一步 plugin id，如 edu.hot.zk-modular / edu.hot.depin，用于学习路径串联。' },
      { name: 'namespace', desc: 'audit_hints 中的 K8s Namespace，如 ns-evm / ns-hot-zk，体现语言组隔离。' },
      { name: 'image', desc: 'audit_hints 中的 Job 镜像 tag，如 edu/toolchain-zk:0.1.0。' },
      { name: 'match_reason', desc: '命中规则的中文/英文选型理由，来自 rules[].reason。' },
      { name: 'compliance_passed', desc: '合规通过后才展示推荐卡片；mainnet 等场景会被拒绝。' },
    ],
    compliance: {
      allowed: [
        '测试网部署与语言/工具链教学推荐',
        '9 场景 × 7 语言组决策演示',
        'HOT_MULTI_LANG_COMPILE 编译 Job 仿真',
        'suggested_lab 路径跳转与 audit_hints 审计',
      ],
      forbidden: [
        '主网 (mainnet) 部署或 target_network=mainnet',
        '真实交易策略或生产级 Rollup 上线',
        '跨 Namespace 混用编译器或运行时 curl 安装二进制',
      ],
    },
    realWorld:
      '对应架构评审与技术选型文档：团队按 TPS、安全模型、生态、审计成本在 Solidity / Rust / Move / Cairo 间选型；DevOps 为每种语言维护独立 CI 镜像与 Namespace（与本平台 build-images/ + ns-* 模型一致）；产品再进入具体 DApp / Rollup / DePIN 实现。Language Advisor 把这一决策过程规则化、可教学化。',
    furtherReading: [
      { label: 'Ethereum 智能合约语言对比', url: 'https://ethereum.org/en/developers/docs/smart-contracts/languages/' },
      { label: 'Foundry Book（EVM 工具链）', url: 'https://book.getfoundry.sh/' },
      { label: 'Anchor 文档（Solana）', url: 'https://www.anchor-lang.com/docs' },
      { label: 'Move Book（Aptos / Sui）', url: 'https://move-language.github.io/move/' },
      { label: 'Cairo / Starknet 文档', url: 'https://docs.starknet.io/' },
      { label: '子库 multi-language-toolchains.md', url: 'https://github.com/lannisite110/web3-hot-topic-labs/blob/main/docs/multi-language-toolchains.md' },
    ],
  },

  'edu.hot.zk-modular': {
    concept:
      'ZK 模块化 Rollup 实验演示一条 L2 流水线：交易批次收集 → Mock 证明生成 → 批次提交 → L1 锚定。它用教学级 mock verifier 替代真实证明系统，让学习者直观看到 batch root 与 tx_count 如何随批次大小变化，理解模块化 Rollup（执行/结算/数据可用性分层）的基本叙事，而不涉及任何真实资金桥接。',
    howItWorks: [
      '用户设置批次大小 batch_size（1–64），点击提交批次仿真。',
      '前端以 batch_size 调用 simulate，taskType 为 HOT_ZK_ROLLUP_SIM，规则引擎产出 audit_hints。',
      '从 hints 读取 mock_batch_root、tx_count、verifier、l1_anchor，前端据此渲染批次列表与 finalized/proving 状态。',
      '四步流水线（collect → prove → submit → anchor）根据任务状态高亮当前步骤。',
    ],
    params: [
      { name: 'batch_size', desc: '单个 Rollup 批次打包的交易数量（1–64），影响演示批次数与每批 tx 数。' },
      { name: 'allowed_chain_ids', desc: '允许的链 ID 白名单，Sepolia 测试网 (11155111)。' },
    ],
    evalFields: [
      { name: 'mock_batch_root', desc: '教学用批次 Merkle root 占位值，对应最后一个批次。' },
      { name: 'tx_count', desc: '本次仿真的总交易数，用于推算每批 tx 数。' },
      { name: 'verifier', desc: '使用的验证器标识（如 mock-sepolia），强调是教学 mock 而非生产证明。' },
      { name: 'l1_anchor', desc: 'L1 锚定信息占位，演示 Rollup 向 L1 提交状态根。' },
    ],
    compliance: {
      allowed: ['Mock ZK / 测试网 Rollup 演示', '教学批次与 root'],
      forbidden: ['生产级 Rollup 部署方案', '主网资金桥接'],
    },
    realWorld:
      '映射到 zkSync、Starknet、Scroll 等模块化 Rollup：Sequencer 收集交易、Prover 生成有效性证明、合约在 L1 验证并锚定状态根。',
    furtherReading: [
      { label: 'Ethereum L2 / Rollup 文档', url: 'https://ethereum.org/en/developers/docs/scaling/' },
      { label: 'Starknet 文档', url: 'https://docs.starknet.io/' },
    ],
  },

  'edu.hot.zk-circuit': {
    concept:
      'ZK 电路编译实验聚焦零知识证明的「电路」一环：把用 Cairo 编写的电路编译为 Sierra/中间表示，是生成证明前的必经步骤。本 Lab 以教学级沙箱演示 circuit_name 提交与规则评估，关联 scarb 工具链 gate，让学习者理解「电路即程序、编译产物即可证明对象」的概念，而不运行真实证明系统。',
    howItWorks: [
      '用户填写电路名称 circuit_name（如 demo_circuit），点击提交。',
      '前端以 circuit_name 调用 simulate，taskType 为 HOT_ZK_CIRCUIT_COMPILE。',
      '规则引擎返回 evaluation，含 recommended_language（cairo）、recommended_template 与 audit_hints。',
      '可选在 cluster 模式触发 Job，运行 scarb --version 工具链 gate 验证沙箱环境。',
    ],
    params: [
      { name: 'circuit_name', desc: '待编译的电路名称，作为教学编译目标标识。' },
      { name: 'allowed_chain_ids', desc: '允许的链 ID 白名单，Sepolia 测试网 (11155111)。' },
    ],
    evalFields: [
      { name: 'recommended_language', desc: '推荐语言，ZK 电路场景应为 cairo。' },
      { name: 'recommended_template', desc: '推荐的起步电路模板路径。' },
      { name: 'audit_hints', desc: '审计提示列表，含编译/工具链相关教学信息。' },
      { name: 'compliance_passed', desc: '合规是否通过；通过后展示评估卡片。' },
    ],
    compliance: {
      allowed: ['测试网 Cairo 编译教学', '沙箱 scarb gate'],
      forbidden: ['主网 ZK 电路部署', '生产证明系统'],
    },
    realWorld:
      '对应 Starknet/Cairo 开发流程：开发者用 Cairo 写电路，scarb 编译为 Sierra，再由 prover 生成 STARK 证明在链上验证。',
    furtherReading: [
      { label: 'The Cairo Book', url: 'https://book.cairo-lang.org/' },
      { label: 'Scarb（Cairo 包管理/编译器）文档', url: 'https://docs.swmansion.com/scarb/' },
    ],
  },

  'edu.hot.aa-wallet': {
    concept:
      '账户抽象 (AA) 钱包实验演示 ERC-4337 风格的 UserOperation 五步流程：Build → Sign → Bundle → Validate → Execute。它让学习者理解智能合约钱包如何脱离 EOA 限制——通过 EntryPoint 合约校验 UserOp、由 Bundler 打包提交，实现自定义签名、批量交易与 Gas 代付。本 Lab 以 mock EntryPoint 演示整条流程，不触及真实资金。',
    howItWorks: [
      '用户填写 owner 地址、call_data，并选择模拟到哪一步 aa_flow_step。',
      '前端以 owner / call_data / aa_flow_step 调用 simulate，taskType 为 HOT_AA_WALLET_SIM。',
      '规则引擎产出 audit_hints，含 user_op_hash、entry_point、owner、aa_flow_completed。',
      '前端据 aa_flow_completed 高亮已完成步骤，并展示计算出的 UserOp hash。',
    ],
    params: [
      { name: 'owner', desc: '智能账户的 Owner 地址（教学占位地址），代表全权限控制者。' },
      { name: 'call_data', desc: 'UserOperation 要执行的调用数据（如 transfer 演示）。' },
      { name: 'aa_flow_step', desc: '模拟执行到的流程步骤：build/sign/bundle/validate/execute。' },
    ],
    evalFields: [
      { name: 'user_op_hash', desc: '本次 UserOperation 的哈希占位值，唯一标识一次操作。' },
      { name: 'entry_point', desc: 'EntryPoint 合约标识（教学 mock），4337 的统一入口。' },
      { name: 'aa_flow_completed', desc: '已完成步骤的逗号分隔列表，驱动流程图高亮。' },
      { name: 'owner', desc: '回显的 Owner 地址，用于对比 Smart Account 角色。' },
    ],
    compliance: {
      allowed: ['测试网 AA / UserOp 教学', 'Mock EntryPoint'],
      forbidden: ['主网 Bundler 攻击 / 资金盗取', '生产 Paymaster 滥用'],
    },
    realWorld:
      '对应 ERC-4337 生态的智能合约钱包（如 Safe、Biconomy、ZeroDev）：用户通过 EntryPoint 提交 UserOp，Bundler 打包上链，Paymaster 可代付 Gas。',
    furtherReading: [
      { label: 'ERC-4337: Account Abstraction', url: 'https://eips.ethereum.org/EIPS/eip-4337' },
      { label: 'ERC-7579: 模块化智能账户', url: 'https://eips.ethereum.org/EIPS/eip-7579' },
    ],
  },

  'edu.hot.aa-session': {
    concept:
      '会话密钥 (Session Key) 实验在 AA 钱包之上演示「受限权限的临时密钥」：用户授权一把带 TTL（有效期）与权限范围的会话密钥，应用可在限定时间和动作内代替用户签名，无需每次唤起主钱包。这是链游、DeFi 自动化常用的体验优化手段。本 Lab 以教学合约简化演示 TTL 概念，过期即应拒绝执行。',
    howItWorks: [
      '用户设置会话有效期 session_ttl_hours（默认 24 小时），点击提交。',
      '前端以 session_ttl_hours 调用 simulate，taskType 为 HOT_AA_SESSION_KEY_DEMO。',
      '规则引擎返回 evaluation，含 recommended_template、recommended_language 与 audit_hints。',
      '对照 aa-wallet 的 Owner 全权限：会话密钥应限制 callData 范围且过期后拒绝 execute。',
    ],
    params: [
      { name: 'session_ttl_hours', desc: '会话密钥的有效期（小时），到期后应失效，演示权限的时间边界。' },
      { name: 'allowed_chain_ids', desc: '允许的链 ID 白名单，Sepolia 测试网 (11155111)。' },
    ],
    evalFields: [
      { name: 'recommended_template', desc: '推荐的会话密钥合约模板（SessionKeyDemo.sol）。' },
      { name: 'recommended_language', desc: '推荐实现语言（solidity）。' },
      { name: 'audit_hints', desc: '审计提示，含 TTL / 权限范围相关教学信息。' },
      { name: 'compliance_passed', desc: '合规是否通过。' },
    ],
    compliance: {
      allowed: ['测试网 session key 演示', '虚构 session 数据'],
      forbidden: ['主网无限授权密钥', '真实资金的长期全权委托'],
    },
    realWorld:
      '对应链游与钱包 SDK 中的 session key（如 ZeroDev、Abstract）：用一把限时、限范围的密钥代签交易，提升体验同时控制风险面。',
    furtherReading: [
      { label: 'ERC-4337: Account Abstraction', url: 'https://eips.ethereum.org/EIPS/eip-4337' },
      { label: 'ERC-7579: 模块化智能账户（含权限模块）', url: 'https://eips.ethereum.org/EIPS/eip-7579' },
    ],
  },

  'edu.hot.dao': {
    concept:
      'DAO 投票实验演示测试网治理的核心机制：提案、投票计数与 quorum（法定人数）。学习者在 UI 本地点 YES/NO，再把快照提交到平台仿真，理解 yesVotes/noVotes 累计、turnout（参与率）与 quorum 达标如何决定提案状态（passed/rejected/active）。本平台仅在教学层模拟计票，不连接真实治理代币。',
    howItWorks: [
      '用户填写 proposal_id、proposal_title、quorum、投票人，并本地点 YES/NO 累计票数。',
      '前端以提案与票数 params 调用 simulate，taskType 为 HOT_DAO_VOTE_SIM。',
      '规则引擎产出 audit_hints，含 proposal_status、yes_votes、no_votes、quorum_target、turnout_pct。',
      '前端据 hints 渲染计票板进度条、状态徽章与治理四步流程（draft → vote → tally → record）。',
    ],
    params: [
      { name: 'proposal_id', desc: '提案编号标识。' },
      { name: 'proposal_title', desc: '提案标题（虚构教学内容）。' },
      { name: 'quorum', desc: '法定人数门槛，决定提案是否有效成立。' },
      { name: 'yes_votes', desc: '赞成票数（本地点票累计后提交）。' },
      { name: 'no_votes', desc: '反对票数。' },
      { name: 'last_voter', desc: '最近投票人标识（虚构地址）。' },
    ],
    evalFields: [
      { name: 'proposal_status', desc: '提案状态：draft / active / passed / rejected。' },
      { name: 'quorum_target', desc: '回显的 quorum 目标值，用于判断是否达标。' },
      { name: 'turnout_pct', desc: '参与率百分比，反映投票覆盖度。' },
      { name: 'yes_votes', desc: '规则层回显的赞成票数。' },
    ],
    compliance: {
      allowed: ['测试网治理教学仿真', '虚构提案与投票人'],
      forbidden: ['主网真实治理 / 代币募资', '操纵真实协议治理'],
    },
    realWorld:
      '对应 OpenZeppelin Governor / Compound Governor Bravo 等链上治理：用治理代币投票、达到 quorum 后通过提案并经 Timelock 执行。',
    furtherReading: [
      { label: 'OpenZeppelin Governance 文档', url: 'https://docs.openzeppelin.com/contracts/5.x/governance' },
      { label: 'Compound Governance', url: 'https://docs.compound.finance/v2/governance/' },
    ],
  },

  'edu.hot.mev': {
    concept:
      'MEV PBS 博弈实验演示以太坊的 Proposer-Builder Separation（提议者-构建者分离）机制：Builders 竞争性地为区块 slot 出价，Proposer 选择最高 bid 的区块打包。它教的是「区块构建市场如何缓解中心化 MEV 风险」的算法叙事，明确区分 PBS 拍卖与被禁止的抢跑/三明治套利机器人。本 Lab 用 MevPbsAuction.sol 演示 submitBid / selectWinningBuilder。',
    howItWorks: [
      '用户设置 block_slots、builder_count、slot_index，UI 演示按 bid 排序的 builder 出价表。',
      '前端以这三个参数调用 simulate，taskType 为 HOT_MEV_PBS_SIM。',
      '规则引擎产出 audit_hints，含 winning_builder、winning_bid_gwei、pbs_mode、arbitrage_bot=forbidden。',
      '前端高亮 Proposer 选中的最高出价 builder，并展示 PBS 四步流程，标注套利机器人为禁止项。',
    ],
    params: [
      { name: 'block_slots', desc: '演示的区块槽位数量（1–32）。' },
      { name: 'builder_count', desc: '参与竞价的 Builder 数量（2–8）。' },
      { name: 'slot_index', desc: '当前观察的 slot 索引，影响演示出价排列。' },
    ],
    evalFields: [
      { name: 'winning_builder', desc: 'Proposer 选中的胜出 Builder 标识（最高 bid）。' },
      { name: 'winning_bid_gwei', desc: '胜出出价（gwei），即 Proposer 获得的收益。' },
      { name: 'pbs_mode', desc: 'PBS 模式标识（proposer-builder-separation），强调教学算法。' },
      { name: 'arbitrage_bot', desc: '套利机器人标记，应为 forbidden，体现合规边界。' },
    ],
    compliance: {
      allowed: ['PBS 算法 / 拍卖机制教学', '测试网仿真'],
      forbidden: ['主网 MEV 套利机器人', '生产 mempool 操控（抢跑/三明治）'],
    },
    realWorld:
      '对应 Flashbots MEV-Boost 与以太坊 PBS：Builder 构建区块并出价，Relay 中继，Proposer（验证者）选择最高出价区块，缓解 MEV 中心化。',
    furtherReading: [
      { label: 'Ethereum MEV 文档', url: 'https://ethereum.org/en/developers/docs/mev/' },
      { label: 'Flashbots 文档', url: 'https://docs.flashbots.net/' },
    ],
  },

  'edu.hot.did': {
    concept:
      'DID 隐私实验演示去中心化身份的「选择性披露」：用户用 DID 注册若干 claim（如 email、age_over_18、country），验证方请求某项时，系统只 reveal 必要字段，其余以 hash 形式 withheld（不泄露原文）。这体现了可验证凭证（VC）的最小披露原则。本 Lab 用 DidPrivacy.move 演示 disclosed_claim 与 withheld_claim_hash 的区别。',
    howItWorks: [
      '用户填写 did_method，选择 disclosure_level（email/minimal/none）与要验证的 requested_claim。',
      '前端以这三个参数调用 simulate，taskType 为 HOT_DID_PRIVACY_DEMO。',
      '规则引擎产出 audit_hints，含 proof_valid、revealed_field、withheld_hash、claim_hash。',
      '前端展示可披露字段明文与被隐藏字段的 hash，并显示证明有效/无效；disclosure_level=none 时 proof_valid=false。',
    ],
    params: [
      { name: 'did_method', desc: 'DID 方法标识（如 did:demo:edu），标识身份命名空间。' },
      { name: 'disclosure_level', desc: '披露级别：email（标准）/ minimal（最小）/ none（不披露）。' },
      { name: 'requested_claim', desc: '验证方请求验证的 claim：email / age_over_18 / country。' },
    ],
    evalFields: [
      { name: 'proof_valid', desc: '披露证明是否有效（字符串 true/false）；不披露时应为 false。' },
      { name: 'revealed_field', desc: '允许公开披露的字段明文（如演示邮箱）。' },
      { name: 'withheld_hash', desc: '被隐藏字段的 hash，证明持有而不泄露原文。' },
      { name: 'claim_hash', desc: 'claim 的哈希值，用于完整性校验。' },
    ],
    compliance: {
      allowed: ['虚构 DID / 演示 claim', '测试网 Move 教学'],
      forbidden: ['真实公民 PII / 护照数据', '主网身份绑定'],
    },
    realWorld:
      '对应 W3C DID / Verifiable Credentials 与 Microsoft Entra Verified ID、ENS 等身份方案：持证人按需出示最小字段或零知识证明，验证方无需获取全部隐私。',
    furtherReading: [
      { label: 'W3C Decentralized Identifiers (DID) Core', url: 'https://www.w3.org/TR/did-core/' },
      { label: 'W3C Verifiable Credentials Data Model', url: 'https://www.w3.org/TR/vc-data-model/' },
    ],
  },

  'edu.hot.depin': {
    concept:
      'DePIN（去中心化物理基础设施网络）节点实验演示 Solana Anchor 方向的「节点注册」叙事：模拟若干物理节点（如无线热点、传感器、存储）在链上注册并参与网络。它关联 language-advisor 对 Solana/depin 场景的 Rust 推荐，让学习者理解 DePIN 项目如何用链上注册表协调真实世界硬件，本 Lab 仅做虚构 node_count 仿真，不涉及真实激励/代币经济。',
    howItWorks: [
      '用户设置模拟节点数 node_count，点击提交。',
      '前端以 node_count 调用 simulate，taskType 为 HOT_DEPIN_NODE_SIM。',
      '规则引擎返回 evaluation，含 recommended_language（rust）、recommended_template 与 audit_hints。',
      '可选在 cluster 模式触发 Job，运行 rustc / anchor 版本检查的工具链 gate。',
    ],
    params: [
      { name: 'node_count', desc: '模拟注册的节点数量（虚构教学数据）。' },
      { name: 'allowed_chain_ids', desc: '允许的链 ID 白名单，Sepolia 测试网 (11155111)。' },
    ],
    evalFields: [
      { name: 'recommended_language', desc: '推荐语言，Solana/DePIN 场景应为 rust。' },
      { name: 'recommended_template', desc: '推荐的 Anchor 节点合约模板（DepinNode.rs）。' },
      { name: 'audit_hints', desc: '审计提示，含节点注册相关教学信息。' },
      { name: 'compliance_passed', desc: '合规是否通过。' },
    ],
    compliance: {
      allowed: ['测试网节点注册仿真', '虚构 node_count'],
      forbidden: ['真实 DePIN 激励/代币经济', '主网设备挖矿'],
    },
    realWorld:
      '对应 Helium、Hivemapper、Render 等 DePIN 网络：真实硬件在链上注册并按贡献获得代币激励，本实验仅演示注册环节的教学模型。',
    furtherReading: [
      { label: 'Solana 开发者文档', url: 'https://solana.com/docs' },
      { label: 'Anchor 框架文档', url: 'https://www.anchor-lang.com/' },
    ],
  },

  'edu.hot.rwa-edu': {
    concept:
      'RWA（真实世界资产）链上映射实验以纯教学方式演示「把一个虚构资产 ID 映射到链上记录」的概念模型。它帮助学习者理解 RWA 代币化的基本思路——链下资产与链上 token 的对应关系，同时明确划清边界：本平台不做任何真实资产发行、募资或证券型代币，只用虚构 asset_id 演示映射。',
    howItWorks: [
      '用户填写虚构资产 ID asset_id（如 DEMO-RWA-001），点击提交。',
      '前端以 asset_id 调用 simulate，taskType 为 HOT_RWA_EDU_SIM。',
      '规则引擎返回 evaluation，含 recommended_template、recommended_language 与 audit_hints。',
      '前端展示规则评估卡片与映射占位结果，全程为测试网 Solidity 教学模板。',
    ],
    params: [
      { name: 'asset_id', desc: '虚构资产标识符，作为链上映射的占位键。' },
      { name: 'allowed_chain_ids', desc: '允许的链 ID 白名单，Sepolia 测试网 (11155111)。' },
    ],
    evalFields: [
      { name: 'recommended_template', desc: '推荐的资产映射合约模板（RwaMappingDemo.sol）。' },
      { name: 'recommended_language', desc: '推荐实现语言（solidity）。' },
      { name: 'audit_hints', desc: '审计提示，含映射模型相关教学信息。' },
      { name: 'compliance_passed', desc: '合规是否通过。' },
    ],
    compliance: {
      allowed: ['虚构资产 ID 映射演示', '测试网 Solidity 模板'],
      forbidden: ['真实资产代币化 / 募资', '证券型代币发行'],
    },
    realWorld:
      '对应 ERC-3643 (T-REX)、Centrifuge、Ondo 等合规 RWA 代币化框架：链下资产经合规校验后映射为受限可转让 token；本实验仅演示映射概念，不含任何发行。',
    furtherReading: [
      { label: 'ERC-3643: 合规代币 (T-REX)', url: 'https://eips.ethereum.org/EIPS/eip-3643' },
      { label: 'ERC-1400: 证券型代币标准', url: 'https://github.com/ethereum/EIPs/issues/1411' },
    ],
  },

  'edu.hot.ai-agent': {
    concept:
      'AI Agent 受限沙箱实验演示链上自治 Agent 的「权限边界」概念：通过 max_actions（最大动作次数）等约束，限制 Agent 在链上可执行的操作上限。它教的是「如何为自动化 Agent 设权限护栏」，明确区分教学沙箱叙事与真实的自主交易/抢跑 Agent。本 Lab 用 AgentSandbox.sol 演示权限模型，不接入真实 LLM 密钥或主网 RPC。',
    howItWorks: [
      '用户设置最大动作次数 max_actions（如 3），点击提交。',
      '前端以 max_actions 调用 simulate，taskType 为 HOT_AI_AGENT_SANDBOX。',
      '规则引擎返回 evaluation，audit_hints 含 max_actions 等权限边界信息。',
      '前端展示规则评估卡片，确认合规通过且无主网 RPC 接入。',
    ],
    params: [
      { name: 'max_actions', desc: 'Agent 允许执行的最大动作次数，作为权限护栏的核心约束。' },
      { name: 'allowed_chain_ids', desc: '允许的链 ID 白名单，Sepolia 测试网 (11155111)。' },
    ],
    evalFields: [
      { name: 'audit_hints', desc: '审计提示，回显 max_actions 等 Agent 权限边界。' },
      { name: 'recommended_template', desc: '推荐的 Agent 沙箱合约模板（AgentSandbox.sol）。' },
      { name: 'compliance_passed', desc: '合规是否通过；应确认无主网 RPC、无真实密钥。' },
    ],
    compliance: {
      allowed: ['权限模型 / 沙箱教学', '虚构 Agent 策略'],
      forbidden: ['自主交易 / 抢跑 Agent', '真实 LLM 密钥上链'],
    },
    realWorld:
      '对应链上 Agent / 智能账户的权限护栏设计：用动作上限、白名单、花费限额等约束自动化代理，防止失控操作，常与 ERC-4337 智能账户的权限模块结合。',
    furtherReading: [
      { label: 'OpenZeppelin Access Control', url: 'https://docs.openzeppelin.com/contracts/5.x/access-control' },
      { label: 'ERC-4337: Account Abstraction', url: 'https://eips.ethereum.org/EIPS/eip-4337' },
    ],
  },
}

export default hot

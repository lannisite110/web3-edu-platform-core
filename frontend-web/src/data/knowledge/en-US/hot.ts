import type { KnowledgeMap } from '../types'

const hot: KnowledgeMap = {
  'edu.hot.language-advisor': {
    concept:
      'The Smart-Contract Language Advisor is the gateway Lab for the entire hot-topic path. Web3 teams face “one scenario, many stacks”: EVM (Solidity/Vyper/Huff) for mature ecosystems and audits; Solana (Rust/Anchor) for TPS and DePIN; Move (Aptos/Sui) for replay-safe assets; Cairo for ZK-Rollups; Clarity/Cadence/TEAL for BTC L2, GameFi and compliant payments. This Lab writes no business contracts—it maps natural-language descriptions onto 9 keyword rules in `language-choice-rules.yaml`, returning recommended_language, toolchain_group, isolated Namespace, starter template and suggested_lab, with optional HOT_MULTI_LANG_COMPILE toolchain-gate simulation in the matching ns-*. The core lesson: pick language and stack by constraints first, then deepen in one of 11 topic Labs.',
    howItWorks: [
      'The page shows the 7-group isolation model (separate images + K8s Namespaces + NetworkPolicy) and a 9-scenario decision matrix aligned with the rules file.',
      'The user picks a chip or matrix row and may edit the prompt (EN/ZH keywords); params carry scenario and tags (scenario id).',
      'The rule engine lowercases prompt + scenario + tags and scans rules[].keywords in order; the first hit sets language / toolchain_group / tools / reason.',
      'If nothing matches, default fallback: Solidity + EVM + solc/foundry.',
      'evaluation returns recommended_template (one of 9 teaching templates), suggested_lab (one of 11 hot Labs), and audit_hints (namespace, image, tools, match_reason, etc.).',
      'The UI shows the recommendation card, matched rule id, and audit_hints detail; you can jump to suggested_lab or submit a HOT_MULTI_LANG_COMPILE Job.',
      'Compliance rejects target_network=mainnet; allowed_chain_ids is fixed to the Sepolia (11155111) testnet allow-list.',
    ],
    params: [
      { name: 'scenario', desc: 'Business-scenario text (chip preset or custom); primary keyword input, e.g. "zk cairo rollup".' },
      { name: 'tags', desc: 'Current chip id (defi / zk / solana …); matched together with scenario.' },
      { name: 'language', desc: 'Compile Job phase: target language from the recommendation (solidity / cairo / rust / move, etc.).' },
      { name: 'template', desc: 'Optional compile Job: recommended_template path, e.g. GenericDeFi.sol / ZkRollup.cairo.' },
      { name: 'toolchain_group', desc: 'Optional compile Job: evm / solana / move / zk, etc.; picks image and Namespace.' },
      { name: 'task_type', desc: 'HOT_MULTI_LANG_COMPILE triggers multi-language compile simulation; default simulate is language advisory.' },
      { name: 'allowed_chain_ids', desc: 'Chain ID allow-list, fixed to [11155111] (Sepolia testnet).' },
    ],
    evalFields: [
      { name: 'recommended_language', desc: 'Recommended language: solidity / vyper / huff / rust / move / cairo / clarity / cadence / teal.' },
      { name: 'toolchain_group', desc: 'One of 7 groups: evm / solana / move / zk / btc / flow / algorand; decides ns-* and Job image.' },
      { name: 'recommended_template', desc: 'Relative path under plugins/language-advisor/templates/ for the starter template.' },
      { name: 'tools', desc: 'Native toolchain for the scenario, e.g. solc+foundry, cairo+starknet-foundry, anchor.' },
      { name: 'suggested_lab', desc: 'Next plugin id, e.g. edu.hot.zk-modular / edu.hot.depin, for learning-path chaining.' },
      { name: 'namespace', desc: 'K8s Namespace in audit_hints, e.g. ns-evm / ns-hot-zk, showing group isolation.' },
      { name: 'image', desc: 'Job image tag in audit_hints, e.g. edu/toolchain-zk:0.1.0.' },
      { name: 'match_reason', desc: 'Selection rationale from rules[].reason for the matched rule.' },
      { name: 'compliance_passed', desc: 'Recommendation card shows only on pass; mainnet and similar are rejected.' },
    ],
    compliance: {
      allowed: [
        'Testnet deployment and language/toolchain teaching recommendations',
        '9 scenarios × 7 toolchain groups decision demos',
        'HOT_MULTI_LANG_COMPILE compile Job simulation',
        'suggested_lab path jumps and audit_hints review',
      ],
      forbidden: [
        'Mainnet deployment or target_network=mainnet',
        'Real trading strategies or production Rollup launch',
        'Cross-Namespace compiler mixing or runtime curl-installed binaries',
      ],
    },
    realWorld:
      'Maps to architecture review and tech-selection docs: teams pick among Solidity / Rust / Move / Cairo by TPS, security model, ecosystem and audit cost; DevOps maintains separate CI images and Namespaces per language (same model as build-images/ + ns-* here); product then builds the DApp / Rollup / DePIN. Language Advisor rule-ifies and teaches that process.',
    furtherReading: [
      { label: 'Ethereum smart-contract languages', url: 'https://ethereum.org/en/developers/docs/smart-contracts/languages/' },
      { label: 'Foundry Book (EVM toolchain)', url: 'https://book.getfoundry.sh/' },
      { label: 'Anchor docs (Solana)', url: 'https://www.anchor-lang.com/docs' },
      { label: 'Move Book (Aptos / Sui)', url: 'https://move-language.github.io/move/' },
      { label: 'Cairo / Starknet docs', url: 'https://docs.starknet.io/' },
      { label: 'Sub-repo multi-language-toolchains.md', url: 'https://github.com/lannisite110/web3-hot-topic-labs/blob/main/docs/multi-language-toolchains.md' },
    ],
  },

  'edu.hot.zk-modular': {
    concept:
      'The ZK Modular Rollup Lab demonstrates an L2 pipeline: collect a transaction batch, generate a mock proof, submit the batch, then anchor to L1. It uses a teaching-grade mock verifier instead of a real proof system so learners can see how batch root and tx_count change with batch size, and understand the modular-Rollup narrative (separate execution / settlement / data-availability layers) without any real fund bridging.',
    howItWorks: [
      'The user sets batch_size (1-64) and clicks submit batch simulation.',
      'The frontend calls simulate with batch_size, taskType HOT_ZK_ROLLUP_SIM; the rule-engine emits audit_hints.',
      'It reads mock_batch_root, tx_count, verifier and l1_anchor from hints and renders the batch list with finalized/proving status.',
      'The four-step pipeline (collect to prove to submit to anchor) highlights the current step based on task status.',
    ],
    params: [
      { name: 'batch_size', desc: 'Number of transactions packed into one Rollup batch (1-64); affects the demo batch count and per-batch tx count.' },
      { name: 'allowed_chain_ids', desc: 'Allow-list of chain IDs; the Sepolia testnet (11155111).' },
    ],
    evalFields: [
      { name: 'mock_batch_root', desc: 'A teaching placeholder Merkle root for the batch, corresponding to the last batch.' },
      { name: 'tx_count', desc: 'Total transactions in this simulation, used to derive per-batch tx count.' },
      { name: 'verifier', desc: 'The verifier identifier (e.g. mock-sepolia), stressing this is a teaching mock, not a production prover.' },
      { name: 'l1_anchor', desc: 'L1 anchoring placeholder, demonstrating the Rollup submitting a state root to L1.' },
    ],
    compliance: {
      allowed: ['Mock ZK / testnet Rollup demos', 'Teaching batches and roots'],
      forbidden: ['Production-grade Rollup deployment plans', 'Mainnet fund bridging'],
    },
    realWorld:
      'Maps to modular Rollups like zkSync, Starknet and Scroll: a sequencer collects transactions, a prover generates validity proofs, and an L1 contract verifies and anchors the state root.',
    furtherReading: [
      { label: 'Ethereum L2 / Rollup docs', url: 'https://ethereum.org/en/developers/docs/scaling/' },
      { label: 'Starknet documentation', url: 'https://docs.starknet.io/' },
    ],
  },

  'edu.hot.zk-circuit': {
    concept:
      'The ZK Circuit Compile Lab focuses on the "circuit" stage of zero-knowledge proofs: compiling a circuit written in Cairo into Sierra / an intermediate representation, the step that precedes proof generation. This Lab demonstrates circuit_name submission and rule evaluation in a teaching sandbox, tied to the scarb toolchain gate, so learners grasp the idea that "a circuit is a program and its compiled artifact is the provable object" without running a real prover.',
    howItWorks: [
      'The user enters a circuit name (e.g. demo_circuit) and clicks submit.',
      'The frontend calls simulate with circuit_name, taskType HOT_ZK_CIRCUIT_COMPILE.',
      'The rule-engine returns evaluation with recommended_language (cairo), recommended_template and audit_hints.',
      'Optionally a cluster-mode Job runs the scarb --version toolchain gate to validate the sandbox environment.',
    ],
    params: [
      { name: 'circuit_name', desc: 'Name of the circuit to compile; serves as the teaching compile-target identifier.' },
      { name: 'allowed_chain_ids', desc: 'Allow-list of chain IDs; the Sepolia testnet (11155111).' },
    ],
    evalFields: [
      { name: 'recommended_language', desc: 'Recommended language; should be cairo for ZK circuit scenarios.' },
      { name: 'recommended_template', desc: 'Path of the recommended starter circuit template.' },
      { name: 'audit_hints', desc: 'Audit-hint list with compile / toolchain teaching info.' },
      { name: 'compliance_passed', desc: 'Whether compliance passed; the eval card shows on pass.' },
    ],
    compliance: {
      allowed: ['Testnet Cairo compile teaching', 'Sandbox scarb gate'],
      forbidden: ['Mainnet ZK circuit deployment', 'Production proof systems'],
    },
    realWorld:
      'Maps to the Starknet/Cairo workflow: developers write circuits in Cairo, scarb compiles them to Sierra, and a prover generates a STARK proof verified on-chain.',
    furtherReading: [
      { label: 'The Cairo Book', url: 'https://book.cairo-lang.org/' },
      { label: 'Scarb (Cairo package manager / compiler) docs', url: 'https://docs.swmansion.com/scarb/' },
    ],
  },

  'edu.hot.aa-wallet': {
    concept:
      'The Account Abstraction (AA) Wallet Lab demonstrates the ERC-4337 style UserOperation five-step flow: Build, Sign, Bundle, Validate, Execute. It teaches how a smart-contract wallet escapes EOA limits: an EntryPoint contract validates the UserOp, a Bundler packs and submits it, enabling custom signatures, batched transactions and gas sponsorship. This Lab runs the whole flow against a mock EntryPoint with no real funds.',
    howItWorks: [
      'The user fills in the owner address and call_data, and selects which step to simulate to via aa_flow_step.',
      'The frontend calls simulate with owner / call_data / aa_flow_step, taskType HOT_AA_WALLET_SIM.',
      'The rule-engine emits audit_hints with user_op_hash, entry_point, owner and aa_flow_completed.',
      'The frontend highlights completed steps from aa_flow_completed and shows the computed UserOp hash.',
    ],
    params: [
      { name: 'owner', desc: 'The smart account owner address (teaching placeholder); represents the full-permission controller.' },
      { name: 'call_data', desc: 'The call data the UserOperation will execute (e.g. a transfer demo).' },
      { name: 'aa_flow_step', desc: 'The flow step to simulate to: build/sign/bundle/validate/execute.' },
    ],
    evalFields: [
      { name: 'user_op_hash', desc: 'Placeholder hash of this UserOperation, uniquely identifying one operation.' },
      { name: 'entry_point', desc: 'EntryPoint contract identifier (teaching mock), the unified 4337 entry.' },
      { name: 'aa_flow_completed', desc: 'Comma-separated list of completed steps that drives the flow-diagram highlighting.' },
      { name: 'owner', desc: 'Echoed owner address, used to contrast with the smart-account role.' },
    ],
    compliance: {
      allowed: ['Testnet AA / UserOp teaching', 'Mock EntryPoint'],
      forbidden: ['Mainnet Bundler attacks / fund theft', 'Production Paymaster abuse'],
    },
    realWorld:
      'Maps to ERC-4337 smart-contract wallets (e.g. Safe, Biconomy, ZeroDev): users submit UserOps via the EntryPoint, a Bundler packs them on-chain, and a Paymaster can sponsor gas.',
    furtherReading: [
      { label: 'ERC-4337: Account Abstraction', url: 'https://eips.ethereum.org/EIPS/eip-4337' },
      { label: 'ERC-7579: Modular Smart Accounts', url: 'https://eips.ethereum.org/EIPS/eip-7579' },
    ],
  },

  'edu.hot.aa-session': {
    concept:
      'The Session Key Lab builds on the AA wallet to demonstrate a "restricted, temporary key": the user authorizes a session key with a TTL (time-to-live) and a permission scope, so an app can sign on the user behalf within bounded time and actions without prompting the main wallet each time. It is a common UX optimization in on-chain games and DeFi automation. This Lab simplifies the TTL concept in a teaching contract; an expired key should refuse execution.',
    howItWorks: [
      'The user sets the session TTL session_ttl_hours (default 24) and clicks submit.',
      'The frontend calls simulate with session_ttl_hours, taskType HOT_AA_SESSION_KEY_DEMO.',
      'The rule-engine returns evaluation with recommended_template, recommended_language and audit_hints.',
      'Contrast with the aa-wallet full-permission owner: a session key should bound the callData scope and refuse execute once expired.',
    ],
    params: [
      { name: 'session_ttl_hours', desc: 'Validity period of the session key in hours; it should expire afterwards, demonstrating the time boundary of permissions.' },
      { name: 'allowed_chain_ids', desc: 'Allow-list of chain IDs; the Sepolia testnet (11155111).' },
    ],
    evalFields: [
      { name: 'recommended_template', desc: 'Recommended session-key contract template (SessionKeyDemo.sol).' },
      { name: 'recommended_language', desc: 'Recommended implementation language (solidity).' },
      { name: 'audit_hints', desc: 'Audit hints with TTL / permission-scope teaching info.' },
      { name: 'compliance_passed', desc: 'Whether compliance passed.' },
    ],
    compliance: {
      allowed: ['Testnet session-key demos', 'Fictional session data'],
      forbidden: ['Mainnet unlimited-approval keys', 'Long-lived full delegation over real funds'],
    },
    realWorld:
      'Maps to session keys in on-chain games and wallet SDKs (e.g. ZeroDev, Abstract): a time-bounded, scope-limited key co-signs transactions, improving UX while limiting the risk surface.',
    furtherReading: [
      { label: 'ERC-4337: Account Abstraction', url: 'https://eips.ethereum.org/EIPS/eip-4337' },
      { label: 'ERC-7579: Modular Smart Accounts (permission modules)', url: 'https://eips.ethereum.org/EIPS/eip-7579' },
    ],
  },

  'edu.hot.dao': {
    concept:
      'The DAO Voting Lab demonstrates the core mechanics of testnet governance: proposals, vote tallying and quorum. Learners click YES/NO locally in the UI, then submit a snapshot to the platform simulation to understand how accumulating yesVotes/noVotes, turnout and quorum decide a proposal status (passed/rejected/active). The platform simulates tallying at the teaching layer only and does not connect to a real governance token.',
    howItWorks: [
      'The user fills in proposal_id, proposal_title, quorum and the voter, then taps YES/NO to accumulate votes locally.',
      'The frontend calls simulate with the proposal and vote params, taskType HOT_DAO_VOTE_SIM.',
      'The rule-engine emits audit_hints with proposal_status, yes_votes, no_votes, quorum_target and turnout_pct.',
      'The frontend renders the tally bar, status badge and the four-step governance flow (draft to vote to tally to record).',
    ],
    params: [
      { name: 'proposal_id', desc: 'Proposal identifier.' },
      { name: 'proposal_title', desc: 'Proposal title (fictional teaching content).' },
      { name: 'quorum', desc: 'Quorum threshold deciding whether the proposal validly carries.' },
      { name: 'yes_votes', desc: 'Yes-vote count (accumulated locally then submitted).' },
      { name: 'no_votes', desc: 'No-vote count.' },
      { name: 'last_voter', desc: 'Identifier of the most recent voter (fictional address).' },
    ],
    evalFields: [
      { name: 'proposal_status', desc: 'Proposal status: draft / active / passed / rejected.' },
      { name: 'quorum_target', desc: 'Echoed quorum target, used to judge whether the threshold is met.' },
      { name: 'turnout_pct', desc: 'Turnout percentage, reflecting voting coverage.' },
      { name: 'yes_votes', desc: 'Yes-vote count echoed by the rule layer.' },
    ],
    compliance: {
      allowed: ['Testnet governance teaching simulation', 'Fictional proposals and voters'],
      forbidden: ['Mainnet real governance / token fundraising', 'Manipulating real protocol governance'],
    },
    realWorld:
      'Maps to on-chain governance like OpenZeppelin Governor / Compound Governor Bravo: holders vote with governance tokens, a proposal passes once quorum is reached, then executes via a Timelock.',
    furtherReading: [
      { label: 'OpenZeppelin Governance docs', url: 'https://docs.openzeppelin.com/contracts/5.x/governance' },
      { label: 'Compound Governance', url: 'https://docs.compound.finance/v2/governance/' },
    ],
  },

  'edu.hot.mev': {
    concept:
      'The MEV PBS Lab demonstrates Ethereum Proposer-Builder Separation: builders competitively bid to construct a block for a slot, and the proposer picks the block with the highest bid. It teaches the algorithmic narrative of how a block-building market mitigates MEV centralization, and clearly separates PBS auctions from the forbidden front-running / sandwich arbitrage bots. This Lab uses MevPbsAuction.sol to demonstrate submitBid / selectWinningBuilder.',
    howItWorks: [
      'The user sets block_slots, builder_count and slot_index; the UI shows a builder bid table sorted by bid.',
      'The frontend calls simulate with these three params, taskType HOT_MEV_PBS_SIM.',
      'The rule-engine emits audit_hints with winning_builder, winning_bid_gwei, pbs_mode and arbitrage_bot=forbidden.',
      'The frontend highlights the highest-bid builder the proposer selects and shows the four-step PBS flow, flagging arbitrage bots as forbidden.',
    ],
    params: [
      { name: 'block_slots', desc: 'Number of block slots to demonstrate (1-32).' },
      { name: 'builder_count', desc: 'Number of competing builders (2-8).' },
      { name: 'slot_index', desc: 'The slot index currently observed; affects the demo bid ordering.' },
    ],
    evalFields: [
      { name: 'winning_builder', desc: 'The winning builder the proposer selects (highest bid).' },
      { name: 'winning_bid_gwei', desc: 'The winning bid (gwei), i.e. the proposer payoff.' },
      { name: 'pbs_mode', desc: 'PBS mode identifier (proposer-builder-separation), stressing the teaching algorithm.' },
      { name: 'arbitrage_bot', desc: 'Arbitrage-bot flag; should be forbidden, reflecting the compliance boundary.' },
    ],
    compliance: {
      allowed: ['PBS algorithm / auction-mechanism teaching', 'Testnet simulation'],
      forbidden: ['Mainnet MEV arbitrage bots', 'Production mempool manipulation (front-running/sandwich)'],
    },
    realWorld:
      'Maps to Flashbots MEV-Boost and Ethereum PBS: builders construct blocks and bid, relays relay them, and the proposer (validator) picks the highest-bid block to mitigate MEV centralization.',
    furtherReading: [
      { label: 'Ethereum MEV docs', url: 'https://ethereum.org/en/developers/docs/mev/' },
      { label: 'Flashbots documentation', url: 'https://docs.flashbots.net/' },
    ],
  },

  'edu.hot.did': {
    concept:
      'The DID Privacy Lab demonstrates "selective disclosure" of decentralized identity: a user registers several claims under a DID (e.g. email, age_over_18, country), and when a verifier requests one, the system reveals only the necessary field while the rest stay withheld as a hash (the plaintext is never leaked). This embodies the minimal-disclosure principle of Verifiable Credentials. This Lab uses DidPrivacy.move to demonstrate the difference between disclosed_claim and withheld_claim_hash.',
    howItWorks: [
      'The user fills in did_method and selects disclosure_level (email/minimal/none) and the requested_claim to verify.',
      'The frontend calls simulate with these three params, taskType HOT_DID_PRIVACY_DEMO.',
      'The rule-engine emits audit_hints with proof_valid, revealed_field, withheld_hash and claim_hash.',
      'The frontend shows the disclosed field in plaintext and the hidden field as a hash, plus proof valid/invalid; with disclosure_level=none, proof_valid=false.',
    ],
    params: [
      { name: 'did_method', desc: 'DID method identifier (e.g. did:demo:edu), naming the identity namespace.' },
      { name: 'disclosure_level', desc: 'Disclosure level: email (standard) / minimal / none.' },
      { name: 'requested_claim', desc: 'The claim the verifier requests: email / age_over_18 / country.' },
    ],
    evalFields: [
      { name: 'proof_valid', desc: 'Whether the disclosure proof is valid (string true/false); should be false when nothing is disclosed.' },
      { name: 'revealed_field', desc: 'The plaintext of the field allowed to be disclosed (e.g. the demo email).' },
      { name: 'withheld_hash', desc: 'Hash of the withheld field, proving possession without leaking plaintext.' },
      { name: 'claim_hash', desc: 'Hash of the claim, used for integrity verification.' },
    ],
    compliance: {
      allowed: ['Fictional DID / demo claims', 'Testnet Move teaching'],
      forbidden: ['Real citizen PII / passport data', 'Mainnet identity binding'],
    },
    realWorld:
      'Maps to W3C DID / Verifiable Credentials and schemes like Microsoft Entra Verified ID and ENS: a holder presents only the minimal field or a zero-knowledge proof, so the verifier never obtains all the private data.',
    furtherReading: [
      { label: 'W3C Decentralized Identifiers (DID) Core', url: 'https://www.w3.org/TR/did-core/' },
      { label: 'W3C Verifiable Credentials Data Model', url: 'https://www.w3.org/TR/vc-data-model/' },
    ],
  },

  'edu.hot.depin': {
    concept:
      'The DePIN (Decentralized Physical Infrastructure Network) Node Lab demonstrates the "node registration" narrative in the Solana Anchor direction: simulating physical nodes (e.g. wireless hotspots, sensors, storage) registering on-chain and joining a network. It ties to the language-advisor Rust recommendation for Solana/depin scenarios, so learners understand how DePIN projects use an on-chain registry to coordinate real-world hardware. This Lab only runs a fictional node_count simulation, with no real incentives / token economics.',
    howItWorks: [
      'The user sets the simulated node count node_count and clicks submit.',
      'The frontend calls simulate with node_count, taskType HOT_DEPIN_NODE_SIM.',
      'The rule-engine returns evaluation with recommended_language (rust), recommended_template and audit_hints.',
      'Optionally a cluster-mode Job runs the rustc / anchor version-check toolchain gate.',
    ],
    params: [
      { name: 'node_count', desc: 'Number of nodes to simulate registering (fictional teaching data).' },
      { name: 'allowed_chain_ids', desc: 'Allow-list of chain IDs; the Sepolia testnet (11155111).' },
    ],
    evalFields: [
      { name: 'recommended_language', desc: 'Recommended language; should be rust for Solana/DePIN scenarios.' },
      { name: 'recommended_template', desc: 'Recommended Anchor node-contract template (DepinNode.rs).' },
      { name: 'audit_hints', desc: 'Audit hints with node-registration teaching info.' },
      { name: 'compliance_passed', desc: 'Whether compliance passed.' },
    ],
    compliance: {
      allowed: ['Testnet node-registration simulation', 'Fictional node_count'],
      forbidden: ['Real DePIN incentives / token economics', 'Mainnet device mining'],
    },
    realWorld:
      'Maps to DePIN networks like Helium, Hivemapper and Render: real hardware registers on-chain and earns token incentives by contribution; this experiment only demonstrates the registration step as a teaching model.',
    furtherReading: [
      { label: 'Solana developer docs', url: 'https://solana.com/docs' },
      { label: 'Anchor framework docs', url: 'https://www.anchor-lang.com/' },
    ],
  },

  'edu.hot.rwa-edu': {
    concept:
      'The RWA (Real-World Asset) On-Chain Mapping Lab demonstrates, purely for teaching, the concept of "mapping a fictional asset ID to an on-chain record". It helps learners grasp the basic idea of RWA tokenization, the correspondence between an off-chain asset and an on-chain token, while drawing a clear boundary: the platform does no real asset issuance, fundraising or security tokens, and only demonstrates the mapping with a fictional asset_id.',
    howItWorks: [
      'The user enters a fictional asset ID asset_id (e.g. DEMO-RWA-001) and clicks submit.',
      'The frontend calls simulate with asset_id, taskType HOT_RWA_EDU_SIM.',
      'The rule-engine returns evaluation with recommended_template, recommended_language and audit_hints.',
      'The frontend shows the rule-eval card and a mapping placeholder result; the whole flow is a testnet Solidity teaching template.',
    ],
    params: [
      { name: 'asset_id', desc: 'Fictional asset identifier serving as the placeholder key for on-chain mapping.' },
      { name: 'allowed_chain_ids', desc: 'Allow-list of chain IDs; the Sepolia testnet (11155111).' },
    ],
    evalFields: [
      { name: 'recommended_template', desc: 'Recommended asset-mapping contract template (RwaMappingDemo.sol).' },
      { name: 'recommended_language', desc: 'Recommended implementation language (solidity).' },
      { name: 'audit_hints', desc: 'Audit hints with mapping-model teaching info.' },
      { name: 'compliance_passed', desc: 'Whether compliance passed.' },
    ],
    compliance: {
      allowed: ['Fictional asset-ID mapping demos', 'Testnet Solidity templates'],
      forbidden: ['Real asset tokenization / fundraising', 'Security-token issuance'],
    },
    realWorld:
      'Maps to compliant RWA tokenization frameworks like ERC-3643 (T-REX), Centrifuge and Ondo: off-chain assets are mapped to restricted-transfer tokens after compliance checks; this experiment only demonstrates the mapping concept, with no issuance.',
    furtherReading: [
      { label: 'ERC-3643: Compliant Token (T-REX)', url: 'https://eips.ethereum.org/EIPS/eip-3643' },
      { label: 'ERC-1400: Security Token Standard', url: 'https://github.com/ethereum/EIPs/issues/1411' },
    ],
  },

  'edu.hot.ai-agent': {
    concept:
      'The AI Agent Restricted Sandbox Lab demonstrates the "permission boundary" concept for an on-chain autonomous agent: constraints such as max_actions cap how many operations the agent may perform on-chain. It teaches how to set permission guardrails for an automated agent, and clearly separates the teaching sandbox narrative from a real autonomous-trading / front-running agent. This Lab uses AgentSandbox.sol to demonstrate the permission model, with no real LLM keys or mainnet RPC.',
    howItWorks: [
      'The user sets the maximum action count max_actions (e.g. 3) and clicks submit.',
      'The frontend calls simulate with max_actions, taskType HOT_AI_AGENT_SANDBOX.',
      'The rule-engine returns evaluation; audit_hints carry max_actions and other permission-boundary info.',
      'The frontend shows the rule-eval card, confirming compliance passed and no mainnet RPC access.',
    ],
    params: [
      { name: 'max_actions', desc: 'Maximum number of actions the agent may perform; the core constraint of the permission guardrail.' },
      { name: 'allowed_chain_ids', desc: 'Allow-list of chain IDs; the Sepolia testnet (11155111).' },
    ],
    evalFields: [
      { name: 'audit_hints', desc: 'Audit hints echoing max_actions and other agent permission boundaries.' },
      { name: 'recommended_template', desc: 'Recommended agent-sandbox contract template (AgentSandbox.sol).' },
      { name: 'compliance_passed', desc: 'Whether compliance passed; should confirm no mainnet RPC and no real keys.' },
    ],
    compliance: {
      allowed: ['Permission-model / sandbox teaching', 'Fictional agent strategies'],
      forbidden: ['Autonomous trading / front-running agents', 'Real LLM keys on-chain'],
    },
    realWorld:
      'Maps to permission-guardrail design for on-chain agents / smart accounts: action caps, allow-lists and spending limits constrain an automated agent to prevent runaway operations, often combined with permission modules of ERC-4337 smart accounts.',
    furtherReading: [
      { label: 'OpenZeppelin Access Control', url: 'https://docs.openzeppelin.com/contracts/5.x/access-control' },
      { label: 'ERC-4337: Account Abstraction', url: 'https://eips.ethereum.org/EIPS/eip-4337' },
    ],
  },
}

export default hot

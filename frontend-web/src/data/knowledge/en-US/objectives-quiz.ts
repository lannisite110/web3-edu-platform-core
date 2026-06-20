import type { ObjectivesQuizMap } from '../types'

const objectivesQuiz: ObjectivesQuizMap = {
  'edu.hot.mock': {
    objectives: [
      'Understand the Mock Lab as an end-to-end platform smoke test',
      'Explain the pipeline: frontend → gateway → rule-engine evaluate → scheduler Job → report',
      'Apply compliance boundaries: evaluate blocks mainnet params and allows testnet demos only',
    ],
    quiz: [
      {
        question: 'What is the primary purpose of the Mock Lab?',
        options: [
          'Demonstrate ZK Rollup batch submission and L1 anchoring',
          'Verify the full platform path: frontend → gateway → rule-engine → scheduler → report',
          'Recommend the best smart-contract language and toolchain',
          'Simulate DAO proposal voting and quorum',
        ],
        answerIndex: 1,
        explanation:
          'The Mock Lab is the smallest runnable sample; it does not teach a business case but confirms the end-to-end pipeline after deployment.',
      },
      {
        question: 'Why is allowed_chain_ids fixed to Sepolia (11155111) in the Mock Lab?',
        options: [
          'To increase transaction throughput',
          'To restrict demos to the testnet and block mainnet params and real fund operations',
          'To enable Cairo circuit compilation',
          'To connect to a live OFAC sanctions API',
        ],
        answerIndex: 1,
        explanation:
          'allowed_chain_ids is a chain-ID allow-list; the mock scenario permits testnet pipeline demos only and the rule-engine blocks mainnet params.',
      },
    ],
  },

  'edu.hot.language-advisor': {
    objectives: [
      'Explain the 7-group isolation model: separate images, K8s Namespaces (ns-evm / ns-solana / ns-hot-zk …) and NetworkPolicy',
      'Apply the 9 keyword rules in language-choice-rules.yaml: match order, fallback, and suggested_lab per scenario',
      'Interpret full evaluation fields (recommended_language, toolchain_group, namespace, image, audit_hints) and jump to topic Labs',
      'Contrast language-advisory simulate vs HOT_MULTI_LANG_COMPILE Job params and testnet-only compliance',
    ],
    quiz: [
      {
        question: 'What are the core input params for the Language Advisor?',
        options: [
          'batch_size and allowed_chain_ids',
          'scenario (description text) and tags (scenario id)',
          'owner and call_data',
          'entity_name and mica_pattern',
        ],
        answerIndex: 1,
        explanation:
          'The user picks a chip or types a custom prompt as scenario; tags carry the scenario id (e.g. zk / solana) for keyword matching.',
      },
      {
        question: 'What is suggested_lab in the evaluation used for?',
        options: [
          'Recording the L1 anchor block height',
          'Identifying the next topic Lab plugin id for learning-path chaining',
          'Storing the Merkle root hash',
          'Flagging whether an arbitrage bot is forbidden',
        ],
        answerIndex: 1,
        explanation:
          'suggested_lab links the language recommendation to the next hot-topic experiment; the UI shows an "Open topic Lab" button.',
      },
      {
        question: 'Keywords "zk cairo rollup" most likely hit which rule and language?',
        options: [
          'defi-general → Solidity',
          'zk-rollup → Cairo (toolchain_group=zk, suggested_lab=edu.hot.zk-modular)',
          'solana-tps → Rust (Anchor)',
          'payment-teal → TEAL',
        ],
        answerIndex: 1,
        explanation:
          'The zk-rollup rule keywords include zk, rollup, cairo, starknet; the hit recommends Cairo and the ZK modular Rollup Lab.',
      },
      {
        question: 'What is the main purpose of 7-group toolchain isolation?',
        options: [
          'Share one solc binary across all Labs to save disk',
          'Separate image and Namespace per language so Jobs never clash and supply chain stays safe',
          'Force every contract to be written in Solidity',
          'Auto-switch language on mainnet deploy',
        ],
        answerIndex: 1,
        explanation:
          'multi-language-toolchains defines separate build-images, ns-* and NetworkPolicy; cross-Namespace compiler access is blocked.',
      },
    ],
  },

  'edu.hot.zk-modular': {
    objectives: [
      'Understand the four-step ZK modular Rollup pipeline: collect → prove → submit → anchor',
      'Explain how batch_size affects demo metrics such as mock_batch_root and tx_count',
      'Apply the boundary between a teaching mock verifier and a production proof system',
    ],
    quiz: [
      {
        question: 'What is the correct order of the ZK Modular Rollup pipeline?',
        options: [
          'Build → Sign → Bundle → Validate → Execute',
          'collect → prove → submit → anchor',
          'draft → vote → tally → record',
          'inbound → transfer → outbound',
        ],
        answerIndex: 1,
        explanation:
          'This Lab demonstrates an L2 pipeline: batch collection, mock proof generation, batch submission and L1 anchoring.',
      },
      {
        question: 'What does verifier=mock-sepolia in audit_hints mean?',
        options: [
          'A live mainnet prover cluster is connected',
          'A teaching-grade mock verifier is used, not a production proof system',
          'An OFAC list hit occurred',
          'The session key has expired',
        ],
        answerIndex: 1,
        explanation:
          'The verifier field identifies the verifier used; mock-sepolia marks a teaching placeholder so learners see the flow without real ZK proofs.',
      },
    ],
  },

  'edu.hot.zk-circuit': {
    objectives: [
      'Understand ZK circuit compilation: Cairo circuits compiled via scarb into Sierra / IR',
      'Explain how circuit_name serves as the compile target for HOT_ZK_CIRCUIT_COMPILE',
      'Apply the idea that "a circuit is a program and its compiled artifact is the provable object"',
    ],
    quiz: [
      {
        question: 'Which contract language does the ZK Circuit Lab recommend?',
        options: ['Solidity', 'Rust', 'Cairo', 'Move'],
        answerIndex: 2,
        explanation:
          'ZK circuit scenarios should recommend cairo; developers write circuits in Cairo, scarb compiles to Sierra, then a prover generates a STARK proof.',
      },
      {
        question: 'What is the taskType for this Lab?',
        options: [
          'HOT_ZK_ROLLUP_SIM',
          'HOT_ZK_CIRCUIT_COMPILE',
          'HOT_AA_WALLET_SIM',
          'CN_FOOD_TRACE_SIM',
        ],
        answerIndex: 1,
        explanation:
          'The frontend calls simulate with circuit_name and taskType HOT_ZK_CIRCUIT_COMPILE, focusing on circuit compilation rather than Rollup batch simulation.',
      },
    ],
  },

  'edu.hot.aa-wallet': {
    objectives: [
      'Understand the ERC-4337 UserOperation five-step flow: Build → Sign → Bundle → Validate → Execute',
      'Explain how owner, call_data and aa_flow_step drive the flow simulation',
      'Apply the roles of the EntryPoint contract and Bundler in smart-contract wallets',
    ],
    quiz: [
      {
        question: 'What is the role of the EntryPoint contract in the AA Wallet Lab?',
        options: [
          'Store food-batch Merkle roots',
          'The unified ERC-4337 entry that validates UserOperations',
          'Run OFAC sanctions list matching',
          'Compute Zakat payment rates',
        ],
        answerIndex: 1,
        explanation:
          'EntryPoint is the core 4337 contract that validates UserOps; this Lab runs the whole flow against a mock EntryPoint.',
      },
      {
        question: 'What is aa_flow_completed used for?',
        options: [
          'A list of completed steps that drives flow-diagram highlighting',
          'A flag for whether the hash chain is intact',
          'The highest Builder bid',
          'The disclosure_level setting',
        ],
        answerIndex: 0,
        explanation:
          'The rule-engine emits aa_flow_completed as a comma-separated list of finished steps; the frontend highlights Build/Sign/Bundle/Validate/Execute progress.',
      },
    ],
  },

  'edu.hot.aa-session': {
    objectives: [
      'Understand session keys as restricted, temporary keys on top of AA wallets',
      'Explain how session_ttl_hours defines the time boundary of permissions',
      'Apply the contrast between full Owner permissions and bounded session-key scope and expiry',
    ],
    quiz: [
      {
        question: 'What is the main benefit of a session key?',
        options: [
          'Unlimited, permanent delegation of all main-wallet assets',
          'Co-signing within bounded time and actions without prompting the main wallet each time',
          'Bypassing the EntryPoint to submit directly on-chain',
          'Replacing Merkle trees for batch verification',
        ],
        answerIndex: 1,
        explanation:
          'Session keys carry a TTL and permission scope; on-chain games and DeFi automation use them for UX while limiting risk; expired keys should refuse execute.',
      },
      {
        question: 'Which template does this Lab recommend?',
        options: [
          'MevPbsAuction.sol',
          'SessionKeyDemo.sol',
          'DepinNode.rs',
          'food_trace.go',
        ],
        answerIndex: 1,
        explanation:
          'taskType is HOT_AA_SESSION_KEY_DEMO; it recommends the SessionKeyDemo.sol template in solidity to demonstrate the TTL concept.',
      },
    ],
  },

  'edu.hot.dao': {
    objectives: [
      'Understand how proposals, vote tallying and quorum interact in DAO governance',
      'Explain how yes_votes, no_votes and turnout_pct affect proposal_status',
      'Apply the four-step governance flow: draft → vote → tally → record',
    ],
    quiz: [
      {
        question: 'What does quorum mean in the DAO voting Lab?',
        options: [
          'The highest single Builder bid',
          'The minimum participation threshold for a proposal to be valid',
          'The number of Merkle tree leaves',
          'Session-key TTL in hours',
        ],
        answerIndex: 1,
        explanation:
          'Quorum is the governance participation threshold; accumulated yes/no votes combine with quorum and turnout to decide passed/rejected/active status.',
      },
      {
        question: 'What is the compliance boundary of this DAO Lab?',
        options: [
          'It may connect to mainnet governance tokens to control real protocols',
          'It simulates tallying at the teaching layer only and does not connect to real governance tokens',
          'It may integrate with real OA approval systems',
          'It may issue security-type RWA tokens',
        ],
        answerIndex: 1,
        explanation:
          'The DAO experiment uses fictional proposals and voters for testnet governance teaching; mainnet real governance and token fundraising are forbidden.',
      },
    ],
  },

  'edu.hot.mev': {
    objectives: [
      'Understand PBS: builders bid competitively and the proposer picks the highest-bid block',
      'Explain how winning_builder and winning_bid_gwei reflect PBS auction results',
      'Apply the distinction between PBS algorithm teaching and forbidden front-running / sandwich bots',
    ],
    quiz: [
      {
        question: 'How does the proposer select the winning builder in the PBS Lab?',
        options: [
          'Random lottery',
          'The builder with the highest bid',
          'The earliest registered node',
          'Whoever matches the OFAC list',
        ],
        answerIndex: 1,
        explanation:
          'In PBS, builders bid for a block slot and the proposer picks the highest bid, corresponding to selectWinningBuilder.',
      },
      {
        question: 'What compliance boundary does arbitrage_bot=forbidden reflect?',
        options: [
          'Flashbots Relay may not be used in production',
          'Mainnet MEV arbitrage bots and mempool front-running / sandwich manipulation are forbidden',
          'PBS may not be demonstrated on testnet',
          'Builders may not participate in bidding',
        ],
        answerIndex: 1,
        explanation:
          'This Lab teaches the PBS auction narrative and clearly separates it from forbidden front-running / sandwich arbitrage; arbitrage_bot is marked forbidden.',
      },
    ],
  },

  'edu.hot.did': {
    objectives: [
      'Understand selective disclosure in DID and the minimal-disclosure principle of Verifiable Credentials',
      'Explain how disclosure_level (email/minimal/none) affects proof_valid',
      'Apply the difference between revealed_field and withheld_hash',
    ],
    quiz: [
      {
        question: 'When disclosure_level=none, proof_valid should be?',
        options: ['true', 'false', 'depends on batch_size', 'depends on quorum'],
        answerIndex: 1,
        explanation:
          'With no claim disclosed, a valid disclosure proof cannot be formed; the rule-engine returns proof_valid=false; only necessary fields are revealed on demand.',
      },
      {
        question: 'What is the purpose of withheld_hash?',
        options: [
          'Disclose all PII in plaintext',
          'Store a hash of withheld fields, proving possession without leaking plaintext',
          'Record the L1 anchor block number',
          'Store Builder bid ordering',
        ],
        answerIndex: 1,
        explanation:
          'In selective disclosure, allowed fields appear as revealed_field plaintext; the rest stay withheld as withheld_hash, embodying minimal disclosure.',
      },
    ],
  },

  'edu.hot.depin': {
    objectives: [
      'Understand how DePIN projects use an on-chain registry to coordinate physical infrastructure nodes',
      'Explain how node_count relates to the Solana Anchor node-registration narrative',
      'Apply the boundary: fictional registration simulation only, no real incentives or token economics',
    ],
    quiz: [
      {
        question: 'Which contract language does the DePIN Node Lab recommend?',
        options: ['Solidity', 'Cairo', 'Rust', 'Move'],
        answerIndex: 2,
        explanation:
          'Solana/DePIN scenarios recommend rust with the DepinNode.rs template; an optional anchor toolchain gate validates the sandbox environment.',
      },
      {
        question: 'Which item is forbidden by this Lab\'s compliance rules?',
        options: [
          'Testnet node-registration simulation',
          'Real DePIN incentives / token economics and mainnet device mining',
          'Fictional node_count demos',
          'rustc / anchor version checks',
        ],
        answerIndex: 1,
        explanation:
          'Testnet fictional node_count simulation and toolchain gates are allowed; real DePIN incentives, token economics and mainnet device mining are forbidden.',
      },
    ],
  },

  'edu.hot.rwa-edu': {
    objectives: [
      'Understand RWA on-chain mapping: the correspondence between off-chain assets and on-chain records',
      'Explain how asset_id serves as a fictional identifier in the mapping demo',
      'Apply the boundary between teaching mapping and real asset issuance / security tokens',
    ],
    quiz: [
      {
        question: 'What is the nature of asset_id in the RWA Edu Lab?',
        options: [
          'A real listed-company stock ticker',
          'A fictional asset identifier used as the on-chain mapping placeholder key',
          'An OFAC SDN list entity id',
          'A real voter national ID',
        ],
        answerIndex: 1,
        explanation:
          'Users enter a fictional asset_id such as DEMO-RWA-001 to demonstrate the mapping concept without real asset issuance or fundraising.',
      },
      {
        question: 'Which real-world framework is conceptually closest to this Lab?',
        options: [
          'Compliant RWA tokenization such as ERC-3643 (T-REX)',
          'MEV-Boost Relay',
          'Hyperledger Fabric food traceability',
          'Election tally_hash consensus',
        ],
        answerIndex: 0,
        explanation:
          'ERC-3643, Centrifuge, Ondo and similar frameworks map off-chain assets to restricted tokens after compliance checks; this Lab only demonstrates the mapping idea.',
      },
    ],
  },

  'edu.hot.ai-agent': {
    objectives: [
      'Understand permission boundaries for on-chain AI agents and max_actions guardrail design',
      'Explain how max_actions caps the number of on-chain operations an agent may perform',
      'Apply the boundary between teaching sandbox narrative and autonomous-trading / front-running agents',
    ],
    quiz: [
      {
        question: 'What does max_actions mean in the AI Agent Sandbox Lab?',
        options: [
          'Number of transactions in a Rollup batch',
          'Maximum actions the agent may perform — the core permission guardrail',
          'The M in M-of-N multisig',
          'Charity ledger entry_count',
        ],
        answerIndex: 1,
        explanation:
          'max_actions limits how many operations an automated agent may perform on-chain, combined with allow-lists and spending limits to prevent runaway behavior.',
      },
      {
        question: 'What is explicitly forbidden in this Lab?',
        options: [
          'Fictional agent strategies and permission-model teaching',
          'Autonomous trading / front-running agents and real LLM keys on-chain',
          'Sepolia testnet template demos',
          'Using the AgentSandbox.sol template',
        ],
        answerIndex: 1,
        explanation:
          'Permission-model sandbox teaching is allowed; connecting to mainnet RPC, deploying autonomous trading / front-running agents or putting real LLM keys on-chain is forbidden.',
      },
    ],
  },

  'edu.cn.trace.food': {
    objectives: [
      'Understand on-chain attestation for food supply-chain stages (harvest → cold chain → retail) and Merkle aggregation',
      'Explain how batch_id serves as the trace index key and Merkle leaf identifier',
      'Apply Merkle root verification to prove the whole chain is untampered',
    ],
    quiz: [
      {
        question: 'Which Fabric channel does the food traceability Lab run on?',
        options: [
          'mainnet',
          'edu-cn-trace-sandbox',
          'Sepolia L1',
          'ns-domain-global in-memory only',
        ],
        answerIndex: 1,
        explanation:
          'The lab runs on the Hyperledger Fabric teaching sandbox fabric-local / edu-cn-trace-sandbox channel with fully fictional data.',
      },
      {
        question: 'What role does the Merkle root play in food traceability?',
        options: [
          'Replace SHA-256 for cryptographic signing',
          'Aggregate all stage leaf hashes into one root; verifying the root proves the chain is untampered',
          'Record the highest Builder bid',
          'Store the Zakat nisab threshold',
        ],
        answerIndex: 1,
        explanation:
          'Each stage produces a content hash as a leaf; all leaves form a Merkle tree; verifying the root proves the supply chain record is intact and trustworthy.',
      },
    ],
  },

  'edu.cn.trace.medical': {
    objectives: [
      'Understand medical tamper-evidence: only SHA-256 digests on-chain; compare submitted_hash vs stored_hash',
      'Explain tamper_detected as the core tamper-detection flag',
      'Apply the distinction between legitimate version hash chains and anomalous tamper alerts',
    ],
    quiz: [
      {
        question: 'When is tamper_detected true?',
        options: [
          'submitted_hash matches the on-chain stored_hash',
          'submitted_hash differs from the on-chain stored_hash',
          'entry_count exceeds 10',
          'consensus is false',
        ],
        answerIndex: 1,
        explanation:
          'The frontend submits submitted_hash for comparison against the on-chain baseline; a mismatch triggers tamper_detected=true in audit_hints.',
      },
      {
        question: 'What is the compliance boundary of this Lab?',
        options: [
          'It may connect to real EMR/HIS and claim MLPS Level-3 certification',
          'It demonstrates medical-record hashing data structures only and does not connect to real EMR/HIS',
          'It may put real patient PII on-chain',
          'It may connect to WeChat Pay',
        ],
        answerIndex: 1,
        explanation:
          'Medical-record hashing and MLPS concept teaching are allowed; connecting to real EMR/HIS, claiming certification or handling real citizen health data is forbidden.',
      },
    ],
  },

  'edu.cn.trace.charity': {
    objectives: [
      'Understand charity ledger attestation: each donation hash aggregates into a campaign Merkle root',
      'Explain public fields (amount, time, donor alias) vs private fields (hash-only on-chain)',
      'Apply the boundary: no integration with real payment rails such as WeChat Pay or Alipay',
    ],
    quiz: [
      {
        question: 'What does ledger_hash represent in the charity ledger Lab?',
        options: [
          'A single donation private key',
          'The campaign ledger Merkle root attesting the entries as a whole',
          'Builder block slot index',
          'Session-key TTL',
        ],
        answerIndex: 1,
        explanation:
          'Multiple donations under the same campaign_id each produce a content hash aggregated into ledger_hash (Merkle root) so the public can verify totals.',
      },
      {
        question: 'Which content is forbidden to put on-chain in this Lab?',
        options: [
          'Fictional donor aliases',
          'Real donor phone numbers and other PII',
          'Public amount and time fields',
          'campaign_id identifiers',
        ],
        answerIndex: 1,
        explanation:
          'Fictional aliases and public/private field-policy teaching are allowed; official donation payment rails and real donor PII on-chain are forbidden.',
      },
    ],
  },

  'edu.cn.gov.bid-graph': {
    objectives: [
      'Understand bid-rigging graphs: connected components and shared-attribute clustering to detect collusion',
      'Explain suspicion_score and risk_level as teaching-only suspicion outputs',
      'Apply recognition of dense subgraphs from shared legal reps and addresses as collusion signals',
    ],
    quiz: [
      {
        question: 'What is a typical collusion signal on the relationship graph?',
        options: [
          'Nodes completely isolated with no edges',
          'Multiple firms sharing the same legal rep, address or account — a suspiciously dense subgraph',
          'All nodes have suspicion_score 0',
          'The Merkle root changes frequently',
        ],
        answerIndex: 1,
        explanation:
          'Bidders that should be independent but share legal reps, contacts or accounts appear as dense clusters; the algorithm accumulates suspicion_score from shared attributes.',
      },
      {
        question: 'What is the approximate suspicion_score on the sample dataset?',
        options: ['0', '25', '75', '100 (fixed)'],
        answerIndex: 2,
        explanation:
          'On fixtures/sample-graph.json the shared-attribute cluster strength accumulates to a teaching suspicion_score of about 75, mapped to risk_level.',
      },
    ],
  },

  'edu.cn.gov.multisig': {
    objectives: [
      'Understand M-of-N multisig: at least threshold approver signatures are required to approve a proposal',
      'Explain how comparing confirmations count to threshold decides approved status',
      'Apply confirm vs execute separation as the "no single person acts alone" internal-control principle',
    ],
    quiz: [
      {
        question: 'When is approved=true?',
        options: [
          'confirmations count < threshold',
          'confirmations count ≥ threshold',
          'Any single signature suffices',
          'Quorum not met but yes votes win',
        ],
        answerIndex: 1,
        explanation:
          'The scheduler compares collected confirmations against threshold; reaching the M-of-N threshold emits approved=true, otherwise the proposal stays pending.',
      },
      {
        question: 'Which network environment does this Lab run on?',
        options: [
          'Ethereum mainnet with real funds',
          'Sepolia testnet (11155111) contract template',
          'Fabric edu-cn-trace-sandbox',
          'Bitcoin mainnet',
        ],
        answerIndex: 1,
        explanation:
          'Multisig approval runs on a Sepolia testnet template with fictional proposals and approver addresses; mainnet deployment and real funds are forbidden.',
      },
    ],
  },

  'edu.cn.gov.supply': {
    objectives: [
      'Understand hash-chain attestation for inbound/transfer/outbound events via prev_hash linking',
      'Explain how simulate_break demonstrates link-3 prev_hash mismatch and chain_intact=false',
      'Apply inbound/transfer/outbound accumulation to inventory balance (sample data balance=85)',
    ],
    quiz: [
      {
        question: 'What happens when simulate_break=true?',
        options: [
          'The Merkle root stays unchanged',
          'Link 3 prev_hash check fails and chain_intact=false',
          'It automatically connects to a real WMS system',
          'consensus is forced to true',
        ],
        answerIndex: 1,
        explanation:
          'simulate_break artificially introduces a hash-chain break; link 3 prev_hash mismatches, emitting chain_intact=false and highlighting the break point.',
      },
      {
        question: 'What is the accumulated inventory balance on the sample ledger?',
        options: ['100', '85', '0', '200'],
        answerIndex: 1,
        explanation:
          'Accumulated from inbound(+)/transfer(0)/outbound(-): 100 → 100 → 85, final balance=85, verifying quantity reconciliation.',
      },
    ],
  },

  'edu.global.sandbox.regulatory': {
    objectives: [
      'Understand sanctions screening: entity name matched against a local fictional OFAC-style list → ofac_match',
      'Explain MiCA-style demo rule keys (whitepaper-missing, etc.) and mica_match hit logic',
      'Apply the boundary: rule-matching teaching only, no live regulatory API calls',
    ],
    quiz: [
      {
        question: 'How is ofac_match produced?',
        options: [
          'By calling the live U.S. Treasury OFAC API',
          'By comparing entity_name against the static fixtures/ofac-sample.json list',
          'By computing from batch_size',
          'By the highest Builder bid',
        ],
        answerIndex: 1,
        explanation:
          'The rule-engine matches entity_name against a local fictional OFAC-style list; hits flag ofac_match for review with no real API calls.',
      },
      {
        question: 'Which is NOT a valid mica_pattern demo rule key?',
        options: [
          'whitepaper-missing',
          'asset-referenced',
          'unlicensed-custodian',
          'mainnet-fund-bridge',
        ],
        answerIndex: 3,
        explanation:
          'MiCA demo rules from fixtures/mica-rules-sample.yaml include missing whitepaper, referenced asset and unlicensed custodian; mainnet bridge is not a demo rule key.',
      },
    ],
  },

  'edu.global.sandbox.election': {
    objectives: [
      'Understand multi-party tally nodes submitting tally_hash and consensus via hash equality',
      'Explain how "Demo Mismatch" tampering one node hash leads to consensus=false',
      'Apply the idea of hash comparison for verification, not a real voting system',
    ],
    quiz: [
      {
        question: 'When is consensus=true?',
        options: [
          'At least one node submits a hash',
          'All nodes\' tally_hash values are identical',
          'node_count is odd',
          'ofac_match is false',
        ],
        answerIndex: 1,
        explanation:
          'The rule-engine checks whether every node\'s tally_hash is equal; if so, consensus flags agreement; otherwise consensus fails.',
      },
      {
        question: 'What is explicitly forbidden in this Lab?',
        options: [
          'Fictional nodes and hash samples',
          'Integrating with real election systems or handling voter PII',
          'Running in the fabric-local sandbox',
          'Clicking "Verify Consensus"',
        ],
        answerIndex: 1,
        explanation:
          'Fictional jurisdictions and nodes are allowed; integrating real election/voting systems, handling voter PII or publishing output as real tally results is forbidden.',
      },
    ],
  },

  'edu.global.sandbox.logistics': {
    objectives: [
      'Understand hash-chain ledgers: each row links to the previous hash; tampering any row breaks subsequent checks',
      'Explain chain_valid and expected_tail_hash comparison to judge ledger integrity',
      'Apply the boundary between data-structure teaching and real classified logistics systems',
    ],
    quiz: [
      {
        question: 'After inserting a DEMO-TAMPER bad row, chain_valid should be?',
        options: ['true', 'false', 'depends on entry_count', 'depends on rule_type'],
        answerIndex: 1,
        explanation:
          '"Add Bad Row" appends a tampered record, breaking sequential hash links; the rule-engine recomputes and chain_valid becomes false.',
      },
      {
        question: 'Which fields does each logistics ledger record contain?',
        options: [
          'batch_id and product_name',
          'account, amount, memo',
          'owner and call_data',
          'did_method and requested_claim',
        ],
        answerIndex: 1,
        explanation:
          'entries are { account, amount, memo } demo rows built into a hash chain in order; optional expected_tail_hash verifies tampering.',
      },
    ],
  },

  'edu.global.sandbox.welfare': {
    objectives: [
      'Understand the Merkle root as an integrity commitment over a batch of aid claims',
      'Explain duplicate_detected for repeated claim_id (double-claim / double-spend)',
      'Apply the "Inject Duplicate" mechanism to demonstrate anti-fraud algorithms',
    ],
    quiz: [
      {
        question: 'What does duplicate_detected=true indicate?',
        options: [
          'Merkle tree construction failed',
          'A repeated claim_id was found — repeat-claim risk',
          'All claim amounts are zero',
          'An OFAC list hit',
        ],
        answerIndex: 1,
        explanation:
          'The engine scans for repeated claim_id values; checking "Inject Duplicate" appends a record with the same claim_id, triggering duplicate_detected.',
      },
      {
        question: 'What does a change in merkle_root mean?',
        options: [
          'Only a UI theme switch',
          'Any change to a claim entry changes the Merkle root, reflecting the integrity commitment',
          'Consensus is automatically reached',
          'The threshold is automatically lowered',
        ],
        answerIndex: 1,
        explanation:
          'merkle_root is computed over the whole { claim_id, amount, region } batch; any add/remove/edit changes the root, preventing silent tampering.',
      },
    ],
  },

  'edu.global.sandbox.religion': {
    objectives: [
      'Understand static evaluation of Zakat and Waqf rule expressions',
      'Explain rule_type and amount as inputs to the rule engine',
      'Apply the boundary: expression teaching only, not real religious fund settlement or fiqh rulings',
    ],
    quiz: [
      {
        question: 'What are the valid rule_type values?',
        options: [
          'solidity / cairo',
          'zakat / waqf',
          'email / minimal / none',
          'inbound / outbound',
        ],
        answerIndex: 1,
        explanation:
          'The frontend selects zakat or waqf; the engine reads the matching static rule expression from fixtures/zakat-rules-sample.yaml.',
      },
      {
        question: 'Which use is explicitly forbidden in this Lab?',
        options: [
          'Static YAML rule expression evaluation teaching',
          'Real religious fund clearing, Halal product certification or using output as a fiqh ruling',
          'Entering a demo amount value',
          'Echoing rule and amount in audit_hints',
        ],
        answerIndex: 1,
        explanation:
          'Faith-related financial rule expression teaching is allowed; real clearing/settlement, product certification endorsement or acting as religious authority is forbidden.',
      },
    ],
  },
}

export default objectivesQuiz

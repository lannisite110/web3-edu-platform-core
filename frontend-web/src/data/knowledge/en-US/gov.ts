import type { KnowledgeMap } from '../types'

const gov: KnowledgeMap = {
  'edu.cn.gov.bid-graph': {
    concept:
      'The bid-rigging relationship graph models suppliers, legal representatives and contact details as a graph, then uses connected components and shared-attribute clustering to surface bidders that should be independent but are secretly linked. Collusion typically shows up as multiple firms sharing the same legal rep, address or bank account — a suspiciously dense subgraph. This Lab demonstrates the algorithm on fictional data and emits a teaching-only suspicion_score and risk_level.',
    howItWorks: [
      'The frontend POSTs the graph id (graph=sample) and scenario to /api/v1/labs/edu.cn.gov.bid-graph/simulate.',
      'The rule-engine first runs a compliance evaluate, allowing the request only after confirming chain id fabric-local and fictional params.',
      'The scheduler dispatches a Job with taskType=CN_BID_GRAPH_SIM and computes connected components plus shared-rep clusters over the supplier graph.',
      'The algorithm accumulates suspicion from the count and strength of shared attributes, producing suspicion_score, risk_level, nodes and edges audit_hints.',
      'The frontend renders the graph in SVG (orange nodes = shared legal rep "Zhang"), and shows the verdict in the score bar and findings list.',
    ],
    params: [
      { name: 'graph', desc: 'Graph dataset id, fixed to sample here, backed by fixtures/sample-graph.json (a fictional supplier graph).' },
      { name: 'scenario', desc: 'Scenario id (sample) used to distinguish teaching cases; it does not alter business logic at the mock stage.' },
    ],
    evalFields: [
      { name: 'suspicion_score', desc: 'Teaching-only suspicion score (0-100) accumulated from shared-attribute cluster strength; ~75 on the sample data.' },
      { name: 'risk_level', desc: 'Risk tier (low/medium/high) derived from suspicion_score, driving the score-bar color.' },
      { name: 'nodes', desc: 'Number of supplier nodes included in the analysis.' },
      { name: 'edges', desc: 'Number of relationship edges between nodes, reflecting graph density.' },
    ],
    compliance: {
      allowed: ['Fictional supplier graph data', 'Teaching relationship analysis and scoring', 'fabric-local sandbox pipeline'],
      forbidden: ['Connecting to real procurement systems', 'Military / classified / combat wording', 'Using the teaching score as a real procurement or audit decision'],
    },
    realWorld:
      'Maps to real procurement fraud and bid-rigging detection: audit, compliance and inspection teams use entity relationship graphs (shared legal reps, addresses, IPs, corporate accounts) to flag bidders that look independent but are linked, then route them to manual review.',
    furtherReading: [
      { label: 'Connected component (graph theory) — Wikipedia', url: 'https://en.wikipedia.org/wiki/Component_(graph_theory)' },
      { label: 'Neo4j graph database for fraud detection', url: 'https://neo4j.com/use-cases/fraud-detection/' },
    ],
  },
  'edu.cn.gov.multisig': {
    concept:
      'The multisig approval Lab demonstrates an M-of-N permission model: a proposal must collect at least "threshold" approver signatures before moving from pending to approved, and it separates confirm from execute. This is the on-chain expression of the internal-control principle that "no single person can act alone", as used in corporate fund disbursement and government approval workflows. The Lab runs on a Sepolia testnet template, letting you toggle signers and watch the threshold being met.',
    howItWorks: [
      'The frontend collects proposal_id, proposal_title, threshold and the checked confirmations address array.',
      'On submit it POSTs to the simulate endpoint; the rule-engine validates compliance such as chainId being Sepolia (11155111).',
      'The scheduler dispatches a Job with taskType=CN_MULTISIG_APPROVAL_DEMO and compares the confirmation count against the threshold.',
      'When confirmations reach threshold it emits approved=true; otherwise approved=false and the proposal stays pending.',
      'The frontend reflects the approved and confirmations hints in real time via a progress bar and a three-step indicator (sign → reach threshold → approved).',
    ],
    params: [
      { name: 'proposal_id', desc: 'Unique proposal identifier, default PROPOSAL-DEMO-001.' },
      { name: 'proposal_title', desc: 'Proposal title (e.g. "teaching budget disbursement"), display-only.' },
      { name: 'threshold', desc: 'The M in M-of-N: the minimum number of signers required (1-3 in this Lab).' },
      { name: 'confirmations', desc: 'Array of approver addresses that have confirmed; its length is compared with threshold to decide approval.' },
    ],
    evalFields: [
      { name: 'approved', desc: 'Boolean flag for whether the threshold was met; true when confirmations count ≥ threshold.' },
      { name: 'confirmations', desc: 'Number of confirmation signatures collected so far.' },
      { name: 'proposal_id', desc: 'Echoed proposal id, to verify which proposal the evaluation refers to.' },
      { name: 'threshold', desc: 'Echoed threshold, to verify the approval condition.' },
    ],
    compliance: {
      allowed: ['Fictional proposals and approver addresses', 'Sepolia testnet contract template', 'Teaching threshold-approval demo'],
      forbidden: ['Mainnet deployment or real funds', 'Connecting to real OA / government approval systems', 'Using real people or organizations as signers'],
    },
    realWorld:
      'Maps to multisig wallet approval flows common in corporate finance and DAO treasuries (e.g. Gnosis Safe): large payments require several authorized signers, with confirm and execute separated, mechanically preventing single-person misappropriation and enforcing separation of duties.',
    furtherReading: [
      { label: 'Safe (Gnosis Safe) documentation', url: 'https://docs.safe.global/' },
      { label: 'Separation of duties — Wikipedia', url: 'https://en.wikipedia.org/wiki/Separation_of_duties' },
    ],
  },
  'edu.cn.gov.supply': {
    concept:
      'Supply-chain attestation records every inbound/transfer/outbound event with a previous-hash field, linking them into a hash chain so that tampering with any link breaks the prev_hash check of all following records. Combined with payload hashing and an inventory balance curve, it verifies both "data was not altered" and "quantities reconcile". This Lab demonstrates an intact chain and a deliberately broken chain on a Hyperledger Fabric sandbox channel.',
    howItWorks: [
      'The frontend submits ledger, asset_id and the simulate_break flag to the simulate endpoint.',
      'The rule-engine validates chain id fabric-local and fictional sandbox data before allowing the request.',
      'The scheduler dispatches a Job with taskType=CN_SUPPLY_CHAIN_DEMO and recomputes each event\'s previous hash and payload hash.',
      'It accumulates inventory balance from inbound(+)/transfer(0)/outbound(-) events (sample data: 100 → 100 → 85, balance=85).',
      'If simulate_break=true, the prev_hash check fails at link 3, emitting chain_intact=false and highlighting the break point in the hash-chain view.',
    ],
    params: [
      { name: 'ledger', desc: 'Ledger dataset id, fixed to sample, backed by fixtures/sample-ledger.json.' },
      { name: 'asset_id', desc: 'The traced material id, default MAT-2024-DEMO-001.' },
      { name: 'simulate_break', desc: 'Toggle to artificially introduce a hash-chain break; when set, link 3 prev_hash mismatches to demonstrate tamper detection.' },
    ],
    evalFields: [
      { name: 'chain_intact', desc: 'Boolean flag for whether the hash chain is intact; false if any prev_hash mismatches.' },
      { name: 'balance', desc: 'Current inventory balance accumulated from the in/out events (85 on the sample data).' },
      { name: 'event_count', desc: 'Total number of in/out events checked.' },
      { name: 'merkle_root', desc: 'Merkle root aggregating all events, used for overall attestation comparison.' },
    ],
    compliance: {
      allowed: ['Fictional in/out ledger data', 'Fabric sandbox channel edu-cn-gov-sandbox', 'Teaching hash-chain and tamper-detection demo'],
      forbidden: ['Connecting to real WMS/ERP production systems', 'Using domestic-stack claims as a real assurance verdict', 'Using real materials or production data'],
    },
    realWorld:
      'Maps to supply-chain traceability and asset attestation: blockchain/hash chains pin in/out, transfer and inspection events so auditors can verify records were not tampered with after the fact and inventory reconciles — widely used for pharmaceuticals, food, hazardous chemicals and critical materials.',
    furtherReading: [
      { label: 'Hyperledger Fabric documentation', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: 'Hash chain — Wikipedia', url: 'https://en.wikipedia.org/wiki/Hash_chain' },
    ],
  },
}

export default gov

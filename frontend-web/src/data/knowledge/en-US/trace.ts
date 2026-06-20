import type { KnowledgeMap } from '../types'

const trace: KnowledgeMap = {
  'edu.cn.trace.food': {
    concept:
      'The food-batch traceability lab shows how every stage of a supply chain (harvest → cold chain → retail) becomes a tamper-evident on-chain record. Each stage produces a content hash that acts as a Merkle leaf; all leaves aggregate into one Merkle tree with a single root hash. Verifying that root hash proves the whole chain is untampered without comparing every raw record. The lab runs on a Hyperledger Fabric teaching sandbox (fabric-local / edu-cn-trace-sandbox channel) with fully fictional data.',
    howItWorks: [
      'The frontend POSTs batch_id and product_name to /api/v1/labs/edu.cn.trace.food/simulate (taskType=CN_FOOD_TRACE_SIM).',
      'The rule-engine first evaluates the params for compliance, blocks mainnet params, and writes back audit_hints (e.g. batch_id, channel, org).',
      'The teaching chaincode food_trace.go maintains BatchRecord and MerkleProof structs, computing a Merkle root from each stage hash as a leaf.',
      'The UI renders harvest/cold-chain/retail stages as a timeline with their leaf hashes, plus the Merkle root and proof path.',
      'The scheduler dispatches a Fabric sandbox Job (validating peer and chaincode path); once completed it returns a JSON report.',
    ],
    params: [
      { name: 'batch_id', desc: 'Food batch identifier, default DEMO-BATCH-001; the index key for trace records and Merkle leaves.' },
      { name: 'product_name', desc: 'Product name (e.g. "organic vegetable gift box"), submitted with simulate for the teaching display.' },
    ],
    evalFields: [
      { name: 'batch_id', desc: 'Batch id echoed back in audit hints; should match the submitted param to confirm the pipeline works.' },
      { name: 'channel', desc: 'Fabric channel, fixed to the edu-cn-trace-sandbox teaching sandbox.' },
      { name: 'org', desc: 'Organization node id that submits the record; OrgEduDemo in the sandbox.' },
    ],
    compliance: {
      allowed: ['Fully fictional farm/cold-chain/store data', 'Fabric sandbox fabric-local channel demo'],
      forbidden: ['Connecting to real regulators or payment systems', 'target_network=mainnet deployment'],
    },
    realWorld:
      'Maps to real food supply-chain traceability — origin, processing, logistics and retail are all recorded on-chain, so a consumer can scan a code and verify the source and shipping path are intact and trustworthy.',
    furtherReading: [
      { label: 'Hyperledger Fabric documentation', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: 'Merkle tree (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
    ],
  },
  'edu.cn.trace.medical': {
    concept:
      'The medical tamper-evidence lab shows how a content hash provides tamper-proof evidence for a medical record. Only the SHA-256 digest of a record snapshot is stored on-chain; verification compares the "submitted hash" against the "on-chain hash" — a match means the content is unchanged, a mismatch raises a tamper_detected alert. Successive versions are chained by their hashes over time, distinguishing legitimate updates from anomalous tampering. The lab demonstrates only the data structure and does not connect to any real EMR/HIS.',
    howItWorks: [
      'The frontend submits record_id and submitted_hash to simulate (taskType=CN_MEDICAL_TAMPER_DEMO).',
      'The frontend first compares submitted_hash against storedHash locally to decide whether the UI shows "hash match" or "hash mismatch".',
      'The rule-engine evaluate writes back audit_hints, where tamper_detected flags whether tampering was detected.',
      'The UI renders the version hash chain (v1 → v2 → current), each version carrying a hash, action and timestamp.',
      'Changing the hash-to-verify to any other value triggers tamper_detected=true, demonstrating the tamper-detection alert.',
    ],
    params: [
      { name: 'record_id', desc: 'Medical record identifier, default DEMO-RECORD-001; the index key for attestation and verification.' },
      { name: 'submitted_hash', desc: 'The content hash to verify; if it differs from the on-chain stored_hash it is judged as tampered.' },
    ],
    evalFields: [
      { name: 'tamper_detected', desc: 'Boolean; true when the submitted hash differs from the on-chain hash. The core detection result.' },
      { name: 'record_id', desc: 'Record id echoed in audit hints, used to confirm which record was verified.' },
      { name: 'stored_hash', desc: 'The baseline on-chain hash (sha256:demo-medical-hash-abc123); the reference value for the comparison.' },
    ],
    compliance: {
      allowed: ['Medical-record hashing data-structure demo', 'MLPS (等保) concept teaching reference'],
      forbidden: ['Connecting to a real EMR/HIS system', 'Claiming MLPS Level-3 (等保三级) certification'],
    },
    realWorld:
      'Maps to tamper-evidence for electronic medical records (EMR) — a hospital anchors a record digest on-chain, and any party can later compare hashes to prove the record was not secretly altered, giving trustworthy evidence for disputes and audits.',
    furtherReading: [
      { label: 'Hyperledger Fabric documentation', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: 'SHA-2 (Wikipedia)', url: 'https://en.wikipedia.org/wiki/SHA-2' },
    ],
  },
  'edu.cn.trace.charity': {
    concept:
      'The charity-ledger lab shows how donations can be made transparent and auditable: each fictional donation produces its own content hash, and all entries under the same campaign_id aggregate into the campaign ledger\'s Merkle root hash. The ledger keeps a per-entry audit trail in a double-entry-style fashion and separates public fields (amount, time, donor alias) from private fields (only their hash goes on-chain). The lab connects to no real payment rails such as WeChat Pay or Alipay and uses fully fictional data.',
    howItWorks: [
      'The frontend submits campaign_id, entry_count and ledger_hash to simulate (taskType=CN_CHARITY_LEDGER_DEMO).',
      'The rule-engine evaluate blocks prompts about real payment integration and writes back audit_hints like campaign_id, entry_count and channel.',
      'The teaching chaincode charity_ledger.go produces a content hash per donation and aggregates them into the ledger root hash.',
      'The UI renders a donation-entry table plus a field-policy table contrasting public / private / forbidden fields and how each is recorded on-chain.',
      'Once the task is completed it returns a JSON report; the ledger total is summed from the individual entries.',
    ],
    params: [
      { name: 'campaign_id', desc: 'Campaign identifier, default DEMO-CAMPAIGN-001; aggregates all entries under that campaign.' },
      { name: 'entry_count', desc: 'Number of donation entries in this submission; feeds into the ledger root hash computation.' },
      { name: 'ledger_hash', desc: 'The campaign ledger Merkle root hash (ledger-merkle-root-demo-9b2c), attesting the entries as a whole.' },
    ],
    evalFields: [
      { name: 'campaign_id', desc: 'Campaign id echoed in audit hints, used to confirm ledger ownership.' },
      { name: 'entry_count', desc: 'Echoed entry count; should match the submitted value (e.g. 2).' },
      { name: 'channel', desc: 'Fabric channel identifier; edu-cn-trace-sandbox in the sandbox.' },
    ],
    compliance: {
      allowed: ['Fictional donor aliases with no real PII', 'Public/private field-policy teaching demo'],
      forbidden: ['Integrating official donation rails like WeChat Pay / Alipay', 'Putting real donor PII such as phone numbers on-chain'],
    },
    realWorld:
      'Maps to transparent ledgers for charity — a fundraising organization anchors each donation entry hash on-chain and publishes the aggregate, so the public can independently verify the total and use of funds while donor private fields are kept as hashes only.',
    furtherReading: [
      { label: 'Hyperledger Fabric documentation', url: 'https://hyperledger-fabric.readthedocs.io/' },
      { label: 'Merkle tree (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
    ],
  },
}

export default trace

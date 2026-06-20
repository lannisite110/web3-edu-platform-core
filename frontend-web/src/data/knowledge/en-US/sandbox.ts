import type { KnowledgeMap } from '../types'

const sandbox: KnowledgeMap = {
  'edu.global.sandbox.regulatory': {
    concept:
      'The Regulatory Rule Sandbox demonstrates the minimal matching logic behind "sanctions screening / crypto-asset compliance rules": it compares an entity name against a local, static, fictional OFAC-style list and checks MiCA-style demo rule keys (e.g. missing whitepaper, referenced asset, unlicensed custodian). It teaches rule matching and hit-flagging, not real legal or compliance conclusions. Everything runs off local JSON/YAML fixtures with no live regulatory API calls.',
    howItWorks: [
      'The frontend submits entity_name and an optional mica_pattern to /api/v1/labs/edu.global.sandbox.regulatory/simulate.',
      'The rule-engine matches the entity name against the fictional entries in fixtures/ofac-sample.json, yielding ofac_match.',
      'If a mica_pattern was chosen, it is checked against the demo rule keys in fixtures/mica-rules-sample.yaml, yielding mica_match.',
      'The results are written to evaluation.audit_hints, and the frontend lists each hit flag such as ofac_match / mica_match.',
    ],
    params: [
      { name: 'entity_name', desc: 'The entity name string to screen, compared against the fictional OFAC-style list (fixtures/ofac-sample.json).' },
      { name: 'mica_pattern', desc: 'Optional MiCA-style demo rule key (whitepaper-missing / asset-referenced / unlicensed-custodian) from fixtures/mica-rules-sample.yaml; empty means skip that check.' },
    ],
    evalFields: [
      { name: 'ofac_match', desc: 'Whether the entity name hit the static sanctions-list sample; a hit is flagged as "needs review" in the classroom demo.' },
      { name: 'mica_match', desc: 'Whether the selected MiCA demo rule fired, used to explain crypto-asset compliance rule hits.' },
    ],
    compliance: {
      allowed: ['Local static JSON/YAML fixtures only', 'Fictional entities and fictional jurisdictions', 'Classroom rule-matching teaching demo'],
      forbidden: ['Calling real OFAC / KYC production APIs', 'Stablecoin payments, cross-border remittance, or RWA issuance', 'Using output as real legal or compliance advice'],
    },
    realWorld:
      'Maps to sanctions screening and crypto-asset pre-checks at financial institutions: real systems connect to authoritative sources like the OFAC SDN list and EU MiCA to name-match customers and counterparties and validate rules — this demo only replicates the matching skeleton.',
    furtherReading: [
      { label: 'OFAC Sanctions Programs (U.S. Treasury)', url: 'https://ofac.treasury.gov/' },
      { label: 'EU MiCA Regulation (ESMA)', url: 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica' },
    ],
  },
  'edu.global.sandbox.election': {
    concept:
      'The Election Hash Consensus demo shows how several fictional tally nodes each submit a result hash (tally_hash) and how a classroom sandbox checks whether those hashes agree to declare consensus. It teaches the idea of "using hash comparison to verify that multiple parties produced the same result", not a real voting or tallying system. All nodes and hashes are fictional samples.',
    howItWorks: [
      'The frontend builds a batch of nodes { node_id, tally_hash }, defaulting to fixtures/election-nodes-sample.json.',
      'Clicking "Verify Consensus" makes every node submit the same hash; clicking "Demo Mismatch" deliberately makes one node submit a tampered hash.',
      'The request is posted to the simulate endpoint, where the rule-engine compares whether every node\'s tally_hash is equal.',
      'Results are written to audit_hints: node_count records the node count and consensus flags whether they agree.',
      'The frontend shows "consensus reached / failed" based on consensus and lists each hint.',
    ],
    params: [
      { name: 'nodes', desc: 'Optional list of tally nodes { node_id, tally_hash }; defaults to fixtures/election-nodes-sample.json.' },
    ],
    evalFields: [
      { name: 'node_count', desc: 'Number of tally nodes compared, indicating the sample size of the consensus check.' },
      { name: 'consensus', desc: 'Boolean flag: whether all nodes\' tally_hash values are identical; identical means consensus reached.' },
    ],
    compliance: {
      allowed: ['Fictional city / jurisdiction only', 'Fictional nodes and hash samples', 'Runs in the ns-domain-global / fabric-local sandbox'],
      forbidden: ['Integrating with a real election or voting system', 'Handling voter PII (personally identifiable information)', 'Publishing output as real tally results'],
    },
    realWorld:
      'Maps to election integrity and multi-party result reconciliation: in production, several independent tally parties hash the same result and publicly compare it, and any mismatch flags a need for manual review or recount — this demo replicates that hash-consistency check.',
    furtherReading: [
      { label: 'Cryptographic Hash Function (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Cryptographic_hash_function' },
      { label: 'CISA — Election Security', url: 'https://www.cisa.gov/topics/election-security' },
    ],
  },
  'edu.global.sandbox.logistics': {
    concept:
      'The Logistics Audit Ledger demo builds a "hash chain" over a batch of fictional supply records: each record\'s hash is linked to the previous one, so tampering with any single row breaks all subsequent hashes and exposes the change. It is a data-structure teaching lab (a tamper-evident / hash-linked ledger), not any real or classified logistics system.',
    howItWorks: [
      'The frontend prepares a batch of { account, amount, memo } demo records as ledger rows.',
      'Clicking "Verify Chain" submits a clean ledger; clicking "Add Bad Row" appends a DEMO-TAMPER tampered record.',
      'The rule-engine hashes each row in order and links it to the previous one, producing a tail hash.',
      'An optional expected_tail_hash is compared against the recomputed tail hash to decide whether the ledger was altered.',
      'Results are written to audit_hints: entry_count records the number of rows and chain_valid flags whether the hash chain is intact.',
    ],
    params: [
      { name: 'entries', desc: 'Optional list of ledger records { account, amount, memo } used to build the hash chain.' },
      { name: 'expected_tail_hash', desc: 'Optional expected tail hash used to verify tampering; compared against the recomputed chain tail.' },
    ],
    evalFields: [
      { name: 'entry_count', desc: 'Number of ledger rows included in the hash chain.' },
      { name: 'chain_valid', desc: 'Boolean flag: whether the hash chain is intact and consistent; inserting or altering any row turns it false.' },
    ],
    compliance: {
      allowed: ['Fictional account codes and memos only', 'Teaching hash chains / tamper-evident ledgers as a data structure', 'Runs in the ns-domain-global / fabric-local sandbox'],
      forbidden: ['Handling real defense data or equipment parameters', 'Integrating with any classified or restricted system', 'Using output as a real supply-chain audit conclusion'],
    },
    realWorld:
      'Maps to tamper-evident ledgers in supply-chain / logistics auditing: real systems use hash chains or blockchains to record material movements so that any after-the-fact change is detectable, preserving the integrity of the audit trail — this demo replicates the core hash-chain verification.',
    furtherReading: [
      { label: 'Hash Chain (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Hash_chain' },
      { label: 'Merkle Tree (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
    ],
  },
  'edu.global.sandbox.welfare': {
    concept:
      'The Welfare Anti-Fraud demo builds a Merkle tree and computes a Merkle root over a batch of fictional aid claims, while detecting duplicate claim_id values (repeat claims / double-spend). It teaches the algorithmic idea of "committing to a batch of data with a Merkle root and using it to spot duplicate entries", all over fictional beneficiary data.',
    howItWorks: [
      'The frontend prepares a batch of { claim_id, amount, region } claims; an "Inject Duplicate" checkbox appends a record with a repeated claim_id.',
      'The request submits claims and verify_claim_id to the simulate endpoint.',
      'The rule-engine builds a Merkle tree over all claims and computes merkle_root as an integrity commitment.',
      'The engine scans for repeated claim_id values, producing the duplicate_detected flag.',
      'Results are written to audit_hints, and the frontend shows the Merkle root plus "duplicate detected / not detected".',
    ],
    params: [
      { name: 'claims', desc: 'Optional list of claims { claim_id, amount, region }; defaults to fixtures/welfare-claims-sample.json.' },
      { name: 'verify_claim_id', desc: 'Optional claim ID to verify membership in the Merkle tree (membership proof).' },
    ],
    evalFields: [
      { name: 'merkle_root', desc: 'The Merkle root computed over the whole claim batch, serving as a data-integrity commitment; any change to an entry changes it.' },
      { name: 'duplicate_detected', desc: 'Boolean flag: whether a repeated claim_id was found, used to prevent repeat claims (double-spend).' },
    ],
    compliance: {
      allowed: ['Fictional beneficiary IDs only', 'Teaching Merkle roots and anti double-claim algorithms', 'Runs in the fabric-local sandbox'],
      forbidden: ['Integrating with real refugee / NGO data', 'Connecting to United Nations or NGO production APIs', 'Using output as a real aid-eligibility or anti-fraud decision'],
    },
    realWorld:
      'Maps to welfare fraud detection in social-aid disbursement: real systems use unique identifiers and deduplication checks to stop the same beneficiary from claiming twice, and cryptographic commitments like Merkle roots to ensure the claim set cannot be silently altered — this demo replicates both.',
    furtherReading: [
      { label: 'Merkle Tree & Merkle Proofs (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Merkle_tree' },
      { label: 'Double-spending (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Double-spending' },
    ],
  },
  'edu.global.sandbox.religion': {
    concept:
      'The Religion Rule Sandbox evaluates static Zakat and Waqf rule expressions: given a rule type and a demo amount, it computes a result from local fixed-sample rules (e.g. whether a threshold is met, the applicable rate). It teaches the idea of "encoding faith-related financial rules as evaluable expressions", and does not perform real religious fund settlement or product certification.',
    howItWorks: [
      'The frontend selects rule_type (zakat or waqf) and enters an amount as a demo value.',
      'The request is posted to /api/v1/labs/edu.global.sandbox.religion/simulate.',
      'The rule-engine reads the matching static rule expression from fixtures/zakat-rules-sample.yaml.',
      'The engine evaluates the expression over the amount and writes the rule key and amount into audit_hints.',
      'The frontend echoes hints such as rule and amount, showing the rule-evaluation result.',
    ],
    params: [
      { name: 'rule_type', desc: 'Rule type: zakat or waqf, selecting which set of static rule expressions to use.' },
      { name: 'amount', desc: 'A numeric demo amount (non-negative, step 100) used as input to rule evaluation.' },
    ],
    evalFields: [
      { name: 'rule', desc: 'The rule key / type identifier used for this evaluation, indicating which rule set was hit.' },
      { name: 'amount', desc: 'Echoes the demo amount evaluated, so input and result can be cross-checked.' },
    ],
    compliance: {
      allowed: ['Static YAML rules in fixtures/zakat-rules-sample.yaml only', 'Teaching expression evaluation of faith-related financial rules', 'Educational simulation only'],
      forbidden: ['Performing real religious fund clearing / settlement', 'Halal product certification or compliance endorsement', 'Using output as a fiqh ruling or religious authority opinion'],
    },
    realWorld:
      'Maps to rule engines in faith-based finance: real systems encode the Zakat threshold (nisab), applicable rates, and Waqf endowment terms as configurable rules computed automatically — this demo replicates the minimal form of rule-expression evaluation.',
    furtherReading: [
      { label: 'Zakat (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Zakat' },
      { label: 'Waqf (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Waqf' },
    ],
  },
}

export default sandbox

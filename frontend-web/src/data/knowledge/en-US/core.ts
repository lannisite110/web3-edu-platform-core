import type { KnowledgeMap } from '../types'

const core: KnowledgeMap = {
  'edu.hot.mock': {
    concept:
      'The bootstrap Mock Lab is the smallest runnable sample of the whole platform path. It does not teach a specific business case; it verifies the end-to-end pipeline: frontend → gateway → rule-engine evaluate → scheduler Job → report. Run it first as a smoke test after deploying the platform.',
    howItWorks: [
      'The frontend POSTs to /api/v1/labs/edu.hot.mock/simulate with user_prompt, params and allowed_chain_ids.',
      'The gateway first asks the rule-engine to evaluate the params for compliance (e.g. block mainnet params); only on pass does it continue.',
      'The scheduler dispatches a minimal Job by taskType, then writes back task status and a report.',
      'The frontend polls task status and renders the JSON report once completed.',
    ],
    params: [
      { name: 'scenario', desc: 'Placeholder scenario id; mock does no real business logic, it only exercises the pipeline.' },
      { name: 'allowed_chain_ids', desc: 'Allow-list of chain IDs; here the Sepolia testnet (11155111).' },
    ],
    evalFields: [
      { name: 'compliance_passed', desc: 'Whether compliance passed; should always be true for the mock case.' },
      { name: 'mode', desc: 'Evaluation mode flag, distinguishing evaluate-only from full execution.' },
    ],
    compliance: {
      allowed: ['Testnet pipeline smoke test', 'Fictional placeholder params'],
      forbidden: ['Mainnet params', 'Real funds / contract calls'],
    },
    realWorld:
      'Maps to a real-world health check / smoke test — after release you fire one minimal request to confirm the whole service chain works before letting real traffic in.',
    furtherReading: [
      { label: 'LabWeave platform overview (docs/LABWEAVE.md)', url: 'https://github.com/lannisite110/web3-edu-platform-core/blob/main/docs/LABWEAVE.md' },
    ],
  },
}

export default core

import type { LabKnowledge } from '../types'
import core from './core'
import hot from './hot'
import trace from './trace'
import gov from './gov'
import sandbox from './sandbox'
import objectivesQuiz from './objectives-quiz'
import { mergeKnowledge } from '../merge'

const base = { ...core, ...hot, ...trace, ...gov, ...sandbox }

const knowledge: Record<string, LabKnowledge> = mergeKnowledge(base, objectivesQuiz)

export default knowledge

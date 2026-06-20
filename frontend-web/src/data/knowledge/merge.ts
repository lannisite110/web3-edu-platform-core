import type { KnowledgeMap, LabKnowledge, ObjectivesQuizMap } from './types'

export function mergeKnowledge(
  base: KnowledgeMap,
  extras: ObjectivesQuizMap,
): Record<string, LabKnowledge> {
  const out: Record<string, LabKnowledge> = {}
  for (const [id, entry] of Object.entries(base)) {
    const extra = extras[id]
    out[id] = {
      ...entry,
      objectives: extra?.objectives ?? [],
      quiz: extra?.quiz ?? [],
    }
  }
  return out
}

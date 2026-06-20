export interface KnowledgeLink {
  label: string
  url: string
}

export interface KnowledgeEntry {
  name: string
  desc: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  /** Zero-based index of the correct option. */
  answerIndex: number
  explanation: string
}

/** Core teaching content (objectives/quiz merged separately). */
export interface LabKnowledgeBase {
  concept: string
  howItWorks: string[]
  params: KnowledgeEntry[]
  evalFields: KnowledgeEntry[]
  compliance: {
    allowed: string[]
    forbidden: string[]
  }
  realWorld: string
  furtherReading: KnowledgeLink[]
}

/** Full teaching content including objectives and quiz. */
export interface LabKnowledge extends LabKnowledgeBase {
  objectives: string[]
  quiz: QuizQuestion[]
}

export type KnowledgeMap = Record<string, LabKnowledgeBase>

export type ObjectivesQuizMap = Record<
  string,
  Pick<LabKnowledge, 'objectives' | 'quiz'>
>

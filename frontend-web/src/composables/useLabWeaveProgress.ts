import { computed, ref } from 'vue'

const STORAGE_KEY = 'labweave-progress-v1'
const QUIZ_STORAGE_KEY = 'labweave-quiz-v1'

function loadSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function loadQuizSet(): Set<string> {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveSet(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

function saveQuizSet(set: Set<string>) {
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify([...set]))
}

const completed = ref<Set<string>>(loadSet())
const quizPassed = ref<Set<string>>(loadQuizSet())

export function useLabWeaveProgress() {
  const completedIds = computed(() => completed.value)
  const quizPassedIds = computed(() => quizPassed.value)

  function isCompleted(pluginId: string) {
    return completed.value.has(pluginId)
  }

  function isQuizPassed(pluginId: string) {
    return quizPassed.value.has(pluginId)
  }

  function toggleComplete(pluginId: string) {
    const next = new Set(completed.value)
    if (next.has(pluginId)) next.delete(pluginId)
    else next.add(pluginId)
    completed.value = next
    saveSet(next)
  }

  function recordQuizScore(pluginId: string, score: number, total: number) {
    if (score < total) return
    const next = new Set(quizPassed.value)
    next.add(pluginId)
    quizPassed.value = next
    saveQuizSet(next)
    if (!completed.value.has(pluginId)) toggleComplete(pluginId)
  }

  function trackProgress(pluginIds: string[]) {
    const done = pluginIds.filter((id) => completed.value.has(id)).length
    return { done, total: pluginIds.length, pct: pluginIds.length ? Math.round((done / pluginIds.length) * 100) : 0 }
  }

  function trackQuizProgress(pluginIds: string[]) {
    const done = pluginIds.filter((id) => quizPassed.value.has(id)).length
    return { done, total: pluginIds.length, pct: pluginIds.length ? Math.round((done / pluginIds.length) * 100) : 0 }
  }

  function resetAll() {
    completed.value = new Set()
    quizPassed.value = new Set()
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(QUIZ_STORAGE_KEY)
  }

  return {
    completedIds,
    quizPassedIds,
    isCompleted,
    isQuizPassed,
    toggleComplete,
    recordQuizScore,
    trackProgress,
    trackQuizProgress,
    resetAll,
  }
}

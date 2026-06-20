import { computed, ref } from 'vue'

const STORAGE_KEY = 'labweave-progress-v1'

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

function saveSet(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

const completed = ref<Set<string>>(loadSet())

export function useLabWeaveProgress() {
  const completedIds = computed(() => completed.value)

  function isCompleted(pluginId: string) {
    return completed.value.has(pluginId)
  }

  function toggleComplete(pluginId: string) {
    const next = new Set(completed.value)
    if (next.has(pluginId)) next.delete(pluginId)
    else next.add(pluginId)
    completed.value = next
    saveSet(next)
  }

  function trackProgress(pluginIds: string[]) {
    const done = pluginIds.filter((id) => completed.value.has(id)).length
    return { done, total: pluginIds.length, pct: pluginIds.length ? Math.round((done / pluginIds.length) * 100) : 0 }
  }

  function resetAll() {
    completed.value = new Set()
    localStorage.removeItem(STORAGE_KEY)
  }

  return { completedIds, isCompleted, toggleComplete, trackProgress, resetAll }
}

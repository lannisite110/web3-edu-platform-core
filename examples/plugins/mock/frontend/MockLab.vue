<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const error = ref('')
const result = ref<Record<string, unknown> | null>(null)

const PLUGIN_ID = 'edu.hot.mock'

async function runSimulate() {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const res = await fetch(`/api/v1/labs/${PLUGIN_ID}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_prompt: 'E2E mock lab smoke',
        params: { scenario: 'mock' },
        allowed_chain_ids: [11155111],
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || res.statusText)
    result.value = data
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="card">
    <h2>Mock Lab (E2E)</h2>
    <p>主库内置 smoke 插件面板 — 测试网 only。</p>
    <button :disabled="loading" @click="runSimulate">
      {{ loading ? 'Running…' : 'Run simulate' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
    <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
  </section>
</template>

<style scoped>
.card { padding: 1rem; }
.error { color: #c00; }
button { margin-top: 0.5rem; }
pre { margin-top: 1rem; font-size: 0.85rem; overflow: auto; }
</style>

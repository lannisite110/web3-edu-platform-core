<script setup lang="ts">
import { ref } from 'vue'
import { useLabI18n } from '@/composables/useLabI18n'

const PLUGIN_ID = 'edu.hot.mock'
const { t } = useLabI18n(PLUGIN_ID)

const loading = ref(false)
const error = ref('')
const result = ref<Record<string, unknown> | null>(null)

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
    <h2>{{ t('title') }}</h2>
    <p>{{ t('desc') }}</p>
    <button :disabled="loading" @click="runSimulate">
      {{ loading ? t('running') : t('run') }}
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { PluginManifestRef } from '@/plugins/types'

const route = useRoute()
const plugin = computed(() => route.meta.plugin as PluginManifestRef)
const prompt = ref('通用 DeFi 教学合约')
const loading = ref(false)
const result = ref<Record<string, unknown> | null>(null)
const error = ref('')

async function runSimulate() {
  if (!plugin.value) return
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const res = await fetch(`/api/v1/labs/${plugin.value.id}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_prompt: prompt.value,
        params: { scenario: prompt.value },
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
  <section v-if="plugin" class="card">
    <h1>{{ plugin.name }}</h1>
    <p class="muted">{{ plugin.id }} · {{ plugin.repo }}</p>
    <div class="tags">
      <span v-for="t in plugin.taskTypes" :key="t" class="tag">{{ t }}</span>
    </div>
    <label class="field">
      实验描述
      <textarea v-model="prompt" rows="3" />
    </label>
    <button class="primary" :disabled="loading" @click="runSimulate">
      {{ loading ? '运行中…' : '提交仿真实验' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
    <pre v-if="result" class="result">{{ JSON.stringify(result, null, 2) }}</pre>
  </section>
</template>

import { ref } from 'vue'

export interface AssistMessage {
  role: 'user' | 'assistant'
  text: string
  compliancePassed?: boolean
  mode?: string
}

export interface AssistResult {
  answer: string
  compliance_passed: boolean
  rejection_reason?: string | null
  mode: string
  evaluation?: Record<string, unknown>
}

export function useLabAssist(
  pluginId: string,
  defaultChainIds: (number | string)[] = ['fabric-local'],
) {
  const loading = ref(false)
  const error = ref('')
  const messages = ref<AssistMessage[]>([])

  async function ask(
    message: string,
    params: Record<string, unknown> = {},
    auditHints: string[] = [],
  ) {
    const text = message.trim()
    if (!text) return

    messages.value.push({ role: 'user', text })
    loading.value = true
    error.value = ''

    try {
      const res = await fetch(`/api/v1/labs/${pluginId}/assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_prompt: text,
          params,
          allowed_chain_ids: defaultChainIds,
          audit_hints: auditHints,
        }),
      })
      const data = (await res.json()) as AssistResult & { error?: string; detail?: string }
      if (!res.ok) {
        throw new Error(data.error || data.detail || res.statusText)
      }
      messages.value.push({
        role: 'assistant',
        text: data.answer,
        compliancePassed: data.compliance_passed,
        mode: data.mode,
      })
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      messages.value.push({
        role: 'assistant',
        text: `助教暂时不可用：${error.value}`,
        compliancePassed: false,
      })
    } finally {
      loading.value = false
    }
  }

  function clear() {
    messages.value = []
    error.value = ''
  }

  return { loading, error, messages, ask, clear }
}

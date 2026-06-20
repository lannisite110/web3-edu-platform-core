<script setup lang="ts">
import { ref } from 'vue'
import ComplianceBadge from '@/components/ComplianceBadge.vue'
import { useLabAssist } from '@/composables/useLabAssist'

const props = withDefaults(
  defineProps<{
    pluginId: string
    params?: Record<string, unknown>
    allowedChainIds?: (number | string)[]
    auditHints?: string[]
  }>(),
  {
    params: () => ({}),
    allowedChainIds: () => ['fabric-local'],
    auditHints: () => [],
  },
)

const open = ref(false)
const input = ref('')
const { loading, messages, ask, clear } = useLabAssist(props.pluginId, props.allowedChainIds)

function toggle() {
  open.value = !open.value
}

function submit() {
  if (!input.value.trim() || loading.value) return
  const q = input.value
  input.value = ''
  ask(q, props.params, props.auditHints)
}
</script>

<template>
  <div class="assist-wrap">
    <button type="button" class="assist-fab" @click="toggle">
      {{ open ? '收起助教' : '沙箱助教' }}
    </button>

    <aside v-if="open" class="assist-drawer">
      <header class="assist-head">
        <div>
          <h2>沙箱助教</h2>
          <p class="muted">L2 · 先 evaluate 再回答 · {{ pluginId }}</p>
        </div>
        <ComplianceBadge :passed="null" compact />
      </header>

      <div class="assist-messages">
        <p v-if="!messages.length" class="muted assist-empty">
          可问本 Lab 的规则 hints、参数含义与合规边界。尝试问「batch_id 影响什么？」或输入 mainnet 看拦截。
        </p>
        <div
          v-for="(m, i) in messages"
          :key="i"
          class="assist-msg"
          :class="m.role === 'user' ? 'assist-msg--user' : 'assist-msg--bot'"
        >
          <ComplianceBadge
            v-if="m.role === 'assistant' && m.compliancePassed != null"
            :passed="m.compliancePassed"
            compact
          />
          <pre class="assist-text">{{ m.text }}</pre>
          <span v-if="m.mode" class="assist-mode">{{ m.mode }}</span>
        </div>
      </div>

      <footer class="assist-foot">
        <textarea
          v-model="input"
          rows="2"
          placeholder="向沙箱助教提问…"
          @keydown.enter.exact.prevent="submit"
        />
        <div class="assist-actions">
          <button type="button" class="link-btn" @click="clear">清空</button>
          <button type="button" class="primary" :disabled="loading" @click="submit">
            {{ loading ? '思考中…' : '发送' }}
          </button>
        </div>
      </footer>
    </aside>
  </div>
</template>

<style scoped>
.assist-wrap {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.assist-fab {
  background: #1a3a5c;
  color: #fff;
  border: 1px solid #2563eb;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
}
.assist-drawer {
  width: min(380px, calc(100vw - 32px));
  max-height: min(70vh, 520px);
  background: #151b23;
  border: 1px solid #243044;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
}
.assist-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid #243044;
}
.assist-head h2 {
  margin: 0;
  font-size: 15px;
}
.muted {
  color: #8b9cb3;
  font-size: 12px;
  margin: 4px 0 0;
}
.assist-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
}
.assist-empty {
  font-size: 12px;
  line-height: 1.5;
}
.assist-msg {
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
}
.assist-msg--user {
  background: #1a3a5c;
  margin-left: 24px;
}
.assist-msg--bot {
  background: #1e2733;
  margin-right: 12px;
}
.assist-text {
  white-space: pre-wrap;
  font-family: inherit;
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.45;
}
.assist-mode {
  font-size: 10px;
  color: #6b7c93;
}
.assist-foot {
  padding: 10px 14px 12px;
  border-top: 1px solid #243044;
}
.assist-foot textarea {
  width: 100%;
  background: #0f1419;
  border: 1px solid #243044;
  color: inherit;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  resize: vertical;
}
.assist-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
}
.link-btn {
  background: none;
  border: none;
  color: #8b9cb3;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
}
.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
}
.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

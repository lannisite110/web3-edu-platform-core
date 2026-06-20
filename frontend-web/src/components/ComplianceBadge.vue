<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  passed?: boolean | null
  compact?: boolean
  label?: string
}>()

const { t } = useI18n()
</script>

<template>
  <span
    class="compliance-badge"
    :class="{
      'compliance-badge--pass': passed === true,
      'compliance-badge--fail': passed === false,
      'compliance-badge--pending': passed == null,
      'compliance-badge--compact': compact,
    }"
    :title="label || t('compliance.statusTitle')"
  >
    <template v-if="passed === true">{{ t('compliance.pass') }}</template>
    <template v-else-if="passed === false">{{ t('compliance.fail') }}</template>
    <template v-else>{{ t('compliance.pending') }}</template>
  </span>
</template>

<style scoped>
.compliance-badge {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
}
.compliance-badge--compact {
  font-size: 11px;
  padding: 2px 8px;
}
.compliance-badge--pass {
  background: #0d2818;
  border-color: #166534;
  color: #86efac;
}
.compliance-badge--fail {
  background: #2a1215;
  border-color: #7f1d1d;
  color: #fca5a5;
}
.compliance-badge--pending {
  background: #1e2733;
  border-color: #243044;
  color: #9ec5ff;
}
</style>

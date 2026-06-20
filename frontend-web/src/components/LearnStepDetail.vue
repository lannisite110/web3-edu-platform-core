<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LabQuiz from '@/components/LabQuiz.vue'
import { useLabKnowledge } from '@/composables/useLabKnowledge'

const props = defineProps<{ pluginId: string }>()
const { t } = useI18n()
const knowledge = useLabKnowledge(props.pluginId)
</script>

<template>
  <div v-if="knowledge" class="step-detail">
    <div v-if="knowledge.objectives?.length" class="detail-section">
      <h4>{{ t('knowledge.objectives') }}</h4>
      <ul>
        <li v-for="(o, i) in knowledge.objectives" :key="i">{{ o }}</li>
      </ul>
    </div>
    <div v-if="knowledge.quiz?.length" class="detail-section">
      <h4>{{ t('knowledge.quiz') }}</h4>
      <LabQuiz :key="pluginId" :plugin-id="pluginId" :questions="knowledge.quiz" compact />
    </div>
  </div>
</template>

<style scoped>
.step-detail {
  padding: 0 0 12px 28px;
  border-left: 2px solid #243044;
  margin-left: 8px;
}
.detail-section { margin-bottom: 12px; }
.detail-section h4 {
  margin: 0 0 6px;
  font-size: 12px;
  color: #9ec5ff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.detail-section ul {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 13px;
  color: #c5d0de;
  line-height: 1.55;
}
</style>

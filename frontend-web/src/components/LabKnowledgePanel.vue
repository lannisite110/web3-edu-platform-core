<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLabKnowledge } from '@/composables/useLabKnowledge'
import LabQuiz from '@/components/LabQuiz.vue'

const props = defineProps<{ pluginId: string }>()
const { t } = useI18n()
const knowledge = useLabKnowledge(props.pluginId)
</script>

<template>
  <details v-if="knowledge" class="knowledge" open>
    <summary class="k-summary">
      <span class="k-badge">{{ t('knowledge.title') }}</span>
      <span class="k-hint">{{ t('knowledge.subtitle') }}</span>
    </summary>

    <div class="k-body">
      <section v-if="knowledge.objectives?.length" class="k-section">
        <h3>{{ t('knowledge.objectives') }}</h3>
        <ul class="k-objectives">
          <li v-for="(obj, i) in knowledge.objectives" :key="i">{{ obj }}</li>
        </ul>
      </section>

      <section class="k-section">
        <h3>{{ t('knowledge.concept') }}</h3>
        <p>{{ knowledge.concept }}</p>
      </section>

      <section class="k-section">
        <h3>{{ t('knowledge.howItWorks') }}</h3>
        <ol class="k-steps">
          <li v-for="(step, i) in knowledge.howItWorks" :key="i">{{ step }}</li>
        </ol>
      </section>

      <div class="k-grid">
        <section v-if="knowledge.params.length" class="k-section">
          <h3>{{ t('knowledge.params') }}</h3>
          <dl class="k-dl">
            <template v-for="p in knowledge.params" :key="p.name">
              <dt>{{ p.name }}</dt>
              <dd>{{ p.desc }}</dd>
            </template>
          </dl>
        </section>

        <section v-if="knowledge.evalFields.length" class="k-section">
          <h3>{{ t('knowledge.evalFields') }}</h3>
          <dl class="k-dl">
            <template v-for="f in knowledge.evalFields" :key="f.name">
              <dt>{{ f.name }}</dt>
              <dd>{{ f.desc }}</dd>
            </template>
          </dl>
        </section>
      </div>

      <section class="k-section">
        <h3>{{ t('knowledge.realWorld') }}</h3>
        <p>{{ knowledge.realWorld }}</p>
      </section>

      <section class="k-section k-compliance">
        <h3>{{ t('knowledge.compliance') }}</h3>
        <div class="k-grid">
          <div class="k-allow">
            <span class="k-tag ok">{{ t('knowledge.allowed') }}</span>
            <ul>
              <li v-for="(a, i) in knowledge.compliance.allowed" :key="i">{{ a }}</li>
            </ul>
          </div>
          <div class="k-forbid">
            <span class="k-tag bad">{{ t('knowledge.forbidden') }}</span>
            <ul>
              <li v-for="(f, i) in knowledge.compliance.forbidden" :key="i">{{ f }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="knowledge.furtherReading.length" class="k-section">
        <h3>{{ t('knowledge.furtherReading') }}</h3>
        <ul class="k-links">
          <li v-for="link in knowledge.furtherReading" :key="link.url">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }} ↗</a>
          </li>
        </ul>
      </section>

      <section v-if="knowledge.quiz?.length" class="k-section k-quiz-section">
        <h3>{{ t('knowledge.quiz') }}</h3>
        <p class="k-quiz-hint">{{ t('knowledge.quizHint') }}</p>
        <LabQuiz :plugin-id="pluginId" :questions="knowledge.quiz" />
      </section>
    </div>
  </details>
</template>

<style scoped>
.knowledge {
  margin: 1.25rem 1rem 2rem;
  background: #0f1419;
  border: 1px solid #243044;
  border-radius: 12px;
  overflow: hidden;
}
.k-summary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
}
.k-summary::-webkit-details-marker { display: none; }
.k-badge {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
}
.k-hint { color: #8aa0b6; font-size: 0.8rem; }
.k-body {
  padding: 0.25rem 1.25rem 1.25rem;
  border-top: 1px solid #1c2735;
}
.k-section { margin-top: 1.1rem; }
.k-section h3 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #9ec5ff;
}
.k-section p { margin: 0; color: #c5d0de; line-height: 1.65; font-size: 0.9rem; }
.k-steps { margin: 0; padding-left: 1.25rem; color: #c5d0de; }
.k-steps li { margin-bottom: 0.4rem; line-height: 1.6; font-size: 0.9rem; }
.k-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}
.k-dl {
  margin: 0;
  display: grid;
  grid-template-columns: minmax(110px, max-content) 1fr;
  gap: 0.35rem 0.85rem;
}
.k-dl dt {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
  color: #6ee7b7;
}
.k-dl dd { margin: 0; color: #c5d0de; font-size: 0.85rem; line-height: 1.5; }
.k-compliance .k-tag {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  margin-bottom: 0.4rem;
}
.k-tag.ok { background: #0d2818; color: #6ee7b7; border: 1px solid #166534; }
.k-tag.bad { background: #2a1115; color: #fca5a5; border: 1px solid #7f1d1d; }
.k-allow ul, .k-forbid ul { margin: 0; padding-left: 1.1rem; }
.k-allow li, .k-forbid li { color: #c5d0de; font-size: 0.85rem; margin-bottom: 0.3rem; }
.k-links { margin: 0; padding-left: 1.1rem; }
.k-links li { margin-bottom: 0.35rem; }
.k-links a { color: #9ec5ff; font-size: 0.85rem; }
.k-objectives { margin: 0; padding-left: 1.25rem; color: #c5d0de; }
.k-objectives li { margin-bottom: 0.35rem; font-size: 0.9rem; line-height: 1.55; }
.k-quiz-section { border-top: 1px solid #1c2735; padding-top: 1rem; margin-top: 1.25rem; }
.k-quiz-hint { margin: 0 0 0.75rem; font-size: 0.8rem; color: #8aa0b6; }
</style>

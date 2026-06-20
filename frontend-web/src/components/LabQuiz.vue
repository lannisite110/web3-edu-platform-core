<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { QuizQuestion } from '@/data/knowledge/types'
import { useLabWeaveProgress } from '@/composables/useLabWeaveProgress'

const props = defineProps<{
  pluginId: string
  questions: QuizQuestion[]
  compact?: boolean
}>()

const { t } = useI18n()
const { isQuizPassed, recordQuizScore } = useLabWeaveProgress()

const picks = ref<Record<number, number | null>>({})
const submitted = ref(false)

const score = computed(() => {
  if (!submitted.value) return 0
  return props.questions.reduce((n, q, i) => (picks.value[i] === q.answerIndex ? n + 1 : n), 0)
})

const passed = computed(() => score.value === props.questions.length && props.questions.length > 0)
const alreadyPassed = computed(() => isQuizPassed(props.pluginId))

function pick(qi: number, oi: number) {
  if (submitted.value || alreadyPassed.value) return
  picks.value = { ...picks.value, [qi]: oi }
}

function submit() {
  if (props.questions.some((_, i) => picks.value[i] == null)) return
  submitted.value = true
  if (passed.value) recordQuizScore(props.pluginId, score.value, props.questions.length)
}

function reset() {
  picks.value = {}
  submitted.value = false
}
</script>

<template>
  <div class="quiz" :class="{ compact }">
    <div v-if="alreadyPassed && !submitted" class="quiz-banner pass">
      {{ t('quiz.alreadyPassed') }}
    </div>

    <div v-for="(q, qi) in questions" :key="qi" class="quiz-q">
      <p class="q-text">{{ qi + 1 }}. {{ q.question }}</p>
      <div class="q-options">
        <button
          v-for="(opt, oi) in q.options"
          :key="oi"
          type="button"
          class="q-opt"
          :class="{
            picked: picks[qi] === oi,
            correct: submitted && oi === q.answerIndex,
            wrong: submitted && picks[qi] === oi && oi !== q.answerIndex,
          }"
          @click="pick(qi, oi)"
        >
          {{ opt }}
        </button>
      </div>
      <p v-if="submitted && picks[qi] !== q.answerIndex" class="q-exp">{{ q.explanation }}</p>
    </div>

    <div class="quiz-actions">
      <button
        v-if="!submitted && !alreadyPassed"
        type="button"
        class="quiz-submit"
        :disabled="questions.some((_, i) => picks[i] == null)"
        @click="submit"
      >
        {{ t('quiz.submit') }}
      </button>
      <button v-if="submitted && !passed" type="button" class="quiz-retry" @click="reset">
        {{ t('quiz.retry') }}
      </button>
      <p v-if="submitted" class="quiz-score" :class="{ pass: passed }">
        {{ t('quiz.score', { score, total: questions.length }) }}
        <span v-if="passed"> · {{ t('quiz.passed') }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.quiz { margin-top: 0.5rem; }
.quiz.compact .q-text { font-size: 0.85rem; }
.quiz.compact .q-opt { font-size: 0.8rem; padding: 6px 10px; }
.quiz-banner {
  font-size: 0.85rem;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
}
.quiz-banner.pass {
  background: #0d2818;
  border: 1px solid #166534;
  color: #6ee7b7;
}
.quiz-q { margin-bottom: 1rem; }
.q-text { margin: 0 0 0.5rem; color: #c5d0de; font-size: 0.9rem; line-height: 1.5; }
.q-options { display: flex; flex-direction: column; gap: 6px; }
.q-opt {
  text-align: left;
  background: #151b23;
  border: 1px solid #243044;
  color: #c5d0de;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: border-color 0.15s, background 0.15s;
}
.q-opt:hover:not(:disabled) { border-color: #2563eb; background: #1a3a5c; }
.q-opt.picked { border-color: #2563eb; background: #1a3a5c; }
.q-opt.correct { border-color: #166534; background: #0d2818; color: #6ee7b7; }
.q-opt.wrong { border-color: #7f1d1d; background: #2a1115; color: #fca5a5; }
.q-exp {
  margin: 0.4rem 0 0;
  font-size: 0.8rem;
  color: #8aa0b6;
  line-height: 1.5;
}
.quiz-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 0.5rem; }
.quiz-submit {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
}
.quiz-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.quiz-retry {
  background: #1e2733;
  color: #9ec5ff;
  border: 1px solid #243044;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
}
.quiz-score { margin: 0; font-size: 0.85rem; color: #8aa0b6; }
.quiz-score.pass { color: #6ee7b7; }
</style>

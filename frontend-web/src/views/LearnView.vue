<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ComplianceBadge from '@/components/ComplianceBadge.vue'
import LearnStepDetail from '@/components/LearnStepDetail.vue'
import { useLabWeaveProgress } from '@/composables/useLabWeaveProgress'
import { useLocalizedPath } from '@/composables/useLocalizedPath'

const { t } = useI18n()
const router = useRouter()
const { isCompleted, isQuizPassed, toggleComplete, trackProgress, trackQuizProgress, resetAll } =
  useLabWeaveProgress()
const { prerequisite, tracks } = useLocalizedPath()

const expandedId = ref<string | null>(null)

const allPluginIds = computed(() => {
  const ids = prerequisite.value.steps.map((s) => s.pluginId)
  for (const tr of tracks.value) {
    for (const s of tr.steps) ids.push(s.pluginId)
  }
  return ids
})

const overall = computed(() => trackProgress(allPluginIds.value))
const quizOverall = computed(() => trackQuizProgress(allPluginIds.value))

function goLab(routePrefix: string) {
  router.push(routePrefix)
}

function toggleExpand(pluginId: string) {
  expandedId.value = expandedId.value === pluginId ? null : pluginId
}
</script>

<template>
  <div class="learn-page">
    <header class="learn-hero card learn-hero-wide">
      <div class="learn-hero-top">
        <div>
          <p class="learn-kicker">{{ t('learn.kicker') }}</p>
          <h1>{{ t('learn.title') }}</h1>
          <p class="muted">{{ t('learn.subtitle') }}</p>
        </div>
        <ComplianceBadge :passed="null" />
      </div>
      <div class="learn-overall">
        <div class="learn-overall-label">
          {{ t('common.overallProgress') }} {{ overall.done }} / {{ overall.total }}
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: overall.pct + '%' }" />
        </div>
        <div class="learn-overall-label">
          {{ t('quiz.overall') }} {{ quizOverall.done }} / {{ quizOverall.total }}
        </div>
        <div class="progress-bar">
          <div class="progress-fill quiz-fill" :style="{ width: quizOverall.pct + '%' }" />
        </div>
        <button type="button" class="link-btn" @click="resetAll">{{ t('common.resetProgress') }}</button>
      </div>
    </header>

    <section class="card learn-hero-wide">
      <h2>{{ prerequisite.title }} · {{ prerequisite.subtitle }}</h2>
      <p class="muted">
        {{ t('common.approx') }} {{ prerequisite.estimatedDays }} {{ t('common.days') }} ·
        {{ t('learn.prerequisiteHint') }}
      </p>
      <ul class="step-list">
        <li v-for="step in prerequisite.steps" :key="step.pluginId" class="step-block">
          <div class="step-row">
            <label class="step-check">
              <input
                type="checkbox"
                :checked="isCompleted(step.pluginId)"
                @change="toggleComplete(step.pluginId)"
              />
            </label>
            <div class="step-body">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-meta muted">
                {{ step.summary }} · ~{{ step.estimatedHours }}{{ t('common.hours') }}
                <span v-if="isQuizPassed(step.pluginId)" class="quiz-badge">✓ {{ t('quiz.passedShort') }}</span>
              </div>
              <code class="step-id">{{ step.pluginId }}</code>
            </div>
            <button type="button" class="ghost-btn" @click="toggleExpand(step.pluginId)">
              {{ expandedId === step.pluginId ? t('learn.collapse') : t('learn.expand') }}
            </button>
            <button type="button" class="secondary" @click="goLab(step.routePrefix)">
              {{ t('common.openLab') }}
            </button>
          </div>
          <LearnStepDetail v-if="expandedId === step.pluginId" :plugin-id="step.pluginId" />
        </li>
      </ul>
    </section>

    <div class="track-grid">
      <section v-for="track in tracks" :key="track.id" class="card track-card">
        <div class="track-head">
          <span class="track-id">{{ track.id }}</span>
          <h2>{{ track.title }}</h2>
          <p class="muted">
            {{ track.subtitle }} · {{ t('common.approx') }} {{ track.estimatedDays }} {{ t('common.days') }}
          </p>
        </div>
        <div class="track-progress">
          <span>{{ trackProgress(track.steps.map((s) => s.pluginId)).done }}/{{ track.steps.length }}</span>
          <div class="progress-bar progress-bar--sm">
            <div
              class="progress-fill"
              :style="{ width: trackProgress(track.steps.map((s) => s.pluginId)).pct + '%' }"
            />
          </div>
        </div>
        <ol class="step-list">
          <li v-for="step in track.steps" :key="step.pluginId" class="step-block">
            <div class="step-row">
              <label class="step-check">
                <input
                  type="checkbox"
                  :checked="isCompleted(step.pluginId)"
                  @change="toggleComplete(step.pluginId)"
                />
              </label>
              <div class="step-body">
                <div class="step-title">{{ step.order }}. {{ step.title }}</div>
                <div class="step-meta muted">
                  ~{{ step.estimatedHours }}{{ t('common.hours') }}
                  <span v-if="isQuizPassed(step.pluginId)" class="quiz-badge">✓ {{ t('quiz.passedShort') }}</span>
                </div>
              </div>
              <button type="button" class="ghost-btn" @click="toggleExpand(step.pluginId)">
                {{ expandedId === step.pluginId ? t('learn.collapse') : t('learn.expand') }}
              </button>
              <button type="button" class="secondary" @click="goLab(step.routePrefix)">
                {{ t('common.labs') }}
              </button>
            </div>
            <LearnStepDetail v-if="expandedId === step.pluginId" :plugin-id="step.pluginId" />
          </li>
        </ol>
      </section>
    </div>

    <footer class="learn-footer muted">{{ t('learn.footer') }}</footer>
  </div>
</template>

<style scoped>
.learn-page { max-width: 1100px; }
.learn-hero-wide { max-width: none; }
.learn-hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.learn-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ec5ff;
  margin: 0 0 4px;
}
.learn-overall {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.learn-overall-label { font-size: 13px; min-width: 140px; }
.progress-bar {
  flex: 1;
  min-width: 120px;
  height: 8px;
  background: #0f1419;
  border-radius: 999px;
  overflow: hidden;
}
.progress-bar--sm { height: 6px; min-width: 80px; flex: 1; }
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
  border-radius: 999px;
  transition: width 0.2s ease;
}
.quiz-fill { background: linear-gradient(90deg, #7c3aed, #a78bfa); }
.link-btn {
  background: none;
  border: none;
  color: #8b9cb3;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
}
.track-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.track-card { max-width: none; }
.track-head { margin-bottom: 12px; }
.track-id {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #9ec5ff;
  background: #1a3a5c;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}
.track-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 12px;
  color: #8b9cb3;
}
.step-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.step-block { border-top: 1px solid #243044; }
.step-block:first-child { border-top: none; }
.step-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}
.step-check { flex-shrink: 0; }
.step-body { flex: 1; min-width: 0; }
.step-title { font-size: 14px; font-weight: 600; }
.step-meta { font-size: 12px; margin-top: 2px; }
.step-id { font-size: 11px; color: #6b7c93; }
.quiz-badge {
  margin-left: 8px;
  color: #a78bfa;
  font-size: 11px;
}
.ghost-btn {
  background: none;
  border: 1px solid #243044;
  color: #9ec5ff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 11px;
  flex-shrink: 0;
}
.ghost-btn:hover { background: #1a3a5c; }
.secondary {
  background: #1e2733;
  color: #c5d0de;
  border: 1px solid #243044;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  flex-shrink: 0;
}
.secondary:hover { background: #243044; }
.learn-footer {
  margin-top: 24px;
  font-size: 12px;
}
</style>

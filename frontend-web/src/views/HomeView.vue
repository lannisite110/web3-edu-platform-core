<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ComplianceBadge from '@/components/ComplianceBadge.vue'
import { useLocalizedPath } from '@/composables/useLocalizedPath'

const { t } = useI18n()
const router = useRouter()
const { tracks } = useLocalizedPath()

const stats = computed(() => {
  const trackCount = tracks.value.length
  const pluginCount = tracks.value.reduce((n, tr) => n + tr.steps.length, 0)
  return { trackCount, pluginCount, totalLabs: pluginCount + 1 }
})
</script>

<template>
  <section class="home-portal">
    <div class="card home-hero">
      <p class="home-kicker">{{ t('home.kicker') }}</p>
      <h1>{{ t('home.title') }}</h1>
      <p class="muted">{{ t('home.subtitle') }}</p>
      <div class="home-badges">
        <ComplianceBadge :passed="null" />
        <span class="tag">LabWeave {{ t('app.version') }}</span>
        <span class="tag">23 Lab</span>
      </div>
      <div class="home-actions">
        <button class="primary" @click="router.push('/learn')">{{ t('home.openLearn') }}</button>
        <button class="secondary" @click="router.push('/labs/edu.hot.mock')">{{ t('home.startMock') }}</button>
      </div>
    </div>

    <div class="home-grid">
      <div class="card home-stat">
        <div class="stat-num">{{ stats.trackCount }}</div>
        <div class="muted">{{ t('home.statTracks') }}</div>
      </div>
      <div class="card home-stat">
        <div class="stat-num">{{ stats.pluginCount }}</div>
        <div class="muted">{{ t('home.statPlugins') }}</div>
      </div>
      <div class="card home-stat">
        <div class="stat-num">{{ stats.totalLabs }}</div>
        <div class="muted">{{ t('home.statTotal') }}</div>
      </div>
    </div>

    <div class="card home-tracks">
      <h2>{{ t('home.tracksTitle') }}</h2>
      <p class="muted">{{ t('home.tracksHint') }}</p>
      <ul class="track-overview">
        <li v-for="tr in tracks" :key="tr.id">
          <strong>{{ tr.id }}</strong> {{ tr.title }}
          <span class="muted">
            — {{ t('home.trackMeta', { count: tr.steps.length, days: tr.estimatedDays }) }}
          </span>
        </li>
      </ul>
      <button class="primary" @click="router.push('/learn')">{{ t('home.viewMap') }}</button>
    </div>

    <ul class="home-notes muted">
      <li>{{ t('home.note1') }}</li>
      <li>{{ t('home.note2') }}</li>
      <li>{{ t('home.note3') }}</li>
    </ul>
  </section>
</template>

<style scoped>
.home-portal { max-width: 900px; }
.home-hero { max-width: none; }
.home-kicker {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9ec5ff;
  margin: 0 0 8px;
}
.home-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 16px 0;
}
.home-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.secondary {
  background: #1e2733;
  color: #c5d0de;
  border: 1px solid #243044;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}
.secondary:hover { background: #243044; }
.home-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}
.home-stat { text-align: center; max-width: none; }
.stat-num { font-size: 28px; font-weight: 700; color: #9ec5ff; }
.home-tracks { margin-top: 16px; max-width: none; }
.track-overview {
  list-style: none;
  padding: 0;
  margin: 12px 0 16px;
}
.track-overview li { padding: 6px 0; border-bottom: 1px solid #243044; font-size: 14px; }
.track-overview li:last-child { border-bottom: none; }
.home-notes {
  margin-top: 16px;
  font-size: 13px;
  line-height: 1.6;
  padding-left: 18px;
}
@media (max-width: 640px) {
  .home-grid { grid-template-columns: 1fr; }
}
</style>

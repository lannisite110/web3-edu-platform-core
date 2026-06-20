<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import pathData from '@/data/labweave-path.json'
import ComplianceBadge from '@/components/ComplianceBadge.vue'
import { useLabWeaveProgress } from '@/composables/useLabWeaveProgress'

const router = useRouter()
const { isCompleted, toggleComplete, trackProgress, resetAll } = useLabWeaveProgress()

const prerequisite = pathData.prerequisite
const tracks = pathData.tracks

const allPluginIds = computed(() => {
  const ids = prerequisite.steps.map((s) => s.pluginId)
  for (const t of tracks) {
    for (const s of t.steps) ids.push(s.pluginId)
  }
  return ids
})

const overall = computed(() => trackProgress(allPluginIds.value))

function goLab(routePrefix: string) {
  router.push(routePrefix)
}
</script>

<template>
  <div class="learn-page">
    <header class="learn-hero card learn-hero-wide">
      <div class="learn-hero-top">
        <div>
          <p class="learn-kicker">LabWeave · 沙箱码坊</p>
          <h1>学习地图</h1>
          <p class="muted">
            四轨道 · 22 插件 + 起步 mock · 每步可进 Lab 动手 · 进度保存在本机浏览器
          </p>
        </div>
        <ComplianceBadge :passed="null" label="测试网/沙箱 only" />
      </div>
      <div class="learn-overall">
        <div class="learn-overall-label">总进度 {{ overall.done }} / {{ overall.total }}</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: overall.pct + '%' }" />
        </div>
        <button type="button" class="link-btn" @click="resetAll">重置进度</button>
      </div>
    </header>

    <section class="card learn-hero-wide">
      <h2>{{ prerequisite.title }} · {{ prerequisite.subtitle }}</h2>
      <p class="muted">约 {{ prerequisite.estimatedDays }} 天 · 建议最先完成</p>
      <ul class="step-list">
        <li v-for="step in prerequisite.steps" :key="step.pluginId" class="step-row">
          <label class="step-check">
            <input
              type="checkbox"
              :checked="isCompleted(step.pluginId)"
              @change="toggleComplete(step.pluginId)"
            />
          </label>
          <div class="step-body">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-meta muted">{{ step.summary }} · ~{{ step.estimatedHours }}h</div>
            <code class="step-id">{{ step.pluginId }}</code>
          </div>
          <button type="button" class="secondary" @click="goLab(step.routePrefix)">打开 Lab</button>
        </li>
      </ul>
    </section>

    <div class="track-grid">
      <section v-for="track in tracks" :key="track.id" class="card track-card">
        <div class="track-head">
          <span class="track-id">{{ track.id }}</span>
          <h2>{{ track.title }}</h2>
          <p class="muted">{{ track.subtitle }} · 约 {{ track.estimatedDays }} 天</p>
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
          <li v-for="step in track.steps" :key="step.pluginId" class="step-row">
            <label class="step-check">
              <input
                type="checkbox"
                :checked="isCompleted(step.pluginId)"
                @change="toggleComplete(step.pluginId)"
              />
            </label>
            <div class="step-body">
              <div class="step-title">{{ step.order }}. {{ step.title }}</div>
              <div class="step-meta muted">~{{ step.estimatedHours }}h</div>
            </div>
            <button type="button" class="secondary" @click="goLab(step.routePrefix)">Lab</button>
          </li>
        </ol>
      </section>
    </div>

    <footer class="learn-footer muted">
      详细文档见仓库 <code>docs/LABWEAVE_PATH.md</code> · L1 不含 Agent（L2 启动合规助教）
    </footer>
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
.learn-overall-label { font-size: 13px; min-width: 120px; }
.progress-bar {
  flex: 1;
  min-width: 160px;
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
.step-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid #243044;
}
.step-row:first-child { border-top: none; }
.step-check { flex-shrink: 0; }
.step-body { flex: 1; min-width: 0; }
.step-title { font-size: 14px; font-weight: 600; }
.step-meta { font-size: 12px; margin-top: 2px; }
.step-id { font-size: 11px; color: #6b7c93; }
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

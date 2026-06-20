<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import pathData from '@/data/labweave-path.json'
import ComplianceBadge from '@/components/ComplianceBadge.vue'

const router = useRouter()

const stats = computed(() => {
  const trackCount = pathData.tracks.length
  const pluginCount = pathData.tracks.reduce((n, t) => n + t.steps.length, 0)
  return { trackCount, pluginCount, totalLabs: pluginCount + pathData.prerequisite.steps.length }
})

const tracks = pathData.tracks
</script>

<template>
  <section class="home-portal">
    <div class="card home-hero">
      <p class="home-kicker">LabWeave · 沙箱码坊</p>
      <h1>合规约束下的 Web3 动手实验室</h1>
      <p class="muted">
        结构化教程 + 可运行 Lab + rule-engine 合规沙箱 · 测试网 / Fabric 沙箱 only
      </p>
      <div class="home-badges">
        <ComplianceBadge :passed="null" />
        <span class="tag">主库 v1.1.0</span>
        <span class="tag">23 Lab</span>
      </div>
      <div class="home-actions">
        <button class="primary" @click="router.push('/learn')">打开学习地图</button>
        <button class="secondary" @click="router.push('/labs/edu.hot.mock')">从 Mock Lab 起步</button>
      </div>
    </div>

    <div class="home-grid">
      <div class="card home-stat">
        <div class="stat-num">{{ stats.trackCount }}</div>
        <div class="muted">学习轨道（3A–3D）</div>
      </div>
      <div class="card home-stat">
        <div class="stat-num">{{ stats.pluginCount }}</div>
        <div class="muted">业务插件</div>
      </div>
      <div class="card home-stat">
        <div class="stat-num">{{ stats.totalLabs }}</div>
        <div class="muted">含起步 mock</div>
      </div>
    </div>

    <div class="card home-tracks">
      <h2>四轨道概览</h2>
      <p class="muted">左侧边栏可直达任意 Lab；推荐按轨道顺序学习。</p>
      <ul class="track-overview">
        <li v-for="t in tracks" :key="t.id">
          <strong>{{ t.id }}</strong> {{ t.title }}
          <span class="muted">— {{ t.steps.length }} 插件 · ~{{ t.estimatedDays }} 天</span>
        </li>
      </ul>
      <button class="primary" @click="router.push('/learn')">查看完整地图 →</button>
    </div>

    <ul class="home-notes muted">
      <li>每步实验：打开 Lab → 运行仿真 → 查看 eval-card 与 compliance 结果</li>
      <li>网关运行时拦截主网参数；规则引擎 evaluate 先于 Job 投递</li>
      <li>文档：<code>docs/LABWEAVE.md</code> · <code>docs/LABWEAVE_PATH.md</code></li>
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

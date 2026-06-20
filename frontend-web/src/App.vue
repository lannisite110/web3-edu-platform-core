<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPluginRegistry, groupPlugins } from '@/plugins/loader'

const route = useRoute()
const router = useRouter()
const grouped = computed(() => groupPlugins(getPluginRegistry()))

function isActive(id: string) {
  return route.name === id
}

function goLab(id: string, prefix: string) {
  router.push(prefix)
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <img src="/favicon.png" alt="logo" class="logo" />
        <div>
          <div class="title">LabWeave</div>
          <div class="subtitle">沙箱码坊 · v1.2.0</div>
        </div>
      </div>
      <nav>
        <button class="nav-item" :class="{ active: route.path === '/' }" @click="router.push('/')">
          首页
        </button>
        <button class="nav-item" :class="{ active: route.path === '/learn' }" @click="router.push('/learn')">
          学习地图
        </button>
        <section v-for="(items, group) in grouped" :key="group" class="nav-group">
          <div class="group-label">{{ group }}</div>
          <button
            v-for="p in items"
            :key="p.id"
            class="nav-item"
            :class="{ active: isActive(p.id) }"
            @click="goLab(p.id, p.routePrefix)"
          >
            {{ p.name }}
          </button>
        </section>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

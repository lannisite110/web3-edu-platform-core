<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { usePluginGroupLabel, usePluginLabel } from '@/composables/useLocalizedPath'
import { getPluginRegistry, groupPlugins } from '@/plugins/loader'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const groupLabel = usePluginGroupLabel()
const pluginLabel = usePluginLabel()
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
          <div class="title">{{ t('app.brand') }}</div>
          <div class="subtitle">{{ t('app.tagline') }} · {{ t('app.version') }}</div>
        </div>
      </div>
      <LanguageSwitcher />
      <nav>
        <button class="nav-item" :class="{ active: route.path === '/' }" @click="router.push('/')">
          {{ t('app.nav.home') }}
        </button>
        <button class="nav-item" :class="{ active: route.path === '/learn' }" @click="router.push('/learn')">
          {{ t('app.nav.learn') }}
        </button>
        <section v-for="(items, group) in grouped" :key="group" class="nav-group">
          <div class="group-label">{{ groupLabel(group) }}</div>
          <button
            v-for="p in items"
            :key="p.id"
            class="nav-item"
            :class="{ active: isActive(p.id) }"
            @click="goLab(p.id, p.routePrefix)"
          >
            {{ pluginLabel(p.id, p.name) }}
          </button>
        </section>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import type { PluginManifestRef } from '@/plugins/types'
import { resolveLabLoader } from '@/plugins/loader'
import LabView from '@/views/LabView.vue'

const route = useRoute()
const plugin = computed(() => route.meta.plugin as PluginManifestRef | undefined)
const panel = shallowRef<Component>(LabView)

watch(
  plugin,
  (p) => {
    if (!p) {
      panel.value = LabView
      return
    }
    const loader = resolveLabLoader(p.id)
    panel.value = loader ? defineAsyncComponent(loader as () => Promise<Component>) : LabView
  },
  { immediate: true },
)
</script>

<template>
  <component :is="panel" />
</template>

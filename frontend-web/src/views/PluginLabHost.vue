<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import type { PluginManifestRef } from '@/plugins/types'
import { resolveLabLoader } from '@/plugins/loader'
import LabView from '@/views/LabView.vue'
import LabKnowledgePanel from '@/components/LabKnowledgePanel.vue'

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
  <div class="lab-host-unified">
    <component :is="panel" />
    <LabKnowledgePanel v-if="plugin" :plugin-id="plugin.id" />
  </div>
</template>

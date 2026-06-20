import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCN from '@/data/knowledge/zh-CN'
import enUS from '@/data/knowledge/en-US'
import type { LabKnowledge } from '@/data/knowledge/types'

const MAPS: Record<string, Record<string, LabKnowledge>> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

/** Locale-reactive structured knowledge for a plugin Lab. */
export function useLabKnowledge(pluginId: string) {
  const { locale } = useI18n()
  return computed<LabKnowledge | null>(() => {
    const map = MAPS[locale.value as string] ?? zhCN
    return map[pluginId] ?? zhCN[pluginId] ?? null
  })
}

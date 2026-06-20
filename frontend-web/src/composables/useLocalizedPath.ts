import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import pathData from '@/data/labweave-path.json'
import { pluginKeySegment } from '@/i18n'

function stepTitle(t: (key: string) => string, pluginId: string, fallback: string) {
  const key = `paths.steps.${pluginKeySegment(pluginId)}.title`
  const v = t(key)
  return v === key ? fallback : v
}

function stepSummary(t: (key: string) => string, pluginId: string, fallback?: string) {
  const key = `paths.steps.${pluginKeySegment(pluginId)}.summary`
  const v = t(key)
  if (v !== key) return v
  return fallback ?? ''
}

export function useLocalizedPath() {
  const { t } = useI18n()

  const prerequisite = computed(() => ({
    ...pathData.prerequisite,
    title: t('paths.prerequisite.title'),
    subtitle: t('paths.prerequisite.subtitle'),
    steps: pathData.prerequisite.steps.map((s) => ({
      ...s,
      title: stepTitle(t, s.pluginId, s.title),
      summary: stepSummary(t, s.pluginId, s.summary),
    })),
  }))

  const tracks = computed(() =>
    pathData.tracks.map((track) => ({
      ...track,
      title: t(`paths.tracks.${track.id}.title`),
      steps: track.steps.map((s) => ({
        ...s,
        title: stepTitle(t, s.pluginId, s.title),
      })),
    })),
  )

  return { prerequisite, tracks }
}

export function usePluginGroupLabel() {
  const { t } = useI18n()
  return (group: string) => {
    const key = `app.groups.${group}`
    const v = t(key)
    return v === key ? group : v
  }
}

/** Sidebar / page title for a plugin — uses paths.steps.{id}.title, else manifest name */
export function usePluginLabel() {
  const { t } = useI18n()
  return (pluginId: string, fallback: string) => stepTitle(t, pluginId, fallback)
}

import { useI18n } from 'vue-i18n'
import { pluginKeySegment } from '@/i18n'

/** Per-plugin + shared lab UI strings (core locale `labs.*`). */
export function useLabI18n(pluginId: string) {
  const { t, te, locale } = useI18n()
  const seg = pluginKeySegment(pluginId)

  function pluginKey(suffix: string) {
    return `labs.${seg}.${suffix}`
  }

  function lt(suffix: string, params?: Record<string, unknown>) {
    const pk = pluginKey(suffix)
    if (te(pk)) return t(pk, params ?? {})
    const ck = `labs.common.${suffix}`
    if (te(ck)) return t(ck, params ?? {})
    return ''
  }

  function has(suffix: string) {
    return te(pluginKey(suffix)) || te(`labs.common.${suffix}`)
  }

  return { t: lt, te: has, locale, pluginId }
}

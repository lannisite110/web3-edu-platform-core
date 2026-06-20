import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import labsZhCN from './labs/zh-CN'
import labsEnUS from './labs/en-US'

export type AppLocale = 'zh-CN' | 'en-US'

const STORAGE_KEY = 'labweave-locale-v1'

/**
 * vue-i18n treats `.` in a key path as a nesting separator, but plugin IDs
 * (e.g. `edu.hot.dao`) contain dots. Convert dotted IDs to a flat key segment
 * so `t('labs.edu_hot_dao.title')` resolves the literal locale entry.
 */
export function pluginKeySegment(pluginId: string): string {
  return pluginId.replace(/\./g, '_')
}

function sanitizeDottedKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    out[pluginKeySegment(key)] = value
  }
  return out
}

type LocaleSchema = typeof zhCN

function buildMessages(
  base: Record<string, unknown>,
  labs: Record<string, unknown>,
): LocaleSchema {
  const paths = base.paths as { steps?: Record<string, unknown> } | undefined
  return {
    ...base,
    ...(paths
      ? { paths: { ...paths, steps: sanitizeDottedKeys(paths.steps ?? {}) } }
      : {}),
    labs: sanitizeDottedKeys(labs),
  } as unknown as LocaleSchema
}

function readSavedLocale(): AppLocale {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en-US' || v === 'zh-CN') return v
  } catch {
    /* ignore */
  }
  return 'zh-CN'
}

export const i18n = createI18n({
  legacy: false,
  locale: readSavedLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': buildMessages(zhCN as Record<string, unknown>, labsZhCN as Record<string, unknown>),
    'en-US': buildMessages(enUS as Record<string, unknown>, labsEnUS as Record<string, unknown>),
  },
})

export function setAppLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
  document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
}

export function getAppLocale(): AppLocale {
  return i18n.global.locale.value as AppLocale
}

// Set initial <html lang>
setAppLocale(getAppLocale())

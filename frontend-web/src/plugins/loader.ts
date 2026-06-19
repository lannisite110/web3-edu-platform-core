import type { PluginManifestRef } from './types'
import registry from './plugins.registry.json'
import { resolveLabLoader } from './lab-loaders'

export function getPluginRegistry(): PluginManifestRef[] {
  return registry as PluginManifestRef[]
}

export function groupPlugins(plugins: PluginManifestRef[]): Record<string, PluginManifestRef[]> {
  return plugins.reduce<Record<string, PluginManifestRef[]>>((acc, p) => {
    const g = p.group || '其他'
    if (!acc[g]) acc[g] = []
    acc[g].push(p)
    return acc
  }, {})
}

export { resolveLabLoader }

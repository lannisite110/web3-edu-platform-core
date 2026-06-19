export interface PluginManifestRef {
  id: string
  name: string
  version: string
  repo: string
  complianceTier: string
  group: string
  routePrefix: string
  frontendEntry: string
  rulesEntry: string
  taskTypes: string[]
  namespaces: string[]
  allowedChainIds: (number | string)[]
  manifestPath?: string
}

import type { ViteDevServer } from 'vite'
import type { AppConfig } from '../shared'
import deepEqual from 'deep-equal'

let originalTags: string[]
let lastFoundTags: string[]

// Internal: Detects markdown components overriden in the app.
export function detectMDXComponents (code: string, config: AppConfig, server: ViteDevServer | undefined) {
  const mdxComponents = code.match(/\bmdxComponents\b(?:.*?){(.*?)}/s)?.[1]
  if (!mdxComponents) return

  const foundTags = Array.from(mdxComponents.matchAll(/\b['"]?(\w+)['"]?:/g)).map(m => m[1])

  if (!originalTags)
    originalTags = config.markdown.overrideTags ||= []

  const overridenTags = Array.from(new Set([...originalTags, ...foundTags])).sort()
  if (!deepEqual(overridenTags, config.markdown.overrideTags)) {
    config.markdown.overrideTags = overridenTags
    server?.moduleGraph.invalidateAll()
  }
}

import type { ViteDevServer } from 'vite'
import deepEqual from 'deep-equal'
import type { AppConfig } from '../shared'

let originalTags: string[]

// Internal: Detects markdown components overriden in the app.
export function detectMDXComponents (code: string, config: AppConfig, server?: ViteDevServer | undefined) {
  const mdxComponents = code.match(/\bmdxComponents\b(?:.*?){(.*?)}/s)?.[1]
  if (!mdxComponents) return

  const foundTags = Array.from(mdxComponents.matchAll(/\b['"]?(\w+)['"]?:/g)).map(m => m[1])

  if (!originalTags)
    originalTags = config.markdown.overrideElements ||= []

  const dynamicElements = Array.from(new Set([...originalTags, ...foundTags])).sort()
  if (!deepEqual(dynamicElements, config.markdown.overrideElements)) {
    config.markdown.overrideElements = dynamicElements
    server?.moduleGraph.invalidateAll()
  }
}

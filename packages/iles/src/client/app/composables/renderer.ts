import { useSSRContext } from 'vue'
import type { PrerenderFn, Framework } from '@islands/hydration'

export function useRenderer (framework: Framework): PrerenderFn | undefined {
  const context = useSSRContext()
  if (!context) throw new Error('SSR context not found when rendering islands.')
  if (!context.renderers) throw new Error('Island renderers are missing in SSR context.')
  return context.renderers[framework]
}

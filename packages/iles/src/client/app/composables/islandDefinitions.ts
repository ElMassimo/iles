import { useSSRContext } from 'vue'
import { useRoute } from 'vue-router'
import { IslandDefinition } from '../../shared'

export function useIslandsForPath<T = any> (): IslandDefinition[] {
  const context = useSSRContext()
  if (!context) throw new Error('SSR context not found when rendering islands.')
  if (!context.islandsByPath) throw new Error('SSR context is missing islands.')

  const currentRoute = useRoute()

  return (context.islandsByPath[currentRoute.path] ||= [])
}

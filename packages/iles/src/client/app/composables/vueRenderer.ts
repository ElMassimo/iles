import type { VNode } from 'vue'
import { useSSRContext } from 'vue'

export function useVueRenderer () {
  const context = import.meta.env.SSR ? useSSRContext() : {}
  return async (vNodes: undefined | VNode | VNode[]) => {
    if (!vNodes) return
    const { renderToString } = await import('@vue/server-renderer')
    if (!Array.isArray(vNodes)) return await renderToString(vNodes, context)
    const strs = vNodes.map(async vNode => await renderToString(vNode, context))
    return (await Promise.all(strs)).join('\n')
  }
}

export type VNodeRenderer = ReturnType<typeof useVueRenderer>

import type { AppContext, VNode } from 'vue'
import { getCurrentInstance, createApp, createSSRApp, ssrContextKey, withCtx } from 'vue'

const newApp = import.meta.env.SSR ? createApp : createSSRApp

type Nodes = undefined | VNode<any, any, any> | VNode<any, any, any>[]

export type VNodeRenderer = (vNodes: Nodes | (() => Nodes | Promise<Nodes>)) => Promise<string>

export function useVueRenderer (): VNodeRenderer {
  return withCtx((async (vNodes) => {
    if (!vNodes) return ''

    // Obtain the app context of the current app to enable nested renders.
    const { app: _, provides: appProvides, ...appContext }
      = getCurrentInstance()?.appContext || {} as AppContext
    // @ts-ignore
    const { [ssrContextKey]: ssrContext, ...provides } = appProvides

    // Initialize a new application that returns the specified nodes.
    if (isFunction(vNodes)) vNodes = await vNodes()
    const nodes = Array.isArray(vNodes) ? vNodes : [vNodes]
    const proxyApp = newApp({ render: () => nodes })

    // Set the external app context to the temporary app.
    Object.assign(proxyApp._context, { ...appContext, provides })

    const { renderToString } = await import('@vue/server-renderer')
    return await renderToString(proxyApp, ssrContext)
  }) as VNodeRenderer, getCurrentInstance()) as VNodeRenderer
}

function isFunction (val: any): val is Function {
  return typeof val === 'function'
}

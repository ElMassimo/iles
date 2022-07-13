import type { AppContext, Component, VNode, AsyncComponentLoader } from 'vue'
import { h, getCurrentInstance, createApp, createSSRApp, ssrContextKey, withCtx } from 'vue'

const newApp = import.meta.env.SSR ? createApp : createSSRApp

export type Nodes = undefined | VNode<any, any, any> | VNode<any, any, any>[]
export type VueRenderable = AsyncComponentLoader | Component | Nodes | ((props?: any) => Nodes | Promise<Nodes>)
export type VNodeRenderer = (content: VueRenderable) => Promise<string>

export function useVueRenderer (): VNodeRenderer {
  return withCtx((async (content) => {
    if (!content) return ''

    // Obtain the app context of the current app to enable nested renders.
    const { app: _, provides: appProvides, ...appContext }
      = getCurrentInstance()?.appContext || {} as AppContext
    // @ts-ignore
    const { [ssrContextKey]: ssrContext, ...provides } = appProvides

    // Coerce the content to an array of vnodes.
    if (isComponent(content) || isAsyncComponent(content)) content = h(content)
    else if (isFunction(content)) content = await content()
    const nodes = Array.isArray(content) ? content : [content]

    // Initialize a new application that returns the specified nodes.
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

function isComponent (val: any): val is Component {
  return isFunction(val.render)
}

function isAsyncComponent (val: any): val is AsyncComponentLoader {
  return Boolean(val?.__asyncLoader)
}

import type { InjectionKey } from 'vue'
import { inject, provide, getCurrentInstance } from 'vue'

import type { AppContext, MDXComponents, UserApp } from '../../shared'

export const mdxComponentsKey: InjectionKey<MDXComponents> = Symbol('[iles-mdx-components]')

// Public: Allows to globally obtain replacements for built-ins, such as img.
export function useMDXComponents () {
  return inject(mdxComponentsKey)
}

// Public: Allows to globally provide replacements for built-ins, such as img.
export function provideMDXComponents (mdxComponents: MDXComponents) {
  const previousComponents = getCurrentInstance()?.appContext?.app?._context?.provides?.[mdxComponentsKey as any]
  if (previousComponents) {
    Object.keys(mdxComponents).forEach((key) => {
      if (!(key in previousComponents))
        console.warn(`Provided '${key}' MDX component, but it was not provided globally. You must specify a default for '${key}' in mdxComponents in app.ts`)
    })
  }
  provide(mdxComponentsKey, mdxComponents)
}

export async function installMDXComponents (context: AppContext, { mdxComponents }: UserApp) {
  const components = mdxComponents
    ? typeof mdxComponents === 'function' ? await mdxComponents(context) : mdxComponents
    : {}
  context.app.provide(mdxComponentsKey, components)
}

import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

import { useAppConfig } from './appConfig'
import type { AppContext, MDXComponents, UserApp } from '../../shared'

export const mdxComponentsKey: InjectionKey<MDXComponents> = Symbol('[iles-mdx-components]')

// Public: Allows to globally obtain replacements for built-ins, such as img.
export function useMDXComponents () {
  return inject(mdxComponentsKey)
}

// Public: Allows to globally provide replacements for built-ins, such as img.
export function provideMDXComponents (mdxComponents: MDXComponents) {
  const overrideElements = useAppConfig()?.overrideElements
  if (overrideElements) {
    for (const key in mdxComponents) {
      if (key === key.toLowerCase() && !overrideElements.includes(key))
        console.warn(`Provided an MDX shortcode for '${key}', but it's being optimized. You must specify '${key}' in mdxComponents in app.ts`)
    }
  }
  provide(mdxComponentsKey, mdxComponents)
}

export async function installMDXComponents (context: AppContext, { mdxComponents }: UserApp) {
  const components = mdxComponents
    ? typeof mdxComponents === 'function' ? await mdxComponents(context) : mdxComponents
    : {}
  context.app.provide(mdxComponentsKey, components)
}

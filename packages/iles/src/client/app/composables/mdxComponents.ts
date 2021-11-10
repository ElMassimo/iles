import type { InjectionKey } from 'vue'
import { inject } from 'vue'

import type { AppContext, MDXComponents, UserApp } from '../../shared'

export const mdxComponentsKey: InjectionKey<MDXComponents> = Symbol('[iles-mdx-components]')

// Public: Allows to globally provide replacements for built-ins, such as img.
export function useMDXComponents () {
  return inject(mdxComponentsKey)
}

export async function installMDXComponents (context: AppContext, { mdxComponents }: UserApp) {
  const components = mdxComponents
    ? typeof mdxComponents === 'function' ? await mdxComponents(context) : mdxComponents
    : {}
  context.app.provide(mdxComponentsKey, components)
}

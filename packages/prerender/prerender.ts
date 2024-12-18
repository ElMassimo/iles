import type { Props, Slots, Framework } from '@islands/hydration'

export type { Framework }

export type PrerenderFn =
  (component: any, props: Props, slots: Slots | undefined, id: string) => Promise<string>

const _imports: {
  preact?: [
    typeof import('@islands/hydration/preact'),
    typeof import('preact-render-to-string'),
  ]
  solid?: typeof import('solid-js/web')
} = {}

export const renderers: Record<Framework, PrerenderFn> = {
  async preact (component, props, slots) {
    const [
      { createElement },
      { renderToString },
    ] = _imports.preact ||= await Promise.all([
      import('@islands/hydration/preact'),
      import('preact-render-to-string'),
    ])
    const node = createElement(component, props, slots)
    return renderToString(node as any)
  },
  async solid (component, props, slots, renderId) {
    const { ssr, renderToString, createComponent } = _imports.solid ||= await import('solid-js/web')
    return renderToString(() => {
      const children = slots?.default && ssr(slots.default)
      return createComponent(component, { ...props, children })
    }, { renderId })
  },
  async svelte (component, props, slots, renderId) {
    const renderSvelteComponent = (await import('./svelte')).default
    return renderSvelteComponent(component, props, slots, renderId)
  },
  async vanilla () {
    throw new Error('The vanilla strategy does not prerender islands.')
  },
  async vue () {
    throw new Error('The vue strategy prerenders islands directly in the main app.')
  },
}

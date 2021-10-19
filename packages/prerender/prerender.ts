import type { Props, Slots, Framework } from '@islands/hydration'

export type { Framework }

export type PrerenderFn =
  (component: any, props: Props, slots: Slots | undefined) => Promise<string>

const _imports: {
  preact?: [
    typeof import('@islands/hydration/preact'),
    typeof import('preact-render-to-string').renderToString,
  ]
  solid?: typeof import('solid-js/web')
} = {}

export const renderers: Record<Framework, PrerenderFn> = {
  async preact (component, props, slots) {
    const [
      { createElement },
      renderToString,
    ] = _imports.preact ||= await Promise.all([
      import('@islands/hydration/preact'),
      require('preact-render-to-string') as typeof import('preact-render-to-string').renderToString,
    ])
    return renderToString(createElement(component, props, slots))
  },
  async solid (component, props, slots) {
    const { ssr, renderToString, createComponent } = _imports.solid ||= await import('solid-js/web')
    return renderToString(() => {
      const children = slots?.default && ssr(slots.default)
      return createComponent(component, { ...props, children })
    })
  },
  async svelte (component, props, slots) {
    const Svelte = (await import('./svelte')).default
    return Svelte.render({ component, props, slots })?.html
  },
  async vanilla () {
    throw new Error('The vanilla strategy does not prerender islands.')
  },
  async vue () {
    throw new Error('The vue strategy prerenders islands directly in the main app.')
  },
}

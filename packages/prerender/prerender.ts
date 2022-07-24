import type { Props, Slots, Framework } from '@islands/hydration'
import type { VNode } from 'vue'

export type { Framework }

export type PrerenderFn =
  (component: any, props: Props, slots: Slots | undefined, id: string) => Promise<string | VNode>

const _imports: {
  preact?: [
    typeof import('@islands/hydration/preact'),
    typeof import('preact-render-to-string'),
  ]
  solid?: typeof import('solid-js/web'),
  vue?: typeof import('@islands/hydration/vue'),
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
    return renderToString(createElement(component, props, slots))
  },
  async solid (component, props, slots, renderId) {
    const { ssr, renderToString, createComponent } = _imports.solid ||= await import('solid-js/web')
    return renderToString(() => {
      const children = slots?.default && ssr(slots.default)
      return createComponent(component, { ...props, children })
    }, { renderId })
  },
  async svelte (component, props, slots) {
    const Svelte = (await import('./svelte')).default
    return Svelte.render({ component, props, slots })?.html
  },
  async vanilla () {
    throw new Error('The vanilla strategy does not prerender islands.')
  },
  async vue (component, props, slots) {
    const { h, slotsToFns } = _imports.vue ||= await import('@islands/hydration/vue')
    return h(component, props, slotsToFns(slots))
  },
}

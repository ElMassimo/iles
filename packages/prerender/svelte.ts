import { createRawSnippet, type Snippet } from 'svelte'
import { render } from 'svelte/server'
import type { PrerenderFn } from './prerender'

const renderSvelteComponent: PrerenderFn = async (Component, props, slots, _id) => {
  let children = undefined;
  let $$slots: Record<string, Snippet> & { default?: boolean } | undefined = undefined
  let renderFns: Record<string, Snippet> = {}

  slots && Object.entries(slots).forEach(([slotName, html]) => {
    const fnName = slotName === 'default' ? 'children' : slotName
    renderFns[fnName] = createRawSnippet(() => ({ render: () => html }))

    $$slots ??= {}
    if (slotName === 'default') {
      $$slots.default = true
      children = renderFns[fnName]
    } else {
      $$slots[fnName] = renderFns[fnName]
    }
  })

  return render(Component, {
    props: {
      ...props,
      children,
      $$slots,
      ...renderFns,
    },
  }).body
}

export default renderSvelteComponent

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import { create_ssr_component, missing_component, validate_component } from 'svelte/internal'

export default create_ssr_component(($$result: any, $$props: any) => {
  const { component, slots, props } = $$props

  const $$slots = slots
    ? Object.fromEntries(
      Object.entries(slots).map(([name, content]) => [name, () => content]),
    )
    : {}

  return validate_component(component || missing_component, 'svelte:component')
    .$$render($$result, props, {}, $$slots)
})

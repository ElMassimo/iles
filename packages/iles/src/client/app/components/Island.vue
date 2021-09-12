<script lang="ts">
/* eslint-disable no-restricted-syntax */
import { defineAsyncComponent, defineComponent, h, createCommentVNode, useSSRContext } from 'vue'
import { useRoute } from 'iles'
import type { PropType, DefineComponent, Slot } from 'vue'
import { renderToString, SSRContext } from '@vue/server-renderer'
import { serialize } from '../utils'
import { newHydrationId, Hydrate, hydrationFns } from '../hydration'
import { useIslandsForPage } from '../composables/islandDefinitions'

export default defineComponent({
  name: 'Island',
  inheritAttrs: false,
  props: {
    component: { type: Object as PropType<DefineComponent>, required: true },
    componentName: { type: String, required: true },
    importName: { type: String, required: true },
    importPath: { type: String, required: true },
    [Hydrate.WhenIdle]: { type: Boolean, default: false },
    [Hydrate.OnLoad]: { type: Boolean, default: false },
    [Hydrate.MediaQuery]: { type: [Boolean, String], default: false },
    [Hydrate.New]: { type: Boolean, default: false },
    [Hydrate.WhenVisible]: { type: Boolean, default: false },
  },
  setup (props) {
    return {
      id: newHydrationId(),
      route: useRoute(),
      islandsForPage: import.meta.env.SSR ? useIslandsForPage() : undefined,
      ssrContext: import.meta.env.SSR ? useSSRContext() : undefined,
      strategy: Object.values(Hydrate).find(s => props[s]) || Hydrate.OnLoad,
      hydrateInDev: true,
    }
  },
  render () {
    const isSSR = import.meta.env.SSR

    const packageUrl = `${isSSR ? '' : '/@id/'}@islands/hydration`

    const content = isSSR && this.$props[Hydrate.New]
      ? []
      : [h(this.component, this.$attrs, this.$slots)]
    const rootNode = h('ile-root', { id: this.id }, content)

    const props = { ...this.$attrs }
    if (this.strategy === Hydrate.MediaQuery)
      props._mediaQuery = this.$props[Hydrate.MediaQuery]

    const slotVNodes = mapObject(this.$slots, slotFn => slotFn?.())

    const renderScript = async () => {
      const slots = await renderSlots(slotVNodes, this.ssrContext)

      return `import { ${this.importName} as ${this.componentName} } from '${this.importPath}'
  import { ${hydrationFns[this.strategy]} as hydrate } from '${packageUrl}'
  hydrate(${this.componentName}, '${this.id}', ${serialize(props)}, ${serialize(slots)})
  `
    }

    const renderPlaceholder = async () => {
      const placeholder = `ISLAND_HYDRATION_PLACEHOLDER_${this.id}`
      const script = await renderScript()
      this.islandsForPage?.push({ id: this.id, script, placeholder })
      return placeholder
    }

    if (isSSR) {
      return [
        rootNode,
        h(defineAsyncComponent(async () => createCommentVNode(await renderPlaceholder()))),
      ]
    }

    // TEMPORARY, for debugging purposes.
    if (this.hydrateInDev) {
      return [
        rootNode,
        h(defineAsyncComponent(async () => h('script', { type: 'module', innerHTML: await renderScript() }))),
      ]
    }

    return rootNode
  },
})

function mapObject<I, O> (obj: Record<string, I>, fn: (i: I) => O): Record<string, O> {
  const result = Object.create(null)
  for (let key in obj)
    result[key] = fn(obj[key])
  return result
}

async function renderSlots (slotVNodes: Record<string, undefined | ReturnType<Slot>>, context: SSRContext = {}) {
  return Object.fromEntries(await Promise.all(Object.entries(slotVNodes).map(async ([name, vNodes]) =>
    [name, vNodes ? await Promise.all(vNodes.map(async vNode => await renderToString(vNode, context))) : vNodes],
  )))
}
</script>

<style>
ile-root {
  display: contents
}
</style>

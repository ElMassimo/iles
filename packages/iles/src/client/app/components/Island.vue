<script lang="ts">
/* eslint-disable no-restricted-syntax */
import { defineAsyncComponent, defineComponent, h, createCommentVNode } from 'vue'
import { useRoute } from 'iles'
import type { PropType, DefineComponent } from 'vue'
import { asyncMapObject, mapObject, serialize } from '../utils'
import { newHydrationId, Hydrate, hydrationFns } from '../hydration'
import { useIslandsForPath } from '../composables/islandDefinitions'
import { useAppConfig } from '../composables/appConfig'
import { useVueRenderer } from '../composables/vueRenderer'

export default defineComponent({
  name: 'Island',
  inheritAttrs: false,
  props: {
    component: { type: [Object, Function] as PropType<DefineComponent>, required: true },
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
      appConfig: useAppConfig(),
      id: newHydrationId(),
      route: useRoute(),
      islandsForPath: import.meta.env.SSR ? useIslandsForPath() : undefined,
      renderVNodes: useVueRenderer(),
      strategy: Object.values(Hydrate).find(s => props[s]) || Hydrate.OnLoad,
    }
  },
  mounted () {
    (window as any).__ILE_DEVTOOLS__?.addIslandToDevtools(this)
  },
  unmounted () {
    (window as any).__ILE_DEVTOOLS__?.removeIslandFromDevtools(this)
  },
  render () {
    const isSSR = import.meta.env.SSR

    const content = isSSR && this.$props[Hydrate.New]
      ? []
      : [h(this.component, this.$attrs, this.$slots)]
    const rootNode = h('ile-root', { id: this.id }, content)

    const props = { ...this.$attrs }
    if (this.strategy === Hydrate.MediaQuery)
      props._mediaQuery = this.$props[Hydrate.MediaQuery]

    const slotVNodes = mapObject(this.$slots, slotFn => slotFn?.())

    const renderScript = async () => {
      const slots = await asyncMapObject(slotVNodes, this.renderVNodes)

      return `import { ${this.importName} as ${this.componentName} } from '${this.importPath.replace(this.appConfig.root, '')}'
  import { ${hydrationFns[this.strategy]} as hydrate } from '${isSSR ? '' : '/@id/'}@islands/hydration'
  hydrate(${this.componentName}, '${this.id}', ${serialize(props)}, ${serialize(slots)})
  `
    }

    const renderPlaceholder = async () => {
      const placeholder = `ISLAND_HYDRATION_PLACEHOLDER_${this.id}`
      const script = await renderScript()
      this.islandsForPath?.push({ id: this.id, script, placeholder })
      return placeholder
    }

    // Hydrate in development to debug potential problems with the script.
    if (this.appConfig.debug && !isSSR) {
      return [
        rootNode,
        h(defineAsyncComponent(async () => h('script', { type: 'module', innerHTML: await renderScript() }))),
      ]
    }

    return [
      rootNode,
      h(defineAsyncComponent(async () => createCommentVNode(await renderPlaceholder()))),
    ]
  },
})
</script>

<style>
ile-root {
  display: contents
}
</style>

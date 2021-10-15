<script lang="ts">
/* eslint-disable no-restricted-syntax */
import { defineAsyncComponent, defineComponent, h, createCommentVNode, createStaticVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
import { asyncMapObject, mapObject, serialize } from '../utils'
import { newHydrationId, Hydrate, hydrationFns, prerenderFns } from '../hydration'
import { useIslandsForPath } from '../composables/islandDefinitions'
import { useAppConfig } from '../composables/appConfig'
import { useVueRenderer } from '../composables/vueRenderer'

function inspectMediaQuery (query: string) {
  if (!query.includes('(') && query.includes(': '))
    console.warn('You might need to add parenthesis to the following media query.\n\t', query, '\n', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#targeting_media_features')
  return query
}

export default defineComponent({
  name: 'Island',
  inheritAttrs: false,
  props: {
    component: { type: [Object, Function] as PropType<DefineComponent>, required: true },
    componentName: { type: String, required: true },
    importName: { type: String, required: true },
    importPath: { type: String, required: true },
    using: { type: String, default: undefined },
    [Hydrate.WhenIdle]: { type: Boolean, default: false },
    [Hydrate.OnLoad]: { type: Boolean, default: false },
    [Hydrate.MediaQuery]: { type: [Boolean, String], default: false },
    [Hydrate.SkipPrerender]: { type: Boolean, default: false },
    [Hydrate.WhenVisible]: { type: Boolean, default: false },
    [Hydrate.None]: { type: Boolean, default: false },
  },
  setup (props, { attrs }) {
    let strategy = Object.values(Hydrate).find(s => props[s])
    if (!strategy) {
      console.warn('Unknown hydration strategy, falling back to client:load. Received:', { ...attrs })
      strategy = Hydrate.OnLoad
    }

    const ext = props.importPath.split('.')[1]
    const appConfig = useAppConfig()
    const framework = props.using
      || (ext === 'svelte' && 'svelte')
      || ((ext === 'js' || ext === 'ts') && 'vanilla')
      || ((ext === 'jsx' || ext === 'tsx') && appConfig.jsx)
      || 'vue'

    return {
      id: newHydrationId(),
      strategy,
      framework,
      appConfig,
      islandsForPath: import.meta.env.SSR ? useIslandsForPath() : undefined,
      renderVNodes: useVueRenderer(),
      prerender: prerenderFns[framework] || h,
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

    const props = { ...this.$attrs }
    if (this.strategy === Hydrate.MediaQuery)
      props._mediaQuery = inspectMediaQuery(this.$props[Hydrate.MediaQuery] as string)

    const slotVNodes = mapObject(this.$slots, slotFn => slotFn?.())
    const hydrationPkg = `${isSSR ? '' : '/@id/'}@islands/hydration`

    const renderScript = async () => {
      const slots = await asyncMapObject(slotVNodes, this.renderVNodes)

      return `import { ${this.importName} as ${this.componentName} } from '${this.importPath.replace(this.appConfig.root, '')}'
  import { ${hydrationFns[this.strategy]} as hydrate } from '${hydrationPkg}'
  import createIsland from '${hydrationPkg}/${this.framework}'
  hydrate(createIsland, ${this.componentName}, '${this.id}', ${serialize(props)}, ${serialize(slots)})
  `
    }

    const renderPlaceholder = async () => {
      const placeholder = `ISLAND_HYDRATION_PLACEHOLDER_${this.id}`
      const script = await renderScript()
      this.islandsForPath?.push({ id: this.id, script, placeholder })
      return placeholder
    }

    const prerenderIsland = () => {
      if (this.$props[Hydrate.SkipPrerender] || this.framework === 'vanilla')
        return undefined

      if (this.framework === 'vue')
        return this.prerender(this.component, this.$attrs, this.$slots)

      return h(defineAsyncComponent(async () => {
        const prerender = await this.prerender()
        const slots = await asyncMapObject(slotVNodes, this.renderVNodes)
        const result = prerender(this.component, this.$attrs, slots)
        return createStaticVNode(result, undefined as any)
      }))
    }

    const ileRoot = h('ile-root', { id: this.id }, prerenderIsland())

    if (isSSR && this.$props[Hydrate.None])
      return ileRoot

    return [
      ileRoot,
      h(defineAsyncComponent(async () =>
        isSSR
          ? createCommentVNode(await renderPlaceholder())
          : h('script', { async: true, type: 'module', innerHTML: await renderScript() }))
      ),
    ]
  },
})
</script>

<style>
ile-root {
  display: contents
}
</style>

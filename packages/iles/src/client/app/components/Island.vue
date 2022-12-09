<script lang="ts">
import { defineAsyncComponent, defineComponent, h, createCommentVNode, createStaticVNode } from 'vue'
import type { PropType, DefineComponent } from 'vue'
import type { Framework } from '@islands/hydration'
import { asyncMapObject, mapObject, serialize } from '../utils'
import { isEager, newHydrationId, Hydrate, hydrationFns } from '../hydration'
import { useIslandsForPath } from '../composables/islandDefinitions'
import { useRenderer } from '../composables/renderer'
import { useAppConfig } from '../composables/appConfig'
import { useVueRenderer } from '../composables/vueRenderer'

function trackIsland (this: any, { __ILE_DEVTOOLS__ }: any = window) {
  __ILE_DEVTOOLS__?.addIslandToDevtools(this)
}

function untrackIsland (this: any, { __ILE_DEVTOOLS__, __ILE_DISPOSE__ }: any = window) {
  __ILE_DEVTOOLS__?.removeIslandFromDevtools(this)
}

function disposeIsland (this: any, { __ILE_DEVTOOLS__, __ILE_DISPOSE__ }: any = window) {
  __ILE_DISPOSE__?.get(this.id)?.()
}

function inspectMediaQuery (query: string) {
  if (!query.includes('(') && query.includes(': '))
    console.warn('You might need to add parenthesis to the following media query.\n\t', query, '\n', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#targeting_media_features')
  return query
}

export default defineComponent({
  name: 'Island',
  inheritAttrs: false,
  props: {
    component: { type: [Object, Function, null] as PropType<DefineComponent>, required: true },
    componentName: { type: String, required: true },
    importName: { type: String, required: true },
    importFrom: { type: String, required: true },
    using: { type: String as PropType<Framework>, default: undefined },
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

    const ext = props.importFrom.split('.').slice(-1)[0]
    const appConfig = useAppConfig()
    const framework: Framework = props.using
      || (ext === 'svelte' && 'svelte')
      || ((ext === 'js' || ext === 'ts') && 'vanilla')
      || ((ext === 'jsx' || ext === 'tsx') && appConfig.jsx)
      || 'vue'

    return {
      id: newHydrationId(),
      strategy,
      framework,
      appConfig,
      islandsForPath: import.meta.env.SSR && strategy !== Hydrate.None ? useIslandsForPath() : undefined,
      renderVNodes: useVueRenderer(),
      prerender: import.meta.env.SSR ? useRenderer(framework) : undefined,
    }
  },
  mounted: trackIsland,
  beforeUpdate: disposeIsland,
  updated: trackIsland,
  beforeUnmount: untrackIsland,
  unmounted: disposeIsland,
  render () {
    const isSSR = import.meta.env.SSR

    const props = { ...this.$attrs }
    if (this.strategy === Hydrate.MediaQuery)
      props._mediaQuery = inspectMediaQuery(this.$props[Hydrate.MediaQuery] as string)

    const { _, ...slots } = this.$slots
    const slotVNodes = mapObject(slots, slotFn => slotFn?.())
    const hydrationPkg = `${isSSR ? '' : '/@id/'}@islands/hydration`
    let renderedSlots: Record<string, string>

    const renderSlots = async () =>
      renderedSlots ||= await asyncMapObject(slotVNodes, this.renderVNodes)

    const renderScript = async () => {
      const slots = await renderSlots()
      const componentPath = this.importFrom.replace(this.appConfig.root, '')
      const frameworkPath = `${hydrationPkg}/${this.framework}`

      return `import { ${hydrationFns[this.strategy]} as hydrate } from '${hydrationPkg}'
${isEager(this.strategy)
    ? `import framework from '${frameworkPath}'
import { ${this.importName} as component } from '${componentPath}'`
    : `const framework = async () => (await import('${frameworkPath}')).default
const component = async () => (await import('${componentPath}')).${this.importName}`
}
hydrate(framework, component, '${this.id}', ${serialize(props)}, ${serialize(slots)})
  `
    }

    const renderPlaceholder = async () => {
      const placeholder = `ISLAND_HYDRATION_PLACEHOLDER_${this.id}`
      const script = await renderScript()
      const componentPath = this.importFrom
      this.islandsForPath!.push({ id: this.id, script, componentPath, placeholder })
      return placeholder
    }

    const prerenderIsland = () => {
      if (this.strategy === Hydrate.SkipPrerender) return undefined

      if (this.framework === 'vanilla') return undefined

      if (this.framework === 'vue') {
        const vnode = h(this.component, this.$attrs, this.$slots)
        return isSSR ? vnode : h(defineAsyncComponent(async () => createStaticVNode(await this.renderVNodes(vnode), undefined as any)))
      }

      const prerender = this.prerender
      if (!prerender) return undefined

      return h(defineAsyncComponent(async () => {
        const slots = await renderSlots()
        const result = await prerender(this.component, this.$attrs, slots, this.id)
        return createStaticVNode(result, undefined as any)
      }))
    }

    const ileAttrs: Record<string, any> = { id: this.id }
    if (this.$attrs.class)
      ileAttrs.class = this.$attrs.class

    const ileRoot = h('ile-root', ileAttrs, prerenderIsland())

    if (isSSR && this.strategy === Hydrate.None)
      return ileRoot

    return [
      ileRoot,
      h(defineAsyncComponent(async () =>
        isSSR
          ? createCommentVNode(await renderPlaceholder())
          : h('script', { async: true, type: 'module', innerHTML: await renderScript() })),
      ),
    ]
  },
})
</script>

<style>
ile-root:empty {
  display: none;
}
</style>

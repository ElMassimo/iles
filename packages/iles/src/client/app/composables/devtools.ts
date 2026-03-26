import type { App, ComponentPublicInstance } from 'vue'
import { reactive, computed } from 'vue'
import type { InspectorNodeTag } from '@vue/devtools-kit'
import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { usePage } from 'iles'
import type { AppClientConfig, PageData } from '../../shared'
import { getComponentName } from '../utils'

const ISLAND_TYPE = 'Islands 🏝'
const componentStateTypes = [ISLAND_TYPE]

const INSPECTOR_ID = 'iles'
const HYDRATION_LAYER_ID = 'iles:hydration'

// Internal: Used to present sequential island ids during development.
let lastUsedIslandId = 0
const islandsById = reactive<Record<string, ComponentPublicInstance>>({})
const islands = computed(() => Object.values(islandsById))

const strategyLabels: Record<string, any> = {
  'client:idle': 'whenIdle',
  'client:load': 'instant',
  'client:media': 'onMediaQuery',
  'client:only': 'noPrerender',
  'client:visible': 'whenVisible',
  'client:none': 'static',
}

const frameworkColors: Record<any, any> = {
  preact: { backgroundColor: 0x673AB8, textColor: 0xFFFFFF },
  solid: { backgroundColor: 0x446B9E, textColor: 0xFFFFFF },
  svelte: { backgroundColor: 0xFF3E00, textColor: 0xFFFFFF },
  vue: { backgroundColor: 0x42B983, textColor: 0xFFFFFF },
}

type DevToolsPluginAPI = Parameters<Parameters<typeof setupDevtoolsPlugin>[1]>[0]
let devtoolsApi: DevToolsPluginAPI
let appConfig: AppClientConfig

let page = {} as PageData['page']
let route = {} as PageData['route']
let meta = {} as PageData['meta']
let frontmatter = {} as PageData['frontmatter']
let props = {} as PageData['props']
let site = {} as PageData['site']

const devtools = {
  updateIslandsInspector () {
    devtoolsApi?.sendInspectorTree(INSPECTOR_ID)
  },

  addIslandToDevtools (island: any) {
    islandsById[island.id] = island
    devtools.updateIslandsInspector()
    devtoolsApi?.selectInspectorNode(INSPECTOR_ID, route?.path)
  },

  removeIslandFromDevtools (island: any) {
    delete islandsById[island.id]

    // NOTE: Vue could unmount ile-1 before ile-2, so check for unused ids.
    while (lastUsedIslandId > 0 && !islandsById[`ile-${lastUsedIslandId}`])
      lastUsedIslandId -= 1

    devtools.updateIslandsInspector()
  },

  nextIslandId () {
    return `ile-${++lastUsedIslandId}`
  },

  onHydration ({ id, ...event }: any) {
    const time = Date.now()
    const island: any = islandsById[id]
    if (!island) return
    const hydrated = getStrategy(island)
    const mediaQuery = getMediaQuery(island)
    const component = island.componentName

    const data = { event, hydrated, ...(mediaQuery ? { mediaQuery } : {}) }
    devtoolsApi?.addTimelineEvent({
      layerId: HYDRATION_LAYER_ID,
      event: { time, title: component, subtitle: hydrated, data },
    })

    if (appConfig?.debug === 'log') {
      const { el, slots } = event
      console.info(`🏝 hydrated ${component}`, el, slots)
    }
  },
}

;(window as any).__ILE_DEVTOOLS__ = devtools

export function installDevtools (app: App, config: AppClientConfig) {
  appConfig = config
  const pageData = usePage(app)
  route = pageData.route
  page = pageData.page
  frontmatter = pageData.frontmatter
  props = pageData.props
  meta = pageData.meta
  site = pageData.site

  setupDevtoolsPlugin({
    id: 'com.maximomussini.iles',
    label: ISLAND_TYPE,
    logo: 'https://iles-docs.netlify.app/favicon.svg',
    packageName: 'iles',
    homepage: 'https://github.com/ElMassimo/iles',
    componentStateTypes,
    app: app as any,
  }, (api) => {
    devtoolsApi = api

    api.addInspector({
      id: INSPECTOR_ID,
      label: ISLAND_TYPE,
      icon: 'waves',
      treeFilterPlaceholder: 'Search islands',
    })

    api.addTimelineLayer({
      id: HYDRATION_LAYER_ID,
      color: 0xFF984F,
      label: 'Hydration 🏝',
    })

    api.on.inspectComponent(({ componentInstance, instanceData }) => {
      const island = findIsland(componentInstance?.proxy)
      if (!island) return
      instanceData.state.push({ type: ISLAND_TYPE, key: 'within', value: island })
    })

    api.on.getInspectorTree(async (payload) => {
      if (payload.app !== app || payload.inspectorId !== INSPECTOR_ID) return
      const userFilter = payload.filter?.toLowerCase() || ''
      const islandNodes = islands.value
        .filter((island: any) => island.id.includes(userFilter) || island.componentName.toLowerCase().includes(userFilter))
        .map((island: any) => ({
          id: island.id,
          label: island.componentName,
          tags: [
            { label: island.id, textColor: 0, ...frameworkColors[island.framework] },
            { label: getStrategy(island), textColor: 0, backgroundColor: 0x22D3EE },
            getMediaQuery(island) && { label: getMediaQuery(island), textColor: 0, backgroundColor: 0xFB923C },
          ].filter(x => x) as InspectorNodeTag[],
        }))
      payload.rootNodes = [{
        id: meta.href,
        label: getComponentName(page.value),
        children: islandNodes,
        tags: [
          { label: page.value.layoutName ?? 'no layout', textColor: 0, backgroundColor: 0x42B983 },
        ],
      }]
    })

    api.on.getInspectorState((payload) => {
      if (payload.app !== app || payload.inspectorId !== INSPECTOR_ID) return

      if (payload.nodeId === route.path) {
        payload.state = {
          props: [
            { key: 'component', value: page.value },
            { key: 'layout', value: page.value.layoutName },
            { key: 'frontmatter', value: frontmatter },
            { key: 'meta', value: meta },
            { key: 'props', value: props.value },
            { key: 'site', value: site },
          ].filter(x => x),
        }
        return
      }

      const island = islandsById[payload.nodeId] as any
      if (!island) return
      const ileRoot = island.$el?.nextSibling
      payload.state = {
        props: [
          { key: 'component', value: island.component },
          { key: 'el', value: ileRoot?.children?.[0] || ileRoot },
          { key: 'strategy', value: getStrategy(island) },
          getMediaQuery(island) && { key: 'mediaQuery', value: getMediaQuery(island) },
          { key: 'framework', value: island.framework },
          { key: 'props', value: island.$attrs },
          { key: 'importName', value: island.importName },
          { key: 'importFrom', value: island.importFrom.replace(island.appConfig.root, '') },
        ].filter(x => x),
      }
    })
  })
}

function findIsland (component: any): any {
  if (!component) return null
  if (component.strategy?.startsWith('client:')) return component
  return findIsland(component.$parent)
}

function getStrategy (island: any) {
  return strategyLabels[island.strategy]
}

function getMediaQuery (island: any) {
  if (island.strategy === 'client:media') return island['client:media']
}

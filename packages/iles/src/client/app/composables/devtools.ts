import type { App, ComponentPublicInstance } from 'vue'
import { reactive, computed } from 'vue'
import type { InspectorNodeTag, DevtoolsPluginApi } from '@vue/devtools-api'
import { setupDevtoolsPlugin } from '@vue/devtools-api'
import type { AppClientConfig, PageData } from '../../shared'
import { getComponentName } from '../utils'
import { usePage } from 'iles'

const ISLAND_TYPE = 'Islands 🏝'
const componentStateTypes = [ISLAND_TYPE]

const INSPECTOR_ID = 'iles'
const HYDRATION_LAYER_ID = 'iles:hydration'

const islandsById = reactive<Record<string, ComponentPublicInstance>>({})
const islands = computed(() => Object.values(islandsById))

const strategyLabels: Record<string, any> = {
  'client:idle': 'whenIdle',
  'client:load': 'instant',
  'client:media': 'onMediaQuery',
  'client:only': 'noPrerender',
  'client:visible': 'whenVisible',
}

let devtoolsApi: DevtoolsPluginApi
let appConfig: AppClientConfig
let pageData: PageData

const devtools = {
  updateIslandsInspector () {
    devtoolsApi?.sendInspectorTree(INSPECTOR_ID)
  },

  addIslandToDevtools (island: any) {
    islandsById[island.id] = island
    devtools.updateIslandsInspector()
    devtoolsApi?.selectInspectorNode(INSPECTOR_ID, pageData?.route?.value?.path)
  },

  removeIslandFromDevtools (island: any) {
    delete islandsById[island.id]
    devtools.updateIslandsInspector()
  },

  onHydration ({ id, ...event }: any) {
    const time = Date.now()
    const island: any = islandsById[id]
    const hydrated = getStrategy(island)
    const mediaQuery = getMediaQuery(island)
    const component = island.componentName

    const data = { event, hydrated, ...(mediaQuery ? { mediaQuery } : {}) }
    devtoolsApi?.addTimelineEvent({
      layerId: HYDRATION_LAYER_ID,
      event: { time, title: component, subtitle: hydrated, data },
    })

    if (appConfig?.debug) {
      const { el, slots } = event
      console.info(`🏝 hydrated ${component}`, el, slots)
    }
  },
}

;(window as any).__ILE_DEVTOOLS__ = devtools

export function installDevtools (app: App, config: AppClientConfig) {
  appConfig = config
  pageData = usePage(app)

  setupDevtoolsPlugin({
    id: 'com.maximomussini.iles',
    label: ISLAND_TYPE,
    logo: 'https://vue-iles.netlify.app/favicon.svg',
    packageName: 'iles',
    homepage: 'https://github.com/ElMassimo/iles',
    componentStateTypes,
    app,
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
      if (payload.app !== app && payload.inspectorId !== INSPECTOR_ID) return
      const userFilter = payload.filter?.toLowerCase() || ''
      const islandNodes = islands.value
        .filter((island: any) => island.id.includes(userFilter) || island.componentName.toLowerCase().includes(userFilter))
        .map((island: any) => ({
          id: island.id,
          label: island.componentName,
          tags: [
            { label: island.id, textColor: 0, backgroundColor: 0x42B983 },
            { label: getStrategy(island), textColor: 0, backgroundColor: 0x22D3EE },
            getMediaQuery(island) && { label: getMediaQuery(island), textColor: 0, backgroundColor: 0xFB923C },
          ].filter(x => x) as InspectorNodeTag[],
        }))
      const page = pageData.page.value
      payload.rootNodes = [{
        id: page.meta?.href,
        label: getComponentName(page),
        children: islandNodes,
        tags: [
          { label: page.layoutName ?? 'no layout', textColor: 0, backgroundColor: 0x42B983 },
        ],
      }]
    })

    api.on.getInspectorState((payload, ctx) => {
      if (payload.app !== app && payload.inspectorId !== INSPECTOR_ID) return

      if (payload.nodeId === pageData.route.value.path) {
        const page = pageData.page.value
        payload.state = {
          props: [
            { key: 'component', value: page },
            { key: 'layout', value: page.layoutName },
            { key: 'meta', value: page.meta },
            { key: 'frontmatter', value: page.frontmatter },
          ].filter(x => x),
        }
        return
      }

      const island = islandsById[payload.nodeId] as any
      if (!island) return
      payload.state = {
        props: [
          { key: 'component', value: island.component },
          { key: 'el', value: island.$el?.nextSibling },
          { key: 'strategy', value: getStrategy(island) },
          getMediaQuery(island) && { key: 'mediaQuery', value: getMediaQuery(island) },
          { key: 'importName', value: island.importName },
          { key: 'importPath', value: island.importPath.replace(island.appConfig.root, '') },
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

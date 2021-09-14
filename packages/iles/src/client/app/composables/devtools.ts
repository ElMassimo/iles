import type { App, ComponentPublicInstance } from 'vue'
import { reactive, computed } from 'vue'
import type { InspectorNodeTag, DevtoolsPluginApi } from '@vue/devtools-api'
import { setupDevtoolsPlugin } from '@vue/devtools-api'
import type { AppConfig } from '../../shared'

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
let appConfig: AppConfig

const devtools = {
  addIslandToDevtools (island: any) {
    islandsById[island.id] = island
    devtoolsApi?.sendInspectorTree(INSPECTOR_ID)
  },

  removeIslandFromDevtools (island: any) {
    delete islandsById[island.id]
    devtoolsApi?.sendInspectorTree(INSPECTOR_ID)
  },

  onHydration ({ id, ...event }: any) {
    const island: any = islandsById[id]
    const hydrated = getStrategy(island)
    devtoolsApi?.addTimelineEvent({
      layerId: HYDRATION_LAYER_ID,
      event: {
        time: Date.now(),
        title: island.componentName,
        subtitle: hydrated,
        data: { ...event, hydrated },
      },
    })
    if (appConfig?.debug) {
      const { el, slots } = event
      console.log(`🏝 hydrated ${island.componentName}`, el, slots)
    }
  },
}

export function installDevtools (app: App, config: AppConfig) {
  appConfig = config
  ;(window as any).__ILE_DEVTOOLS__ = devtools

  setupDevtoolsPlugin({
    id: 'com.maximomussini.iles',
    label: ISLAND_TYPE,
    logo: 'https://vue-iles.netlify.app/favicon.svg',
    packageName: 'iles',
    homepage: 'https://github.com/ElMassimo/iles',
    componentStateTypes,
    app,
  }, (api) => {
    (devtools as any).api = api
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
      label: '🏝 Hydration',
    })

    api.on.inspectComponent(({ componentInstance, instanceData }) => {
      const island = findIsland(componentInstance?.proxy)
      if (!island) return
      instanceData.state.push({
        type: ISLAND_TYPE,
        key: 'id',
        value: {
          _custom: {
            display: island.id,
            actions: [
              {
                icon: 'open_in_new',
                tooltip: 'Open in Islands Inspector',
                action () {
                  api.selectInspectorNode(INSPECTOR_ID, island.id)
                },
              },
            ],
          },
        },
      })
    })

    api.on.getInspectorTree((payload) => {
      if (payload.app !== app && payload.inspectorId !== INSPECTOR_ID) return
      const filter = payload.filter?.toLowerCase() || ''
      payload.rootNodes = islands.value
        .filter((island: any) => island.id.includes(filter) || island.componentName.toLowerCase().includes(filter))
        .map((island: any) => ({
          id: island.id,
          label: island.componentName,
          tags: [
            { label: island.id, textColor: 0, backgroundColor: 0x42B983 },
            { label: getStrategy(island), textColor: 0, backgroundColor: 0x22D3EE },
            island.strategy === 'client:media' && { label: island['client:media'], textColor: 0, backgroundColor: 0xFB923C },
          ].filter(x => x) as InspectorNodeTag[],
        }))
    })

    api.on.getInspectorState((payload, ctx) => {
      if (payload.app !== app && payload.inspectorId !== INSPECTOR_ID) return
      const island = islandsById[payload.nodeId] as any
      if (!island) return
      payload.state = {
        props: [
          { key: 'el', value: island.$el?.nextSibling },
          { key: 'strategy', value: getStrategy(island) },
          { key: 'component', value: island.component },
          { key: 'importName', value: island.importName },
          { key: 'importPath', value: island.importPath.replace(island.appConfig.root, '') },
        ],
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

import type { App, ComponentPublicInstance } from 'vue'
import { reactive, computed } from 'vue'
import { DevtoolsPluginApi, setupDevtoolsPlugin } from '@vue/devtools-api'

const ISLAND_TYPE = 'Islands 🏝'
const componentStateTypes = [ISLAND_TYPE]

const INSPECTOR_ID = 'iles'

const islandsById = reactive<Record<string, ComponentPublicInstance>>({})
const islands = computed(() => Object.values(islandsById))

let devtoolsApi: DevtoolsPluginApi

const strategyLabels = {
  'client:idle': 'whenIdle',
  'client:load': 'instant',
  'client:media': 'onMediaQuery',
  'client:only': 'noPrerender',
  'client:visible': 'whenVisible',
}

export function addIslandToDevtools (island: any) {
  islandsById[island.id] = island
  devtoolsApi?.sendInspectorTree(INSPECTOR_ID)
}

export function removeIslandFromDevtools (island: any) {
  delete islandsById[island.id]
  devtoolsApi?.sendInspectorTree(INSPECTOR_ID)
}

export function installDevtools (app: App) {
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
      icon: 'water',
      treeFilterPlaceholder: 'Search islands',
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
            { label: island.id, textColor: 0, backgroundColor: 0x84CC16 },
            { label: (strategyLabels as any)[island.strategy], textColor: 0, backgroundColor: 0x22D3EE },
            island.strategy === 'client:media' && { label: island['client:media'], textColor: 0, backgroundColor: 0xFB923C },
          ].filter(x => x),
        }))
    })

    api.on.getInspectorState((payload, ctx) => {
      if (payload.app !== app && payload.inspectorId !== INSPECTOR_ID) return
      const island = islandsById[payload.nodeId] as any
      if (!island) return
      payload.state = {
        props: [
          { key: 'id', value: island.id },
          { key: 'strategy', value: (strategyLabels as any)[island.strategy] },
          { key: 'componentName', value: island.componentName },
          { key: 'importName', value: island.importName },
          { key: 'importPath', value: island.importPath.replace(island.appConfig.root, '') },
          {
            key: 'el',
            value: {
              _custom: {
                display: 'ile-root',
                actions: [
                  {
                    icon: 'preview',
                    tooltip: 'Show Element',
                    action () {
                      api.highlightElement(island)
                    },
                  },
                ],
              },
            },
          },
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

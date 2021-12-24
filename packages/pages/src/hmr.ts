import { ViteDevServer } from 'vite'
import { debug, slash } from './utils'
import { Awaitable, MODULE_ID, ResolvedOptions, PagesApi } from './types'

export function handleHMR (api: PagesApi, options: ResolvedOptions, clearRoutes: () => void) {
  const server = options.server!

  onPage('add', async (path) => {
    await api.addPage(path)
    debug.hmr('add', path)
    return true
  })

  onPage('unlink', (path) => {
    api.removePage(path)
    debug.hmr('remove', path)
    return true
  })

  onPage('change', async (path) => {
    const { changed, needsReload } = await api.updatePage(path)
    if (changed) {
      invalidatePageFiles(path, server)
      debug.hmr('change', path)
      return needsReload
    } else {
      const info = server.pluginContainer.getModuleInfo(path)
      if (info) info.meta = { sameFrontmatter: true, ...info.meta }
    }
  })

  function onPage (eventName: string, handler: (path: string) => Awaitable<void | boolean>) {
    server.watcher.on(eventName, async (path) => {
      path = slash(path)
      if (api.isPage(path) && await handler(path))
        fullReload()
    })
  }

  function fullReload () {
    invalidatePagesModule(server)
    clearRoutes()
    server.ws.send({ type: 'full-reload' })
  }
}

function invalidatePageFiles (path: string, { moduleGraph }: ViteDevServer) {
  moduleGraph.getModulesByFile(path)
    ?.forEach(mod => moduleGraph.invalidateModule(mod))
}

function invalidatePagesModule ({ moduleGraph }: ViteDevServer) {
  const mod = moduleGraph.getModuleById(MODULE_ID)
  if (mod) moduleGraph.invalidateModule(mod)
}

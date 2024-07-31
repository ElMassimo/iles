import type { Plugin, ViteDevServer } from 'vite'
import { debug, slash } from './utils'
import type { Awaitable, PagesApi, ResolvedOptions } from './types'
import { MODULE_ID } from './types'

export function handleHMR(api: PagesApi, options: ResolvedOptions, clearRoutes: () => void): Plugin['handleHotUpdate'] {
  const server = options.server!

  onPage('add', async (path) => {
    const page = await api.addPage(path)
    debug.hmr('add %s %O', path, page)
    return true
  })

  onPage('unlink', (path) => {
    api.removePage(path)
    debug.hmr('remove', path)
    return true
  })

  return async (ctx) => {
    const path = slash(ctx.file)
    if (api.isPage(path)) {
      const { changed, needsReload } = await api.updatePage(path)
      if (changed) { debug.hmr('change', path) }
      if (needsReload) { fullReload() }
    }
  }

  function onPage(eventName: string, handler: (path: string) => Awaitable<void | boolean>) {
    server.watcher.on(eventName, async (path) => {
      path = slash(path)
      if (api.isPage(path) && await handler(path)) { fullReload() }
    })
  }

  function fullReload() {
    invalidatePagesModule(server)
    clearRoutes()
    server.ws.send({ type: 'full-reload' })
  }
}

function invalidatePageFiles(path: string, { moduleGraph }: ViteDevServer) {
  moduleGraph.getModulesByFile(path)
    ?.forEach(mod => moduleGraph.invalidateModule(mod))
}

function invalidatePagesModule({ moduleGraph }: ViteDevServer) {
  const mod = moduleGraph.getModuleById(MODULE_ID)
  if (mod) { moduleGraph.invalidateModule(mod) }
}

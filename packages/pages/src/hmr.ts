import type { ViteDevServer, Plugin } from 'vite-plus'
import { debug, slash } from './utils'
import { MODULE_ID, ResolvedOptions, PagesApi } from './types'

export function handleHMR (api: PagesApi, options: ResolvedOptions, clearRoutes: () => void): Plugin['hotUpdate'] {
  const server = options.server!

  return async function ({ file, type }) {
    const path = slash(file)
    if (api.isPage(path)) {
      switch (type) {
        case 'create': {
          const page = await api.addPage(path)
          debug.hmr('add %s %O', path, page)
          fullReload()
          return []
        }
        case 'delete': {
          api.removePage(path)
          debug.hmr('remove', path)
          fullReload()
          return []
        }
        case 'update': {
          const { changed, needsReload } = await api.updatePage(path)
          if (changed) debug.hmr('change', path)
          if (needsReload) fullReload()
        }
      }
    }
  }

  function fullReload () {
    invalidatePagesModule(server)
    clearRoutes()
    server.ws.send({ type: 'full-reload' })
  }
}

function invalidatePagesModule ({ moduleGraph }: ViteDevServer) {
  const mod = moduleGraph.getModuleById(MODULE_ID)
  if (mod) moduleGraph.invalidateModule(mod)
}

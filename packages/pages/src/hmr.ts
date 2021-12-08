import { ViteDevServer } from 'vite'
import { invalidatePagesModule, checkRouteBlockChanges, isPage, supportsCustomBlock, debug, slash } from './utils'
import { removePage, addPage, updatePage } from './pages'
import { MODULE_ID, ResolvedOptions, PagesByFile } from './types'

export function handleHMR (pages: PagesByFile, options: ResolvedOptions, clearRoutes: () => void) {
  const { isPage, server } = options
  const { ws, watcher, moduleGraph } = server

  watcher.on('add', async (file) => {
    const path = slash(file)
    if (isPage(path)) {
      await addPage(path, pages, options)
      debug.hmr('add', path)
      fullReload()
    }
  })
  watcher.on('unlink', (file) => {
    const path = slash(file)
    if (isPage(path)) {
      pages.delete(path)
      debug.hmr('remove', path)
      fullReload()
    }
  })
  watcher.on('change', async (file) => {
    const path = slash(file)
    if (isPage(path)) {
      const { changed, needsReload } = updatePage(path, pages, options)
      if (changed) {
        moduleGraph.getModulesByFile(file)?.forEach(mod => moduleGraph.invalidateModule(mod))
        debug.hmr('change', path)
        if (needsReload) fullReload()
      }
    }
  })

  function fullReload () {
    invalidatePagesModule(server)
    clearRoutes()
    ws.send({ type: 'full-reload' })
  }
}

export function invalidatePagesModule ({ moduleGraph }: ViteDevServer) {
  const mod = moduleGraph.getModuleById(MODULE_ID)
  if (mod) moduleGraph.invalidateModule(mod)
}

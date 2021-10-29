import type { ViteDevServer } from 'vite'
import { green } from 'nanocolors'
import { relative } from 'pathe'

import type { AppConfig } from '../shared'
import { createServer } from '../server'
import { ILES_APP_ENTRY } from '../alias'

const supportedAppExtensions = ['.html', '.xml', '.json', '.rss', '.atom']

const ILES_APP_HTML = `<!DOCTYPE html>
<html>
<body>
<div id="app"></div>
<script type="module" src="${ILES_APP_ENTRY}"></script>
</body>
</html>`

export function configureServer (server: ViteDevServer, config: AppConfig, defaultLayoutPath: string) {
  restartOnConfigChanges(server, config)

  // Fallback when the user has not created a default layout.
  server.middlewares.use(defaultLayoutPath, (_req, res, next) => {
    res.statusCode = 200
    res.setHeader('content-type', 'text/javascript')
    res.end('export default false')
  })

  server.middlewares.use('/__iles_api', (req, res) => {
    const [pathname,] = (req.url || '').split('?', 2)

    if (pathname === '/markdown') {
      res.write(JSON.stringify({ root: config.root }, null, 2))
      res.end()
    }
  })

  // Run after Vite's 
  return () => {

    // Serve a default index.html for all paths as a fallback.
    server.middlewares.use(async (req, res, next) => {
    const url = req.url || ''
    if (!supportedAppExtensions.some(ext => url.endsWith(ext))) return next()

    res.statusCode = 200
    res.setHeader('content-type', 'text/html')

    const html = await server.transformIndexHtml(url, ILES_APP_HTML, req.originalUrl)
    res.end(html)
  })
}

async function restartOnConfigChanges (server: ViteDevServer, config: AppConfig) {
  const restartIfConfigChanged = async (path: string) => {
    if (path === config.configPath) {
      server.config.logger.info(
        green(
          `${relative(process.cwd(), config.configPath)} changed, restarting server...`,
        ),
        { clear: true, timestamp: true },
      )
      await server.close()
      // @ts-ignore
      global.__vite_start_time = Date.now()
      const { server: newServer } = await createServer(server.config.root, server.config.server)
      await newServer.listen()
    }
  }
  // Shut down the server and start a new one if config changes.
  server.watcher.add(config.configPath)
  server.watcher.on('add', restartIfConfigChanged)
  server.watcher.on('change', restartIfConfigChanged)
}

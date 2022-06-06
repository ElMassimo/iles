import fs from 'fs'
import crypto from 'crypto'
import { resolve } from 'path'
import { performance } from 'perf_hooks'
import type { IlesModule, UserConfig } from 'iles'
import type { VitePluginPWAAPI, VitePWAOptions } from 'vite-plugin-pwa'
import type { Plugin, PluginOption, LogLevel } from 'vite'
import type { ManifestEntry } from 'workbox-build'
import { VitePWA } from 'vite-plugin-pwa'

function timeSince (start: number): string {
  const diff = performance.now() - start
  return diff < 750 ? `${Math.round(diff)}ms` : `${(diff / 1000).toFixed(1)}s`
}

function configureDefaults (config: UserConfig, options: Partial<VitePWAOptions> = {}): Partial<VitePWAOptions> {
  const {
    strategies = 'generateSW',
    registerType = 'prompt',
    workbox = {},
    ...rest
  } = options

  if (strategies === 'generateSW') {
    const useWorkbox = { ...workbox }
    const newOptions: Partial<VitePWAOptions> = { ...rest, strategies, registerType }
    // we use route names: use Vite base or its default
    if (!useWorkbox.navigateFallback || useWorkbox.navigateFallback.endsWith('.html'))
      useWorkbox.navigateFallback = config.vite?.base || '/'

    if (registerType === 'autoUpdate') {
      // we don't need registerSW.js
      newOptions.injectRegister = null
      if (useWorkbox.clientsClaim === undefined)
        useWorkbox.clientsClaim = true

      if (useWorkbox.skipWaiting === undefined)
        useWorkbox.skipWaiting = true
    }

    newOptions.workbox = useWorkbox

    return newOptions
  }

  return options
}

function buildManifestEntry (
  url: string,
  path: string,
): Promise<ManifestEntry> {
  return new Promise((resolve, reject) => {
    const cHash = crypto.createHash('MD5')
    const stream = fs.createReadStream(path)
    stream.on('error', (err) => {
      reject(err)
    })
    stream.on('data', (chunk) => {
      cHash.update(chunk)
    })
    stream.on('end', () => {
      return resolve({
        url,
        revision: `${cHash.digest('hex')}`,
      })
    })
  })
}

/**
 * An iles module that configures vite-plugin-pwa and
 * regenerates the PWA when SSG is finished.
 *
 * @param options - Optional options to configure the output.
 */
export default function IlesPWA (options: Partial<VitePWAOptions> = {}): IlesModule {
  let api: VitePluginPWAAPI | undefined
  return {
    name: '@islands/pwa',
    config (config) {
      const plugins = config.vite?.plugins
      const plugin = plugins?.flat(Infinity).find(p => p.name === 'vite-plugin-pwa')
      if (plugin) {
        api = plugin.api
      }
      else {
        const pluginPWA = VitePWA(configureDefaults(config, options))
        api = pluginPWA.find(p => p.name === 'vite-plugin-pwa')?.api
        return {
          vite: {
            plugins: [pluginPWA],
          },
        }
      }
    },
    ssg: {
      async onSiteRendered ({ pages, config: { outDir } }) {
        if (api && !api.disabled) {
          console.info('Regenerating PWA service worker...')
          const startTime = performance.now()
          const addRoutes = await Promise.all(pages.map((r) => {
            return buildManifestEntry(r.path, resolve(outDir, r.outputFilename))
          }))
          api.extendManifestEntries((manifestEntries) => {
            manifestEntries.push(...addRoutes)
            return manifestEntries
          })
          // generate the manifest.webmanifest file
          api.generateBundle()
          // regenerate the sw
          await api.generateSW()
          console.info(`\n√  PWA done in ${timeSince(startTime)}\n`)
        }
      },
    },
  }
}

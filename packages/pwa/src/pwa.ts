import fs from 'fs'
import crypto from 'crypto'
import { resolve } from 'path'
import type { IlesModule } from 'iles'
import type { VitePluginPWAAPI, VitePWAOptions } from 'vite-plugin-pwa'
import type { Plugin, PluginOption, LogLevel } from 'vite'
import type { ManifestEntry } from 'workbox-build'
import { VitePWA } from 'vite-plugin-pwa'

function lookupPWAVitePlugin (plugins: PluginOption[]): Plugin | undefined {
  for (const p of plugins) {
    if (p) {
      if (Array.isArray(p)) {
        const pwa = p.find(p1 =>
          p1
            && !Array.isArray(p1)
            && p1.name === 'vite-plugin-pwa',
        )
        if (pwa)
          return pwa as Plugin
      }
      else {
        if (p.name === 'vite-plugin-pwa')
          return p
      }
    }
  }

  return undefined
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
      const plugin = plugins ? lookupPWAVitePlugin(plugins) : undefined

      // todo@userquin: handle here skipWaiting, clientsClaim, navigateFallback and injectRegister
      // todo@maximo: it providing the plugin there is no way to access/change the pwa plugin configuration
      if (plugin) {
        throw new Error('Provide vite-plugin-pwa options on @islands/pwa module, remove vite-plugin-pwa from vite.plugins')
      }
      else {
        const pluginPWA = VitePWA(options)
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
          // todo@userquin: remove dynamic pages
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
        }
      },
    },
  }
}

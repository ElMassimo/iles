import fs from 'fs'
import crypto from 'crypto'
import { resolve } from 'path'
import { performance } from 'perf_hooks'
import type { IlesModule, RouteToRender, UserConfig } from 'iles'
import type { VitePluginPWAAPI, VitePWAOptions } from 'vite-plugin-pwa'
import type { ManifestEntry, ManifestTransform } from 'workbox-build'
import { VitePWA } from 'vite-plugin-pwa'

interface ManifestTransformData {
  outDir: string
  pages: RouteToRender[]
}

interface EnableManifestTransformData {
  enable: boolean
  data?: ManifestTransformData
}

type EnableManifestTransform = () => EnableManifestTransformData

function timeSince (start: number): string {
  const diff = performance.now() - start
  return diff < 750 ? `${Math.round(diff)}ms` : `${(diff / 1000).toFixed(1)}s`
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

async function buildManifestEntryTransform (
  ssgUrl: string,
  path: string,
): Promise<ManifestEntry & { size: number }> {
  const [size, { url, revision }] = await Promise.all([
    new Promise<number>((resolve, reject) => {
      fs.lstat(path, (err, stats) => {
        if (err)
          reject(err)
        else
          resolve(stats.size)
      })
    }),
    buildManifestEntry(ssgUrl, path),
  ])
  return { url, revision, size }
}

function createManifestTransform (enableManifestTransform: EnableManifestTransform): ManifestTransform {
  return async (entries) => {
    const { enable, data } = enableManifestTransform()
    if (enable && data) {
      const { outDir, pages } = data
      const manifest = entries.filter(e => !e.url.endsWith('.html'))
      const addRoutes = await Promise.all(pages.map((r) => {
        return buildManifestEntryTransform(r.path, resolve(outDir, r.outputFilename))
      }))
      manifest.push(...addRoutes)
      return { manifest }
    }

    return { manifest: entries }
  }
}

function configureDefaults (
  config: UserConfig,
  enableManifestTransform: EnableManifestTransform,
  options: Partial<VitePWAOptions> = {},
): Partial<VitePWAOptions> {
  const {
    strategies = 'generateSW',
    registerType = 'prompt',
    injectRegister,
    workbox = {},
    injectManifest = {},
    ...rest
  } = options

  if (strategies === 'generateSW') {
    const useWorkbox = { ...workbox }
    const newOptions: Partial<VitePWAOptions> = {
      ...rest,
      strategies,
      registerType,
      injectRegister,
    }
    const prettyUrls = config.prettyUrls ?? true
    if (!useWorkbox.navigateFallback && prettyUrls)
      useWorkbox.navigateFallback = config.vite?.base ?? '/'

    newOptions.workbox = useWorkbox

    newOptions.workbox.manifestTransforms = newOptions.workbox.manifestTransforms ?? []
    newOptions.workbox.manifestTransforms.push(createManifestTransform(enableManifestTransform))

    return newOptions
  }

  // we don't need registerSW.js if not configured
  if (injectRegister === undefined) {
    injectManifest.manifestTransforms = injectManifest.manifestTransforms ?? []
    injectManifest.manifestTransforms.push(createManifestTransform(enableManifestTransform))
    return {
      ...rest,
      strategies,
      registerType,
      injectManifest,
      injectRegister: null,
    }
  }

  options.injectManifest = options.injectManifest ?? {}
  options.injectManifest.manifestTransforms = injectManifest.manifestTransforms ?? []
  options.injectManifest.manifestTransforms.push(createManifestTransform(enableManifestTransform))

  return options
}

/**
 * An iles module that configures vite-plugin-pwa and
 * regenerates the PWA when SSG is finished.
 *
 * @param options - Optional options to configure the output.
 */
export default function IlesPWA (options: Partial<VitePWAOptions> = {}): IlesModule {
  let api: VitePluginPWAAPI | undefined
  let enable = false
  let data: ManifestTransformData | undefined
  let enableManifestTransform: EnableManifestTransform | undefined
  return {
    name: '@islands/pwa',
    config (config) {
      const plugin = config.vite?.plugins?.flat(Infinity).find(p => p.name === 'vite-plugin-pwa')
      if (plugin) {
        throw new Error('Remove the vite-plugin-pwa plugin from Vite plugins entry in iles config file, configure it via @islands/pwa plugin')
      }
      else {
        enableManifestTransform = () => {
          return { enable, data }
        }
        const pluginPWA = VitePWA(configureDefaults(config, enableManifestTransform, options))
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
          enable = true
          data = { outDir, pages }
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

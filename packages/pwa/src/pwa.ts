import { performance } from 'perf_hooks'
import type { IlesModule, UserConfig } from 'iles'
import type { VitePluginPWAAPI, VitePWAOptions } from 'vite-plugin-pwa'
import type { ManifestTransform } from 'workbox-build'
import { VitePWA } from 'vite-plugin-pwa'

interface PWAContext {
  enabled: boolean
  prettyUrls: boolean
  base: string
}

type PWAContextResolver = () => PWAContext

function timeSince (start: number): string {
  const diff = performance.now() - start
  return diff < 750 ? `${Math.round(diff)}ms` : `${(diff / 1000).toFixed(1)}s`
}

function createManifestTransform (resolve: PWAContextResolver): ManifestTransform {
  return async (entries) => {
    const { base, enabled, prettyUrls } = resolve()
    // entries already in the precache manifest, we only need to change the mapping when prettyUrls is enabled
    if (enabled && prettyUrls) {
      entries.filter(e => e.url.endsWith('.html')).forEach((e) => {
        if (e.url === 'index.html')
          e.url = base
        else
          e.url = e.url.replace(/\.html$/, '')
      })
    }

    return { manifest: entries }
  }
}

function configureDefaults (
  config: UserConfig,
  resolve: PWAContextResolver,
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

    newOptions.workbox = useWorkbox

    newOptions.workbox.manifestTransforms = newOptions.workbox.manifestTransforms ?? []
    newOptions.workbox.manifestTransforms.push(createManifestTransform(resolve))

    // configure 404 navigation fallback only if not already configured
    if (!useWorkbox.navigateFallback) {
      newOptions.integration = {
        configureOptions (_, pwaOptions) {
          // pwaOptions is the same as newOptions: just adding this, linter complains
          pwaOptions.workbox = pwaOptions.workbox ?? {}
          const { base, prettyUrls } = resolve()
          if (prettyUrls)
            pwaOptions.workbox.navigateFallback = `${base}404`
          else
            pwaOptions.workbox.navigateFallback = `${base}404.html`
        },
      }
    }

    return newOptions
  }

  options.injectManifest = options.injectManifest ?? {}
  options.injectManifest.manifestTransforms = injectManifest.manifestTransforms ?? []
  options.injectManifest.manifestTransforms.push(createManifestTransform(resolve))

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
  const ctx: PWAContext = {
    enabled: false,
    prettyUrls: true,
    base: '/',
  }
  const resolver: PWAContextResolver = () => {
    return ctx
  }
  return {
    name: '@islands/pwa',
    config (config) {
      const plugin = config.vite?.plugins?.flat(Infinity).find(p => p.name === 'vite-plugin-pwa')
      if (plugin)
        throw new Error('Remove the vite-plugin-pwa plugin from Vite plugins entry in iles config file, configure it via @islands/pwa plugin')

      const pluginPWA = VitePWA(configureDefaults(config, resolver, options))
      api = pluginPWA.find(p => p.name === 'vite-plugin-pwa')?.api
      return {
        vite: {
          plugins: [pluginPWA],
        },
      }
    },
    configResolved ({ base, prettyUrls }) {
      // the hook will be called before the pwa plugin integration hook
      ctx.base = base
      ctx.prettyUrls = prettyUrls
    },
    ssg: {
      async onSiteRendered () {
        if (api && !api.disabled) {
          console.info('Regenerating PWA service worker...')
          const startTime = performance.now()
          ctx.enabled = true
          // regenerate the sw
          await api.generateSW()
          console.info(`\n√  PWA done in ${timeSince(startTime)}\n`)
        }
      },
    },
  }
}

import path from 'path'
import ora from 'ora'
import { RollupOutput } from 'rollup'
import { build, BuildOptions, mergeConfig as mergeViteConfig, UserConfig as ViteUserConfig } from 'vite'
import { resolvePages, resolveOptions as resolvePageOptions } from 'vite-plugin-pages'
import { APP_PATH } from '../alias'
import { AppConfig } from '../shared'
import IslandsPlugins from '../plugin'
import { fileToAssetName, okMark, failMark } from './utils'

// Internal: Bundles the Islands app for both client and server.
//
// Multi-entry build: every page is considered an entry chunk.
export async function bundle (config: AppConfig, options: BuildOptions) {
  const { root } = config

  const input: Record<string, string> = {
    app: path.resolve(APP_PATH, 'index.js'),
  }

  const pageOptions = resolvePageOptions(config.pages, root)
  const pages = await resolvePages(pageOptions)

  pages.forEach(page => {
    input[fileToAssetName(page.route)] = page.filepath
  })

  // resolve options to pass to vite
  const { rollupOptions } = options

  const resolveViteConfig = (ssr: boolean): ViteUserConfig => mergeViteConfig(config.vite, {
    logLevel: 'warn',
    ssr: {
      external: ['vue', '@vue/server-renderer'],
      noExternal: ['iles'],
    },
    plugins: IslandsPlugins(config),
    build: {
      ...options,
      emptyOutDir: true,
      ssr,
      outDir: ssr ? config.tempDir : config.outDir,
      cssCodeSplit: false,
      manifest: !ssr,
      rollupOptions: {
        ...rollupOptions,
        input,
        // important so that each page chunk and the index export things for each
        // other
        preserveEntrySignatures: 'allow-extension',
        output: {
          ...rollupOptions?.output,
          ...(ssr
            ? {}
            : {
              chunkFileNames (chunk) {
                if (!chunk.isEntry && /runtime/.test(chunk.name))
                  return 'assets/framework.[hash].js'

                return 'assets/[name].[hash].js'
              },
            }),
        },
      },
    },
  } as ViteUserConfig)

  let clientResult: RollupOutput
  let serverResult: RollupOutput

  const spinner = ora()
  spinner.start('building client + server bundles...')
  try {
    [clientResult, serverResult] = await (Promise.all([
      build(resolveViteConfig(false)),
      build(resolveViteConfig(true)),
    ]) as Promise<[RollupOutput, RollupOutput]>)
  }
  catch (e) {
    spinner.stopAndPersist({
      symbol: failMark,
    })
    throw e
  }
  spinner.stopAndPersist({
    symbol: okMark,
  })

  return { clientResult, serverResult, pages }
}

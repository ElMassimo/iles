import path from 'path'
import ora from 'ora'
import { RollupOutput } from 'rollup'
import { build, BuildOptions, UserConfig as ViteUserConfig } from 'vite'
import { resolvePages, resolveOptions as resolvePageOptions } from 'vite-plugin-pages'
import { APP_PATH } from '../alias'
import { AppConfig } from '../shared'
import { slash } from './utils'

// Internal: Bundles the Islands app for both client and server.
export async function bundle (config: AppConfig, options: BuildOptions) {
  const { root, srcDir } = config

  // Multi-entry build: every page is considered an entry chunk.
  const input: Record<string, string> = {
    app: path.resolve(APP_PATH, 'index.js'),
  }

  const pageOptions = resolvePageOptions(config.pages, root)
  const pages = await resolvePages(pageOptions)

  // pages.forEach((page, file) => {
  //   // page filename conversion
  //   // foo/bar.md -> foo_bar.md
  //   input[slash(file).replace(/\//g, '_')] = path.resolve(srcDir, file)
  // })
  console.warn({ pages })

  // const pageToHashMap = Object.create(null)
  // // resolve options to pass to vite
  // const { rollupOptions } = options

  // const resolveViteConfig = (ssr: boolean): ViteUserConfig => ({
  //   root: srcDir,
  //   base: config.site.base,
  //   logLevel: 'warn',
  //   plugins: createVitePressPlugin(root, config, ssr, pageToHashMap),
  //   // @ts-ignore
  //   ssr: {
  //     external: ['iles', 'vue', '@vue/server-renderer'],
  //   },
  //   build: {
  //     ...options,
  //     emptyOutDir: true,
  //     ssr,
  //     outDir: ssr ? config.tempDir : config.outDir,
  //     cssCodeSplit: false,
  //     rollupOptions: {
  //       ...rollupOptions,
  //       input,
  //       // important so that each page chunk and the index export things for each
  //       // other
  //       preserveEntrySignatures: 'allow-extension',
  //       output: {
  //         ...rollupOptions?.output,
  //         ...(ssr
  //           ? {}
  //           : {
  //             chunkFileNames (chunk): string {
  //               console.log('chunkFileNames', chunk.name)
  //               if (!chunk.isEntry && /runtime/.test(chunk.name))
  //                 return 'assets/framework.[hash].js'

  //               return 'assets/[name].[hash].js'
  //             },
  //           }),
  //       },
  //     },
  //     minify: ssr ? false : !process.env.DEBUG,
  //   },
  // })

  // let clientResult: RollupOutput
  // let serverResult: RollupOutput

  // const spinner = ora()
  // spinner.start('building client + server bundles...')
  // try {
  //   [clientResult, serverResult] = await (Promise.all([
  //     build(resolveViteConfig(false)),
  //     build(resolveViteConfig(true)),
  //   ]) as Promise<[RollupOutput, RollupOutput]>)
  // }
  // catch (e) {
  //   spinner.stopAndPersist({
  //     symbol: failMark,
  //   })
  //   throw e
  // }
  // spinner.stopAndPersist({
  //   symbol: okMark,
  // })

  // return { clientResult, serverResult, pageToHashMap }
}

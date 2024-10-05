import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { join, dirname, resolve } from 'pathe'
import { Alias, AliasOptions } from 'vite'
import type { UserConfig } from './shared'

const _dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

const PKG_ROOT = join(_dirname, '../../')
export const CONFIG_PATH = join(PKG_ROOT, 'config.js')
export const TURBO_SCRIPT_PATH = join(PKG_ROOT, 'turbo.js')
export const DIST_CLIENT_PATH = join(_dirname, '../client')
export const SHARED_PATH = join(DIST_CLIENT_PATH, 'shared')
export const APP_PATH = join(DIST_CLIENT_PATH, 'app', 'index.js')

const COMPONENTS_PATH = join(DIST_CLIENT_PATH, 'app/components')
export const APP_COMPONENT_PATH = join(COMPONENTS_PATH, 'App.vue')
export const ISLAND_COMPONENT_PATH = join(COMPONENTS_PATH, 'Island.vue')
export const NOT_FOUND_COMPONENT_PATH = join(COMPONENTS_PATH, 'NotFound.vue')
export const DEBUG_COMPONENT_PATH = join(COMPONENTS_PATH, 'DebugPanel.vue')
export const HYDRATION_DIST_PATH = join(dirname(require.resolve('@islands/hydration/package.json')), 'dist')

// special virtual file
// we can't directly import '/@islands' because
// - it's not an actual file so we can't use tsconfig paths to redirect it
// - TS doesn't allow shimming a module that starts with '/'
export const APP_CONFIG_ID = '@islands/app-config'
export const APP_CONFIG_REQUEST_PATH = `/${APP_CONFIG_ID}`

export const USER_APP_ID = '@islands/user-app'
export const USER_APP_REQUEST_PATH = `/${USER_APP_ID}`

export const USER_APP_ENHANCE_ISLANDS = 'virtual:enhance-islands'
export const USER_APP_ENHANCE_ISLANDS_RESOLVED = `\0${USER_APP_ENHANCE_ISLANDS}`

export const USER_SITE_ID = '@islands/user-site'
export const USER_SITE_REQUEST_PATH = `/${USER_SITE_ID}`

export const NOT_FOUND_REQUEST_PATH = '@islands/components/NotFound'

export function resolveAliases (root: string, userConfig: UserConfig): AliasOptions {
  const paths: Record<string, string> = {
    '/@shared': SHARED_PATH,
    [USER_APP_ID]: USER_APP_REQUEST_PATH,
    [USER_APP_ENHANCE_ISLANDS]: USER_APP_ENHANCE_ISLANDS_RESOLVED,
    [USER_SITE_ID]: USER_SITE_REQUEST_PATH,
    [APP_CONFIG_ID]: APP_CONFIG_REQUEST_PATH,
  }

  const { srcDir = 'src' } = userConfig

  const aliases: Alias[] = [
    ...Object.keys(paths).map(p => ({
      find: p,
      replacement: paths[p],
    })),
    {
      find: /^[~@]\//,
      replacement: `${resolve(root, srcDir)}/`,
    },
    {
      find: /^iles$/,
      replacement: join(DIST_CLIENT_PATH, 'index'),
    },
    { find: /^iles\//, replacement: `${PKG_ROOT}/` },
    // make sure it always use the same vue dependency that comes with
    // iles itself
    {
      find: /^vue$/,
      replacement: require.resolve(
        '@vue/runtime-dom/dist/runtime-dom.esm-bundler.js',
      ),
    },
    {
      find: /^vue-router$/,
      replacement: require.resolve(
        'vue-router/dist/vue-router.esm-bundler.js',
      ),
    },
    {
      find: /^@islands\/hydration$/,
      replacement: require.resolve('@islands/hydration'),
    },
    ...['vue', 'vanilla', 'svelte', 'preact', 'solid'].map(name => ({
      find: new RegExp(`^@islands/hydration/${name}$`),
      replacement: require.resolve(`@islands/hydration/${name}`),
    })),
  ]

  return aliases
}

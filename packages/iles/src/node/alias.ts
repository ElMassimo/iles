import { join, dirname, resolve } from 'pathe'
import { Alias, AliasOptions } from 'vite'

const PKG_ROOT = join(__dirname, '../../')
export const DIST_CLIENT_PATH = join(__dirname, '../client')
export const APP_PATH = join(DIST_CLIENT_PATH, 'app')
export const NOT_FOUND_COMPONENT_PATH = join(DIST_CLIENT_PATH, 'app/components/NotFound.vue')
export const SHARED_PATH = join(DIST_CLIENT_PATH, 'shared')
export const HYDRATION_DIST_PATH = join(dirname(require.resolve('@islands/hydration/package.json')), 'dist')

// special virtual file
// we can't directly import '/@islands' because
// - it's not an actual file so we can't use tsconfig paths to redirect it
// - TS doesn't allow shimming a module that starts with '/'
export const ROUTES_ID = '@islands/routes'
export const ROUTES_REQUEST_PATH = `/${ROUTES_ID}`

export const APP_CONFIG_ID = '@islands/app-config'
export const APP_CONFIG_REQUEST_PATH = `/${APP_CONFIG_ID}`

export const USER_APP_ID = '@islands/user-app'
export const USER_APP_REQUEST_PATH = `/${USER_APP_ID}`

export const USER_SITE_ID = '@islands/user-site'
export const USER_SITE_REQUEST_PATH = `/${USER_SITE_ID}`

export const NOT_FOUND_REQUEST_PATH = '@islands/components/NotFound'

export function resolveAliases (root: string): AliasOptions {
  const paths: Record<string, string> = {
    '/@shared': SHARED_PATH,
    [ROUTES_ID]: ROUTES_REQUEST_PATH,
    [USER_APP_ID]: USER_APP_REQUEST_PATH,
    [USER_SITE_ID]: USER_SITE_REQUEST_PATH,
    [APP_CONFIG_ID]: APP_CONFIG_REQUEST_PATH,
  }

  const aliases: Alias[] = [
    ...Object.keys(paths).map(p => ({
      find: p,
      replacement: paths[p],
    })),
    {
      find: /^[~@]\//,
      replacement: `${resolve(root, 'src')}/`,
    },
    {
      find: /^iles$/,
      replacement: join(__dirname, '../client/index'),
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
      find: /^@vueuse\/head$/,
      replacement: require.resolve(
        '@vueuse/head/dist/index.mjs',
      ),
    },
    {
      find: /^@vue\/devtools-api$/,
      replacement: require.resolve(
        '@vue/devtools-api/lib/esm/index.js',
      ),
    },
    {
      find: /^@islands\/hydration$/,
      replacement: `${HYDRATION_DIST_PATH}/hydration.js`,
    },
    {
      find: /^@islands\/hydration\/(vanilla|vue|svelte|solid|preact)$/,
      replacement: `${HYDRATION_DIST_PATH}/$1.js`,
    },
  ]

  return aliases
}

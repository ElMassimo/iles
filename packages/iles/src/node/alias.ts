import path from 'path'
import { Alias, AliasOptions } from 'vite'

const PKG_ROOT = path.join(__dirname, '../../')
export const DIST_CLIENT_PATH = path.join(__dirname, '../client')
export const APP_PATH = path.join(DIST_CLIENT_PATH, 'app')
export const SHARED_PATH = path.join(DIST_CLIENT_PATH, 'shared')

// special virtual file
// we can't directly import '/@siteData' because
// - it's not an actual file so we can't use tsconfig paths to redirect it
// - TS doesn't allow shimming a module that starts with '/'
export const SITE_DATA_ID = '@siteData'
export const SITE_DATA_REQUEST_PATH = `/${SITE_DATA_ID}`

export const ROUTES_ID = '@islands/routes'
export const ROUTES_REQUEST_PATH = `/${ROUTES_ID}`

export const USER_CONFIG_ID = '@islands/user-config'
export const USER_CONFIG_REQUEST_PATH = `/${USER_CONFIG_ID}`

export function resolveAliases (root: string): AliasOptions {
  const paths: Record<string, string> = {
    '/@shared': SHARED_PATH,
    [SITE_DATA_ID]: SITE_DATA_REQUEST_PATH,
    [ROUTES_ID]: ROUTES_REQUEST_PATH,
    [USER_CONFIG_ID]: USER_CONFIG_REQUEST_PATH,
  }

  const aliases: Alias[] = [
    ...Object.keys(paths).map(p => ({
      find: p,
      replacement: paths[p],
    })),
    {
      find: /^~\//,
      replacement: `${path.resolve(root, 'src')}/`,
    },
    {
      find: /^iles$/,
      replacement: path.join(__dirname, '../client/index'),
    },
    // alias for local linked development
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
      find: /^@islands\/hydration$/,
      replacement: require.resolve('@islands/hydration/dist/index.js'),
    },
  ]

  return aliases
}

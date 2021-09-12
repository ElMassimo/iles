import path from 'path'
import { Alias, AliasOptions } from 'vite'

const PKG_ROOT = path.join(__dirname, '../../')
export const DIST_CLIENT_PATH = path.join(__dirname, '../client')
export const APP_PATH = path.join(DIST_CLIENT_PATH, 'app')
export const SHARED_PATH = path.join(DIST_CLIENT_PATH, 'shared')
export const HYDRATION_DIST_PATH = path.join(path.dirname(require.resolve('@islands/hydration/package.json')), 'dist')

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

export function resolveAliases (root: string): AliasOptions {
  const paths: Record<string, string> = {
    '/@shared': SHARED_PATH,
    [ROUTES_ID]: ROUTES_REQUEST_PATH,
    [USER_APP_ID]: USER_APP_REQUEST_PATH,
    [APP_CONFIG_ID]: APP_CONFIG_REQUEST_PATH,
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

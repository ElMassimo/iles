import { UserApp, UserConfig, GetStaticPaths } from '../../types/shared'

export type {
  AppClientConfig,
  AppConfig,
  AppPlugins,
  Awaited,
  ConfigEnv,
  CreateAppConfig,
  CreateAppFactory,
  HeadConfig,
  IslandDefinition,
  OnLoadFn,
  IslandsByPath,
  LayoutFactory,
  NamedPlugins,
  PageComponent,
  PageData,
  PageFrontmatter,
  PageMeta,
  PageProps,
  Plugin,
  PluginOption,
  RouteMeta,
  Router,
  RouteRecordRaw,
  RouterOptions,
  AppContext,
  GetStaticPaths,
  StaticPath,
  SSGRoute,
  UserApp,
  UserSite,
  UserConfig,
  ViteOptions,
} from '../../types/shared'

export const EXTERNAL_URL_RE = /^https?:/i

export const inBrowser = typeof window !== 'undefined'

export function defineConfig (config: UserConfig) {
  return config
}

export function defineApp (app: UserApp) {
  return app
}

export function defineStaticPaths (fn: GetStaticPaths) {
  return fn
}

import { UserApp, UserConfig } from '../../types/shared'

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
  IslandsByPath,
  LayoutFactory,
  PageMeta,
  Plugin,
  PluginOption,
  Router,
  RouteRecordRaw,
  RouterOptions,
  SSGContext,
  SSGRoute,
  UserApp,
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
